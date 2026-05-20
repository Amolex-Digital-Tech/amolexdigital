"use client";

import { motion } from "framer-motion";

interface LiquidBackgroundProps {
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export function LiquidBackground({ className = "", intensity = "medium" }: LiquidBackgroundProps) {
  const blurAmount = intensity === "low" ? 40 : intensity === "medium" ? 60 : 80;
  const opacity = intensity === "low" ? 0.3 : intensity === "medium" ? 0.4 : 0.5;

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Primary liquid blob - moves slowly */}
      <motion.div
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(16, 61, 46, 0.5) 0%, rgba(16, 61, 46, 0.2) 40%, transparent 70%)",
          filter: `blur(${blurAmount}px)`,
        }}
        animate={{
          x: [0, 100, 50, -50, 0],
          y: [0, -50, 30, -30, 0],
          scale: [1, 1.1, 1.05, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary blob - gold accent */}
      <motion.div
        className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(178, 146, 103, 0.5) 0%, rgba(178, 146, 103, 0.2) 40%, transparent 70%)",
          filter: `blur(${blurAmount}px)`,
        }}
        animate={{
          x: [0, -80, 30, -50, 0],
          y: [0, 60, -30, 40, 0],
          scale: [1, 1.15, 1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Tertiary blob - bottom left */}
      <motion.div
        className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(16, 61, 46, 0.4) 0%, rgba(16, 61, 46, 0.15) 40%, transparent 70%)",
          filter: `blur(${blurAmount - 10}px)`,
        }}
        animate={{
          x: [0, 60, -30, 40, 0],
          y: [0, -40, 20, -30, 0],
          scale: [1, 1.2, 1.05, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      {/* Accent highlight blob */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(178, 146, 103, 0.3) 0%, rgba(178, 146, 103, 0.1) 40%, transparent 70%)",
          filter: `blur(${blurAmount - 20}px)`,
        }}
        animate={{
          x: [0, -50, 30, -20, 0],
          y: [0, 30, -20, 10, 0],
          scale: [1, 1.1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />
    </div>
  );
}
