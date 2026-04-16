import React from "react";
import { FONT } from "../styles.js";

export default function ShotFocusDiagram({ labels, activeIndex, onSelect }) {
  // Zone of focus: [start, end] as fraction of the depth axis (0=near, 1=far).
  // null means nothing is in focus.
  const focusZones = [
    { zone: [0.0, 1.0] },    // Deep — entire depth range sharp
    { zone: [0.2, 0.8] },    // Neutral — moderate band
    { zone: [0.38, 0.62] },  // Shallow — narrow band
    { zone: null },           // Out of Focus — nothing sharp
  ];

  const stepPositions = [
    { cx: 35 },
    { cx: 105 },
    { cx: 175 },
    { cx: 245 },
  ];

  const active = activeIndex != null ? focusZones[activeIndex] : null;

  // Depth axis geometry
  const axisLeft = 50;
  const axisRight = 240;
  const axisWidth = axisRight - axisLeft;
  const axisY = 60; // vertical center of the scene area

  // Subject shapes distributed along depth
  const subjects = [
    { depth: 0.12, size: 14 },
    { depth: 0.35, size: 11 },
    { depth: 0.55, size: 9 },
    { depth: 0.78, size: 7 },
    { depth: 0.92, size: 5.5 },
  ];

  // Is a given depth position inside the focus zone?
  // When nothing is selected, treat everything as neutrally visible
  const isInFocus = (depth) => {
    if (activeIndex === null) return true; // idle state: all visible
    if (!active || !active.zone) return false;
    return depth >= active.zone[0] && depth <= active.zone[1];
  };

  // Focus zone pixel positions
  const zoneLeft = active && active.zone ? axisLeft + active.zone[0] * axisWidth : 0;
  const zoneRight = active && active.zone ? axisLeft + active.zone[1] * axisWidth : 0;
  const zoneWidth = zoneRight - zoneLeft;

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
        viewBox="0 0 280 170"
        style={{ width: "100%", maxWidth: 260, height: "auto" }}
      >
        <defs>
          <filter id="focus-blur-soft">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
          <filter id="focus-blur-heavy">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* "near" and "far" axis labels */}
        <text
          x={axisLeft} y={100}
          textAnchor="middle"
          fill="rgba(255,255,255,0.12)"
          fontSize="6.5"
          fontFamily={FONT.mono}
        >
          near
        </text>
        <text
          x={axisRight} y={100}
          textAnchor="middle"
          fill="rgba(255,255,255,0.12)"
          fontSize="6.5"
          fontFamily={FONT.mono}
        >
          far
        </text>

        {/* Depth axis line */}
        <line
          x1={axisLeft} y1={90}
          x2={axisRight} y2={90}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.8"
        />

        {/* Camera icon at near end */}
        <g transform="translate(20, 80)">
          <rect x="0" y="2" width="14" height="10" rx="2" fill="rgba(255,255,255,0.25)" />
          <polygon points="14,4 20,1 20,13 14,10" fill="rgba(255,255,255,0.18)" />
        </g>

        {/* Focus zone highlight band */}
        {active && active.zone && (
          <rect
            x={zoneLeft}
            y={18}
            width={Math.max(zoneWidth, 0)}
            height={70}
            rx={3}
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            strokeDasharray={zoneWidth < axisWidth * 0.5 ? "3,3" : "none"}
            style={{
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        )}

        {/* Focus zone bracket marks */}
        {active && active.zone && (
          <>
            {/* Left bracket */}
            <line
              x1={zoneLeft} y1={88} x2={zoneLeft} y2={92}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.2"
              style={{ transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
            {/* Right bracket */}
            <line
              x1={zoneRight} y1={88} x2={zoneRight} y2={92}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.2"
              style={{ transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
            {/* "in focus" label centered in zone */}
            <text
              x={(zoneLeft + zoneRight) / 2}
              y={14}
              textAnchor="middle"
              fill="rgba(255,255,255,0.2)"
              fontSize="6"
              fontFamily={FONT.mono}
              style={{
                transition: "all 0.3s ease",
                pointerEvents: "none",
              }}
            >
              in focus
            </text>
          </>
        )}

        {/* "out of focus" label when nothing is sharp */}
        {active && !active.zone && (
          <text
            x={(axisLeft + axisRight) / 2}
            y={14}
            textAnchor="middle"
            fill="rgba(255,255,255,0.15)"
            fontSize="6"
            fontFamily={FONT.mono}
            style={{ pointerEvents: "none" }}
          >
            nothing in focus
          </text>
        )}

        {/* Subject shapes along the depth axis */}
        {subjects.map((subj, si) => {
          const x = axisLeft + subj.depth * axisWidth;
          const sharp = isInFocus(subj.depth);
          const blur = sharp
            ? undefined
            : (active && active.zone)
            ? "url(#focus-blur-soft)"
            : "url(#focus-blur-heavy)";

          return (
            <g key={si}>
              {/* Head */}
              <circle
                cx={x}
                cy={axisY - subj.size * 0.4}
                r={subj.size * 0.38}
                fill={
                  sharp
                    ? "rgba(255,255,255,0.4)"
                    : "rgba(255,255,255,0.1)"
                }
                filter={blur}
                style={{
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
              {/* Body */}
              <rect
                x={x - subj.size * 0.22}
                y={axisY - subj.size * 0.02}
                width={subj.size * 0.44}
                height={subj.size * 0.7}
                rx={subj.size * 0.08}
                fill={
                  sharp
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(255,255,255,0.07)"
                }
                filter={blur}
                style={{
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
              {/* Ground contact line */}
              <line
                x1={x - subj.size * 0.3}
                y1={axisY + subj.size * 0.72}
                x2={x + subj.size * 0.3}
                y2={axisY + subj.size * 0.72}
                stroke={
                  sharp
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.04)"
                }
                strokeWidth="0.6"
                filter={blur}
                style={{
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </g>
          );
        })}

        {/* Step track */}
        <line
          x1="35" y1="135" x2="245" y2="135"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />

        {/* Step dots and labels */}
        {stepPositions.map((pos, i) => {
          const isActive = i === activeIndex;
          const isAdjacent = activeIndex != null && Math.abs(i - activeIndex) === 1;

          return (
            <g
              key={i}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(i)}
            >
              {/* Hit target */}
              <rect
                x={pos.cx - 30}
                y={120}
                width={60}
                height={45}
                fill="transparent"
              />

              {/* Step dot */}
              <circle
                cx={pos.cx}
                cy={135}
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
                y={153}
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
                fontSize="8"
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
