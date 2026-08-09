// Server-only: templates + envio dos emails de RSVP (confirmação ao convidado
// e notificação interna para os noivos).
import { sendResendEmail } from './communications.server';

const OLIVE = '#6B7A4F';
const CREAM = '#FAF7F0';
const GOLD = '#C9A961';
const INK = '#3F4436';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface RsvpEmailPayload {
  name: string;
  email: string;
  guests: number;
  attending: boolean;
  allergies: string;
  song: string;
  message: string;
}

export const GUEST_SUBJECT = 'Confirmação recebida — Casamento Joana & Diogo ❤️';

function buildGuestEmail(name: string): { html: string; text: string } {
  const safeName = escapeHtml(name.trim());

  const text = `Olá ${name},

Recebemos a tua confirmação para o nosso casamento no dia 19 de setembro de 2026.

Estamos muito felizes por partilhar este momento contigo.

Obrigado pela tua resposta.

Joana & Diogo`;

  const html = `<!DOCTYPE html>
<html lang="pt">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>${escapeHtml(GUEST_SUBJECT)}</title></head>
<body style="margin:0;padding:0;background-color:${CREAM};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Recebemos a tua confirmação de presença.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${CREAM};padding:24px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid ${GOLD}33;border-radius:6px;overflow:hidden;">
      <tr><td align="center" style="background:${OLIVE};padding:36px 24px;">
        <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${GOLD};">Confirmação recebida</p>
        <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:34px;color:#ffffff;">Joana &amp; Diogo</h1>
        <p style="margin:12px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#ffffffcc;">19 Setembro 2026</p>
      </td></tr>
      <tr><td style="padding:36px 32px 36px;">
        <p style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:${OLIVE};">Olá ${safeName},</p>
        <p style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:${INK};">
          Recebemos a tua confirmação para o nosso casamento no dia 19 de setembro de 2026.
        </p>
        <p style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:${INK};">
          Estamos muito felizes por partilhar este momento contigo.
        </p>
        <p style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:${INK};">
          Obrigado pela tua resposta.
        </p>
        <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:${OLIVE};">Joana &amp; Diogo</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  return { html, text };
}

function buildInternalEmail(p: RsvpEmailPayload): { html: string; text: string } {
  const rows: Array<[string, string]> = [
    ['Nome', p.name],
    ['Email', p.email],
    ['Número de convidados', String(p.guests)],
    ['Presença', p.attending ? 'Sim' : 'Não'],
    ['Restrições alimentares', p.allergies || '—'],
    ['Música escolhida', p.song || '—'],
    ['Mensagem adicional', p.message || '—'],
  ];

  const text = `Nova confirmação recebida:\n\n${rows
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')}`;

  const html = `<!DOCTYPE html>
<html lang="pt"><head><meta charset="utf-8" /></head>
<body style="margin:0;padding:24px;background:${CREAM};font-family:Arial,Helvetica,sans-serif;color:${INK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid ${GOLD}33;border-radius:6px;">
    <tr><td style="padding:24px 28px;">
      <h2 style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-weight:normal;color:${OLIVE};">Nova confirmação recebida</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 0;font-size:13px;color:${OLIVE};width:190px;">${escapeHtml(k)}</td><td style="padding:6px 0;font-size:14px;">${escapeHtml(v)}</td></tr>`,
          )
          .join('')}
      </table>
    </td></tr>
  </table>
</body></html>`;

  return { html, text };
}

export async function sendRsvpNotifications(
  p: RsvpEmailPayload,
): Promise<{ ok: boolean; errors: string[] }> {
  const replyTo = process.env['WEDDING_CONTACT_EMAIL'];

  const { renderStoredEmail } = await import('./email-content.server');

  const stored = await renderStoredEmail('rsvp-confirmation', { nome: p.name });
  const guest = stored ?? buildGuestEmail(p.name);
  const guestSubject = stored?.subject ?? GUEST_SUBJECT;

  const storedInternal = await renderStoredEmail('rsvp-notification', { nome: p.name }, [
    ['Nome', p.name],
    ['Email', p.email],
    ['Número de convidados', String(p.guests)],
    ['Presença', p.attending ? 'Sim' : 'Não'],
    ['Restrições alimentares', p.allergies || '—'],
    ['Música escolhida', p.song || '—'],
    ['Mensagem adicional', p.message || '—'],
  ]);
  const internal = storedInternal ?? buildInternalEmail(p);
  const internalSubject = storedInternal?.subject ?? `Nova confirmação RSVP — ${p.name}`;

  const results = await Promise.all([
    sendResendEmail({
      to: p.email,
      subject: guestSubject,
      html: guest.html,
      text: guest.text,
      ...(replyTo ? { replyTo } : {}),
    }),
    replyTo
      ? sendResendEmail({
          to: replyTo,
          subject: internalSubject,
          html: internal.html,
          text: internal.text,
          replyTo: p.email,
        })
      : Promise.resolve({ ok: false as const, error: 'WEDDING_CONTACT_EMAIL não configurado.' }),
  ]);

  const errors = results
    .map((r) => ('error' in r ? r.error : null))
    .filter((e): e is string => Boolean(e));
  if (errors.length) console.error('[rsvp-emails] falhas:', errors.join(' | '));
  return { ok: results.every((r) => r.ok), errors };
}
