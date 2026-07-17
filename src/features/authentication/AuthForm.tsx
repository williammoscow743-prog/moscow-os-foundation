import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type Mode = "signin" | "signup" | "forgot";

const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
  remember: z.boolean().optional(),
});
const signUpSchema = z.object({
  full_name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});
const forgotSchema = z.object({ email: z.string().email("Enter a valid email") });

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("signin");
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { next?: string };
  const nextPath =
    typeof search.next === "string" && search.next.startsWith("/") && !search.next.startsWith("//")
      ? search.next
      : undefined;
  const afterAuthRedirect = nextPath ?? "/dashboard";
  const [submitting, setSubmitting] = useState(false);

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", remember: true },
  });
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { full_name: "", email: "", password: "" },
  });
  const forgotForm = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSignIn = signInForm.handleSubmit(async (values) => {
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    window.location.href = afterAuthRedirect;
  });

  const onSignUp = signUpForm.handleSubmit(async (values) => {
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}${afterAuthRedirect}`,
        data: { full_name: values.full_name },
      },
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. Check your email to verify.");
    setMode("signin");
  });

  const onForgot = forgotForm.handleSubmit(async (values) => {
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Password reset email sent");
    setMode("signin");
  });

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          {mode === "signin" && "Welcome back"}
          {mode === "signup" && "Create your workspace"}
          {mode === "forgot" && "Reset your password"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin" && "Sign in to your Moscow OS workspace."}
          {mode === "signup" && "Start running your business from one place."}
          {mode === "forgot" && "We'll email you a secure reset link."}
        </p>
      </div>

      {mode === "signin" && (
        <form onSubmit={onSignIn} className="space-y-4">
          <Field label="Email" error={signInForm.formState.errors.email?.message}>
            <Input type="email" autoComplete="email" {...signInForm.register("email")} />
          </Field>
          <Field label="Password" error={signInForm.formState.errors.password?.message}>
            <Input
              type="password"
              autoComplete="current-password"
              {...signInForm.register("password")}
            />
          </Field>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                checked={!!signInForm.watch("remember")}
                onCheckedChange={(v) => signInForm.setValue("remember", !!v)}
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            No account?{" "}
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="font-medium text-foreground hover:underline"
            >
              Create one
            </button>
          </p>
        </form>
      )}

      {mode === "signup" && (
        <form onSubmit={onSignUp} className="space-y-4">
          <Field label="Full name" error={signUpForm.formState.errors.full_name?.message}>
            <Input autoComplete="name" {...signUpForm.register("full_name")} />
          </Field>
          <Field label="Email" error={signUpForm.formState.errors.email?.message}>
            <Input type="email" autoComplete="email" {...signUpForm.register("email")} />
          </Field>
          <Field label="Password" error={signUpForm.formState.errors.password?.message}>
            <Input
              type="password"
              autoComplete="new-password"
              {...signUpForm.register("password")}
            />
          </Field>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create account
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("signin")}
              className="font-medium text-foreground hover:underline"
            >
              Sign in
            </button>
          </p>
        </form>
      )}

      {mode === "forgot" && (
        <form onSubmit={onForgot} className="space-y-4">
          <Field label="Email" error={forgotForm.formState.errors.email?.message}>
            <Input type="email" autoComplete="email" {...forgotForm.register("email")} />
          </Field>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send reset link
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className="font-medium text-foreground hover:underline"
            >
              Back to sign in
            </button>
          </p>
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
