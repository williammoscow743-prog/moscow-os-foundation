import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/_authenticated/calendar")({
  component: () => (
    <ComingSoon
      icon={Calendar}
      title="Calendar"
      description="See meetings, deadlines and time blocks in one unified view — synced with your workspace."
    />
  ),
});
