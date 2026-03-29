"use client";

import { useEffect, useRef } from "react";

type VantaInstance = {
  destroy?: () => void;
  resize?: () => void;
};

export default function VantaBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let effect: VantaInstance | null = null;
    let cancelled = false;

    const initialize = async () => {
      if (!containerRef.current || typeof window === "undefined") {
        return;
      }

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        return;
      }

      const [p5Module, topologyModule] = await Promise.all([
        import("p5"),
        import("vanta/dist/vanta.topology.min"),
      ]);

      if (cancelled || !containerRef.current) {
        return;
      }

      window.p5 = p5Module.default as unknown as typeof window.p5;
      const topology = topologyModule.default as (options: Record<string, unknown>) => VantaInstance;

      effect = topology({
        el: containerRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        color: 0x7f8a9d,
        backgroundColor: 0x05070d,
      });
    };

    initialize();

    return () => {
      cancelled = true;
      effect?.destroy?.();
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 opacity-55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(125,145,170,0.18),_transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,13,0.18)_0%,rgba(5,7,13,0.72)_65%,rgba(5,7,13,0.94)_100%)]" />
    </div>
  );
}
