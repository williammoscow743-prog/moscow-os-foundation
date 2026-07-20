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
  name: "create_income",
  title: "Create income",
  description: "Record an income entry for the signed-in user.",
  inputSchema: {
    source: z.string().min(1),
    amount: z.number().nonnegative(),
    currency: z.string().default("USD"),
    category: z.string().default("other"),
    received_date: z.string().optional(),
    project_id: z.string().uuid().optional(),
    notes: z.string().optional(),
  },
  annotations: { readOnlyHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { data, error } = await sb(ctx).from("income").insert({
      source: input.source,
      amount: input.amount,
      currency: input.currency,
      category: input.category,
      received_date: input.received_date ?? new Date().toISOString().slice(0, 10),
      project_id: input.project_id ?? null,
      notes: input.notes ?? null,
    }).select().single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: `Recorded income "${data.source}" (${data.id}).` }], structuredContent: { income: data } };
  },
});
