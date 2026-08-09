import { createServerFn } from '@tanstack/react-start';

export interface EmailDetailInput {
  label: string;
  value: string;
}

export interface EmailContentInput {
  key: string;
  subject: string;
  preheader: string;
  greeting: string;
  body: string;
  details: EmailDetailInput[];
  button_label: string;
  button_url: string;
  signature: string;
}

const KEYS = ['rsvp-confirmation', 'rsvp-notification', 'one-month-reminder'];

function str(value: unknown, max = 4000): string {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

function validate(data: any): EmailContentInput {
  const key = str(data?.key, 60);
  if (!KEYS.includes(key)) throw new Error('Email desconhecido.');
  const subject = str(data?.subject, 250).trim();
  if (!subject) throw new Error('O assunto é obrigatório.');
  const details = Array.isArray(data?.details)
    ? data.details
        .slice(0, 12)
        .map((d: any) => ({ label: str(d?.label, 80), value: str(d?.value, 250) }))
        .filter((d: EmailDetailInput) => d.label || d.value)
    : [];
  return {
    key,
    subject,
    preheader: str(data?.preheader, 250),
    greeting: str(data?.greeting, 250),
    body: str(data?.body, 8000),
    details,
    button_label: str(data?.button_label, 80),
    button_url: str(data?.button_url, 500),
    signature: str(data?.signature, 250),
  };
}

export const listEmails = createServerFn({ method: 'GET' }).handler(async () => {
  const { requireAdminSession } = await import('./admin-auth.server');
  await requireAdminSession();
  const { listEmailContents } = await import('./email-content.server');
  return { emails: await listEmailContents() };
});

export const saveEmail = createServerFn({ method: 'POST' })
  .inputValidator(validate)
  .handler(async ({ data }) => {
    const { requireAdminSession } = await import('./admin-auth.server');
    await requireAdminSession();
    const { saveEmailContent } = await import('./email-content.server');
    await saveEmailContent({ ...data, display_name: '' } as any);
    return { ok: true as const };
  });

export const previewEmail = createServerFn({ method: 'POST' })
  .inputValidator(validate)
  .handler(async ({ data }) => {
    const { requireAdminSession } = await import('./admin-auth.server');
    await requireAdminSession();
    const { renderEmail } = await import('./email-content.server');
    const extraRows: Array<[string, string]> =
      data.key === 'rsvp-notification'
        ? [
            ['Nome', 'Maria Silva'],
            ['Email', 'maria@exemplo.pt'],
            ['Número de convidados', '2'],
            ['Presença', 'Sim'],
            ['Restrições alimentares', 'Sem glúten'],
            ['Música escolhida', 'Fix You — Coldplay'],
            ['Mensagem adicional', 'Parabéns aos dois!'],
          ]
        : [];
    const rendered = renderEmail({ ...data, display_name: '' } as any, { nome: 'Maria' }, extraRows);
    return rendered;
  });
