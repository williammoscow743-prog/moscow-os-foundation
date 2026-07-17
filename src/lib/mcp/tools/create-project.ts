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
  name: "create_project",
  title: "Create project",
  description: "Create a new project for the signed-in user.",
  inputSchema: {
    name: z.string().trim().min(1).describe("Project name."),
    description: z.string().optional().describe("Optional project description."),
    category: z.string().optional().describe("Category label (e.g. Client Work, Internal)."),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    status: z.enum(["active", "on_hold", "completed", "archived"]).optional(),
    due_date: z.string().optional().describe("ISO date (YYYY-MM-DD) for the due date."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("projects")
      .insert({
        user_id: ctx.getUserId(),
        name: input.name,
        description: input.description ?? null,
        category: input.category ?? null,
        priority: input.priority ?? "medium",
        status: input.status ?? "active",
        due_date: input.due_date ?? null,
      })
      .select()
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Created project "${data.name}" (${data.id}).` }],
      structuredContent: { project: data },
    };
  },
});
