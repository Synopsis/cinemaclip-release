import React from "react";
import { FONT, SVG_TEXT } from "../styles.js";

export default function ColorContrastDiagram({ labels, activeIndex, onSelect }) {
  // Each step: [light swatch lightness, dark swatch lightness]
  const contrastLevels = [
    { light: 58, dark: 42, label: "Low" },
    { light: 70, dark: 30, label: "Neutral" },
    { light: 90, dark: 10, label: "High" },
  ];

  const barY = 40;
  const barH = 60;
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
        viewBox="0 0 280 160"
        style={{ width: "100%", maxWidth: 260, height: "auto" }}
      >
        {/* Track line */}
        <line
          x1="50"
          y1="130"
          x2="230"
          y2="130"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />

        {positions.map((pos, i) => {
          const isActive = i === activeIndex;
          const isAdjacent = activeIndex != null && Math.abs(i - activeIndex) === 1;
          const level = contrastLevels[i];
          const swatchW = isActive ? 24 : 14;
          const swatchH = isActive ? 48 : 30;
          const gap = isActive ? 3 : 2;

          const lightColor = `hsl(0, 0%, ${level.light}%)`;
          const darkColor = `hsl(0, 0%, ${level.dark}%)`;

          const totalW = swatchW * 2 + gap;
          const leftX = pos.cx - totalW / 2;
          const yOffset = barY + (60 - swatchH) / 2;

          return (
            <g
              key={i}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(i)}
            >
              {/* Hit target */}
              <rect
                x={pos.cx - 36}
                y={20}
                width={72}
                height={120}
                fill="transparent"
              />

              {/* Light swatch */}
              <rect
                x={leftX}
                y={yOffset}
                width={swatchW}
                height={swatchH}
                rx={3}
                fill={lightColor}
                stroke={
                  isActive
                    ? "rgba(255,255,255,0.5)"
                    : isAdjacent
                    ? "rgba(255,255,255,0.12)"
                    : activeIndex === null
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.04)"
                }
                strokeWidth={isActive ? 1.5 : 0.8}
                style={{
                  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  pointerEvents: "none",
                }}
              />

              {/* Dark swatch */}
              <rect
                x={leftX + swatchW + gap}
                y={yOffset}
                width={swatchW}
                height={swatchH}
                rx={3}
                fill={darkColor}
                stroke={
                  isActive
                    ? "rgba(255,255,255,0.3)"
                    : isAdjacent
                    ? "rgba(255,255,255,0.08)"
                    : activeIndex === null
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.03)"
                }
                strokeWidth={isActive ? 1.5 : 0.8}
                style={{
                  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  pointerEvents: "none",
                }}
              />

              {/* Bracket lines showing range */}
              {isActive && (
                <>
                  <line
                    x1={leftX + swatchW / 2}
                    y1={yOffset + swatchH + 6}
                    x2={leftX + swatchW + gap + swatchW / 2}
                    y2={yOffset + swatchH + 6}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1"
                    strokeDasharray="3 2"
                    style={{ pointerEvents: "none" }}
                  />
                  <text
                    x={pos.cx}
                    y={yOffset + swatchH + 18}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.25)"
                    fontSize={SVG_TEXT.sm}
                    fontFamily={FONT.mono}
                    style={{ pointerEvents: "none" }}
                  >
                    range
                  </text>
                </>
              )}

              {/* Step dot */}
              <circle
                cx={pos.cx}
                cy={130}
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
                y={148}
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
