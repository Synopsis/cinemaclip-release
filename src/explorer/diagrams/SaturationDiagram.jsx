import React from "react";
import { FONT, SVG_TEXT } from "../styles.js";

export default function SaturationDiagram({ labels, activeIndex, onSelect }) {
  // Reference hue for the saturation demo (warm orange — cinematic)
  const hue = 25;
  const positions = [
    { x: 40, saturation: 0, color: `hsl(${hue}, 0%, 55%)` },
    { x: 140, saturation: 45, color: `hsl(${hue}, 45%, 52%)` },
    { x: 240, saturation: 100, color: `hsl(${hue}, 100%, 50%)` },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <svg
        viewBox="0 0 280 160"
        style={{ width: "100%", maxWidth: 260, height: "auto" }}
      >
        <defs>
          <linearGradient id="sat-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={`hsl(${hue}, 0%, 55%)`} />
            <stop offset="50%" stopColor={`hsl(${hue}, 45%, 52%)`} />
            <stop offset="100%" stopColor={`hsl(${hue}, 100%, 50%)`} />
          </linearGradient>
        </defs>

        {/* Main gradient bar */}
        <rect
          x="30"
          y="55"
          width="220"
          height="18"
          rx="9"
          fill="url(#sat-gradient)"
          opacity="0.7"
        />

        {/* Track line below the bar for positioning */}
        <line
          x1="40"
          y1="90"
          x2="240"
          y2="90"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />

        {/* Clickable positions with swatches */}
        {positions.map((pos, i) => {
          const isActive = i === activeIndex;
          const isAdjacent = activeIndex != null && Math.abs(i - activeIndex) === 1;

          return (
            <g
              key={i}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(i)}
            >
              {/* Larger transparent hit target */}
              <rect
                x={pos.x - 24}
                y={30}
                width={48}
                height={100}
                fill="transparent"
              />

              {/* Indicator line from bar to swatch area */}
              <line
                x1={pos.x}
                y1={73}
                x2={pos.x}
                y2={90}
                stroke={
                  isActive
                    ? "rgba(255,255,255,0.5)"
                    : activeIndex === null
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(255,255,255,0.08)"
                }
                strokeWidth={isActive ? 1.5 : 0.8}
                style={{ transition: "all 0.3s ease" }}
              />

              {/* Position dot on bar */}
              <circle
                cx={pos.x}
                cy={64}
                r={isActive ? 5 : 3}
                fill={isActive ? "#fff" : activeIndex === null ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)"}
                stroke={isActive ? "rgba(0,0,0,0.3)" : "none"}
                strokeWidth="1.5"
                style={{
                  transition: "all 0.3s ease",
                  pointerEvents: "none",
                }}
              />

              {/* Color swatch circle below */}
              <circle
                cx={pos.x}
                cy={108}
                r={isActive ? 16 : activeIndex === null ? 13 : 10}
                fill={pos.color}
                stroke={
                  isActive
                    ? "rgba(255,255,255,0.6)"
                    : activeIndex === null
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.06)"
                }
                strokeWidth={isActive ? 2 : 1}
                style={{
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  pointerEvents: "none",
                }}
              />

              {/* Label */}
              <text
                x={pos.x}
                y={140}
                textAnchor="middle"
                fill={
                  isActive
                    ? "rgba(255,255,255,0.8)"
                    : isAdjacent
                    ? "rgba(255,255,255,0.25)"
                    : activeIndex === null
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(255,255,255,0.1)"
                }
                fontSize={SVG_TEXT.lg}
                fontFamily={FONT.mono}
                style={{
                  transition: "all 0.3s ease",
                  pointerEvents: "none",
                }}
              >
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
