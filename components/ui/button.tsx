"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 backdrop-blur-md",
  {
    variants: {
      variant: {
        default:
          "bg-white/20 border border-white/35 text-[#103D2E] shadow-[0_2px_4px_rgba(0,0,0,0.02),0_4px_10px_rgba(0,0,0,0.02),0_-1px_2px_rgba(255,255,255,0.4)_inset,0_1px_2px_rgba(0,0,0,0.01)_inset] hover:bg-white/35 hover:shadow-[0_4px_8px_rgba(0,0,0,0.03),0_8px_16px_rgba(0,0,0,0.03),0_-1px_3px_rgba(255,255,255,0.5)_inset,0_1px_3px_rgba(0,0,0,0.02)_inset] hover:translate-y-[-2px]",
        secondary:
          "bg-white/15 border border-white/25 text-gray-800 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_4px_10px_rgba(0,0,0,0.02),0_-1px_2px_rgba(255,255,255,0.3)_inset,0_1px_2px_rgba(0,0,0,0.01)_inset] hover:bg-white/25 hover:shadow-[0_3px_6px_rgba(0,0,0,0.03),0_6px_14px_rgba(0,0,0,0.03),0_-1px_3px_rgba(255,255,255,0.35)_inset,0_1px_3px_rgba(0,0,0,0.02)_inset]",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-white/20",
        link: "p-0 text-primary underline-offset-4 hover:underline",
        destructive:
          "bg-red-500/90 border border-red-600 text-white shadow-sm hover:bg-red-600"
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-11 w-11 rounded-full"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        data-cursor={variant === "link" ? undefined : "interactive"}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
