import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function sb(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_bills",
  title: "List bills",
  description: "List bills for the signed-in user, optionally filtered by status.",
  inputSchema: {
    status: z.enum(["upcoming", "due_today", "overdue", "paid", "cancelled"]).optional(),
    include_archived: z.boolean().optional(),
    limit: z.number().int().min(1).max(500).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    let q = sb(ctx).from("bills").select("*").order("due_date", { ascending: true }).limit(input.limit ?? 100);
    if (input.status) q = q.eq("status", input.status);
    if (!input.include_archived) q = q.eq("archived", false);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: { bills: data ?? [] } };
  },
});
