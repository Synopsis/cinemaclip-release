import React from "react";
import { FONT } from "../styles.js";

export default function HeightDiagram({ labels, activeIndex, onSelect }) {
  const trackX = 90;
  const subjectX = 240;
  const groundY = 310;

  // Subject figure proportions (standing person, feet on ground)
  const subjectHeadY = 185;
  const subjectHeadR = 12;
  const subjectEyeY = 185; // eye-level reference

  // Camera positions from top (Aerial) to bottom (Ground Level)
  const heightPositions = [
    { y: 30, label: "Aerial" },
    { y: 100, label: "Elevated" },
    { y: 165, label: "Above Subject" },
    { y: subjectEyeY, label: "Eye Level" },
    { y: 250, label: "Below Subject" },
    { y: groundY - 8, label: "Ground Level" },
  ];

  const activePos = activeIndex != null ? heightPositions[activeIndex] : null;

  // Camera aims at subject's head/torso area
  // At eye level, aim horizontally (same Y as camera)
  const isEyeLevel = activePos ? activePos.y === subjectEyeY : false;
  const aimY = activePos ? (isEyeLevel ? activePos.y : subjectEyeY + 10) : 0;
  const dx = activePos ? subjectX - trackX : 0;
  const dy = activePos ? aimY - activePos.y : 0;
  const aimAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

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
        viewBox="0 0 310 340"
        style={{ width: "100%", maxWidth: 290, height: "auto" }}
      >
        {/* Vertical dashed track */}
        <line
          x1={trackX}
          y1={15}
          x2={trackX}
          y2={groundY}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          strokeDasharray="5 4"
        />

        {/* Ground line */}
        <line
          x1={25}
          y1={groundY}
          x2={290}
          y2={groundY}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />

        {/* Subject — standing figure */}
        {/* Head */}
        <circle
          cx={subjectX}
          cy={subjectHeadY}
          r={subjectHeadR}
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        {/* Neck */}
        <line
          x1={subjectX}
          y1={subjectHeadY + subjectHeadR}
          x2={subjectX}
          y2={subjectHeadY + subjectHeadR + 10}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
        />
        {/* Torso */}
        <line
          x1={subjectX}
          y1={subjectHeadY + subjectHeadR + 10}
          x2={subjectX}
          y2={260}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
        />
        {/* Shoulders */}
        <line
          x1={subjectX - 18}
          y1={subjectHeadY + subjectHeadR + 12}
          x2={subjectX + 18}
          y2={subjectHeadY + subjectHeadR + 12}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Left leg */}
        <line
          x1={subjectX}
          y1={260}
          x2={subjectX - 12}
          y2={groundY - 2}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Right leg */}
        <line
          x1={subjectX}
          y1={260}
          x2={subjectX + 12}
          y2={groundY - 2}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Dashed sightline from camera to subject */}
        {activePos && (
          <line
            x1={trackX + 14}
            y1={activePos.y}
            x2={subjectX - subjectHeadR - 6}
            y2={aimY}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            strokeDasharray="4 3"
            style={{ transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        )}

        {/* Clickable position dots along the track */}
        {heightPositions.map((pos, i) => {
          const isActive = i === activeIndex;
          const isAdjacent = activeIndex != null && Math.abs(i - activeIndex) === 1;

          // Label offset: place to the right of the dot, away from camera
          const labelX = trackX - 10;

          return (
            <g key={i}>
              {/* Larger transparent hit target */}
              <circle
                cx={trackX}
                cy={pos.y}
                r={14}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onClick={() => onSelect(i)}
              />
              {/* Visible dot - skip for active position (camera will be on top) */}
              {!isActive && (
                <circle
                  cx={trackX}
                  cy={pos.y}
                  r={isAdjacent ? 3.5 : 2.5}
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
              {/* Label next to dot */}
              {(isActive || isAdjacent || activeIndex === null) && (
                <text
                  x={labelX}
                  y={pos.y + 3.5}
                  textAnchor="end"
                  fill={
                    isActive
                      ? "rgba(255,255,255,0.7)"
                      : activeIndex === null
                      ? "rgba(255,255,255,0.4)"
                      : "rgba(255,255,255,0.2)"
                  }
                  fontSize="8"
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

        {/* Active dot + camera (only when something is selected) */}
        {activePos && (
          <>
            <circle
              cx={trackX}
              cy={activePos.y}
              r={4}
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={1.5}
              style={{
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                pointerEvents: "none",
              }}
            />
            <g
              transform={`translate(${trackX}, ${activePos.y}) rotate(${aimAngle})`}
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
          </>
        )}
      </svg>
    </div>
  );
}
