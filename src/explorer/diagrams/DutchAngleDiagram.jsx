import React from "react";
import BinaryDiagram from "./BinaryDiagram.jsx";

export default function DutchAngleDiagram({ labels, activeIndex, onSelect }) {
  const Scene = ({ isTilted }) => {
    const rotation = isTilted ? -16 : 0;
    return (
      <>
        {/* Dark background */}
        <rect x={4} y={4} width={102} height={54} rx={3} fill="rgba(0,0,0,0.25)" />

        {/* Clip the rotated content to the frame */}
        <clipPath id={`dutch-clip-${isTilted ? "t" : "l"}`}>
          <rect x={5} y={5} width={100} height={54} rx={2} />
        </clipPath>

        <g
          clipPath={`url(#dutch-clip-${isTilted ? "t" : "l"})`}
          style={{ transition: "transform 0.4s ease" }}
        >
          <g transform={`rotate(${rotation}, 55, 31)`}>
            {/* Sky gradient (upper half) */}
            <rect x={-20} y={-20} width={150} height={47} fill="rgba(255,255,255,0.02)" />

            {/* Horizon line */}
            <line
              x1={-20}
              y1={36}
              x2={130}
              y2={36}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.8"
            />

            {/* Ground (below horizon) */}
            <rect x={-20} y={36} width={150} height={40} fill="rgba(255,255,255,0.015)" />

            {/* Building shapes — simple silhouettes above horizon */}
            {/* Tall building left */}
            <rect x={16} y={15} width={14} height={21} fill="rgba(255,255,255,0.1)" />
            {/* Window dots */}
            <rect x={19} y={17} width={3} height={3} rx={0.5} fill="rgba(255,255,255,0.06)" />
            <rect x={24} y={17} width={3} height={3} rx={0.5} fill="rgba(255,255,255,0.06)" />
            <rect x={19} y={21} width={3} height={3} rx={0.5} fill="rgba(255,255,255,0.06)" />
            <rect x={24} y={21} width={3} height={3} rx={0.5} fill="rgba(255,255,255,0.06)" />
            <rect x={19} y={25} width={3} height={3} rx={0.5} fill="rgba(255,255,255,0.06)" />
            <rect x={24} y={25} width={3} height={3} rx={0.5} fill="rgba(255,255,255,0.06)" />

            {/* Medium building center-left */}
            <rect x={33} y={22} width={12} height={13} fill="rgba(255,255,255,0.08)" />

            {/* Wide building center */}
            <rect x={48} y={25} width={18} height={11} fill="rgba(255,255,255,0.09)" />
            <rect x={51} y={27} width={4} height={4} rx={0.5} fill="rgba(255,255,255,0.05)" />
            <rect x={58} y={27} width={4} height={4} rx={0.5} fill="rgba(255,255,255,0.05)" />

            {/* Tall narrow building right */}
            <rect x={70} y={15} width={10} height={18} fill="rgba(255,255,255,0.1)" />
            <rect x={73} y={20} width={3} height={3} rx={0.5} fill="rgba(255,255,255,0.06)" />
            <rect x={73} y={24} width={3} height={3} rx={0.5} fill="rgba(255,255,255,0.06)" />
            <rect x={73} y={28} width={3} height={3} rx={0.5} fill="rgba(255,255,255,0.06)" />

            {/* Small building far right */}
            <rect x={83} y={28} width={10} height={8} fill="rgba(255,255,255,0.07)" />
          </g>
        </g>

        {/* Frame border overlay — always axis-aligned */}
        <rect
          x={5}
          y={5}
          width={100}
          height={54}
          rx={2}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
        />
      </>
    );
  };

  return (
    <BinaryDiagram
      labels={labels}
      activeIndex={activeIndex}
      onSelect={onSelect}
      illustrations={[
        () => <Scene isTilted={true} />,
        () => <Scene isTilted={false} />,
      ]}
    />
  );
}
