import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/public/hooks/one-month-emails')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey =
          request.headers.get('apikey') ??
          request.headers.get('authorization')?.replace('Bearer ', '');
        const expected = process.env['SUPABASE_ANON_KEY'];

        if (!expected || !apikey || apikey !== expected) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        try {
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
