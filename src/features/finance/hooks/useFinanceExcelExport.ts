import { useCallback } from "react";
import { toast } from "sonner";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/hooks/use-auth";
import {
  exportFinanceExcel,
  type ExcelExportOptions,
} from "@/features/finance/services/excel-export.service";

/** Hook that wraps the finance Excel exporter with current user context. */
export function useFinanceExcelExport() {
  const { data: profile } = useProfile();
  const { user } = useAuth();

  return useCallback(
    async (opts: Omit<ExcelExportOptions, "userName"> & { userName?: string }) => {
      try {
        const userName =
          opts.userName ?? profile?.full_name ?? profile?.email ?? user?.email ?? "—";
        if (opts.rows.length === 0) {
          toast.error("Nothing to export for this report.");
          return;
        }
        await exportFinanceExcel({ ...opts, userName });
        toast.success("Excel exported");
      } catch (e) {
        toast.error((e as Error).message || "Excel export failed");
      }
    },
    [profile, user],
  );
}
