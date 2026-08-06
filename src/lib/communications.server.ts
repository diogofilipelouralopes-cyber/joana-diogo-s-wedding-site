// Server-only helpers for guest communications (email templates + Resend API).

const SITE_URL = 'https://joanaediogo-com.lovable.app';

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

export const EMAIL_1_MONTH_SUBJECT = 'Joana & Diogo | Falta apenas 1 mês ❤️';

export function buildOneMonthEmail(name: string): { html: string; text: string } {
  const safeName = escapeHtml((name || '').trim().split(/\s+/)[0] || 'amigo');

  const text = `Olá ${name},

Estamos cada vez mais perto do nosso grande dia!
Queremos agradecer por fazeres parte deste momento tão especial.

Toda a informação do casamento está disponível no nosso site:
${SITE_URL}

Podes consultar: horário da cerimónia, localização, estacionamento, alojamento, dress code e todas as novidades.

Mal podemos esperar para celebrar contigo.

Com carinho,
Joana & Diogo`;

  const items = [
    'Horário da cerimónia',
    'Localização',
    'Estacionamento',
    'Alojamento',
    'Dress code',
    'Todas as novidades',
  ]
    .map(
      (item) =>
        `<tr><td style="padding:6px 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:${INK};">
          <span style="color:${GOLD};">&#10022;</span>&nbsp;&nbsp;${item}
        </td></tr>`,
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(EMAIL_1_MONTH_SUBJECT)}</title>
</head>
<body style="margin:0;padding:0;background-color:${CREAM};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Falta apenas 1 mês para o nosso casamento.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${CREAM};padding:24px 12px;">
  <tr>
    <td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid ${GOLD}33;border-radius:6px;overflow:hidden;">
        <tr>
          <td align="center" style="background:${OLIVE};padding:36px 24px;">
            <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${GOLD};">Vamos casar</p>
            <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:34px;color:#ffffff;">Joana &amp; Diogo</h1>
            <p style="margin:12px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#ffffffcc;">19 Novembro 2026</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 32px 8px;">
            <p style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:${OLIVE};">Olá ${safeName},</p>
            <p style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:${INK};">
              Estamos cada vez mais perto do nosso grande dia! Queremos agradecer por fazeres parte deste momento tão especial.
            </p>
            <p style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:${INK};">
              Toda a informação do casamento está disponível no nosso site:
            </p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:0 32px 26px;">
            <a href="${SITE_URL}" style="display:inline-block;background:${GOLD};color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;padding:15px 34px;border-radius:2px;">Ver o nosso site</a>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};border-radius:4px;padding:18px 22px;">
              ${items}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px 36px;">
            <p style="margin:0 0 22px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:${INK};">
              Mal podemos esperar para celebrar contigo.
            </p>
            <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:${OLIVE};">Com carinho,</p>
            <p style="margin:4px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:${OLIVE};">Joana &amp; Diogo</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="background:${CREAM};padding:20px 24px;border-top:1px solid ${GOLD}33;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${OLIVE}99;">
              <a href="${SITE_URL}" style="color:${OLIVE};text-decoration:none;">joanaediogo-com.lovable.app</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  return { html, text };
}

export async function sendResendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env['RESEND_API_KEY'];
  if (!apiKey) {
    return { ok: false, error: 'RESEND_API_KEY não está configurada.' };
  }
  const from = process.env['RESEND_FROM_EMAIL'] || 'Joana & Diogo <onboarding@resend.dev>';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [params.to],
        subject: params.subject,
        html: params.html,
        text: params.text,
        ...(params.replyTo ? { reply_to: params.replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`Resend request failed [${response.status}]: ${body}`);
      return { ok: false, error: `Resend [${response.status}]: ${body.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Resend request threw:', message);
    return { ok: false, error: message };
  }
}
