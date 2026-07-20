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
  name: "list_expenses",
  title: "List expenses",
  description: "List expenses for the signed-in user, optionally filtered by category or date range.",
  inputSchema: {
    category: z.string().optional(),
    from: z.string().optional().describe("ISO date lower bound (inclusive)."),
    to: z.string().optional().describe("ISO date upper bound (inclusive)."),
    limit: z.number().int().min(1).max(500).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    let q = sb(ctx).from("expenses").select("*").order("expense_date", { ascending: false }).limit(input.limit ?? 100);
    if (input.category) q = q.eq("category", input.category);
    if (input.from) q = q.gte("expense_date", input.from);
    if (input.to) q = q.lte("expense_date", input.to);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: { expenses: data ?? [] } };
  },
});
