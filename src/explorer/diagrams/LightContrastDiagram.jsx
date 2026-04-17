import React from "react";
import { FONT, SVG_TEXT } from "../styles.js";

export default function LightContrastDiagram({ labels, activeIndex, onSelect }) {
  const positions = [
    { cx: 50 },
    { cx: 140 },
    { cx: 230 },
  ];

  // Each level defines how dramatic the lighting gradient on the sphere is
  const contrastLevels = [
    { highlightOpacity: 0.18, shadowOpacity: 0.10, bgFill: 0.04 },
    { highlightOpacity: 0.40, shadowOpacity: 0.04, bgFill: 0.02 },
    { highlightOpacity: 0.70, shadowOpacity: 0.01, bgFill: 0.01 },
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
        viewBox="0 0 280 150"
        style={{ width: "100%", maxWidth: 260, height: "auto" }}
      >
        <defs>
          {contrastLevels.map((level, i) => (
            <radialGradient
              key={i}
              id={`lc-grad-${i}`}
              cx="0.3"
              cy="0.3"
              r="0.7"
            >
              <stop
                offset="0%"
                stopColor={`rgba(253,203,110,${level.highlightOpacity})`}
              />
              <stop
                offset="100%"
                stopColor={`rgba(255,255,255,${level.shadowOpacity})`}
              />
            </radialGradient>
          ))}
        </defs>

        {/* Track line */}
        <line
          x1="50"
          y1="120"
          x2="230"
          y2="120"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />

        {positions.map((pos, i) => {
          const isActive = i === activeIndex;
          const isAdjacent = activeIndex != null && Math.abs(i - activeIndex) === 1;
          const r = isActive ? 24 : 14;
          const level = contrastLevels[i];

          return (
            <g
              key={i}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(i)}
            >
              {/* Hit target */}
              <rect
                x={pos.cx - 30}
                y={10}
                width={60}
                height={115}
                fill="transparent"
              />

              {/* Background context rectangle */}
              <rect
                x={pos.cx - r - 6}
                y={50 - r - 6}
                width={(r + 6) * 2}
                height={(r + 6) * 2}
                rx={4}
                fill={`rgba(255,255,255,${level.bgFill})`}
                style={{
                  transition: "all 0.3s ease",
                  pointerEvents: "none",
                }}
              />

              {/* Lit sphere */}
              <circle
                cx={pos.cx}
                cy={50}
                r={r}
                fill={`url(#lc-grad-${i})`}
                stroke={
                  isActive
                    ? "rgba(255,255,255,0.3)"
                    : isAdjacent
                    ? "rgba(255,255,255,0.08)"
                    : activeIndex === null
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(255,255,255,0.03)"
                }
                strokeWidth={isActive ? 1.2 : 0.6}
                style={{
                  transition: "all 0.3s ease",
                  pointerEvents: "none",
                }}
              />

              {/* Specular highlight for high contrast */}
              {i === 2 && (
                <circle
                  cx={pos.cx - r * 0.3}
                  cy={50 - r * 0.3}
                  r={r * 0.15}
                  fill={`rgba(255,255,255,${isActive ? 0.5 : 0.15})`}
                  style={{
                    transition: "all 0.3s ease",
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Step dot */}
              <circle
                cx={pos.cx}
                cy={120}
                r={isActive ? 4 : 2.5}
                fill={
                  isActive
                    ? "rgba(255,255,255,0.7)"
                    : isAdjacent
                    ? "rgba(255,255,255,0.2)"
                    : activeIndex === null
                    ? "rgba(255,255,255,0.35)"
                    : "rgba(255,255,255,0.06)"
                }
                style={{
                  transition: "all 0.3s ease",
                  pointerEvents: "none",
                }}
              />

              {/* Label */}
              <text
                x={pos.cx}
                y={138}
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
