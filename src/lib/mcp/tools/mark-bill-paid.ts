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
  name: "mark_bill_paid",
  title: "Mark bill paid",
  description: "Mark a bill as paid for the signed-in user.",
  inputSchema: { bill_id: z.string().uuid() },
  annotations: { readOnlyHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { data, error } = await sb(ctx)
      .from("bills")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", input.bill_id)
      .select()
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: `Marked "${data.name}" as paid.` }], structuredContent: { bill: data } };
  },
});
