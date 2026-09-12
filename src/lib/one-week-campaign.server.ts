// Server-only: campanha automática de email "falta 1 semana".
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import { sendResendEmail } from './communications.server';
import { getEmailContent, applyVars, escapeHtml } from './email-content.server';

export interface CampaignResult {
  total: number;
  sent: number;
  failed: number;
  skipped: number;
}

export const EMAIL_1_WEEK_SUBJECT = 'Falta 1 semana! Informações importantes 💚';

const SITE_URL = 'https://joanaediogo.com';
const MAPS_URL = 'https://maps.app.goo.gl/PqSYW3fkz5wGmmrj9';
const ALBUM_URL = 'https://photos.app.goo.gl/ZfRKu3pg8oHait6eA';
const WA_JOANA = 'https://wa.me/351912633104';
const WA_DIOGO = 'https://wa.me/32493945581';

/** Email "falta uma semana" — desenho premium creme/dourado. */
export function buildOneWeekEmail(name: string): { html: string; text: string } {
  const first = (name || '').trim().split(/\s+/)[0] || '';
  const safeFirst = escapeHtml(first);
  const greeting = first ? `Olá ${first},` : 'Olá,';

  const text = `${greeting}

Falta uma semana para a nossa maior viagem.

19 · 09 · 2026 — está tudo no nosso site: ${SITE_URL}

No site podes ver:
· Horários e programa do dia
· Morada e como chegar
· Alojamento e perguntas frequentes
· Lista de presentes
· Livro de mensagens para os noivos

Local: Glicínia Wedding House, Freamunde
Cerimónia às 14h00 · Estacionamento no local
Google Maps: ${MAPS_URL}

Dúvidas? WhatsApp Joana (${WA_JOANA}) ou Diogo (${WA_DIOGO}).
Álbum partilhado de fotografias: ${ALBUM_URL}

Até sábado!
Joana & Diogo`;

  const html = `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>Falta uma semana — Joana &amp; Diogo</title>
<!--[if mso]>
<style type="text/css">
  body, table, td, a, p, h1 { font-family: Georgia, serif !important; }
</style>
<![endif]-->
<style type="text/css">
  @media only screen and (max-width:620px) {
    .px { padding-left:24px !important; padding-right:24px !important; }
    .h1 { font-size:24px !important; letter-spacing:5px !important; }
    .script { font-size:25px !important; }
    .date { font-size:16px !important; letter-spacing:5px !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:#F5EFE4;">

<span style="display:none; font-size:1px; color:#F5EFE4; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">19 de setembro · Glicínia Wedding House · Cerimónia às 14h00. Vê tudo no nosso site.</span>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F5EFE4;">
<tr>
<td align="center" style="padding:36px 12px 44px 12px;">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background-color:#FBF8F1; border:1px solid #DCC9A6; border-radius:12px;">

<tr>
<td height="4" bgcolor="#B8935A" style="height:4px; background-color:#B8935A; font-size:0; line-height:0; border-radius:12px 12px 0 0;">&nbsp;</td>
</tr>

<tr>
<td class="px" align="center" style="padding:48px 44px 0 44px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
<tr>
<td align="center" width="72" height="72" style="width:72px; height:72px; border:1px dashed #B8935A; border-radius:36px; font-family:Georgia,'Times New Roman',serif; font-size:18px; letter-spacing:2px; color:#6B7A4F; mso-line-height-rule:exactly; line-height:72px;">J&nbsp;&amp;&nbsp;D</td>
</tr>
</table>
<p style="margin:28px 0 0 0; font-family:Georgia,'Times New Roman',serif; font-size:11px; letter-spacing:4px; text-transform:uppercase; color:#B8935A; mso-line-height-rule:exactly; line-height:18px;">Falta uma semana</p>
<h1 class="h1" style="margin:14px 0 0 0; font-family:Georgia,'Times New Roman',serif; font-size:28px; font-weight:normal; letter-spacing:8px; text-transform:uppercase; color:#6B7A4F; mso-line-height-rule:exactly; line-height:40px;">Joana &amp; Diogo</h1>
<p class="script" style="margin:8px 0 0 0; font-family:Georgia,'Times New Roman',serif; font-style:italic; font-size:28px; color:#B8935A; mso-line-height-rule:exactly; line-height:36px;">a nossa maior viagem</p>
</td>
</tr>

<tr>
<td class="px" style="padding:26px 44px 0 44px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="30%" style="border-top:1px dashed #C9AE81; font-size:0; line-height:0;">&nbsp;</td>
<td align="center" class="date" style="padding:0 14px; font-family:Georgia,'Times New Roman',serif; font-size:17px; letter-spacing:6px; color:#6B7A4F; mso-line-height-rule:exactly; line-height:22px; white-space:nowrap;">19 · 09 · 2026</td>
<td width="30%" style="border-top:1px dashed #C9AE81; font-size:0; line-height:0;">&nbsp;</td>
</tr>
</table>
</td>
</tr>

<tr>
<td class="px" align="center" style="padding:32px 44px 0 44px;">
${
  safeFirst
    ? `<p style="margin:0 0 14px 0; font-family:Georgia,'Times New Roman',serif; font-size:19px; color:#6B7A4F; mso-line-height-rule:exactly; line-height:28px;">Olá ${safeFirst},</p>`
    : ''
}
<p style="margin:0 0 22px 0; font-family:Arial,Helvetica,sans-serif; font-size:16px; color:#4A5240; mso-line-height-rule:exactly; line-height:26px;">Está tudo no nosso site — horários, morada e álbum.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" bgcolor="#6B7A4F" style="background-color:#6B7A4F; border-radius:10px;">
<a href="${SITE_URL}" style="display:block; padding:19px 24px; font-family:Georgia,'Times New Roman',serif; font-size:14px; letter-spacing:3px; text-transform:uppercase; color:#FBF8F1; text-decoration:none; mso-line-height-rule:exactly; line-height:20px;">Ver tudo no site</a>
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td class="px" align="center" style="padding:34px 44px 0 44px;">
<p style="margin:0; font-family:Georgia,'Times New Roman',serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; color:#B8935A; mso-line-height-rule:exactly; line-height:18px;">Local</p>
<p style="margin:12px 0 0 0; font-family:Georgia,'Times New Roman',serif; font-size:19px; color:#3F4736; mso-line-height-rule:exactly; line-height:28px;">Glicínia Wedding House, Freamunde</p>
<p style="margin:8px 0 0 0; font-family:Arial,Helvetica,sans-serif; font-size:15px; color:#6E7563; mso-line-height-rule:exactly; line-height:24px;">Cerimónia às 14h00 · Estacionamento no local</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:18px;">
<tr>
<td align="center" bgcolor="#FBF8F1" style="background-color:#FBF8F1; border:1px solid #B8935A; border-radius:10px;">
<a href="${MAPS_URL}" style="display:block; padding:17px 24px; font-family:Georgia,'Times New Roman',serif; font-size:13px; letter-spacing:2.5px; text-transform:uppercase; color:#6B7A4F; text-decoration:none; mso-line-height-rule:exactly; line-height:18px;">Abrir no Google Maps</a>
</td>
</tr>
</table>
</td>
</tr>


<tr>
<td class="px" style="padding:34px 44px 0 44px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="45%" style="border-top:1px dashed #DCC9A6; font-size:0; line-height:0;">&nbsp;</td>
<td align="center" style="padding:0 10px; font-family:Georgia,'Times New Roman',serif; font-size:14px; color:#B8935A; mso-line-height-rule:exactly; line-height:16px;">♡</td>
<td width="45%" style="border-top:1px dashed #DCC9A6; font-size:0; line-height:0;">&nbsp;</td>
</tr>
</table>
</td>
</tr>

<tr>
<td class="px" align="center" style="padding:26px 44px 48px 44px;">
<p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:15px; color:#6E7563; mso-line-height-rule:exactly; line-height:25px;">Dúvidas? WhatsApp <a href="${WA_JOANA}" style="color:#6B7A4F; text-decoration:none; border-bottom:1px solid #C9AE81;">Joana</a> ou <a href="${WA_DIOGO}" style="color:#6B7A4F; text-decoration:none; border-bottom:1px solid #C9AE81;">Diogo</a>.</p>
<p style="margin:10px 0 0 0; font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#8A8F7E; mso-line-height-rule:exactly; line-height:22px;">No dia, as fotografias podem ser partilhadas no <a href="${ALBUM_URL}" style="color:#8A8F7E; text-decoration:underline;">álbum partilhado</a>.</p>
<p style="margin:24px 0 0 0; font-family:Georgia,'Times New Roman',serif; font-style:italic; font-size:26px; color:#B8935A; mso-line-height-rule:exactly; line-height:32px;">Até sábado!</p>
</td>
</tr>

</table>

<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">
<tr>
<td class="px" align="center" style="padding:26px 44px 0 44px; font-family:Arial,Helvetica,sans-serif; font-size:12px; color:#8A8F7E; mso-line-height-rule:exactly; line-height:20px;">
Feito com ♡ para a nossa maior viagem
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

/** Assunto editável no admin, com reserva local. */
export async function getOneWeekSubject(name: string): Promise<string> {
  const content = await getEmailContent('one-week-reminder');
  const raw = content?.subject?.trim();
  return raw ? applyVars(raw, { nome: name }) : EMAIL_1_WEEK_SUBJECT;
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

    const { html, text } = buildOneWeekEmail(guest.name);
    const subject = await getOneWeekSubject(guest.name);
    const outcome = await sendResendEmail({
      to: guest.email,
      subject,
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
