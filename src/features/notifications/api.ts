import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type { DraftNotification, NotificationRow } from "./types";

export const NOTIFICATIONS_KEY = ["notifications"] as const;

export function useNotifications(limit = 30) {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...NOTIFICATIONS_KEY, user?.id, limit],
    enabled: !!user,
    queryFn: async (): Promise<NotificationRow[]> => {
      // RLS restricts rows to the signed-in user; no client-side filtering needed.
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as NotificationRow[];
    },
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}

/**
 * Persist rule-generated notifications.
 * Duplicates are prevented by the (user_id, dedupe_key) unique index — inserting
 * an already-known condition is ignored rather than creating a second row.
 * Returns only the rows that were newly created.
 */
export function useCreateNotifications() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (drafts: DraftNotification[]): Promise<NotificationRow[]> => {
      if (!user || drafts.length === 0) return [];
      const { data, error } = await supabase
        .from("notifications")
        .upsert(
          drafts.map((d) => ({ ...d, user_id: user.id })),
          { onConflict: "user_id,dedupe_key", ignoreDuplicates: true },
        )
        .select();
      if (error) throw error;
      return (data ?? []) as NotificationRow[];
    },
    onSuccess: (created) => {
      if (created.length > 0) qc.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    },
  });
}
