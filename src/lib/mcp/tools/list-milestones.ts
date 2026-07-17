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
  name: "list_milestones",
  title: "List milestones",
  description:
    "List milestones for a specific project owned by the signed-in user, or across all their projects.",
  inputSchema: {
    project_id: z.string().uuid().optional().describe("Restrict to a single project."),
    status: z.enum(["pending", "in_progress", "completed", "blocked"]).optional(),
    limit: z.number().int().min(1).max(200).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ project_id, status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    let query = supabaseForUser(ctx)
      .from("milestones")
      .select("id, project_id, title, description, status, progress, due_date, created_at")
      .order("due_date", { ascending: true, nullsFirst: false })
      .limit(limit ?? 100);
    if (project_id) query = query.eq("project_id", project_id);
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { milestones: data ?? [] },
    };
  },
});
