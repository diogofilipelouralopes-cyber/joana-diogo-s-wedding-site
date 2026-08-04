import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import {
  EMAIL_1_MONTH_SUBJECT,
  buildOneMonthEmail,
  sendResendEmail,
} from './communications.server';

export interface SendResultItem {
  guestId: string;
  name: string;
  email: string | null;
  status: 'sent' | 'failed' | 'skipped';
  reason?: string;
}

export const sendOneMonthEmails = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { guestIds: string[] }) => {
    if (!data || !Array.isArray(data.guestIds) || data.guestIds.length === 0) {
      throw new Error('Nenhum convidado selecionado.');
    }
    if (data.guestIds.length > 200) {
      throw new Error('Demasiados convidados selecionados.');
    }
    return { guestIds: data.guestIds.map(String) };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: roleRow } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    if (!roleRow) throw new Error('Sem permissões de administrador.');

    const { data: guests, error } = await supabase
      .from('rsvps')
      .select('id, name, email, attending')
      .in('id', data.guestIds);
    if (error) throw new Error('Não foi possível carregar os convidados.');

    const { data: alreadySent } = await supabase
      .from('guest_communications')
      .select('guest_id')
      .eq('type', 'email_1_month')
      .eq('status', 'sent')
      .in('guest_id', data.guestIds);
    const sentSet = new Set((alreadySent ?? []).map((r) => r.guest_id));

    const results: SendResultItem[] = [];

    for (const guest of guests ?? []) {
      const base = { guestId: guest.id, name: guest.name, email: guest.email };

      if (sentSet.has(guest.id)) {
        results.push({ ...base, status: 'skipped', reason: 'Este convidado já recebeu esta comunicação.' });
        continue;
      }
      if (!guest.attending) {
        results.push({ ...base, status: 'skipped', reason: 'Presença não confirmada.' });
        continue;
      }
      if (!guest.email || !guest.email.includes('@')) {
        results.push({ ...base, status: 'skipped', reason: 'Sem email válido.' });
        continue;
      }

      const { html, text } = buildOneMonthEmail(guest.name);
      const outcome = await sendResendEmail({
        to: guest.email,
        subject: EMAIL_1_MONTH_SUBJECT,
        html,
        text,
      });

      await supabase.from('guest_communications').insert({
        guest_id: guest.id,
        type: 'email_1_month',
        status: outcome.ok ? 'sent' : 'failed',
        sent_at: outcome.ok ? new Date().toISOString() : null,
        error_message: outcome.ok ? null : outcome.error,
      });

      results.push(
        outcome.ok
          ? { ...base, status: 'sent' }
          : { ...base, status: 'failed', reason: outcome.error },
      );
    }

    return { results };
  });
