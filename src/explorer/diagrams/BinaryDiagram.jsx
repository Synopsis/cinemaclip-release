import React from "react";
import { FONT, SVG_TEXT } from "../styles.js";

export default function BinaryDiagram({ labels, activeIndex, onSelect, illustrations }) {
  const frameW = 110;
  const frameH = 62;
  const gap = 20;
  const totalW = frameW * 2 + gap;
  const totalH = frameH + 22;
  const noSel = activeIndex === null;

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
        style={{ width: "100%", maxWidth: 270, height: "auto" }}
      >
        {[0, 1].map((i) => {
          const isActive = i === activeIndex;
          const offsetX = i * (frameW + gap);

          return (
            <g
              key={i}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(i)}
            >
              {/* Frame border */}
              <rect
                x={offsetX}
                y={0}
                width={frameW}
                height={frameH}
                rx={4}
                fill={isActive ? "rgba(255,255,255,0.03)" : "transparent"}
                stroke={
                  isActive
                    ? "rgba(255,255,255,0.35)"
                    : noSel
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.06)"
                }
                strokeWidth={isActive ? 1.5 : 0.8}
                style={{ transition: "all 0.3s ease" }}
              />

              {/* Illustration content */}
              <g
                style={{
                  opacity: isActive ? 1 : noSel ? 0.65 : 0.3,
                  transition: "opacity 0.35s ease",
                  pointerEvents: "none",
                }}
              >
                <g transform={`translate(${offsetX}, 0)`}>
                  {illustrations[i]()}
                </g>
              </g>

              {/* Label */}
              <text
                x={offsetX + frameW / 2}
                y={frameH + 16}
                textAnchor="middle"
                fill={
                  isActive
                    ? "rgba(255,255,255,0.8)"
                    : noSel
                    ? "rgba(255,255,255,0.55)"
                    : "rgba(255,255,255,0.2)"
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
