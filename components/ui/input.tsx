import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-2xl border border-border bg-background/60 px-4 py-2 text-sm text-foreground outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
