import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/_authenticated/finance")({
  component: () => (
    <ComingSoon
      icon={Wallet}
      title="Finance"
      description="Invoices, expenses and cash flow in a single, spreadsheet-free view of your business."
    />
  ),
});
