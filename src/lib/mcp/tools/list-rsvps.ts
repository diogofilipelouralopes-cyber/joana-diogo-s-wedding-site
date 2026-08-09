import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_rsvps",
  title: "List RSVPs",
  description:
    "List wedding RSVP entries (name, attending, guests, contact, allergies, notes). Only the couple's admin accounts can read them.",
  inputSchema: {
    attending: z
      .enum(["all", "yes", "no"])
      .optional()
      .describe("Filter by attendance. Defaults to all."),
    search: z.string().optional().describe("Case-insensitive match on the guest name."),
    limit: z.number().int().optional().describe("Maximum rows to return (default 50, max 200)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ attending, search, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const max = Math.min(Math.max(limit ?? 50, 1), 200);
    let query = supabaseForUser(ctx)
      .from("rsvps")
      .select(
        "id,name,attending,guests,email,phone,allergies,song_suggestion,message,family_group,table_number,accommodation,transport,internal_notes,created_at",
      )
      .order("created_at", { ascending: false })
      .limit(max);

    if (attending === "yes") query = query.eq("attending", true);
    if (attending === "no") query = query.eq("attending", false);
    if (search?.trim()) query = query.ilike("name", `%${search.trim()}%`);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { count: data?.length ?? 0, rsvps: data ?? [] },
    };
  },
});
