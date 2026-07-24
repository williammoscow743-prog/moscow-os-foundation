import { useCallback } from "react";
import { toast } from "sonner";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/hooks/use-auth";
import { exportFinancePdf, type PdfExportOptions } from "@/features/finance/pdf-export";

/** Hook that wraps the finance PDF exporter with current user context. */
export function useFinancePdfExport() {
  const { data: profile } = useProfile();
  const { user } = useAuth();

  return useCallback(
    (opts: Omit<PdfExportOptions, "userName"> & { userName?: string }) => {
      try {
        const userName =
          opts.userName ?? profile?.full_name ?? profile?.email ?? user?.email ?? "—";
        if (opts.rows.length === 0) {
          toast.error("Nothing to export for this report.");
          return;
        }
        exportFinancePdf({ ...opts, userName });
        toast.success("PDF exported");
      } catch (e) {
        toast.error((e as Error).message || "PDF export failed");
      }
    },
    [profile, user],
  );
}
