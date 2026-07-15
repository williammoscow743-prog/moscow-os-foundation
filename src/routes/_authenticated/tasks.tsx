import { createFileRoute } from "@tanstack/react-router";
import { CheckSquare } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/_authenticated/tasks")({
  component: () => (
    <ComingSoon
      icon={CheckSquare}
      title="Tasks"
      description="A calm, keyboard-first task system. Capture, prioritize and finish work without the noise."
    />
  ),
});
