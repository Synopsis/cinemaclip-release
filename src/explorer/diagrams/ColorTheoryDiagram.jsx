import React from "react";
import { FONT, SVG_TEXT } from "../styles.js";

export default function ColorTheoryDiagram({ labels, activeIndex, onSelect }) {
  const cx = 130;
  const cy = 110;
  const outerR = 80;
  const innerR = 40;
  const segments = 12;

  // 12 hue values evenly spaced
  const hues = Array.from({ length: segments }, (_, i) => i * 30);

  // Which segments to highlight for each mode — aligned to exemplar images
  // Analogous: 3 adjacent segments in the reference (pink/magenta/purple)
  // Complementary: 2 opposite segments — sunset exemplar (orange/red vs blue)
  // Monochromatic: single hue from reference (orange desert)
  const highlightModes = [
    // Analogous — pink/magenta/purple (indices 9,10,11 = 270°–330°), matching couple-in-pink exemplar
    { indices: [9, 10, 11], type: "analogous" },
    // Complementary — opposite pair: index 1 (orange) and 7 (blue), matching sunset exemplar
    { indices: [1, 7], type: "complementary" },
    // Monochromatic — orange (index 1 = 30°), matching orange/brown desert exemplar
    { indices: [1], type: "monochromatic" },
  ];

  const mode = activeIndex !== null ? highlightModes[activeIndex] : null;

  function segmentPath(index, rOuter, rInner) {
    const startAngle = ((index * 360) / segments - 90 - 360 / segments / 2) * (Math.PI / 180);
    const endAngle = ((index * 360) / segments - 90 + 360 / segments / 2) * (Math.PI / 180);

    const x1 = cx + Math.cos(startAngle) * rOuter;
    const y1 = cy + Math.sin(startAngle) * rOuter;
    const x2 = cx + Math.cos(endAngle) * rOuter;
    const y2 = cy + Math.sin(endAngle) * rOuter;
    const x3 = cx + Math.cos(endAngle) * rInner;
    const y3 = cy + Math.sin(endAngle) * rInner;
    const x4 = cx + Math.cos(startAngle) * rInner;
    const y4 = cy + Math.sin(startAngle) * rInner;

    return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 0 0 ${x4} ${y4} Z`;
  }

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
        viewBox="0 0 260 240"
        style={{ width: "100%", maxWidth: 240, height: "auto" }}
      >
        {/* Color wheel segments */}
        {hues.map((hue, i) => {
          const isHighlighted = mode && mode.indices.includes(i);
          let fillColor;
          let fillOpacity;
          let strokeOpacity;

          if (isHighlighted) {
            if (mode.type === "monochromatic") {
              fillColor = `hsl(${hue}, 70%, 50%)`;
            } else {
              fillColor = `hsl(${hue}, 75%, 55%)`;
            }
            fillOpacity = 0.85;
            strokeOpacity = 0.6;
          } else if (activeIndex === null) {
            // No selection: show wheel at moderate visibility
            fillColor = `hsl(${hue}, 50%, 45%)`;
            fillOpacity = 0.4;
            strokeOpacity = 0.1;
          } else {
            fillColor = `hsl(${hue}, 30%, 35%)`;
            fillOpacity = 0.15;
            strokeOpacity = 0.06;
          }

          return (
            <path
              key={i}
              d={segmentPath(i, outerR, innerR)}
              fill={fillColor}
              fillOpacity={fillOpacity}
              stroke={`rgba(255,255,255,${strokeOpacity})`}
              strokeWidth="0.8"
              style={{
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          );
        })}

        {/* Monochromatic: inner rings showing value variation */}
        {mode && mode.type === "monochromatic" && (
          <>
            <circle
              cx={cx}
              cy={cy}
              r={innerR - 4}
              fill={`hsl(${hues[mode.indices[0]]}, 70%, 75%)`}
              fillOpacity="0.5"
              style={{ transition: "all 0.4s ease" }}
            />
            <circle
              cx={cx}
              cy={cy}
              r={innerR - 14}
              fill={`hsl(${hues[mode.indices[0]]}, 70%, 35%)`}
              fillOpacity="0.6"
              style={{ transition: "all 0.4s ease" }}
            />
          </>
        )}

        {/* Complementary: connecting line through center */}
        {mode && mode.type === "complementary" && (() => {
          const a1 = (mode.indices[0] * 360 / segments - 90) * (Math.PI / 180);
          const a2 = (mode.indices[1] * 360 / segments - 90) * (Math.PI / 180);
          const midR = (outerR + innerR) / 2;
          return (
            <line
              x1={cx + Math.cos(a1) * midR}
              y1={cy + Math.sin(a1) * midR}
              x2={cx + Math.cos(a2) * midR}
              y2={cy + Math.sin(a2) * midR}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              style={{ transition: "all 0.4s ease" }}
            />
          );
        })()}

        {/* Analogous: arc connecting adjacent segments */}
        {mode && mode.type === "analogous" && (() => {
          const midR = (outerR + innerR) / 2;
          const startA = (mode.indices[0] * 360 / segments - 90) * (Math.PI / 180);
          const endA = (mode.indices[mode.indices.length - 1] * 360 / segments - 90) * (Math.PI / 180);
          return (
            <path
              d={`M ${cx + Math.cos(startA) * midR} ${cy + Math.sin(startA) * midR} A ${midR} ${midR} 0 0 1 ${cx + Math.cos(endA) * midR} ${cy + Math.sin(endA) * midR}`}
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              style={{ transition: "all 0.4s ease" }}
            />
          );
        })()}

        {/* Center label */}
        {mode && (
          <text
            x={cx}
            y={cy + (mode.type === "monochromatic" ? 4 : 4)}
            textAnchor="middle"
            fill={
              mode.type === "monochromatic"
                ? "rgba(255,255,255,0.5)"
                : "rgba(255,255,255,0.15)"
            }
            fontSize={SVG_TEXT.md}
            fontFamily={FONT.mono}
            style={{ pointerEvents: "none", transition: "all 0.3s ease" }}
          >
            {mode.type === "monochromatic" ? "one hue" : ""}
          </text>
        )}

        {/* Mode selectors below the wheel */}
        {labels.map((label, i) => {
          const isActive = i === activeIndex;
          const isAdjacent = activeIndex !== null && Math.abs(i - activeIndex) === 1;
          const bx = 40 + i * 90;
          const by = 215;

          return (
            <g
              key={i}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(i)}
            >
              <rect
                x={bx - 38}
                y={by - 10}
                width={76}
                height={22}
                rx={4}
                fill={isActive ? "rgba(255,255,255,0.08)" : "transparent"}
                stroke={
                  isActive
                    ? "rgba(255,255,255,0.2)"
                    : activeIndex === null
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.04)"
                }
                strokeWidth={isActive ? 1.2 : 0.5}
                style={{ transition: "all 0.3s ease" }}
              />
              <text
                x={bx}
                y={by + 4}
                textAnchor="middle"
                fill={
                  isActive
                    ? "rgba(255,255,255,0.85)"
                    : isAdjacent
                    ? "rgba(255,255,255,0.3)"
                    : activeIndex === null
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(255,255,255,0.12)"
                }
                fontSize={SVG_TEXT.md}
                fontFamily={FONT.mono}
                style={{
                  transition: "all 0.3s ease",
                  pointerEvents: "none",
                }}
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
