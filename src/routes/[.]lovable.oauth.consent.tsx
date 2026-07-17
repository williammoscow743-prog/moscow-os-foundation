import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type OAuthClient = {
  name?: string;
  client_name?: string;
  redirect_uri?: string;
};

type AuthorizationDetails = {
  client?: OAuthClient | null;
  redirect_url?: string;
  redirect_to?: string;
  scopes?: string[] | string;
};

// The `supabase.auth.oauth` namespace is beta and may not be in the shipped types.
type OAuthApi = {
  getAuthorizationDetails: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  denyAuthorization: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
};

function oauthApi(): OAuthApi {
  return (supabase.auth as unknown as { oauth: OAuthApi }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/auth", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId =
      new URLSearchParams(location.search).get("authorization_id") ?? "";
    const { data, error } = await oauthApi().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: ConsentPage,
  errorComponent: ({ error }) => (
    <ConsentShell>
      <h1 className="text-xl font-semibold tracking-tight">Authorization error</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {String((error as Error)?.message ?? error)}
      </p>
    </ConsentShell>
  ),
});

function ConsentShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen w-full place-items-center bg-background px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        {children}
      </div>
    </main>
  );
}

function ConsentPage() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState<"approve" | "deny" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clientName = details?.client?.client_name || details?.client?.name || "an app";
  const redirectUri = details?.client?.redirect_uri;
  const scopes = Array.isArray(details?.scopes)
    ? details?.scopes
    : typeof details?.scopes === "string"
      ? details.scopes.split(" ").filter(Boolean)
      : [];

  async function decide(approve: boolean) {
    setBusy(approve ? "approve" : "deny");
    setError(null);
    const { data, error } = approve
      ? await oauthApi().approveAuthorization(authorization_id)
      : await oauthApi().denyAuthorization(authorization_id);
    if (error) {
      setBusy(null);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(null);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  return (
    <ConsentShell>
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <span className="font-display text-sm font-bold">M</span>
        </div>
        <span className="text-sm font-semibold tracking-tight">Moscow OS</span>
      </div>

      <h1 className="mt-6 text-2xl font-semibold tracking-tight">
        Connect {clientName} to your account
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {clientName} will be able to call Moscow OS tools while you are signed in. This does not
        bypass Moscow OS permissions or backend policies.
      </p>

      {redirectUri && (
        <div className="mt-6 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          <p className="font-medium uppercase tracking-wider text-[10px]">Redirects to</p>
          <p className="mt-1 break-all font-mono text-foreground">{redirectUri}</p>
        </div>
      )}

      {scopes.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Permissions requested
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            {scopes.map((s) => (
              <li key={s} className="rounded-md bg-muted/40 px-2 py-1 font-mono text-xs">
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          disabled={busy !== null}
          onClick={() => decide(false)}
        >
          {busy === "deny" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Cancel connection
        </Button>
        <Button disabled={busy !== null} onClick={() => decide(true)}>
          {busy === "approve" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Approve
        </Button>
      </div>
    </ConsentShell>
  );
}
