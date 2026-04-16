import React from "react";
import { FONT } from "../styles.js";

export default function LightingDirectionDiagram({ labels, activeIndex, onSelect }) {
  const cx = 120;
  const cy = 120;
  const subjectR = 22;
  const orbitR = 72;

  const directionPositions = [
    { angle: null, label: "Ambient" },
    { angle: 0, label: "Backlit" },
    { angle: 180, label: "Front-Lit" },
    { angle: 270, label: "Left" },
    { angle: 90, label: "Right" },
    { angle: 0, label: "Top" },
    { angle: 180, label: "Under-Lit" },
  ];

  function posFromAngle(angleDeg) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + Math.cos(rad) * orbitR,
      y: cy + Math.sin(rad) * orbitR,
    };
  }

  const active = activeIndex != null ? directionPositions[activeIndex] : null;

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
        viewBox="0 0 240 240"
        style={{ width: "100%", maxWidth: 220, height: "auto" }}
      >
        <defs>
          <radialGradient id="ambient-glow">
            <stop offset="0%" stopColor="rgba(253,203,110,0.25)" />
            <stop offset="100%" stopColor="rgba(253,203,110,0)" />
          </radialGradient>
          <radialGradient id="top-glow">
            <stop offset="0%" stopColor="rgba(253,203,110,0.35)" />
            <stop offset="60%" stopColor="rgba(253,203,110,0.08)" />
            <stop offset="100%" stopColor="rgba(253,203,110,0)" />
          </radialGradient>
        </defs>

        {/* Orbit guide */}
        <circle
          cx={cx}
          cy={cy}
          r={orbitR}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />

        {/* Light glow for active direction — point source with radial falloff */}
        {activeIndex === 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={orbitR + 10}
            fill="url(#ambient-glow)"
          />
        )}
        {activeIndex === 5 && (
          <circle
            cx={cx}
            cy={cy}
            r={subjectR + 30}
            fill="url(#top-glow)"
          />
        )}
        {active && active.angle !== null && activeIndex !== 5 && (
          <>
            {(() => {
              const p = posFromAngle(active.angle);
              return (
                <>
                  {/* Point source glow at the light position */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={18}
                    fill="rgba(253,203,110,0.25)"
                    style={{ transition: "all 0.4s ease" }}
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={10}
                    fill="rgba(253,203,110,0.4)"
                    style={{ transition: "all 0.4s ease" }}
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={4}
                    fill="rgba(253,203,110,0.8)"
                    style={{ transition: "all 0.4s ease" }}
                  />
                  {/* Soft cone of light toward the subject */}
                  <ellipse
                    cx={(p.x + cx) / 2}
                    cy={(p.y + cy) / 2}
                    rx={28}
                    ry={14}
                    fill="rgba(253,203,110,0.06)"
                    transform={`rotate(${Math.atan2(cy - p.y, cx - p.x) * 180 / Math.PI}, ${(p.x + cx) / 2}, ${(p.y + cy) / 2})`}
                    style={{ transition: "all 0.4s ease" }}
                  />
                </>
              );
            })()}
          </>
        )}

        {/* Subject */}
        <circle
          cx={cx}
          cy={cy}
          r={subjectR}
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        <text
          x={cx}
          y={cy + 3}
          textAnchor="middle"
          fill="rgba(255,255,255,0.15)"
          fontSize="8"
          fontFamily={FONT.mono}
        >
          subject
        </text>

        {/* Camera indicator at bottom */}
        <g>
          <rect
            x={cx - 8}
            y={cy + orbitR + 16}
            width="16"
            height="10"
            rx="2"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.8"
          />
          <text
            x={cx}
            y={cy + orbitR + 35}
            textAnchor="middle"
            fill="rgba(255,255,255,0.12)"
            fontSize="7"
            fontFamily={FONT.mono}
          >
            cam
          </text>
        </g>

        {/* Clickable positions */}
        {directionPositions.map((dir, i) => {
          if (i === 0) {
            return (
              <g
                key={i}
                onClick={() => onSelect(i)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={28}
                  cy={28}
                  r={i === activeIndex ? 14 : 10}
                  fill={
                    i === activeIndex
                      ? "rgba(253,203,110,0.12)"
                      : "rgba(255,255,255,0.02)"
                  }
                  stroke={
                    i === activeIndex
                      ? "rgba(253,203,110,0.6)"
                      : activeIndex === null
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(255,255,255,0.1)"
                  }
                  strokeWidth={i === activeIndex ? 1.5 : 0.8}
                />
                <text
                  x={28}
                  y={31}
                  textAnchor="middle"
                  fill={
                    i === activeIndex
                      ? "rgba(253,203,110,0.8)"
                      : activeIndex === null
                      ? "rgba(255,255,255,0.4)"
                      : "rgba(255,255,255,0.2)"
                  }
                  fontSize="7"
                  fontFamily={FONT.mono}
                >
                  AMB
                </text>
              </g>
            );
          }
          if (i === 5) {
            return (
              <g
                key={i}
                onClick={() => onSelect(i)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={cx}
                  cy={cy - subjectR - 14}
                  r={i === activeIndex ? 8 : 5}
                  fill={
                    i === activeIndex
                      ? "rgba(253,203,110,0.15)"
                      : "rgba(255,255,255,0.02)"
                  }
                  stroke={
                    i === activeIndex
                      ? "rgba(253,203,110,0.6)"
                      : activeIndex === null
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(255,255,255,0.1)"
                  }
                  strokeWidth={i === activeIndex ? 1.5 : 0.8}
                />
              </g>
            );
          }

          const p = posFromAngle(dir.angle);
          const isActive = i === activeIndex;
          const isAdjacent = activeIndex != null && Math.abs(i - activeIndex) === 1;
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={isActive ? 8 : isAdjacent ? 5 : 4}
              fill={
                isActive
                  ? "rgba(253,203,110,0.15)"
                  : "rgba(255,255,255,0.02)"
              }
              stroke={
                isActive
                  ? "rgba(253,203,110,0.7)"
                  : isAdjacent
                  ? "rgba(255,255,255,0.2)"
                  : activeIndex === null
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(255,255,255,0.08)"
              }
              strokeWidth={isActive ? 2 : 1}
              style={{
                cursor: "pointer",
                transition: "all 0.35s ease",
              }}
              onClick={() => onSelect(i)}
            />
          );
        })}
      </svg>
    </div>
  );
}
