"use client";
import { useEffect, useRef } from "react";

interface Props {
  onToggle: () => void;
  onDone: () => void;
  originX: number;
  originY: number;
}

export default function ThemeLens({ onToggle, onDone, originX, originY }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onToggle();
      onDone();
      return;
    }

    const el = ref.current;
    if (!el) return;

    // Use target theme color (opposite of current)
    const isDark = document.documentElement.classList.contains("dark");
    const tintColor = isDark
      ? "rgba(235,238,245,0.12)"   // light tint for dark→light
      : "rgba(8,10,16,0.15)";      // dark tint for light→dark

    // Init overlay
    el.style.background = tintColor;
    el.style.backdropFilter = "blur(40px) saturate(180%)";
    el.style.WebkitBackdropFilter = "blur(40px) saturate(180%)";
    el.style.clipPath = `circle(0% at ${originX}px ${originY}px)`;

    void el.offsetWidth; // force reflow

    // Phase 1 — expand with springy overshoot
    el.style.transition = "clip-path 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)";
    el.style.clipPath = `circle(150% at ${originX}px ${originY}px)`;

    const expandTimer = setTimeout(() => {
      onToggle(); // switch theme at peak coverage

      // Phase 2a — quick drop to semi-transparent (reveal new theme partially)
      el.style.transition = "opacity 0.2s ease";
      el.style.opacity = "0.25";

      // Phase 2b — slow dissolve from semi-transparent to fully transparent
      setTimeout(() => {
        el.style.transition = "opacity 0.5s ease";
        el.style.opacity = "0";
        setTimeout(() => onDone(), 550);
      }, 260);
    }, 500);

    return () => clearTimeout(expandTimer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  );
}

