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
  name: "create_expense",
  title: "Create expense",
  description: "Record a new expense for the signed-in user.",
  inputSchema: {
    name: z.string().min(1),
    amount: z.number().nonnegative(),
    currency: z.string().default("USD"),
    category: z.string().default("other"),
    expense_date: z.string().optional().describe("ISO date; defaults to today."),
    vendor: z.string().optional(),
    payment_method: z.string().optional(),
    project_id: z.string().uuid().optional(),
    description: z.string().optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(),
  },
  annotations: { readOnlyHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { data, error } = await sb(ctx)
      .from("expenses")
      .insert({
        name: input.name,
        amount: input.amount,
        currency: input.currency,
        category: input.category,
        expense_date: input.expense_date ?? new Date().toISOString().slice(0, 10),
        vendor: input.vendor ?? null,
        payment_method: input.payment_method ?? null,
        project_id: input.project_id ?? null,
        description: input.description ?? null,
        notes: input.notes ?? null,
        tags: input.tags ?? [],
      })
      .select()
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: `Created expense "${data.name}" (${data.id}).` }], structuredContent: { expense: data } };
  },
});
