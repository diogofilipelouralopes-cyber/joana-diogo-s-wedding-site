import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/public/hooks/one-month-emails')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey =
          request.headers.get('apikey') ??
          request.headers.get('authorization')?.replace('Bearer ', '');
        const accepted = [
          process.env['SUPABASE_ANON_KEY'],
          process.env['SUPABASE_PUBLISHABLE_KEY'],
          process.env['VITE_SUPABASE_ANON_KEY'],
          process.env['VITE_SUPABASE_PUBLISHABLE_KEY'],
        ].filter((v): v is string => Boolean(v));

        if (!accepted.length || !apikey || !accepted.includes(apikey)) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        try {
          const body = (await request.json().catch(() => ({}))) as {
            testEmail?: string;
            testName?: string;
          };

          // Modo de teste: envia o email de lembrete a um único endereço, sem gravar logs.
          if (body.testEmail && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.testEmail)) {
            const { EMAIL_1_MONTH_SUBJECT, buildOneMonthEmail, sendResendEmail } = await import(
              '@/lib/communications.server'
            );
            const replyTo = process.env['WEDDING_CONTACT_EMAIL'];
            const { html, text } = buildOneMonthEmail(body.testName ?? 'Convidado');
            const outcome = await sendResendEmail({
              to: body.testEmail,
              subject: `[TESTE] ${EMAIL_1_MONTH_SUBJECT}`,
              html,
              text,
              ...(replyTo ? { replyTo } : {}),
            });
            return Response.json({ success: true, test: true, outcome });
          }

          const { runOneMonthCampaign } = await import('@/lib/one-month-campaign.server');
          const result = await runOneMonthCampaign();
          console.log('[one-month-emails]', JSON.stringify(result));
          return Response.json({ success: true, ...result });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          console.error('[one-month-emails] failed:', message);
          return new Response(JSON.stringify({ success: false, error: message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      },
    },
  },
});
