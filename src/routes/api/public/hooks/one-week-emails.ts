import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/public/hooks/one-week-emails')({
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

          // Modo de teste: envia apenas a um endereço, sem gravar logs.
          if (body.testEmail && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.testEmail)) {
            const { EMAIL_1_WEEK_SUBJECT, buildOneWeekEmail } = await import(
              '@/lib/one-week-campaign.server'
            );
            const { sendResendEmail } = await import('@/lib/communications.server');
            const { renderStoredEmail } = await import('@/lib/email-content.server');
            const replyTo = process.env['WEDDING_CONTACT_EMAIL'];
            const name = body.testName ?? 'Convidado';
            const stored = await renderStoredEmail('one-week-reminder', { nome: name });
            const { html, text } = stored ?? buildOneWeekEmail(name);
            const outcome = await sendResendEmail({
              to: body.testEmail,
              subject: `[TESTE] ${stored?.subject ?? EMAIL_1_WEEK_SUBJECT}`,
              html,
              text,
              ...(replyTo ? { replyTo } : {}),
            });
            return Response.json({ success: true, test: true, outcome });
          }

          const { runOneWeekCampaign } = await import('@/lib/one-week-campaign.server');
          const result = await runOneWeekCampaign();
          console.log('[one-week-emails]', JSON.stringify(result));
          return Response.json({ success: true, ...result });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          console.error('[one-week-emails] failed:', message);
          return new Response(JSON.stringify({ success: false, error: message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      },
    },
  },
});
