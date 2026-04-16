import React from "react";
import { FONT } from "../styles.js";

export default function LightCastDiagram({ labels, activeIndex, onSelect }) {
  const positions = [
    { cx: 50 },
    { cx: 140 },
    { cx: 230 },
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
          {/* Soft: very gradual transition across entire width */}
          <linearGradient id="cast-soft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="5%" stopColor="rgba(255,255,255,0.22)" />
            <stop offset="95%" stopColor="rgba(255,255,255,0.03)" />
          </linearGradient>
          {/* Neutral: moderate transition */}
          <linearGradient id="cast-neutral" x1="0" y1="0" x2="1" y2="0">
            <stop offset="30%" stopColor="rgba(255,255,255,0.22)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0.03)" />
          </linearGradient>
          {/* Hard: near-instant step function */}
          <linearGradient id="cast-hard" x1="0" y1="0" x2="1" y2="0">
            <stop offset="48%" stopColor="rgba(255,255,255,0.22)" />
            <stop offset="52%" stopColor="rgba(255,255,255,0.03)" />
          </linearGradient>
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
          const gradId = ["cast-soft", "cast-neutral", "cast-hard"][i];
          const rectW = isActive ? 50 : 28;
          const rectH = isActive ? 60 : 34;
          const yCenter = 52;

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

              {/* Shadow transition rectangle */}
              <rect
                x={pos.cx - rectW / 2}
                y={yCenter - rectH / 2}
                width={rectW}
                height={rectH}
                rx={3}
                fill={`url(#${gradId})`}
                stroke={
                  isActive
                    ? "rgba(255,255,255,0.35)"
                    : isAdjacent
                    ? "rgba(255,255,255,0.1)"
                    : activeIndex === null
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.04)"
                }
                strokeWidth={isActive ? 1.5 : 0.8}
                style={{
                  transition:
                    "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  pointerEvents: "none",
                }}
              />

              {/* Light/shadow annotation on active */}
              {isActive && (
                <>
                  <text
                    x={pos.cx - rectW / 2 + 5}
                    y={yCenter + rectH / 2 + 12}
                    fill="rgba(255,255,255,0.18)"
                    fontSize="6"
                    fontFamily={FONT.mono}
                    style={{ pointerEvents: "none" }}
                  >
                    light
                  </text>
                  <text
                    x={pos.cx + rectW / 2 - 5}
                    y={yCenter + rectH / 2 + 12}
                    textAnchor="end"
                    fill="rgba(255,255,255,0.18)"
                    fontSize="6"
                    fontFamily={FONT.mono}
                    style={{ pointerEvents: "none" }}
                  >
                    shadow
                  </text>
                </>
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
                fontSize="8.5"
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
