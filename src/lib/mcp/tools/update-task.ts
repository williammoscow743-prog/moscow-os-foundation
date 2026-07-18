import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "update_task",
  title: "Update task",
  description: "Update fields on an existing task owned by the signed-in user.",
  inputSchema: {
    id: z.string().uuid(),
    title: z.string().trim().min(1).optional(),
    description: z.string().nullable().optional(),
    status: z.enum(["todo", "in_progress", "in_review", "completed", "blocked"]).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    progress: z.number().int().min(0).max(100).optional(),
    due_date: z.string().nullable().optional(),
    milestone_id: z.string().uuid().nullable().optional(),
    estimated_hours: z.number().min(0).nullable().optional(),
    actual_hours: z.number().min(0).nullable().optional(),
    archived: z.boolean().optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { id, ...patch } = input;
    if (patch.status === "completed") {
      (patch as Record<string, unknown>).completed_at = new Date().toISOString();
      if (patch.progress == null) patch.progress = 100;
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("tasks")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Updated task "${data.title}".` }],
      structuredContent: { task: data },
    };
  },
});
