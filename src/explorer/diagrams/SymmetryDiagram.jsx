import React from "react";
import BinaryDiagram from "./BinaryDiagram.jsx";

export default function SymmetryDiagram({ labels, activeIndex, onSelect }) {
  const SymmetryScene = ({ isSymmetric }) => (
    <>
      {/* Dark background */}
      <rect x={4} y={4} width={102} height={54} rx={3} fill="rgba(0,0,0,0.25)" />

      {/* Vertical center line (axis of symmetry) */}
      <line
        x1={55}
        y1={8}
        x2={55}
        y2={54}
        stroke={isSymmetric ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"}
        strokeWidth={0.8}
        strokeDasharray={isSymmetric ? "3,2" : "2,3"}
        style={{ transition: "all 0.35s ease" }}
      />

      {isSymmetric ? (
        <>
          {/* Mirrored shapes — left side */}
          <rect x={18} y={16} width={16} height={13} rx={2} fill="rgba(255,255,255,0.18)" />
          <circle cx={34} cy={40} r={8} fill="rgba(255,255,255,0.12)" />
          <rect x={22} y={45} width={10} height={7} rx={1} fill="rgba(255,255,255,0.10)" />

          {/* Mirrored shapes — right side (mirror of left) */}
          <rect x={76} y={16} width={16} height={13} rx={2} fill="rgba(255,255,255,0.18)" />
          <circle cx={76} cy={40} r={8} fill="rgba(255,255,255,0.12)" />
          <rect x={78} y={45} width={10} height={7} rx={1} fill="rgba(255,255,255,0.10)" />
        </>
      ) : (
        <>
          {/* Asymmetric — shapes clustered differently on each side */}
          <rect x={14} y={13} width={22} height={18} rx={2} fill="rgba(255,255,255,0.18)" />
          <circle cx={28} cy={42} r={10} fill="rgba(255,255,255,0.12)" />

          {/* Right side — different shapes, different positions */}
          <circle cx={78} cy={22} r={6} fill="rgba(255,255,255,0.10)" />
          <rect x={82} y={38} width={8} height={11} rx={1} fill="rgba(255,255,255,0.08)" />
        </>
      )}
    </>
  );

  return (
    <BinaryDiagram
      labels={labels}
      activeIndex={activeIndex}
      onSelect={onSelect}
      illustrations={[
        () => <SymmetryScene isSymmetric={true} />,
        () => <SymmetryScene isSymmetric={false} />,
      ]}
    />
  );
}
