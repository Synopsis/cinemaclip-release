import React from "react";
import { FONT, SVG_TEXT } from "../styles.js";

export default function AngleDiagram({ labels, activeIndex, onSelect }) {
  // The subject sits to the right. The camera orbits it on a semicircular
  // arc that opens to the left — overhead at 12 o'clock, level at 9 o'clock,
  // reverse overhead at 6 o'clock.
  const subjectX = 220;
  const subjectY = 150;
  const subjectR = 22;
  const arcCenterX = subjectX; // arc is centered on the subject
  const arcCenterY = subjectY;
  const arcRadius = 100;

  // Angles in standard math convention (0 = right, 90 = up, etc.)
  // We want: overhead = directly above = 90°,
  //          level = directly left = 180°,
  //          reverse overhead = directly below = 270°
  const positions = [
    { angle: 180 - 90, label: "Overhead" },
    { angle: 180 - 50, label: "High" },
    { angle: 180 - 20, label: "Subtle High" },
    { angle: 180, label: "Level" },
    { angle: 180 + 20, label: "Subtle Low" },
    { angle: 180 + 50, label: "Low" },
    { angle: 180 + 90, label: "Rev OH" },
  ];

  function posFromAngle(angleDeg) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: arcCenterX + Math.cos(rad) * arcRadius,
      y: arcCenterY - Math.sin(rad) * arcRadius, // SVG y is flipped
    };
  }

  const activePos = activeIndex != null ? posFromAngle(positions[activeIndex].angle) : null;

  // Camera icon rotation: aim toward the subject
  const dx = activePos ? subjectX - activePos.x : 0;
  const dy = activePos ? subjectY - activePos.y : 0;
  const aimAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

  // Sightline endpoint at center of subject circle
  const sightEndX = subjectX;
  const sightEndY = subjectY;

  // Arc path for the guide line (from overhead to reverse overhead)
  const arcStart = posFromAngle(95);
  const arcEnd = posFromAngle(265);

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
        viewBox="0 0 300 300"
        style={{ width: "100%", maxWidth: 280, height: "auto" }}
      >
        {/* Arc guide path */}
        <path
          d={`M ${arcStart.x} ${arcStart.y} A ${arcRadius} ${arcRadius} 0 0 0 ${arcEnd.x} ${arcEnd.y}`}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />

        {/* Sightline from camera to subject */}
        {activePos && (
          <line
            x1={activePos.x}
            y1={activePos.y}
            x2={sightEndX}
            y2={sightEndY}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
            strokeDasharray="4 3"
            style={{ transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        )}

        {/* Subject */}
        <circle
          cx={subjectX}
          cy={subjectY}
          r={subjectR}
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        <text
          x={subjectX}
          y={subjectY + 4}
          textAnchor="middle"
          fill="rgba(255,255,255,0.2)"
          fontSize={SVG_TEXT.lg}
          fontFamily={FONT.mono}
        >
          subject
        </text>

        {/* Ground line */}
        <line
          x1={subjectX - arcRadius - 20}
          y1={subjectY }
          x2={subjectX }
          y2={subjectY }
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />

        {/* Clickable position dots along the arc */}
        {positions.map((pos, i) => {
          const p = posFromAngle(pos.angle);
          const isActive = i === activeIndex;
          const isAdjacent = activeIndex != null && Math.abs(i - activeIndex) === 1;
          return (
            <g key={i}>
              {/* Larger transparent hit target */}
              <circle
                cx={p.x}
                cy={p.y}
                r={14}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onClick={() => onSelect(i)}
              />
              {/* Visible dot - skip for active position (camera will be on top) */}
              {!isActive && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isAdjacent ? 4.5 : 3.5}
                  fill="rgba(255,255,255,0.02)"
                  stroke={
                    isAdjacent
                      ? "rgba(255,255,255,0.25)"
                      : activeIndex === null
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(255,255,255,0.08)"
                  }
                  strokeWidth={1}
                  style={{
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    pointerEvents: "none",
                  }}
                />
              )}
              {/* Label next to dot (offset away from arc center) */}
              {(isActive || isAdjacent || activeIndex === null) && (
                <text
                  x={p.x + (pos.label === "Overhead" ? -12 : p.x < subjectX ? -12 : 12)}
                  y={p.y + (p.y < subjectY ? -10 : p.y > subjectY ? 14 : 4)}
                  textAnchor={pos.label === "Overhead" || p.x < subjectX ? "end" : "start"}
                  fill={
                    isActive
                      ? "rgba(255,255,255,0.7)"
                      : activeIndex === null
                      ? "rgba(255,255,255,0.4)"
                      : "rgba(255,255,255,0.2)"
                  }
                  fontSize={SVG_TEXT.md}
                  fontFamily={FONT.mono}
                  style={{
                    transition: "all 0.3s ease",
                    pointerEvents: "none",
                  }}
                >
                  {pos.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Active dot (rendered before camera so camera is on top) */}
        {activePos && (() => {
          const activeP = posFromAngle(positions[activeIndex].angle);
          return (
            <circle
              cx={activeP.x}
              cy={activeP.y}
              r={5}
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={1.5}
              style={{
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                pointerEvents: "none",
              }}
            />
          );
        })()}

        {/* Camera icon at active position - rendered last to ensure it's on top */}
        {activePos && (
          <g
            transform={`translate(${activePos.x}, ${activePos.y}) rotate(${aimAngle})`}
            style={{
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              pointerEvents: "none",
              isolation: "isolate",
            }}
          >
            <rect
              x={-7}
              y={-5}
              width={14}
              height={10}
              rx={2}
              fill="rgba(255,255,255,0.95)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={0.5}
              style={{ pointerEvents: "none" }}
            />
            <polygon
              points="7,-3.5 12,-6 12,6 7,3.5"
              fill="rgba(255,255,255,0.8)"
              style={{ pointerEvents: "none" }}
            />
          </g>
        )}
      </svg>
    </div>
  );
}
