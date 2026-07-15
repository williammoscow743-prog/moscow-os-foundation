import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Loader2, Sun, Moon, Monitor } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

const profileSchema = z.object({
  full_name: z.string().min(1, "Enter your name"),
  business_name: z.string().optional().or(z.literal("")),
  timezone: z.string(),
});

function SettingsPage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Manage your profile, workspace and preferences.
        </p>
      </div>

      {isLoading ? (
        <div className="surface flex items-center justify-center p-12">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <ProfileCard profile={profile} email={user?.email ?? ""} />
          <ThemeCard />
          <NotificationsCard />
        </>
      )}
    </div>
  );
}

function ProfileCard({
  profile,
  email,
}: {
  profile: ReturnType<typeof useProfile>["data"];
  email: string;
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name ?? "",
      business_name: profile?.business_name ?? "",
      timezone: profile?.timezone ?? "UTC",
    },
  });

  useEffect(() => {
    form.reset({
      full_name: profile?.full_name ?? "",
      business_name: profile?.business_name ?? "",
      timezone: profile?.timezone ?? "UTC",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof profileSchema>) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: values.full_name,
        business_name: values.business_name || null,
        timezone: values.timezone,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile updated");
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const initials =
    (form.watch("full_name") || email)
      .split(" ")
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <section className="surface p-6">
      <SectionHead title="Profile" description="Your personal identity in Moscow OS." />
      <form className="mt-6 space-y-5" onSubmit={form.handleSubmit((v) => mutation.mutate(v))}>
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/15 text-lg font-semibold text-primary">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium">Avatar</p>
            <p className="text-xs text-muted-foreground">Generated from your name.</p>
          </div>
        </div>

        <Field label="Full name" error={form.formState.errors.full_name?.message}>
          <Input {...form.register("full_name")} />
        </Field>
        <Field label="Email">
          <Input value={email} disabled />
        </Field>
        <Field label="Business name">
          <Input {...form.register("business_name")} placeholder="Your company" />
        </Field>
        <Field label="Timezone">
          <Input {...form.register("timezone")} placeholder="UTC" />
        </Field>

        <div className="flex justify-end">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </div>
      </form>
    </section>
  );
}

function ThemeCard() {
  const { theme, setTheme } = useTheme();
  const options: { value: "light" | "dark" | "system"; label: string; Icon: typeof Sun }[] = [
    { value: "light", label: "Light", Icon: Sun },
    { value: "dark", label: "Dark", Icon: Moon },
    { value: "system", label: "System", Icon: Monitor },
  ];

  return (
    <section className="surface p-6">
      <SectionHead title="Appearance" description="Choose how Moscow OS looks to you." />
      <div className="mt-6 grid grid-cols-3 gap-3">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => setTheme(o.value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border p-4 text-sm font-medium transition-colors",
              theme === o.value
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            <o.Icon className="h-5 w-5" />
            {o.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function NotificationsCard() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["settings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [local, setLocal] = useState({
    email_notifications: true,
    push_notifications: true,
    weekly_digest: true,
    marketing_emails: false,
  });

  useEffect(() => {
    if (data) {
      setLocal({
        email_notifications: data.email_notifications,
        push_notifications: data.push_notifications,
        weekly_digest: data.weekly_digest,
        marketing_emails: data.marketing_emails,
      });
    }
  }, [data]);

  const update = useMutation({
    mutationFn: async (patch: Partial<typeof local>) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("settings")
        .upsert({ user_id: user.id, ...local, ...patch });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = (key: keyof typeof local) => {
    const next = { ...local, [key]: !local[key] };
    setLocal(next);
    update.mutate({ [key]: next[key] });
  };

  const rows: { key: keyof typeof local; title: string; desc: string }[] = [
    {
      key: "email_notifications",
      title: "Email notifications",
      desc: "Get product updates and important alerts by email.",
    },
    {
      key: "push_notifications",
      title: "Push notifications",
      desc: "In-app notifications for real-time updates.",
    },
    {
      key: "weekly_digest",
      title: "Weekly digest",
      desc: "A calm Monday summary of your workspace.",
    },
    {
      key: "marketing_emails",
      title: "Marketing emails",
      desc: "Occasional news about Moscow OS features.",
    },
  ];

  return (
    <section className="surface p-6">
      <SectionHead
        title="Notifications"
        description="Decide what reaches you and how."
      />
      <div className="mt-6 divide-y divide-border">
        {isLoading ? (
          <div className="py-8 text-center">
            <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          rows.map((r) => (
            <div key={r.key} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="text-sm font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
              <Switch checked={local[r.key]} onCheckedChange={() => toggle(r.key)} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function SectionHead({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
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
