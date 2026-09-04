import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CLIENT_STATUSES, CLIENT_TYPES, type ClientRow } from "./types";
import { isValidEmail } from "./utils";

type FormState = {
  first_name: string;
  last_name: string;
  client_type: string;
  company_name: string;
  email: string;
  phone: string;
  alternative_phone: string;
  website: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  status: string;
  notes: string;
};

const empty: FormState = {
  first_name: "",
  last_name: "",
  client_type: "individual",
  company_name: "",
  email: "",
  phone: "",
  alternative_phone: "",
  website: "",
  address: "",
  city: "",
  province: "",
  postal_code: "",
  country: "South Africa",
  status: "active",
  notes: "",
};

export type ClientFormSubmit = {
  first_name: string;
  last_name: string;
  client_type: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  alternative_phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  country: string | null;
  status: string;
  notes: string | null;
  archived_at: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: ClientRow | null;
  onSubmit: (values: ClientFormSubmit) => Promise<void> | void;
  saving?: boolean;
};

type Errors = Partial<Record<"first_name" | "last_name" | "email", string>>;

export function ClientFormDialog({ open, onOpenChange, client, onSubmit, saving }: Props) {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      client
        ? {
            first_name: client.first_name ?? "",
            last_name: client.last_name ?? "",
            client_type: client.client_type ?? "individual",
            company_name: client.company_name ?? "",
            email: client.email ?? "",
            phone: client.phone ?? "",
            alternative_phone: client.alternative_phone ?? "",
            website: client.website ?? "",
            address: client.address ?? "",
            city: client.city ?? "",
            province: client.province ?? "",
            postal_code: client.postal_code ?? "",
            country: client.country ?? "South Africa",
            status: client.status ?? "active",
            notes: client.notes ?? "",
          }
        : empty,
    );
  }, [open, client]);

  const set = (k: keyof FormState) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!form.first_name.trim()) next.first_name = "First name is required";
    if (!form.last_name.trim()) next.last_name = "Last name is required";
    if (form.email.trim() && !isValidEmail(form.email)) next.email = "Enter a valid email address";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const trimmed = (v: string) => v.trim() || null;
    await onSubmit({
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      client_type: form.client_type,
      company_name: trimmed(form.company_name),
      email: trimmed(form.email),
      phone: trimmed(form.phone),
      alternative_phone: trimmed(form.alternative_phone),
      website: trimmed(form.website),
      address: trimmed(form.address),
      city: trimmed(form.city),
      province: trimmed(form.province),
      postal_code: trimmed(form.postal_code),
      country: trimmed(form.country),
      status: form.status,
      notes: trimmed(form.notes),
      archived_at: form.status === "archived" ? new Date().toISOString() : null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{client ? "Edit client" : "New client"}</DialogTitle>
          <DialogDescription>
            {client
              ? "Update this client's details below."
              : "Add a client to your workspace. Fields marked * are required."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col" noValidate>
          <div className="-mx-6 min-h-0 flex-1 space-y-5 overflow-y-auto px-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">First name *</Label>
              <Input
                id="first_name"
                value={form.first_name}
                onChange={(e) => set("first_name")(e.target.value)}
                aria-invalid={!!errors.first_name}
                autoFocus
              />
              {errors.first_name && (
                <p className="text-xs text-destructive">{errors.first_name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last name *</Label>
              <Input
                id="last_name"
                value={form.last_name}
                onChange={(e) => set("last_name")(e.target.value)}
                aria-invalid={!!errors.last_name}
              />
              {errors.last_name && <p className="text-xs text-destructive">{errors.last_name}</p>}
            </div>

            <div className="space-y-2">
              <Label>Client type *</Label>
              <Select value={form.client_type} onValueChange={set("client_type")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLIENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_name">Company name</Label>
              <Input
                id="company_name"
                value={form.company_name}
                onChange={(e) => set("company_name")(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => set("email")(e.target.value)}
                aria-invalid={!!errors.email}
                placeholder="name@company.co.za"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => set("phone")(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alternative_phone">Alternative phone</Label>
              <Input
                id="alternative_phone"
                value={form.alternative_phone}
                onChange={(e) => set("alternative_phone")(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={form.website}
                onChange={(e) => set("website")(e.target.value)}
                placeholder="https://"
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Address
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Street address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => set("address")(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={form.city} onChange={(e) => set("city")(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Input
                  id="province"
                  value={form.province}
                  onChange={(e) => set("province")(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal code</Label>
                <Input
                  id="postal_code"
                  value={form.postal_code}
                  onChange={(e) => set("postal_code")(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={form.country}
                  onChange={(e) => set("country")(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={set("status")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLIENT_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes")(e.target.value)}
              placeholder="Anything useful to remember about this client…"
            />
          </div>
          </div>

          <DialogFooter className="-mx-6 -mb-6 mt-4 border-t bg-background px-6 py-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : client ? "Save changes" : "Create client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
