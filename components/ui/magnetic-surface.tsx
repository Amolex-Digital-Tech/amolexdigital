"use client";

import * as React from "react";
import {
  motion,
  type HTMLMotionProps,
  type MotionStyle,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform
} from "framer-motion";

import { cn } from "@/lib/utils";

type MagneticSurfaceProps = HTMLMotionProps<"div"> & {
  cursorLabel?: string;
  cursorMode?: "interactive" | "scroll" | "text";
  strength?: number;
  rotateStrength?: number;
  inline?: boolean;
};

export function MagneticSurface({
  children,
  className,
  cursorLabel,
  cursorMode = "interactive",
  strength = 14,
  rotateStrength = 7,
  inline = false,
  style,
  onMouseMove,
  onMouseLeave,
  ...props
}: MagneticSurfaceProps) {
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const translateX = useSpring(useTransform(pointerX, [-1, 1], [-strength, strength]), {
    stiffness: 180,
    damping: 22,
    mass: 0.7
  });
  const translateY = useSpring(useTransform(pointerY, [-1, 1], [-strength, strength]), {
    stiffness: 180,
    damping: 22,
    mass: 0.7
  });
  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [rotateStrength, -rotateStrength]), {
    stiffness: 160,
    damping: 18,
    mass: 0.8
  });
  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [-rotateStrength, rotateStrength]), {
    stiffness: 160,
    damping: 18,
    mass: 0.8
  });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!shouldReduceMotion) {
      const bounds = event.currentTarget.getBoundingClientRect();
      const relativeX = (event.clientX - bounds.left) / bounds.width;
      const relativeY = (event.clientY - bounds.top) / bounds.height;

      pointerX.set(relativeX * 2 - 1);
      pointerY.set(relativeY * 2 - 1);
    }

    onMouseMove?.(event);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    pointerX.set(0);
    pointerY.set(0);
    onMouseLeave?.(event);
  };

  const magneticStyle: MotionStyle | undefined = shouldReduceMotion
    ? (style as MotionStyle | undefined)
    : {
        ...(style as MotionStyle | undefined),
        x: translateX,
        y: translateY,
        rotateX,
        rotateY,
        transformPerspective: 1400
      };

  return (
    <motion.div
      data-cursor={cursorMode}
      data-cursor-label={cursorLabel}
      className={cn(
        inline ? "inline-block" : "block",
        "will-change-transform [transform-style:preserve-3d]",
        className
      )}
      style={magneticStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </motion.div>
  );
}
