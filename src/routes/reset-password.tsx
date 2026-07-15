import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

const schema = z
  .object({
    password: z.string().min(8, "At least 8 characters"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: values.password });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    navigate({ to: "/dashboard" });
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-semibold tracking-tight">Set a new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a strong password for your Moscow OS account.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              New password
            </Label>
            <Input type="password" {...form.register("password")} />
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Confirm password
            </Label>
            <Input type="password" {...form.register("confirm")} />
            {form.formState.errors.confirm && (
              <p className="text-xs text-destructive">{form.formState.errors.confirm.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update password
          </Button>
        </form>
      </div>
    </div>
  );
}
