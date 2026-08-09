// Server-only: conteúdo editável dos emails (assunto + texto) guardado na base
// de dados, e renderização para HTML/texto com a identidade visual do site.
import { supabaseAdmin } from '@/integrations/supabase/client.server';

const OLIVE = '#6B7A4F';
const CREAM = '#FAF7F0';
const GOLD = '#C9A961';
const INK = '#3F4436';

export interface EmailDetail {
  label: string;
  value: string;
}

export interface EmailContent {
  key: string;
  display_name: string;
  subject: string;
  preheader: string;
  greeting: string;
  body: string;
  details: EmailDetail[];
  button_label: string;
  button_url: string;
  signature: string;
  updated_at?: string;
}

export const EMAIL_KEYS = [
  'rsvp-confirmation',
  'rsvp-notification',
  'one-month-reminder',
] as const;

export type EmailKey = (typeof EMAIL_KEYS)[number];

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Substitui variáveis do tipo {{nome}} pelos valores fornecidos. */
export function applyVars(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_m, key: string) => vars[key] ?? '');
}

function normalizeDetails(raw: unknown): EmailDetail[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((d) => ({
      label: typeof (d as any)?.label === 'string' ? (d as any).label : '',
      value: typeof (d as any)?.value === 'string' ? (d as any).value : '',
    }))
    .filter((d) => d.label || d.value);
}

export async function listEmailContents(): Promise<EmailContent[]> {
  const { data, error } = await supabaseAdmin
    .from('email_content')
    .select('*')
    .order('key');
  if (error) throw new Error(error.message);
  return (data ?? []).map((row: any) => ({
    ...row,
    details: normalizeDetails(row.details),
  })) as EmailContent[];
}

export async function getEmailContent(key: string): Promise<EmailContent | null> {
  try {
    const { data } = await supabaseAdmin
      .from('email_content')
      .select('*')
      .eq('key', key)
      .maybeSingle();
    if (!data) return null;
    return { ...(data as any), details: normalizeDetails((data as any).details) } as EmailContent;
  } catch {
    return null;
  }
}

export async function saveEmailContent(input: EmailContent): Promise<void> {
  const { error } = await supabaseAdmin
    .from('email_content')
    .update({
      subject: input.subject,
      preheader: input.preheader,
      greeting: input.greeting,
      body: input.body,
      details: input.details.map((d) => ({ label: d.label, value: d.value })) as any,
      button_label: input.button_label,
      button_url: input.button_url,
      signature: input.signature,
      updated_at: new Date().toISOString(),
    })
    .eq('key', input.key);
  if (error) throw new Error(error.message);
}

/* ------------------------------------------------------------- renderização */

export function renderEmail(
  content: EmailContent,
  vars: Record<string, string> = {},
  extraRows: Array<[string, string]> = [],
): { subject: string; html: string; text: string } {
  const subject = applyVars(content.subject, vars).trim();
  const preheader = applyVars(content.preheader, vars);
  const greeting = applyVars(content.greeting, vars);
  const signature = applyVars(content.signature, vars);
  const paragraphs = applyVars(content.body, vars)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const details = content.details.filter((d) => d.label || d.value);
  const showButton = Boolean(content.button_label && content.button_url);

  const textParts = [
    greeting,
    ...paragraphs,
    ...details.map((d) => `${d.label}: ${d.value}`),
    ...extraRows.map(([k, v]) => `${k}: ${v}`),
    showButton ? `${content.button_label}: ${content.button_url}` : '',
    signature,
  ].filter(Boolean);

  const html = `<!DOCTYPE html>
<html lang="pt">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background-color:${CREAM};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${CREAM};padding:24px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid ${GOLD}33;border-radius:6px;overflow:hidden;">
      <tr><td align="center" style="background:${OLIVE};padding:36px 24px;">
        <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${GOLD};">${escapeHtml(preheader).slice(0, 80)}</p>
        <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:34px;color:#ffffff;">Joana &amp; Diogo</h1>
        <p style="margin:12px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#ffffffcc;">19 Setembro 2026</p>
      </td></tr>
      <tr><td style="padding:36px 32px;">
        ${greeting ? `<p style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:${OLIVE};">${escapeHtml(greeting)}</p>` : ''}
        ${paragraphs
          .map(
            (p) =>
              `<p style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:${INK};">${escapeHtml(p).replace(/\n/g, '<br />')}</p>`,
          )
          .join('')}
        ${
          details.length
            ? `<hr style="border:none;border-top:1px solid ${GOLD}55;margin:24px 0;" />` +
              details
                .map(
                  (d) =>
                    `<p style="margin:0 0 2px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${GOLD};">${escapeHtml(d.label)}</p>
                     <p style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:17px;color:${INK};">${escapeHtml(d.value)}</p>`,
                )
                .join('')
            : ''
        }
        ${
          extraRows.length
            ? `<hr style="border:none;border-top:1px solid ${GOLD}55;margin:24px 0;" />
               <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${extraRows
                 .map(
                   ([k, v]) =>
                     `<tr><td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${OLIVE};width:190px;">${escapeHtml(k)}</td><td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${INK};">${escapeHtml(v)}</td></tr>`,
                 )
                 .join('')}</table>`
            : ''
        }
        ${
          showButton
            ? `<p style="margin:26px 0;text-align:center;"><a href="${escapeHtml(content.button_url)}" style="background:${OLIVE};color:#ffffff;padding:14px 28px;border-radius:4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;text-decoration:none;display:inline-block;">${escapeHtml(content.button_label)}</a></p>`
            : ''
        }
        ${signature ? `<p style="margin:24px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:${OLIVE};">${escapeHtml(signature)}</p>` : ''}
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  return { subject, html, text: textParts.join('\n\n') };
}

/** Renderiza um email guardado; devolve null quando não existe conteúdo. */
export async function renderStoredEmail(
  key: string,
  vars: Record<string, string> = {},
  extraRows: Array<[string, string]> = [],
): Promise<{ subject: string; html: string; text: string } | null> {
  const content = await getEmailContent(key);
  if (!content) return null;
  return renderEmail(content, vars, extraRows);
}
