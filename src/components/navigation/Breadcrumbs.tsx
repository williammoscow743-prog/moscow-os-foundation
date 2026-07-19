import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  to?: string;
}

export interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

/** Compact breadcrumb trail for nested pages. */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex flex-wrap items-center gap-1 text-sm text-muted-foreground", className)}
    >
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={`${c.label}-${i}`}>
            {c.to && !last ? (
              <Link to={c.to} className="hover:text-foreground">
                {c.label}
              </Link>
            ) : (
              <span className={cn(last && "text-foreground")}>{c.label}</span>
            )}
            {!last && <ChevronRight className="h-3.5 w-3.5" />}
          </Fragment>
        );
      })}
    </nav>
  );
}
