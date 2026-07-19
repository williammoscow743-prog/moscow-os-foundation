import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export interface TabNavItem {
  label: string;
  to: string;
  exact?: boolean;
}

export interface TabNavProps {
  items: TabNavItem[];
  className?: string;
}

/** Route-driven tab bar. Uses TanStack Router's active state. */
export function TabNav({ items, className }: TabNavProps) {
  return (
    <div className={cn("flex gap-1 border-b border-border/60", className)}>
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          activeOptions={{ exact: item.exact }}
          className="relative px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
          activeProps={{ className: "active" }}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
