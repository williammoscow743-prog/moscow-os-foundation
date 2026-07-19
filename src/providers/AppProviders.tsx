import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/sonner";

export interface AppProvidersProps {
  children: ReactNode;
  queryClient: QueryClient;
}

/**
 * Composed application providers.
 *
 * Wraps children with query, theme, auth, and global toasts.
 * Use this when mounting the app outside the standard router shell
 * (e.g. Storybook, tests, embedded contexts). The main router already
 * wires these providers in `src/router.tsx`.
 */
export function AppProviders({ children, queryClient }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
