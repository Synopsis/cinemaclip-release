import React from "react";
import { FONT, TEXT_SIZE } from "../styles.js";

const HEADROOM = 8;
const HEAD_CENTER_Y = 50;
const HEAD_TOP_Y = HEAD_CENTER_Y - 18; // 18px radius
const HEAD_BOTTOM_Y = HEAD_CENTER_Y + 18;
const SHOULDERS_Y = 72;
const CHEST_Y = 95;
const WAIST_Y = 120;
const THIGHS_Y = 145;
const FEET_Y = 180;
const VIEWBOX_WIDTH = 400;
const VIEWBOX_HEIGHT = 225;
const CENTER_X = VIEWBOX_WIDTH / 2;

// Frame definitions: each maintains 16:9 aspect ratio (width = height * 16/9)
// Frames are centered horizontally and positioned to show appropriate body parts
const FRAME_LEVELS = [
  // Extreme Wide: shows tiny figure in vast space (fits entire viewBox)
  {
    abbr: "EW",
    height: VIEWBOX_HEIGHT - 10, // 215px height
    topY: 5,
    centerX: CENTER_X,
  },
  // Wide: entire body visible, head to feet
  {
    abbr: "W",
    height: 190,
    topY: HEAD_TOP_Y - HEADROOM - 10,
    centerX: CENTER_X,
  },
  // Full: entire body with some space
  {
    abbr: "F",
    height: 163,
    topY: HEAD_TOP_Y - HEADROOM,
    centerX: CENTER_X,
  },
  // Medium Wide: head to mid-thigh
  {
    abbr: "MW",
    height: 130,
    topY: HEAD_TOP_Y - HEADROOM,
    centerX: CENTER_X,
  },
  // Medium: head to waist
  {
    abbr: "M",
    height: 94,
    topY: HEAD_TOP_Y - HEADROOM,
    centerX: CENTER_X,
  },
  // Medium Closeup: head to lower chest
  {
    abbr: "MCU",
    height: 68,
    topY: HEAD_TOP_Y - HEADROOM,
    centerX: CENTER_X,
  },
  // Closeup: head and shoulders
  {
    abbr: "CU",
    height: 45,
    topY: HEAD_TOP_Y - HEADROOM + 3,
    centerX: CENTER_X,
  },
  // Extreme Closeup: crops into face
  {
    abbr: "ECU",
    height: 25,
    topY: HEAD_CENTER_Y - 13, // crops into face, no headroom
    centerX: CENTER_X,
  },
].map((frame) => {
  const width = frame.height * (16 / 9);
  return {
    abbr: frame.abbr,
    x: frame.centerX - width / 2,
    y: frame.topY,
    w: width,
    h: frame.height,
  };
});

// ─── Scale Constants for Wide Shots ─────────────────────────────────────────
// Adjust these values to fine-tune how much the inner content shrinks
// when Extreme Wide or Wide shots are selected
const EW_INNER_SCALE = 0.28;  // Scale when Extreme Wide selected (smaller = more dramatic)
const W_INNER_SCALE = 0.55;   // Scale when Wide selected (less dramatic than EW)

export default function FramingDiagram({ labels, activeIndex, onSelect }) {
  // Determine scale based on which shot is selected
  // EW and W both cause the inner content to shrink (EW more dramatically)
  const isExtremeWide = activeIndex === 0;
  const isWide = activeIndex === 1;
  const innerScale = isExtremeWide ? EW_INNER_SCALE : isWide ? W_INNER_SCALE : 1;

  // EW frame always stays at full size
  const ewFrame = FRAME_LEVELS[0];
  // W frame reference (rendered outside scaled group only when W is selected)
  const wFrame = FRAME_LEVELS[1];
  // Inner frames: when W is selected, only F-ECU scale; when EW is selected, W-ECU all scale
  const innerFrames = isWide ? FRAME_LEVELS.slice(2) : FRAME_LEVELS.slice(1);

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
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        style={{ width: "100%", maxWidth: VIEWBOX_WIDTH, height: "auto" }}
      >
        {/* EW frame - always rendered at full size, outside the scaled group */}
        {(() => {
          const isActive = activeIndex === 0;
          const isAdjacent = activeIndex === 1;
          const noSel = activeIndex === null;
          const strokeColor = isActive
            ? "rgba(100,200,255,0.9)"
            : isAdjacent
            ? "rgba(255,255,255,0.25)"
            : noSel
            ? "rgba(255,255,255,0.2)"
            : "rgba(255,255,255,0.1)";
          const strokeW = isActive ? 2.5 : isAdjacent ? 1.2 : noSel ? 1 : 0.7;

          return (
            <g>
              <rect
                x={ewFrame.x}
                y={ewFrame.y}
                width={ewFrame.w}
                height={ewFrame.h}
                rx={3}
                fill="transparent"
                stroke={strokeColor}
                strokeWidth={strokeW}
                strokeDasharray={isAdjacent ? "6 4" : "none"}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onClick={() => onSelect(0)}
              />
              <text
                x={ewFrame.x + ewFrame.w - 4}
                y={ewFrame.y + ewFrame.h - 5}
                textAnchor="end"
                fill={
                  isActive
                    ? "rgba(100,200,255,0.95)"
                    : isAdjacent
                    ? "rgba(255,255,255,0.3)"
                    : noSel
                    ? "rgba(255,255,255,0.4)"
                    : "rgba(255,255,255,0.12)"
                }
                fontSize={isActive ? TEXT_SIZE.micro : TEXT_SIZE.labelSmall}
                fontFamily={FONT.mono}
                fontWeight={isActive ? 500 : 400}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  pointerEvents: "none",
                }}
              >
                {ewFrame.abbr}
              </text>
              {/* Corner brackets for EW when active */}
              {isActive && (
                <>
                  <polyline
                    points={`${ewFrame.x},${ewFrame.y + 14} ${ewFrame.x},${ewFrame.y} ${ewFrame.x + 14},${ewFrame.y}`}
                    fill="none"
                    stroke="rgba(100,200,255,0.7)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points={`${ewFrame.x + ewFrame.w - 14},${ewFrame.y} ${ewFrame.x + ewFrame.w},${ewFrame.y} ${ewFrame.x + ewFrame.w},${ewFrame.y + 14}`}
                    fill="none"
                    stroke="rgba(100,200,255,0.7)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points={`${ewFrame.x},${ewFrame.y + ewFrame.h - 14} ${ewFrame.x},${ewFrame.y + ewFrame.h} ${ewFrame.x + 14},${ewFrame.y + ewFrame.h}`}
                    fill="none"
                    stroke="rgba(100,200,255,0.7)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points={`${ewFrame.x + ewFrame.w - 14},${ewFrame.y + ewFrame.h} ${ewFrame.x + ewFrame.w},${ewFrame.y + ewFrame.h} ${ewFrame.x + ewFrame.w},${ewFrame.y + ewFrame.h - 14}`}
                    fill="none"
                    stroke="rgba(100,200,255,0.7)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}
            </g>
          );
        })()}

        {/* W frame - rendered at full size ONLY when W is selected */}
        {isWide && (() => {
          const strokeColor = "rgba(100,200,255,0.9)";
          const strokeW = 2.5;

          return (
            <g>
              <rect
                x={wFrame.x}
                y={wFrame.y}
                width={wFrame.w}
                height={wFrame.h}
                rx={3}
                fill="transparent"
                stroke={strokeColor}
                strokeWidth={strokeW}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onClick={() => onSelect(1)}
              />
              <text
                x={wFrame.x + wFrame.w - 4}
                y={wFrame.y + wFrame.h - 5}
                textAnchor="end"
                fill="rgba(100,200,255,0.95)"
                fontSize={TEXT_SIZE.micro}
                fontFamily={FONT.mono}
                fontWeight={500}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  pointerEvents: "none",
                }}
              >
                {wFrame.abbr}
              </text>
              {/* Corner brackets for W when active */}
              <polyline
                points={`${wFrame.x},${wFrame.y + 14} ${wFrame.x},${wFrame.y} ${wFrame.x + 14},${wFrame.y}`}
                fill="none"
                stroke="rgba(100,200,255,0.7)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points={`${wFrame.x + wFrame.w - 14},${wFrame.y} ${wFrame.x + wFrame.w},${wFrame.y} ${wFrame.x + wFrame.w},${wFrame.y + 14}`}
                fill="none"
                stroke="rgba(100,200,255,0.7)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points={`${wFrame.x},${wFrame.y + wFrame.h - 14} ${wFrame.x},${wFrame.y + wFrame.h} ${wFrame.x + 14},${wFrame.y + wFrame.h}`}
                fill="none"
                stroke="rgba(100,200,255,0.7)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points={`${wFrame.x + wFrame.w - 14},${wFrame.y + wFrame.h} ${wFrame.x + wFrame.w},${wFrame.y + wFrame.h} ${wFrame.x + wFrame.w},${wFrame.y + wFrame.h - 14}`}
                fill="none"
                stroke="rgba(100,200,255,0.7)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })()}

        {/* Scaled group: figure + inner frames (F through ECU) */}
        {/* Scales from center of viewBox for smooth zoom effect */}
        <g
          style={{
            transform: `scale(${innerScale})`,
            transformOrigin: `${CENTER_X}px ${VIEWBOX_HEIGHT / 2}px`,
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Figure silhouette */}
          <g
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Head */}
            <circle cx={CENTER_X} cy={HEAD_CENTER_Y} r={18} fill="rgba(255,255,255,0.03)" />
            {/* Torso */}
            <line x1={CENTER_X} y1={HEAD_BOTTOM_Y} x2={CENTER_X} y2={WAIST_Y} />
            {/* Arms */}
            <line x1={CENTER_X} y1={85} x2={CENTER_X - 32} y2={140} />
            <line x1={CENTER_X} y1={85} x2={CENTER_X + 32} y2={140} />
            {/* Legs */}
            <line x1={CENTER_X} y1={WAIST_Y} x2={CENTER_X - 25} y2={FEET_Y} />
            <line x1={CENTER_X} y1={WAIST_Y} x2={CENTER_X + 25} y2={FEET_Y} />
          </g>

          {/* Inner frame rectangles (W-ECU when EW selected, F-ECU when W selected) */}
          {innerFrames.map((frame, idx) => {
            // Offset depends on what's in innerFrames: +1 if W included, +2 if only F-ECU
            const i = idx + (isWide ? 2 : 1);
            const isActive = i === activeIndex;
            const isAdjacent = activeIndex != null && Math.abs(i - activeIndex) === 1;

            // Distinct colors for active vs inactive
            const noSel = activeIndex === null;
            const strokeColor = isActive
              ? "rgba(100,200,255,0.9)"
              : isAdjacent
              ? "rgba(255,255,255,0.25)"
              : noSel
              ? "rgba(255,255,255,0.2)"
              : "rgba(255,255,255,0.1)";
            const strokeW = isActive ? 2.5 : isAdjacent ? 1.2 : noSel ? 1 : 0.7;

            return (
              <g key={i}>
                {/* Transparent fill for click target */}
                <rect
                  x={frame.x}
                  y={frame.y}
                  width={frame.w}
                  height={frame.h}
                  rx={3}
                  fill="transparent"
                  stroke={strokeColor}
                  strokeWidth={strokeW}
                  strokeDasharray={
                    isAdjacent ? "6 4" : isActive ? "none" : "none"
                  }
                  style={{
                    cursor: "pointer",
                    transition: "stroke 0.3s cubic-bezier(0.4, 0, 0.2, 1), stroke-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onClick={() => onSelect(i)}
                />

                {/* Abbreviation label — positioned at bottom-right corner of each rect */}
                <text
                  x={frame.x + frame.w - 4}
                  y={frame.y + frame.h - 5}
                  textAnchor="end"
                  fill={
                    isActive
                      ? "rgba(100,200,255,0.95)"
                      : isAdjacent
                      ? "rgba(255,255,255,0.3)"
                      : noSel
                      ? "rgba(255,255,255,0.4)"
                      : "rgba(255,255,255,0.12)"
                  }
                  fontSize={isActive ? TEXT_SIZE.micro : TEXT_SIZE.labelSmall}
                  fontFamily={FONT.mono}
                  fontWeight={isActive ? 500 : 400}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    pointerEvents: "none",
                  }}
                >
                  {frame.abbr}
                </text>

                {/* Corner arrows for active frame (like ShotDeck reference) */}
                {isActive && (
                  <>
                    {/* Top-left corner */}
                    <polyline
                      points={`${frame.x},${frame.y + 14} ${frame.x},${frame.y} ${frame.x + 14},${frame.y}`}
                      fill="none"
                      stroke="rgba(100,200,255,0.7)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Top-right corner */}
                    <polyline
                      points={`${frame.x + frame.w - 14},${frame.y} ${frame.x + frame.w},${frame.y} ${frame.x + frame.w},${frame.y + 14}`}
                      fill="none"
                      stroke="rgba(100,200,255,0.7)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Bottom-left corner */}
                    <polyline
                      points={`${frame.x},${frame.y + frame.h - 14} ${frame.x},${frame.y + frame.h} ${frame.x + 14},${frame.y + frame.h}`}
                      fill="none"
                      stroke="rgba(100,200,255,0.7)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Bottom-right corner */}
                    <polyline
                      points={`${frame.x + frame.w - 14},${frame.y + frame.h} ${frame.x + frame.w},${frame.y + frame.h} ${frame.x + frame.w},${frame.y + frame.h - 14}`}
                      fill="none"
                      stroke="rgba(100,200,255,0.7)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
