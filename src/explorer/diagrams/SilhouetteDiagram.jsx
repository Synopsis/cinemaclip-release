import React from "react";
import BinaryDiagram from "./BinaryDiagram.jsx";

export default function SilhouetteDiagram({ labels, activeIndex, onSelect }) {
  const SilhouetteScene = ({ isSilhouette }) => (
    <>
      {/* Background: bright glow for silhouette, dim for non-silhouette */}
      <rect
        x={4}
        y={4}
        width={102}
        height={54}
        rx={3}
        fill={
          isSilhouette ? "rgba(253,203,110,0.18)" : "rgba(255,255,255,0.02)"
        }
      />
      {isSilhouette && (
        <rect
          x={18}
          y={6}
          width={74}
          height={46}
          rx={2}
          fill="rgba(253,203,110,0.12)"
        />
      )}

      {/* Figure — nested SVG preserves C-2 aspect ratio */}
      <svg x={30} y={4} width={50} height={54} viewBox="28 8 44 48">
        {/* Head */}
        <path
          d="M50 16 C42 16 40 22 40 28 C40 34 43 40 50 40 C57 40 60 34 60 28 C60 22 58 16 50 16 Z"
          fill={
            isSilhouette ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.18)"
          }
        />
        {/* Coat */}
        <path
          d="M45 40 L42 44 C38 45 35 47 34 48 L34 56 L66 56 L66 48 C65 47 62 45 58 44 L55 40 Z"
          fill={
            isSilhouette ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.12)"
          }
        />
        {/* Collar */}
        <path
          d="M42 44 L46 52 L50 48 L54 52 L58 44"
          fill="none"
          stroke={
            isSilhouette ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.04)"
          }
          strokeWidth="0.8"
        />

        {/* Non-silhouette: subtle lighting gradient to indicate illumination */}
        {!isSilhouette && (
          <ellipse
            cx={46}
            cy={26}
            rx={6}
            ry={6}
            fill="rgba(255,255,255,0.06)"
          />
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
        () => <SilhouetteScene isSilhouette={true} />,
        () => <SilhouetteScene isSilhouette={false} />,
      ]}
    />
  );
}
