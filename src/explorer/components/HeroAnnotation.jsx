import React from "react";
import { HERO_ANNOTATION } from "../styles.js";

export default function HeroAnnotation({ data, index, isVisible }) {
  const S = HERO_ANNOTATION;

  const alignStyles = {
    left: { left: `${data.x}%`, transform: "translateY(-50%)" },
    right: { right: `${100 - data.x}%`, transform: "translateY(-50%)" },
    center: {
      left: `${data.x}%`,
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <div
      style={{
        position: "absolute",
        top: `${data.y}%`,
        ...alignStyles[data.align],
        opacity: isVisible ? 1 : 0,
        transition: `${S.transition} ${index * S.stagger}s`,
        transform: `${alignStyles[data.align].transform} translateY(${
          isVisible ? 0 : S.entryOffset
        }px)`,
        pointerEvents: "none",
        zIndex: S.zIndex,
      }}
    >
      <div
        style={{
          background: S.chip.background,
          backdropFilter: `blur(${S.chip.blur}px)`,
          WebkitBackdropFilter: `blur(${S.chip.blur}px)`,
          borderRadius: S.chip.borderRadius,
          padding: S.chip.padding,
          border: S.chip.border,
          whiteSpace: "nowrap",
        }}
      >
        <div style={S.category}>
          {data.category}
        </div>
        <div style={S.label}>
          {data.label}
        </div>
      </div>
    </div>
  );
}
