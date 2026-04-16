import React from "react";
import { FONT } from "../styles.js";

export default function ShotTypeDiagram({ labels, activeIndex, onSelect }) {
  const Figure = ({ cx, cy, scale = 1 }) => (
    <g
      transform={`translate(${cx}, ${cy}) scale(${scale})`}
      stroke="rgba(255,255,255,0.5)"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    >
      <circle cx="0" cy="-22" r="6" fill="rgba(255,255,255,0.05)" />
      <line x1="0" y1="-16" x2="0" y2="8" />
      <line x1="0" y1="-8" x2="-10" y2="2" />
      <line x1="0" y1="-8" x2="10" y2="2" />
      <line x1="0" y1="8" x2="-8" y2="24" />
      <line x1="0" y1="8" x2="8" y2="24" />
    </g>
  );

  const InsertObject = ({ cx, cy }) => (
    <g>
      <rect
        x={cx - 16}
        y={cy - 12}
        width="32"
        height="24"
        rx="3"
        fill="rgba(255,255,255,0.05)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
      />
      <circle
        cx={cx}
        cy={cy}
        r="5"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
    </g>
  );

  const layouts = [
    () => <Figure cx={150} cy={83} />,
    () => (
      <>
        <Figure cx={120} cy={83} />
        <Figure cx={180} cy={83} />
      </>
    ),
    () => (
      <>
        <Figure cx={100} cy={83} />
        <Figure cx={150} cy={83} />
        <Figure cx={200} cy={83} />
      </>
    ),
    () => (
      <>
        <Figure cx={90} cy={85} scale={0.85} />
        <Figure cx={125} cy={81} scale={0.85} />
        <Figure cx={155} cy={83} scale={0.85} />
        <Figure cx={185} cy={83} scale={0.85} />
        <Figure cx={215} cy={85} scale={0.85} />
      </>
    ),
    () => <InsertObject cx={150} cy={83} />,
  ];

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
        viewBox="0 0 300 166"
        style={{ width: "100%", maxWidth: 260, height: "auto" }}
      >
        <rect
          x="38"
          y="20"
          width="224"
          height="126"
          rx="3"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
        />
        {activeIndex != null && layouts[activeIndex]()}
      </svg>

      {/* Step dots */}
      <div
        style={{
          display: "flex",
          gap: 6,
          justifyContent: "center",
        }}
      >
        {labels.map((label, i) => (
          <button
            key={label}
            onClick={() => onSelect(i)}
            style={{
              width: i === activeIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: "none",
              background:
                i === activeIndex
                  ? "rgba(255,255,255,0.7)"
                  : activeIndex != null && Math.abs(i - activeIndex) === 1
                  ? "rgba(255,255,255,0.2)"
                  : activeIndex === null
                  ? "rgba(255,255,255,0.35)"
                  : "rgba(255,255,255,0.08)",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s ease",
            }}
            title={label}
          />
        ))}
      </div>
    </div>
  );
}
