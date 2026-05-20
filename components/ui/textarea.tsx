import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[140px] w-full rounded-[1.5rem] border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
