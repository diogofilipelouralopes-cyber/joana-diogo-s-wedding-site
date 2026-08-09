import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "rsvp_stats",
  title: "RSVP statistics",
  description:
    "Summary of the wedding RSVPs: totals, confirmed vs declined, total guest headcount and dietary restrictions.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("rsvps")
      .select("name,attending,guests,allergies");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const rows = data ?? [];
    const confirmed = rows.filter((r) => r.attending);
    const stats = {
      total_responses: rows.length,
      confirmed: confirmed.length,
      declined: rows.length - confirmed.length,
      confirmed_headcount: confirmed.reduce((sum, r) => sum + (r.guests ?? 1), 0),
      dietary_restrictions: rows
        .filter((r) => r.allergies?.trim())
        .map((r) => ({ name: r.name, allergies: r.allergies })),
    };

    return {
      content: [{ type: "text", text: JSON.stringify(stats, null, 2) }],
      structuredContent: stats,
    };
  },
});
