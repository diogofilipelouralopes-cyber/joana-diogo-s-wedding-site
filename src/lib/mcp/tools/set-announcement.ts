import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "set_announcement",
  title: "Set live announcement",
  description:
    "Update the live announcement banner shown on the wedding site (Portuguese and English text, and whether it is visible). Admin accounts only.",
  inputSchema: {
    message: z.string().describe("Announcement text in Portuguese."),
    message_en: z.string().optional().describe("Announcement text in English."),
    active: z.boolean().optional().describe("Whether the banner is visible on the site."),
  },
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
  handler: async ({ message, message_en, active }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const values = {
      message,
      message_en: message_en ?? message,
      active: active ?? true,
    };

    const { data: existing, error: readError } = await supabase
      .from("announcements")
      .select("id")
      .limit(1)
      .maybeSingle();
    if (readError) {
      return { content: [{ type: "text", text: readError.message }], isError: true };
    }

    const { data, error } = existing
      ? await supabase.from("announcements").update(values).eq("id", existing.id).select()
      : await supabase.from("announcements").insert(values).select();

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    return {
      content: [{ type: "text", text: JSON.stringify(data?.[0] ?? values, null, 2) }],
      structuredContent: { announcement: data?.[0] ?? values },
    };
  },
});
