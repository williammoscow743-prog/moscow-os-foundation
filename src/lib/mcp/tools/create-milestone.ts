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
  name: "create_milestone",
  title: "Create milestone",
  description: "Create a milestone under a project owned by the signed-in user.",
  inputSchema: {
    project_id: z.string().uuid().describe("Parent project ID."),
    title: z.string().trim().min(1),
    description: z.string().optional(),
    status: z.enum(["pending", "in_progress", "completed", "blocked"]).optional(),
    progress: z.number().int().min(0).max(100).optional(),
    due_date: z.string().optional().describe("ISO date (YYYY-MM-DD)."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("milestones")
      .insert({
        project_id: input.project_id,
        title: input.title,
        description: input.description ?? null,
        status: input.status ?? "pending",
        progress: input.progress ?? 0,
        due_date: input.due_date ?? null,
      })
      .select()
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Created milestone "${data.title}" (${data.id}).` }],
      structuredContent: { milestone: data },
    };
  },
});
