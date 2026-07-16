import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type { MilestoneInsert, MilestoneRow, MilestoneUpdate } from "./types";

const KEY = ["milestones"] as const;

export function useMilestones(projectId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...KEY, "project", projectId, user?.id],
    enabled: !!user && !!projectId,
    queryFn: async (): Promise<MilestoneRow[]> => {
      const { data, error } = await supabase
        .from("milestones")
        .select("*")
        .eq("project_id", projectId!)
        .order("due_date", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as MilestoneRow[];
    },
  });
}

export function useAllMilestones() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...KEY, "all", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<MilestoneRow[]> => {
      const { data, error } = await supabase
        .from("milestones")
        .select("*")
        .order("due_date", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return (data ?? []) as MilestoneRow[];
    },
  });
}

export function useCreateMilestone() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: Omit<MilestoneInsert, "user_id">) => {
      if (!user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("milestones")
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data as MilestoneRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: MilestoneUpdate }) => {
      const { data, error } = await supabase
        .from("milestones")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as MilestoneRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("milestones").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
