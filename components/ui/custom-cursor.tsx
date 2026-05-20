"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

type CursorMode = "default" | "interactive" | "scroll" | "text";

type CursorMeta = {
  mode: CursorMode;
  label: string | null;
};

const HIDDEN_POSITION = -160;

function resolveCursorMeta(target: HTMLElement | null): CursorMeta {
  if (!target) {
    return { mode: "default", label: null };
  }

  const explicit = target.closest<HTMLElement>("[data-cursor], [data-cursor-label]");
  if (explicit) {
    const kind = explicit.dataset.cursor;

    if (kind === "scroll") {
      return { mode: "scroll", label: explicit.dataset.cursorLabel ?? "Scroll" };
    }

    if (kind === "text") {
      return { mode: "text", label: explicit.dataset.cursorLabel ?? null };
    }

    return { mode: "interactive", label: explicit.dataset.cursorLabel ?? "Open" };
  }

  const textTarget = target.closest<HTMLElement>(
    'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, select, [contenteditable="true"]'
  );
  if (textTarget) {
    return { mode: "text", label: null };
  }

  const interactiveTarget = target.closest<HTMLElement>(
    'a, button, summary, label, [role="button"], [tabindex]:not([tabindex="-1"])'
  );
  if (interactiveTarget) {
    return {
      mode: "interactive",
      label: interactiveTarget.tagName.toLowerCase() === "a" ? "Open" : "Tap"
    };
  }

  let current: HTMLElement | null = target;
  while (current) {
    const computedCursor = window.getComputedStyle(current).cursor;

    if (computedCursor === "pointer") {
      return { mode: "interactive", label: "Open" };
    }

    if (computedCursor === "text") {
      return { mode: "text", label: null };
    }

    current = current.parentElement;
  }

  return { mode: "default", label: null };
}

export function CustomCursor() {
  const shouldReduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const [label, setLabel] = useState<string | null>(null);

  const pointerX = useMotionValue(HIDDEN_POSITION);
  const pointerY = useMotionValue(HIDDEN_POSITION);

  const ringX = useSpring(pointerX, { stiffness: 420, damping: 28, mass: 0.4 });
  const ringY = useSpring(pointerY, { stiffness: 420, damping: 28, mass: 0.4 });
  const auraX = useSpring(pointerX, { stiffness: 180, damping: 24, mass: 0.8 });
  const auraY = useSpring(pointerY, { stiffness: 180, damping: 24, mass: 0.8 });
  const labelX = useSpring(pointerX, { stiffness: 220, damping: 24, mass: 0.7 });
  const labelY = useSpring(pointerY, { stiffness: 220, damping: 24, mass: 0.7 });

  const cursorMetaRef = useRef<CursorMeta>({ mode: "default", label: null });

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncState = () => setEnabled(mediaQuery.matches);

    syncState();
    mediaQuery.addEventListener("change", syncState);

    return () => {
      mediaQuery.removeEventListener("change", syncState);
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("has-custom-cursor");
      return;
    }

    document.documentElement.classList.add("has-custom-cursor");

    const updateMeta = (target: HTMLElement | null) => {
      const nextMeta = resolveCursorMeta(target);
      const currentMeta = cursorMetaRef.current;

      if (nextMeta.mode !== currentMeta.mode) {
        cursorMetaRef.current.mode = nextMeta.mode;
        setMode(nextMeta.mode);
      }

      if (nextMeta.label !== currentMeta.label) {
        cursorMetaRef.current.label = nextMeta.label;
        setLabel(nextMeta.label);
      }
    };

    const handlePointerMove = (event: MouseEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      setVisible(true);
      updateMeta(document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null);
    };

    const handlePointerLeave = () => {
      setVisible(false);
      setPressed(false);
    };

    const handlePointerDown = () => setPressed(true);
    const handlePointerUp = () => setPressed(false);
    const handleWindowMouseOut = (event: MouseEvent) => {
      if (!event.relatedTarget) {
        handlePointerLeave();
      }
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("mousedown", handlePointerDown, { passive: true });
    window.addEventListener("mouseup", handlePointerUp, { passive: true });
    window.addEventListener("mouseout", handleWindowMouseOut);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("mouseout", handleWindowMouseOut);
      window.removeEventListener("blur", handlePointerLeave);
    };
  }, [enabled, pointerX, pointerY]);

  if (!enabled) {
    return null;
  }

  const ringSize = mode === "interactive" ? 68 : mode === "scroll" ? 76 : mode === "text" ? 18 : 32;
  const auraSize = mode === "interactive" ? 92 : mode === "scroll" ? 112 : mode === "text" ? 20 : 60;
  const ringOpacity = visible ? (mode === "text" ? 0.2 : 1) : 0;
  const auraOpacity = visible ? (mode === "text" ? 0 : 1) : 0;
  const labelVisible = visible && label;

  return (
    <>
      <motion.div
        style={{ x: auraX, y: auraY }}
        className="pointer-events-none fixed left-0 top-0 z-[140] hidden mix-blend-normal md:block"
        animate={{
          opacity: auraOpacity,
          scale: pressed ? 0.88 : mode === "scroll" ? 1.18 : mode === "interactive" ? 1.06 : 1
        }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="rounded-full bg-[radial-gradient(circle,rgba(178,146,103,0.32),rgba(178,146,103,0.1)_42%,rgba(16,61,46,0)_72%)] blur-lg"
          style={{
            width: auraSize,
            height: auraSize,
            transform: "translate(-50%, -50%)"
          }}
        />
      </motion.div>

      <motion.div
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed left-0 top-0 z-[145] hidden md:block"
      >
        <motion.div
          animate={{
            width: ringSize,
            height: ringSize,
            opacity: ringOpacity,
            scale: pressed ? 0.86 : 1,
            borderRadius: mode === "text" ? 8 : 999,
            borderColor:
              mode === "scroll"
                ? "rgba(178,146,103,0.72)"
                : mode === "interactive"
                  ? "rgba(16,61,46,0.72)"
                  : "rgba(16,61,46,0.28)",
            backgroundColor:
              mode === "interactive" || mode === "scroll" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.02)"
          }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center border shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_18px_40px_rgba(16,61,46,0.12)] backdrop-blur-sm"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <motion.div
            animate={{
              width: mode === "text" ? 2 : 7,
              height: mode === "text" ? 14 : 7,
              opacity: visible ? 1 : 0,
              backgroundColor: mode === "scroll" ? "#B29267" : "#103D2E"
            }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-full shadow-[0_0_16px_rgba(178,146,103,0.45)]"
          />
        </motion.div>
      </motion.div>

      <motion.div
        style={{ x: labelX, y: labelY }}
        className="pointer-events-none fixed left-0 top-0 z-[150] hidden md:block"
        animate={{
          opacity: labelVisible ? 1 : 0,
          scale: labelVisible ? 1 : 0.82,
          y: labelVisible ? -38 : -28
        }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="rounded-full border border-[#103D2E]/12 bg-white/92 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#103D2E] shadow-[0_18px_34px_rgba(16,61,46,0.14)] backdrop-blur-md">
          {label}
        </div>
      </motion.div>
    </>
  );
}
