import React from "react";
import BinaryDiagram from "./BinaryDiagram.jsx";

export default function OTSDiagram({ labels, activeIndex, onSelect }) {
  // Drawn from the camera's perspective — what the viewer actually sees.
  // OTS: a dark shoulder/back-of-head silhouette fills the right foreground,
  //       the subject faces us on the left side of frame.
  // Not OTS: just the subject in frame, no foreground obstruction.

  const OTSScene = ({ isOTS }) => (
    <>
      {/* Dark background */}
      <rect x={4} y={4} width={102} height={54} rx={3} fill="rgba(0,0,0,0.25)" />

      {isOTS && (
        <>
          {/* Foreground figure — LEFT side, large, seen from BEHIND,
              partially cropping off the left edge. Just back of head + coat. */}
          <svg x={-12} y={-4} width={62} height={70} viewBox="28 8 44 48" overflow="visible">
            <path
              d="M50 16 C42 16 40 22 40 28 C40 34 43 40 50 40 C57 40 60 34 60 28 C60 22 58 16 50 16 Z"
              fill="rgba(255,255,255,0.08)"
            />
            <path
              d="M45 40 L42 44 C38 45 35 47 34 48 L34 56 L66 56 L66 48 C65 47 62 45 58 44 L55 40 Z"
              fill="rgba(255,255,255,0.07)"
            />
          </svg>
        </>
      )}

      {/* Subject — facing camera, right side when OTS, centered when not */}
      <svg x={isOTS ? 56 : 30} y={isOTS ? 10 : 4} width={isOTS ? 42 : 50} height={isOTS ? 46 : 54} viewBox="28 8 44 48">
        <path
          d="M50 16 C42 16 40 22 40 28 C40 34 43 40 50 40 C57 40 60 34 60 28 C60 22 58 16 50 16 Z"
          fill="rgba(255,255,255,0.18)"
        />
        <path
          d="M45 40 L42 44 C38 45 35 47 34 48 L34 56 L66 56 L66 48 C65 47 62 45 58 44 L55 40 Z"
          fill="rgba(255,255,255,0.12)"
        />
        <path
          d="M42 44 L46 52 L50 48 L54 52 L58 44"
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="0.8"
        />
      </svg>
    </>
  );

  return (
    <BinaryDiagram
      labels={labels}
      activeIndex={activeIndex}
      onSelect={onSelect}
      illustrations={[
        () => <OTSScene isOTS={true} />,
        () => <OTSScene isOTS={false} />,
      ]}
    />
  );
}
