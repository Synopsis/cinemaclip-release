import React from "react";
import BinaryDiagram from "./BinaryDiagram.jsx";

export default function EdgeLightDiagram({ labels, activeIndex, onSelect }) {
  const BustWithRim = ({ rimLight }) => (
    <>
      {/* Dark background fill */}
      <rect x={4} y={4} width={102} height={54} rx={3} fill="rgba(0,0,0,0.25)" />

      {/* Figure — nested SVG preserves C-2 aspect ratio */}
      <svg x={30} y={4} width={50} height={54} viewBox="28 8 44 48">
        {/* Head */}
        <path
          d="M50 16 C42 16 40 22 40 28 C40 34 43 40 50 40 C57 40 60 34 60 28 C60 22 58 16 50 16 Z"
          fill="rgba(255,255,255,0.08)"
        />
        {/* Coat */}
        <path
          d="M45 40 L42 44 C38 45 35 47 34 48 L34 56 L66 56 L66 48 C65 47 62 45 58 44 L55 40 Z"
          fill="rgba(255,255,255,0.08)"
        />
        {/* Collar */}
        <path
          d="M42 44 L46 52 L50 48 L54 52 L58 44"
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="0.8"
        />

        {rimLight && (
          <>
            {/* Bright rim line on right edge of head */}
            <path
              d="M57 17 C59 20 60 25 60 28 C60 33 58 37 55 40"
              fill="none"
              stroke="rgba(253,203,110,0.9)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Rim on right coat contour */}
            <path
              d="M58 44 C62 46 65 49 66 54"
              fill="none"
              stroke="rgba(253,203,110,0.55)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </>
  );

  return (
    <BinaryDiagram
      labels={labels}
      activeIndex={activeIndex}
      onSelect={onSelect}
      illustrations={[
        () => <BustWithRim rimLight={true} />,
        () => <BustWithRim rimLight={false} />,
      ]}
    />
  );
}
