// Server-only: campanha automática de email "falta 1 semana".
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import { sendResendEmail } from './communications.server';
import { renderStoredEmail } from './email-content.server';

export interface CampaignResult {
  total: number;
  sent: number;
  failed: number;
  skipped: number;
}

export const EMAIL_1_WEEK_SUBJECT = 'Falta 1 semana! Informações importantes 💚';

const SITE_URL = 'https://joanaediogo.com';

/** Conteúdo de reserva, usado apenas se o email editável não existir. */
export function buildOneWeekEmail(name: string): { html: string; text: string } {
  const first = (name || '').trim().split(/\s+/)[0] || 'amigo';
  const text = `Olá ${first},

Falta apenas uma semana para o nosso casamento!

Data: 19 de setembro de 2026
Cerimónia: 14:00 (chegada entre as 13:30 e as 13:45)
Local: Quinta Glicínia Wedding House, Freamunde
Check-in do alojamento: logo após a cerimónia
Dress code: formal/elegante (evitar branco)
Estacionamento: gratuito no local

Todos os detalhes em ${SITE_URL}

Até já,
Joana & Diogo`;

  const html = `<!DOCTYPE html><html lang="pt"><head><meta charset="utf-8" /></head>
<body style="margin:0;padding:24px;background:#FAF7F0;font-family:Georgia,serif;color:#3F4436;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #C9A96133;border-radius:6px;">
<tr><td align="center" style="background:#6B7A4F;padding:32px 24px;">
<p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C9A961;">Falta 1 semana</p>
<h1 style="margin:0;font-weight:normal;font-size:32px;color:#fff;">Joana &amp; Diogo</h1>
<p style="margin:12px 0 0;font-family:Arial,sans-serif;font-size:12px;letter-spacing:3px;color:#ffffffcc;">19 SETEMBRO 2026</p>
</td></tr>
<tr><td style="padding:32px;">${text
    .split('\n\n')
    .map((p) => `<p style="margin:0 0 14px;font-size:16px;line-height:1.7;">${p.replace(/\n/g, '<br />')}</p>`)
    .join('')}</td></tr>
</table></body></html>`;

  return { html, text };
}

/**
 * Envia o email de "falta 1 semana" a todos os convidados que confirmaram
 * presença e ainda não receberam esta comunicação.
 */
export async function runOneWeekCampaign(): Promise<CampaignResult> {
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
      .eq('type', 'email_1_week')
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

    const stored = await renderStoredEmail('one-week-reminder', { nome: guest.name });
    const { html, text } = stored ?? buildOneWeekEmail(guest.name);
    const outcome = await sendResendEmail({
      to: guest.email,
      subject: stored?.subject ?? EMAIL_1_WEEK_SUBJECT,
      html,
      text,
      ...(replyTo ? { replyTo } : {}),
    });

    await supabaseAdmin.from('guest_communications').insert({
      guest_id: guest.id,
      type: 'email_1_week',
      status: outcome.ok ? 'sent' : 'failed',
      sent_at: outcome.ok ? new Date().toISOString() : null,
      error_message: outcome.ok ? null : outcome.error,
    });

    if (outcome.ok) result.sent += 1;
    else result.failed += 1;
  }

  return result;
}
