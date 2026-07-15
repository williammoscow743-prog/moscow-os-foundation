import { createFileRoute } from "@tanstack/react-router";
import { FolderKanban } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/_authenticated/projects")({
  component: () => (
    <ComingSoon
      icon={FolderKanban}
      title="Projects"
      description="Plan, ship and track every project across your business — with milestones, boards and timelines."
    />
  ),
});
