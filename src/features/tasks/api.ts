import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type {
  SubtaskInsert,
  SubtaskRow,
  SubtaskUpdate,
  TaskActivityRow,
  TaskCommentRow,
  TaskInsert,
  TaskRow,
  TaskUpdate,
} from "./types";

const KEY = ["tasks"] as const;

async function logActivity(
  taskId: string,
  userId: string,
  action: string,
  metadata: Record<string, unknown> = {},
) {
  await supabase.from("task_activity").insert({
    task_id: taskId,
    user_id: userId,
    action,
    metadata: metadata as never,
  });
}

// ---------- Tasks ----------

export function useAllTasks() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...KEY, "all", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<TaskRow[]> => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("due_date", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as TaskRow[];
    },
  });
}

export function useProjectTasks(projectId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...KEY, "project", projectId, user?.id],
    enabled: !!user && !!projectId,
    queryFn: async (): Promise<TaskRow[]> => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId!)
        .order("due_date", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as TaskRow[];
    },
  });
}

export function useTask(taskId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...KEY, "detail", taskId, user?.id],
    enabled: !!user && !!taskId,
    queryFn: async (): Promise<TaskRow | null> => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId!)
        .maybeSingle();
      if (error) throw error;
      return (data as TaskRow | null) ?? null;
    },
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: Omit<TaskInsert, "user_id">) => {
      if (!user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("tasks")
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      await logActivity(data.id, user.id, "created", { title: data.title });
      return data as TaskRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: TaskUpdate }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      if (user) await logActivity(id, user.id, "updated", { fields: Object.keys(patch) });
      return data as TaskRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

// ---------- Subtasks ----------

export function useSubtasks(taskId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...KEY, "subtasks", taskId, user?.id],
    enabled: !!user && !!taskId,
    queryFn: async (): Promise<SubtaskRow[]> => {
      const { data, error } = await supabase
        .from("subtasks")
        .select("*")
        .eq("task_id", taskId!)
        .order("position", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as SubtaskRow[];
    },
  });
}

export function useCreateSubtask() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: Omit<SubtaskInsert, "user_id">) => {
      if (!user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("subtasks")
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data as SubtaskRow;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: [...KEY, "subtasks", vars.task_id] });
    },
  });
}

export function useUpdateSubtask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: SubtaskUpdate }) => {
      const { data, error } = await supabase
        .from("subtasks")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as SubtaskRow;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: [...KEY, "subtasks", data.task_id] });
    },
  });
}

export function useDeleteSubtask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, taskId }: { id: string; taskId: string }) => {
      const { error } = await supabase.from("subtasks").delete().eq("id", id);
      if (error) throw error;
      return { id, taskId };
    },
    onSuccess: ({ taskId }) => {
      qc.invalidateQueries({ queryKey: [...KEY, "subtasks", taskId] });
    },
  });
}

// ---------- Comments ----------

export function useTaskComments(taskId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...KEY, "comments", taskId, user?.id],
    enabled: !!user && !!taskId,
    queryFn: async (): Promise<TaskCommentRow[]> => {
      const { data, error } = await supabase
        .from("task_comments")
        .select("*")
        .eq("task_id", taskId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as TaskCommentRow[];
    },
  });
}

export function useCreateTaskComment() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({
      task_id,
      body,
      parent_id,
    }: {
      task_id: string;
      body: string;
      parent_id?: string | null;
    }) => {
      if (!user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("task_comments")
        .insert({ task_id, body, parent_id: parent_id ?? null, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      await logActivity(task_id, user.id, "commented", {});
      return data as TaskCommentRow;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: [...KEY, "comments", vars.task_id] });
      qc.invalidateQueries({ queryKey: [...KEY, "activity", vars.task_id] });
    },
  });
}

export function useDeleteTaskComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, taskId }: { id: string; taskId: string }) => {
      const { error } = await supabase.from("task_comments").delete().eq("id", id);
      if (error) throw error;
      return { id, taskId };
    },
    onSuccess: ({ taskId }) => {
      qc.invalidateQueries({ queryKey: [...KEY, "comments", taskId] });
    },
  });
}

// ---------- Activity ----------

export function useTaskActivity(taskId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...KEY, "activity", taskId, user?.id],
    enabled: !!user && !!taskId,
    queryFn: async (): Promise<TaskActivityRow[]> => {
      const { data, error } = await supabase
        .from("task_activity")
        .select("*")
        .eq("task_id", taskId!)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data ?? []) as TaskActivityRow[];
    },
  });
}
