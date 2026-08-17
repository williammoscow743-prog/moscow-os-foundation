import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/layouts/AppShell";
import { Loader2 } from "lucide-react";
import { useFinanceNotifications } from "@/features/finance/hooks/useFinanceNotifications";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/auth", replace: true, search: { next: undefined } });
    }
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AppShell>
      <FinanceNotificationRunner />
      <Outlet />
    </AppShell>
  );
}

/** Evaluates Finance notification rules once per authenticated session mount. */
function FinanceNotificationRunner() {
  useFinanceNotifications();
  return null;
}
