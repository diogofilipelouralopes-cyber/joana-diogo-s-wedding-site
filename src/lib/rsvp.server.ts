// Server-only: the Google Apps Script webhook URL must never reach the client bundle.
const WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbxbhmu0sJwJ_gkyvXf2AhmqJapuJqVFgIcKMsqq9rNlM2-hFDGiffrMwlq36txBUeL1/exec';

export interface SheetRow {
  nome: string;
  email: string;
  telefone: string;
  pessoas: number;
  presenca: 'sim' | 'nao';
  restricoes: string;
  musica: string;
  mensagem: string;
}

export async function forwardToSheet(row: SheetRow): Promise<{ ok: boolean }> {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(row),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}


export async function findExistingRsvp(email: string, phone: string): Promise<{ exists: boolean; name?: string }> {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const digits = phone.replace(/\D/g, '');
  const { data, error } = await supabaseAdmin
    .from('rsvps')
    .select('name, email, phone')
    .limit(500);
  if (error || !data) return { exists: false };
  const match = data.find(
    (r) =>
      (r.email ?? '').trim().toLowerCase() === email.trim().toLowerCase() ||
      (digits.length >= 6 && (r.phone ?? '').replace(/\D/g, '').endsWith(digits.slice(-9))),
  );
  return match ? { exists: true, name: match.name ?? undefined } : { exists: false };
}
