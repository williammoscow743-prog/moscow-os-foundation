/** Canonical route paths — reference these instead of hard-coding strings. */

export const ROUTES = {
  home: "/",
  auth: "/auth",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  projects: "/projects",
  projectDetail: (id: string) => `/projects/${id}`,
  tasks: "/tasks",
  calendar: "/calendar",
  clients: "/clients",
  finance: "/finance",
  reports: "/reports",
  settings: "/settings",
} as const;
