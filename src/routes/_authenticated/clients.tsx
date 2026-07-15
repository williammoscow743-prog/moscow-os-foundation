import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/_authenticated/clients")({
  component: () => (
    <ComingSoon
      icon={Users}
      title="Clients"
      description="A lightweight CRM built for entrepreneurs. Contacts, deals and notes without the sales-cliché."
    />
  ),
});
