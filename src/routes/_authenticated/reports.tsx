import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/_authenticated/reports")({
  component: () => (
    <ComingSoon
      icon={BarChart3}
      title="Reports"
      description="Insights and trends across projects, clients and finance — automatically."
    />
  ),
});
