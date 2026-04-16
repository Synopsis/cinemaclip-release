import React from "react";
import { SECTION_ACCENTS } from "../data.js";
import { EXEMPLAR_PLACEHOLDER } from "../styles.js";

export default function ExemplarPlaceholder({ label, sectionId }) {
  const S = EXEMPLAR_PLACEHOLDER;
  const [bg, accent] = SECTION_ACCENTS[sectionId] || ["#1a1a2e", "#e94560"];

  return (
    <div
      style={{
        ...S.container,
        background: `linear-gradient(${S.gradientAngle}deg, ${bg} 0%, ${accent}${S.gradientOpacitySuffix} 100%)`,
      }}
    >
      {/* Letterbox bars */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: S.letterbox.height,
          background: S.letterbox.background,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: S.letterbox.height,
          background: S.letterbox.background,
        }}
      />

      {/* Center content */}
      <div style={S.centerContent}>
        <span style={S.placeholderText}>
          exemplar image
        </span>
      </div>

      {/* Active label overlaid on the image */}
      <div style={S.labelOverlay}>
        <span style={S.label}>
          {label}
        </span>
      </div>

      {/* Film title placeholder */}
      <div style={S.filmCredit}>
        Film Title (Year)
      </div>
    </div>
  );
}
