// Server-only: campanha automática de email "falta 1 mês".
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import {
  EMAIL_1_MONTH_SUBJECT,
  buildOneMonthEmail,
  sendResendEmail,
} from './communications.server';

export interface CampaignResult {
  total: number;
  sent: number;
  failed: number;
  skipped: number;
}

/**
 * Envia o email de "falta 1 mês" a todos os convidados que confirmaram presença
 * e ainda não receberam esta comunicação (deduplicação via guest_communications).
 */
export async function runOneMonthCampaign(): Promise<CampaignResult> {
  const replyTo = process.env['WEDDING_CONTACT_EMAIL'];

  const { data: guests, error } = await supabaseAdmin
    .from('rsvps')
    .select('id, name, email, attending')
    .eq('attending', true);

  if (error) throw new Error(`Falha ao carregar convidados: ${error.message}`);

  const ids = (guests ?? []).map((g) => g.id);
  const sentSet = new Set<string>();
  if (ids.length) {
    const { data: already } = await supabaseAdmin
      .from('guest_communications')
      .select('guest_id')
      .eq('type', 'email_1_month')
      .eq('status', 'sent')
      .in('guest_id', ids);
    for (const row of already ?? []) sentSet.add(row.guest_id);
  }

  const result: CampaignResult = { total: ids.length, sent: 0, failed: 0, skipped: 0 };

  for (const guest of guests ?? []) {
    if (sentSet.has(guest.id) || !guest.email || !guest.email.includes('@')) {
      result.skipped += 1;
      continue;
    }

    const { renderStoredEmail } = await import('./email-content.server');
    const stored = await renderStoredEmail('one-month-reminder', { nome: guest.name });
    const { html, text } = stored ?? buildOneMonthEmail(guest.name);
    const outcome = await sendResendEmail({
      to: guest.email,
      subject: stored?.subject ?? EMAIL_1_MONTH_SUBJECT,
      html,
      text,
      ...(replyTo ? { replyTo } : {}),
    });

    await supabaseAdmin.from('guest_communications').insert({
      guest_id: guest.id,
      type: 'email_1_month',
      status: outcome.ok ? 'sent' : 'failed',
      sent_at: outcome.ok ? new Date().toISOString() : null,
      error_message: outcome.ok ? null : outcome.error,
    });

    if (outcome.ok) result.sent += 1;
    else result.failed += 1;
  }

  return result;
}
