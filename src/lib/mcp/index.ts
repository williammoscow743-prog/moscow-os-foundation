import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProjectsTool from "./tools/list-projects";
import createProjectTool from "./tools/create-project";
import listMilestonesTool from "./tools/list-milestones";
import createMilestoneTool from "./tools/create-milestone";
import listTasksTool from "./tools/list-tasks";
import createTaskTool from "./tools/create-task";
import updateTaskTool from "./tools/update-task";
import completeTaskTool from "./tools/complete-task";
import listExpensesTool from "./tools/list-expenses";
import createExpenseTool from "./tools/create-expense";
import listBillsTool from "./tools/list-bills";
import createBillTool from "./tools/create-bill";
import markBillPaidTool from "./tools/mark-bill-paid";
import listIncomeTool from "./tools/list-income";
import createIncomeTool from "./tools/create-income";
import whoamiTool from "./tools/whoami";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "moscow-os-mcp",
  title: "Moscow OS",
  version: "0.3.0",
  instructions:
    "Tools for Moscow OS — read and manage projects, milestones, tasks, expenses, bills and income as the signed-in user. Use `whoami` to verify identity.",
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
    listExpensesTool,
    createExpenseTool,
    listBillsTool,
    createBillTool,
    markBillPaidTool,
    listIncomeTool,
    createIncomeTool,
  ],
});
