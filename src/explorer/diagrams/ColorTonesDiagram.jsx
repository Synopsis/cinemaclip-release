import React from "react";
import { FONT } from "../styles.js";

export default function ColorTonesDiagram({ labels, activeIndex, onSelect }) {
  // Labels order: 0=B&W, 1=Cool, 2=Mixed, 3=Neutral, 4=Warm
  // Spectrum (Cool–Neutral–Warm) maps to label indices [1, 3, 4]
  const spectrumStops = [
    { x: 50,  swatchBg: "#4a7fa8", labelIdx: 1, label: "Cool" },
    { x: 140, swatchBg: "#998878", labelIdx: 3, label: "Neutral" },
    { x: 230, swatchBg: "#c4854a", labelIdx: 4, label: "Warm" },
  ];

  const swatchSize = 22;      // uniform inactive size
  const activeSize = 32;      // enlarged when selected

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
        viewBox="0 0 280 210"
        style={{ width: "100%", maxWidth: 260, height: "auto" }}
      >
        <defs>
          <linearGradient id="tone-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5b8fb9" />
            <stop offset="50%" stopColor="#a09080" />
            <stop offset="100%" stopColor="#d4956b" />
          </linearGradient>
        </defs>

        {/* ── B&W special case (above spectrum) ── */}
        {(() => {
          const isActive = activeIndex === 0;
          const bwX = 140;
          const bwY = 28;
          const size = isActive ? activeSize : swatchSize;
          const left = bwX - size / 2;
          const top = bwY - size / 2;

          return (
            <g
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(0)}
            >
              {/* Hit target */}
              <rect
                x={bwX - 40}
                y={0}
                width={80}
                height={55}
                fill="transparent"
              />

              {/* B&W swatch — half black / half white */}
              <rect
                x={left}
                y={top}
                width={size}
                height={size}
                rx={4}
                fill="#999"
                stroke={
                  isActive
                    ? "rgba(255,255,255,0.55)"
                    : activeIndex === null
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(255,255,255,0.08)"
                }
                strokeWidth={isActive ? 1.8 : 0.8}
                style={{
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  pointerEvents: "none",
                }}
              />
              <clipPath id="bw-left-tone">
                <rect x={left} y={top} width={size / 2} height={size} />
              </clipPath>
              <rect
                x={left}
                y={top}
                width={size}
                height={size}
                rx={4}
                fill="#333"
                clipPath="url(#bw-left-tone)"
                style={{
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  pointerEvents: "none",
                }}
              />

              {/* Label to the right */}
              <text
                x={bwX + size / 2 + 8}
                y={bwY + 3.5}
                textAnchor="start"
                fill={
                  isActive
                    ? "rgba(255,255,255,0.8)"
                    : activeIndex === null
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(255,255,255,0.15)"
                }
                fontSize="8"
                fontFamily={FONT.mono}
                style={{
                  transition: "all 0.3s ease",
                  pointerEvents: "none",
                }}
              >
                B&W
              </text>
            </g>
          );
        })()}

        {/* ── Cool → Neutral → Warm gradient bar ── */}
        <rect
          x="40"
          y="68"
          width="200"
          height="14"
          rx="7"
          fill="url(#tone-gradient)"
          opacity={activeIndex === 0 || activeIndex === 2 ? 0.3 : activeIndex === null ? 0.55 : 0.65}
          style={{ transition: "opacity 0.3s ease" }}
        />

        {/* Spectrum positions (Cool, Neutral, Warm) */}
        {spectrumStops.map((stop, si) => {
          const isActive = stop.labelIdx === activeIndex;

          return (
            <g
              key={si}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(stop.labelIdx)}
            >
              {/* Hit target */}
              <rect
                x={stop.x - 28}
                y={55}
                width={56}
                height={100}
                fill="transparent"
              />

              {/* Dot on bar */}
              <circle
                cx={stop.x}
                cy={75}
                r={isActive ? 5 : 3}
                fill={isActive ? "#fff" : activeIndex === null ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)"}
                stroke={isActive ? "rgba(0,0,0,0.3)" : "none"}
                strokeWidth="1.5"
                style={{
                  transition: "all 0.3s ease",
                  pointerEvents: "none",
                }}
              />

              {/* Connector line */}
              <line
                x1={stop.x}
                y1={85}
                x2={stop.x}
                y2={98}
                stroke={
                  isActive
                    ? "rgba(255,255,255,0.4)"
                    : activeIndex === null
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.06)"
                }
                strokeWidth={isActive ? 1 : 0.5}
                style={{ transition: "all 0.3s ease" }}
              />

              {/* Swatch rectangle — uniform inactive size */}
              {(() => {
                const size = isActive ? activeSize : swatchSize;
                return (
                  <rect
                    x={stop.x - size / 2}
                    y={100}
                    width={size}
                    height={size}
                    rx={4}
                    fill={stop.swatchBg}
                    stroke={
                      isActive
                        ? "rgba(255,255,255,0.55)"
                        : activeIndex === null
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(255,255,255,0.06)"
                    }
                    strokeWidth={isActive ? 1.8 : 0.8}
                    style={{
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      pointerEvents: "none",
                    }}
                  />
                );
              })()}

              {/* Label */}
              <text
                x={stop.x}
                y={(isActive ? 100 + activeSize : 100 + swatchSize) + 14}
                textAnchor="middle"
                fill={
                  isActive
                    ? "rgba(255,255,255,0.8)"
                    : activeIndex === null
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(255,255,255,0.15)"
                }
                fontSize="8"
                fontFamily={FONT.mono}
                style={{
                  transition: "all 0.3s ease",
                  pointerEvents: "none",
                }}
              >
                {stop.label}
              </text>
            </g>
          );
        })}

        {/* ── Mixed special case (below spectrum) ── */}
        {(() => {
          const isActive = activeIndex === 2;
          const mx = 140;
          const my = 178;
          const size = isActive ? activeSize : swatchSize;
          const coolColor = "#4a7fa8";
          const warmColor = "#c4854a";
          const left = mx - size / 2;
          const top = my - size / 2;

          return (
            <g
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(2)}
            >
              {/* Hit target */}
              <rect
                x={mx - 40}
                y={my - size / 2 - 10}
                width={80}
                height={size + 30}
                fill="transparent"
              />

              {/* Mixed swatch — left half Cool, right half Warm */}
              <clipPath id="mixed-left-half">
                <rect x={left} y={top} width={size / 2} height={size} />
              </clipPath>
              <clipPath id="mixed-right-half">
                <rect x={mx} y={top} width={size / 2} height={size} />
              </clipPath>
              <rect
                x={left}
                y={top}
                width={size}
                height={size}
                rx={4}
                fill={coolColor}
                clipPath="url(#mixed-left-half)"
                style={{
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  pointerEvents: "none",
                }}
              />
              <rect
                x={left}
                y={top}
                width={size}
                height={size}
                rx={4}
                fill={warmColor}
                clipPath="url(#mixed-right-half)"
                style={{
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  pointerEvents: "none",
                }}
              />
              <rect
                x={left}
                y={top}
                width={size}
                height={size}
                rx={4}
                fill="none"
                stroke={
                  isActive
                    ? "rgba(255,255,255,0.55)"
                    : activeIndex === null
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.06)"
                }
                strokeWidth={isActive ? 1.8 : 0.8}
                style={{
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  pointerEvents: "none",
                }}
              />

              {/* Label to the right */}
              <text
                x={mx + size / 2 + 8}
                y={my + 3.5}
                textAnchor="start"
                fill={
                  isActive
                    ? "rgba(255,255,255,0.8)"
                    : activeIndex === null
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(255,255,255,0.15)"
                }
                fontSize="8"
                fontFamily={FONT.mono}
                style={{
                  transition: "all 0.3s ease",
                  pointerEvents: "none",
                }}
              >
                Mixed
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
