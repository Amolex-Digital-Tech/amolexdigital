"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulsePhase: number;
}

export function AiNetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let nodes: Node[] = [];
    const NODE_COUNT = 55;
    const MAX_DIST = 160;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        vx: rand(-0.35, 0.35),
        vy: rand(-0.35, 0.35),
        radius: rand(1.5, 3.5),
        alpha: rand(0.4, 0.9),
        pulsePhase: rand(0, Math.PI * 2)
      });
    }

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.012;

      // Update positions
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.4;
            // Alternate gold / green lines
            const isGold = (i + j) % 3 === 0;
            ctx.strokeStyle = isGold
              ? `rgba(178,146,103,${alpha})`
              : `rgba(26,92,68,${alpha * 1.4})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const pulse = 0.6 + 0.4 * Math.sin(t + n.pulsePhase);
        const r = n.radius * (0.85 + 0.3 * pulse);

        // Outer glow
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 5);
        grd.addColorStop(0, `rgba(178,146,103,${0.18 * pulse})`);
        grd.addColorStop(1, "rgba(178,146,103,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 5, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = `rgba(178,146,103,${n.alpha * pulse})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-60"
      aria-hidden="true"
    />
  );
}
