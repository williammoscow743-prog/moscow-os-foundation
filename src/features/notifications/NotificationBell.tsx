import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/utils/format";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "./api";
import { NOTIFICATION_CATEGORY_LABELS, type NotificationCategory } from "./types";

const FILTERS: (NotificationCategory | "all")[] = ["all", "finance"];

const DOT_STYLES: Record<string, string> = {
  info: "bg-blue-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

export function NotificationBell() {
  const { data: notifications = [] } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const [filter, setFilter] = useState<NotificationCategory | "all">("all");

  const unread = notifications.filter((n) => !n.read).length;
  const visible = useMemo(
    () => (filter === "all" ? notifications : notifications.filter((n) => n.category === filter)),
    [notifications, filter],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span
              aria-hidden
              className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
            >
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="text-sm font-semibold">Notifications</span>
          {unread > 0 && (
            <button
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => markAll.mutate()}
            >
              Mark all read
            </button>
          )}
        </div>
        <div className="flex gap-1 border-b border-border px-3 py-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                filter === f
                  ? "bg-primary/15 font-semibold text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f === "all" ? "All" : NOTIFICATION_CATEGORY_LABELS[f]}
            </button>
          ))}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {visible.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              You&apos;re all caught up.
            </p>
          ) : (
            visible.map((n) => {
              const body = (
                <div className="flex items-start gap-2">
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                      n.read ? "bg-transparent" : (DOT_STYLES[n.type] ?? "bg-primary"),
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm", !n.read && "font-medium")}>{n.title}</p>
                    {n.message && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{n.message}</p>
                    )}
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {formatRelative(n.created_at)}
                    </p>
                  </div>
                  {!n.read && <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                </div>
              );
              return (
                <div
                  key={n.id}
                  className="border-b border-border/60 px-3 py-2.5 last:border-0 hover:bg-muted/50"
                  onClick={() => !n.read && markRead.mutate(n.id)}
                >
                  {n.link ? (
                    <Link to={n.link} className="block">
                      {body}
                    </Link>
                  ) : (
                    body
                  )}
                </div>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
