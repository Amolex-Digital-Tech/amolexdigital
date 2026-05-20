import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Badge({
  className,
  children
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary dark:text-secondary",
        className
      )}
    >
      {children}
    </span>
  );
}
