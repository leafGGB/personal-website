"use client";
import { useRef, ReactNode, useCallback, useState } from "react";
import { Link } from "react-router-dom";

interface GlassMagneticCardProps {
  children: ReactNode;
  className?: string;
  /** If provided, renders an invisible Link overlay over the entire card */
  to?: string;
  onClick?: () => void;
  tiltIntensity?: number;
}

export default function GlassMagneticCard({
  children,
  className = "",
  to,
  onClick,
  tiltIntensity = 8,
}: GlassMagneticCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      const glow = glowRef.current;
      const content = contentRef.current;
      if (!card || !glow) return;

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mx = e.clientX - centerX;
      const my = e.clientY - centerY;

      const normX = mx / (rect.width / 2);
      const normY = my / (rect.height / 2);

      // 3D tilt
      const rx = -normY * tiltIntensity;
      const ry = normX * tiltIntensity;
      card.style.transform =
        `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`;

      // Shadow offset
      card.style.setProperty("--sox", `${normX * -14}px`);
      card.style.setProperty("--soy", `${normY * -14}px`);

      // Glow follows cursor
      const gx = ((e.clientX - rect.left) / rect.width) * 100;
      const gy = ((e.clientY - rect.top) / rect.height) * 100;
      glow.style.setProperty("--gx", `${gx}%`);
      glow.style.setProperty("--gy", `${gy}%`);
      glow.style.opacity = "1";

      // Content parallax
      if (content) {
        content.style.transform =
          `translateX(${normX * 4}px) translateY(${normY * 4}px) translateZ(24px)`;
      }
    },
    [tiltIntensity]
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    const content = contentRef.current;
    if (!card) return;

    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    card.style.setProperty("--sox", "0px");
    card.style.setProperty("--soy", "0px");

    if (glow) glow.style.opacity = "0";
    if (content)
      content.style.transform =
        "translateX(0px) translateY(0px) translateZ(0px)";
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`glass-card-interactive group relative overflow-hidden ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transform:
          "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition:
          "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease",
        boxShadow: `inset 0 1px 0 var(--color-glass-highlight), var(--sox, 0px) var(--soy, 0px) 48px var(--color-glass-shadow)`,
        willChange: "transform",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Invisible Link overlay for clickable cards */}
      {to && (
        <Link
          to={to}
          className="absolute inset-0 z-30 rounded-[inherit]"
          aria-label="View details"
        />
      )}
      {onClick && (
        <button
          onClick={onClick}
          className="absolute inset-0 z-30 rounded-[inherit] cursor-pointer"
          aria-label="Action"
        />
      )}

      {/* Cursor-following glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none z-10 rounded-[inherit] opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(126,184,247,0.18) 0%, rgba(232,196,196,0.07) 30%, transparent 70%)`,
        }}
      />

      {/* Top reflection highlight */}
      <div
        className="absolute inset-0 pointer-events-none z-10 rounded-[inherit] transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)`,
        }}
      />

      {/* Content layer with parallax */}
      <div
        ref={contentRef}
        className="relative z-20"
        style={{
          transformStyle: "preserve-3d",
          transform: "translateX(0px) translateY(0px) translateZ(0px)",
          transition:
            "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
