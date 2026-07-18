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
  name: "create_task",
  title: "Create task",
  description: "Create a task under a project (and optionally a milestone) for the signed-in user.",
  inputSchema: {
    project_id: z.string().uuid(),
    milestone_id: z.string().uuid().optional(),
    title: z.string().trim().min(1),
    description: z.string().optional(),
    status: z.enum(["todo", "in_progress", "in_review", "completed", "blocked"]).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    progress: z.number().int().min(0).max(100).optional(),
    due_date: z.string().optional().describe("ISO date (YYYY-MM-DD)."),
    estimated_hours: z.number().min(0).optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("tasks")
      .insert({
        project_id: input.project_id,
        milestone_id: input.milestone_id ?? null,
        title: input.title,
        description: input.description ?? null,
        status: input.status ?? "todo",
        priority: input.priority ?? "medium",
        progress: input.progress ?? 0,
        due_date: input.due_date ?? null,
        estimated_hours: input.estimated_hours ?? null,
      })
      .select()
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Created task "${data.title}" (${data.id}).` }],
      structuredContent: { task: data },
    };
  },
});
