import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type { ProjectInsert, ProjectRow, ProjectUpdate } from "./types";

const KEY = ["projects"] as const;

export function useProjects() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...KEY, user?.id],
    enabled: !!user,
    queryFn: async (): Promise<ProjectRow[]> => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ProjectRow[];
    },
  });
}

export function useProjectsByClient(clientId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...KEY, "by-client", clientId],
    enabled: !!user && !!clientId,
    queryFn: async (): Promise<ProjectRow[]> => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("client_id", clientId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ProjectRow[];
    },
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: Omit<ProjectInsert, "user_id">) => {
      if (!user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("projects")
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data as ProjectRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: ProjectUpdate }) => {
      const { data, error } = await supabase
        .from("projects")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as ProjectRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
