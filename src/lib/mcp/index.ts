import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProjectsTool from "./tools/list-projects";
import createProjectTool from "./tools/create-project";
import listMilestonesTool from "./tools/list-milestones";
import createMilestoneTool from "./tools/create-milestone";
import listTasksTool from "./tools/list-tasks";
import createTaskTool from "./tools/create-task";
import updateTaskTool from "./tools/update-task";
import completeTaskTool from "./tools/complete-task";
import whoamiTool from "./tools/whoami";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "moscow-os-mcp",
  title: "Moscow OS",
  version: "0.2.0",
  instructions:
    "Tools for Moscow OS — read and manage projects, milestones and tasks as the signed-in user. Use `whoami` to verify the connected identity.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    whoamiTool,
    listProjectsTool,
    createProjectTool,
    listMilestonesTool,
    createMilestoneTool,
    listTasksTool,
    createTaskTool,
    updateTaskTool,
    completeTaskTool,
  ],
});
