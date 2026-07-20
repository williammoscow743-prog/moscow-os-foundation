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
  name: "create_bill",
  title: "Create bill",
  description: "Create a bill for the signed-in user.",
  inputSchema: {
    name: z.string().min(1),
    amount: z.number().nonnegative(),
    due_date: z.string().describe("ISO date."),
    currency: z.string().default("USD"),
    category: z.string().default("other"),
    frequency: z.enum(["once", "weekly", "monthly", "quarterly", "yearly"]).default("once"),
    vendor: z.string().optional(),
    notes: z.string().optional(),
  },
  annotations: { readOnlyHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { data, error } = await sb(ctx).from("bills").insert({
      name: input.name,
      amount: input.amount,
      due_date: input.due_date,
      currency: input.currency,
      category: input.category,
      frequency: input.frequency,
      vendor: input.vendor ?? null,
      notes: input.notes ?? null,
    }).select().single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: `Created bill "${data.name}" (${data.id}).` }], structuredContent: { bill: data } };
  },
});
