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
