export default function SquigglyUnderline() {
  return (
    <svg
      className="absolute -bottom-2 left-0 w-full h-3"
      viewBox="0 0 200 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M2 6 C 15 0, 30 12, 45 6 S 75 12, 90 6 S 115 12, 130 6 S 155 12, 170 6 S 185 12, 198 6"
        stroke="url(#squiggle-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="transparent"
        opacity="0.6"
      />
      <defs>
        <linearGradient id="squiggle-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7EB8F7" />
          <stop offset="100%" stopColor="#E8C4C4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
