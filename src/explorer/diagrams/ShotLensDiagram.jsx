import React from "react";
import { FONT } from "../styles.js";

export default function ShotLensDiagram({ labels, activeIndex, onSelect }) {
  const camX = 25;
  const camY = 145;

  // Each lens has its own radius (∝ focal length) and half-angle (½ FOV).
  // Shorter focal length → wider FOV but shorter projected reach.
  // Longer focal length → narrower FOV but reaches much further.
  const lenses = [
    { halfAngle: 62, fov: "124°", fl: "<18mm",    radius: 105, color: [13, 42, 78] },
    { halfAngle: 48, fov: "96°",  fl: "19–35mm",  radius: 125, color: [27, 100, 125] },
    { halfAngle: 32, fov: "64°",  fl: "36–74mm",  radius: 150, color: [48, 148, 168] },
    { halfAngle: 18, fov: "36°",  fl: "75–120mm", radius: 180, color: [82, 180, 208] },
    { halfAngle: 8,  fov: "16°",  fl: ">120mm",   radius: 210, color: [158, 218, 238] },
  ];

  // Pie-sector path using per-lens radius.
  function sectorPath(halfAngleDeg, r) {
    const ha = (halfAngleDeg * Math.PI) / 180;
    const topX = camX + r * Math.cos(ha);
    const topY = camY - r * Math.sin(ha);
    const botY = camY + r * Math.sin(ha);
    const large = halfAngleDeg * 2 > 180 ? 1 : 0;
    return `M ${camX},${camY} L ${topX},${topY} A ${r},${r} 0 ${large},1 ${topX},${botY} Z`;
  }

  const stepPositions = [30, 83, 135, 188, 240];

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
        viewBox="0 0 260 305"
        style={{ width: "100%", maxWidth: 280, height: "auto" }}
      >
        {/* Sectors drawn back-to-front: widest+shortest first */}
        {lenses.map((lens, i) => {
          const isActive = i === activeIndex;
          const isAdjacent = activeIndex != null && Math.abs(i - activeIndex) === 1;
          const [r, g, b] = lens.color;
          const fillOpacity = isActive ? 0.85 : isAdjacent ? 0.25 : activeIndex === null ? 0.35 : 0.10;

          return (
            <g key={i}>
              <path
                d={sectorPath(lens.halfAngle, lens.radius)}
                fill={`rgba(${r},${g},${b},${fillOpacity})`}
                stroke={`rgba(255,255,255,${isActive ? 0.1 : 0.02})`}
                strokeWidth={isActive ? 1.2 : 0.5}
                style={{
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onClick={() => onSelect(i)}
              />

              {/* FOV + focal length annotation in the active sector */}
              {isActive && (
                <>
                  <text
                    x={camX + lens.radius * 0.55}
                    y={camY - 5}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.6)"
                    fontSize="9"
                    fontFamily={FONT.mono}
                    style={{
                      pointerEvents: "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {lens.fov}
                  </text>
                  <text
                    x={camX + lens.radius * 0.55}
                    y={camY + 7}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.35)"
                    fontSize="7"
                    fontFamily={FONT.mono}
                    style={{
                      pointerEvents: "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {lens.fl}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Camera icon at the apex */}
        <g transform={`translate(${camX - 20}, ${camY - 9})`}>
          <rect
            x={0}
            y={2}
            width={16}
            height={12}
            rx={2}
            fill="rgba(255,255,255,0.3)"
          />
          <polygon
            points="16,4 22,1 22,15 16,12"
            fill="rgba(255,255,255,0.2)"
          />
          {/* Lens barrel detail lines */}
          <rect x={3} y={5} width={1.5} height={6} rx={0.5} fill="rgba(255,255,255,0.1)" />
          <rect x={6} y={5} width={1.5} height={6} rx={0.5} fill="rgba(255,255,255,0.1)" />
          <rect x={9} y={5} width={1.5} height={6} rx={0.5} fill="rgba(255,255,255,0.1)" />
        </g>

        {/* Step track */}
        <line
          x1={30}
          y1={265}
          x2={240}
          y2={265}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />

        {/* Step dots and labels */}
        {stepPositions.map((cx, i) => {
          const isActive = i === activeIndex;
          const isAdjacent = activeIndex != null && Math.abs(i - activeIndex) === 1;

          const displayLabel = labels[i]
            .replace(" / Ultrawide", "")
            .replace("Fisheye", "Fish.");

          return (
            <g
              key={i}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(i)}
            >
              {/* Hit target */}
              <rect
                x={cx - 28}
                y={250}
                width={56}
                height={45}
                fill="transparent"
              />

              {/* Step dot */}
              <circle
                cx={cx}
                cy={265}
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
                x={cx}
                y={283}
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
                fontSize="7.5"
                fontFamily={FONT.mono}
                style={{
                  transition: "all 0.3s ease",
                  pointerEvents: "none",
                }}
              >
                {displayLabel}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
