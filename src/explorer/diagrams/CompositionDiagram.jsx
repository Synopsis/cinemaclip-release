import React from "react";
import { FONT } from "../styles.js";

export default function CompositionDiagram({ labels, activeIndex, onSelect }) {
  // Layout: 2x2 grid of mini frames
  // Labels order: Balanced, Center, Left-Heavy, Right-Heavy
  const frameW = 110;
  const frameH = 62;
  const gap = 14;
  const circleR = 16;

  const layouts = [
    {
      // Balanced: two circles side by side
      label: "Balanced",
      circles: [
        { cx: frameW * 0.35, cy: frameH * 0.52 },
        { cx: frameW * 0.65, cy: frameH * 0.52 },
      ],
    },
    {
      // Center: one circle in middle
      label: "Center",
      circles: [{ cx: frameW * 0.5, cy: frameH * 0.52 }],
    },
    {
      // Left-Heavy: one circle on left
      label: "Left Heavy",
      circles: [{ cx: frameW * 0.28, cy: frameH * 0.52 }],
    },
    {
      // Right-Heavy: one circle on right
      label: "Right Heavy",
      circles: [{ cx: frameW * 0.72, cy: frameH * 0.52 }],
    },
  ];

  // Grid positions: [row, col]
  const gridPositions = [
    [0, 0], // Balanced → top-left
    [0, 1], // Center → top-right
    [1, 0], // Left-Heavy → bottom-left
    [1, 1], // Right-Heavy → bottom-right
  ];

  const topPadding = 20; // Space for labels above top row
  const labelSpace = 16; // Space between rows for labels
  const totalW = frameW * 2 + gap;
  // Calculate total height: top padding + top row + gap + label space + bottom row
  const totalH = topPadding + frameH + gap + labelSpace + frameH;

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
        viewBox={`0 0 ${totalW} ${totalH}`}
        style={{ width: "100%", maxWidth: 260, height: "auto" }}
      >
        {layouts.map((layout, i) => {
          const [row, col] = gridPositions[i];
          const offsetX = col * (frameW + gap);
          const offsetY = topPadding + row * (frameH + gap + labelSpace);
          const isActive = i === activeIndex;
          const isAdjacent = activeIndex != null && Math.abs(i - activeIndex) === 1;

          const noSel = activeIndex === null;
          const frameStroke = isActive
            ? "rgba(255,255,255,0.7)"
            : isAdjacent
            ? "rgba(255,255,255,0.2)"
            : noSel
            ? "rgba(255,255,255,0.2)"
            : "rgba(255,255,255,0.08)";

          const circleFill = isActive
            ? "rgba(255,255,255,0.5)"
            : isAdjacent
            ? "rgba(255,255,255,0.15)"
            : noSel
            ? "rgba(255,255,255,0.2)"
            : "rgba(255,255,255,0.06)";

          const textColor = isActive
            ? "rgba(255,255,255,0.85)"
            : isAdjacent
            ? "rgba(255,255,255,0.3)"
            : noSel
            ? "rgba(255,255,255,0.5)"
            : "rgba(255,255,255,0.12)";

          return (
            <g
              key={i}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(i)}
            >
              {/* Label above frame */}
              <text
                x={offsetX + frameW / 2}
                y={offsetY - 4}
                textAnchor="middle"
                fill={textColor}
                fontSize="8.5"
                fontFamily={FONT.mono}
                style={{
                  transition: "all 0.3s ease",
                  pointerEvents: "none",
                }}
              >
                {layout.label}
              </text>

              {/* Frame rectangle */}
              <rect
                x={offsetX}
                y={offsetY}
                width={frameW}
                height={frameH}
                rx={3}
                fill={isActive ? "rgba(255,255,255,0.02)" : "transparent"}
                stroke={frameStroke}
                strokeWidth={isActive ? 2 : 1}
                style={{ transition: "all 0.3s ease" }}
              />

              {/* Circles representing visual mass */}
              {layout.circles.map((circle, ci) => (
                <circle
                  key={ci}
                  cx={offsetX + circle.cx}
                  cy={offsetY + circle.cy}
                  r={circleR}
                  fill={circleFill}
                  style={{
                    transition: "all 0.3s ease",
                    pointerEvents: "none",
                  }}
                />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
