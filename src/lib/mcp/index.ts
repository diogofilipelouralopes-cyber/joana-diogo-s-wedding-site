import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listRsvpsTool from "./tools/list-rsvps";
import rsvpStatsTool from "./tools/rsvp-stats";
import listMessagesTool from "./tools/list-messages";
import setAnnouncementTool from "./tools/set-announcement";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "joana-diogo-s-wedding-site",
  title: "Joana & Diogo's Wedding Site",
  version: "0.1.0",
  instructions:
    "Tools for Joana & Diogo's wedding site. Use `list_rsvps` and `rsvp_stats` to review guest confirmations, `list_messages` to read guest book messages, and `set_announcement` to update the live banner on the site. All tools act as the signed-in admin account.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listRsvpsTool, rsvpStatsTool, listMessagesTool, setAnnouncementTool],
});
