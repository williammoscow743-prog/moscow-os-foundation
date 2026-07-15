import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/features/authentication/AuthForm";

export const Route = createFileRoute("/auth")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/dashboard" });
  },
  component: AuthPage,
});

function AuthPage() {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-sidebar lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 60% at 20% 20%, oklch(from var(--primary) l c h / 0.25) 0%, transparent 60%), radial-gradient(50% 50% at 80% 80%, oklch(0.4 0.05 240 / 0.15) 0%, transparent 60%)",
          }}
        />
        <div className="relative flex items-center gap-2">
          <BrandMark />
          <span className="text-lg font-semibold tracking-tight">Moscow OS</span>
        </div>
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Sprint 01 · Foundation
          </p>
          <h2 className="mt-4 max-w-lg text-4xl font-semibold leading-tight tracking-tight">
            One intelligent workspace to{" "}
            <span className="text-gradient-brand">run your business.</span>
          </h2>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Projects, tasks, clients, finance, reports and AI — unified in a single, calm operating
            system built for entrepreneurs.
          </p>
        </div>
        <div className="relative text-xs text-muted-foreground">
          © {new Date().getFullYear()} Moscow OS. Crafted for operators.
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-10 flex items-center gap-2 lg:hidden">
            <BrandMark />
            <span className="text-base font-semibold tracking-tight">Moscow OS</span>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
}

function BrandMark() {
  return (
    <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
      <span className="font-display text-sm font-bold">M</span>
    </div>
  );
}
