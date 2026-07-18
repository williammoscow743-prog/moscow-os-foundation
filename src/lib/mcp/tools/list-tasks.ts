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
  name: "list_tasks",
  title: "List tasks",
  description:
    "List tasks for the signed-in user, optionally filtered by project, milestone, status, or priority.",
  inputSchema: {
    project_id: z.string().uuid().optional(),
    milestone_id: z.string().uuid().optional(),
    status: z.enum(["todo", "in_progress", "in_review", "completed", "blocked"]).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    include_archived: z.boolean().optional(),
    limit: z.number().int().min(1).max(200).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    let query = supabaseForUser(ctx)
      .from("tasks")
      .select(
        "id, project_id, milestone_id, title, description, status, priority, progress, due_date, estimated_hours, actual_hours, completed_at, created_at",
      )
      .order("due_date", { ascending: true, nullsFirst: false })
      .limit(input.limit ?? 100);
    if (input.project_id) query = query.eq("project_id", input.project_id);
    if (input.milestone_id) query = query.eq("milestone_id", input.milestone_id);
    if (input.status) query = query.eq("status", input.status);
    if (input.priority) query = query.eq("priority", input.priority);
    if (!input.include_archived) query = query.eq("archived", false);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { tasks: data ?? [] },
    };
  },
});
