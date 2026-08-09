import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_messages",
  title: "List guest messages",
  description:
    "List the messages guests left for the couple in the guest book, newest first. Admin accounts only.",
  inputSchema: {
    only_unread: z.boolean().optional().describe("Return only messages not yet marked as read."),
    limit: z.number().int().optional().describe("Maximum rows to return (default 50, max 200)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ only_unread, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const max = Math.min(Math.max(limit ?? 50, 1), 200);
    let query = supabaseForUser(ctx)
      .from("mensagens")
      .select("id,nome,mensagem,lida,favorita,created_at")
      .order("created_at", { ascending: false })
      .limit(max);
    if (only_unread) query = query.eq("lida", false);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { count: data?.length ?? 0, messages: data ?? [] },
    };
  },
});
