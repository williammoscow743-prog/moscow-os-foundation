import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  children: ReactNode;
  className?: string;
}

const SIZES: Record<NonNullable<ContainerProps["size"]>, string> = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-none",
};

/** Width-constrained page container. */
export function Container({ size = "xl", children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6", SIZES[size], className)}>
      {children}
    </div>
  );
}
