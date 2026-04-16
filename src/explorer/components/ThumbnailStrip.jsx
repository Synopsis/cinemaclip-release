import React from "react";
import { SECTION_ACCENTS } from "../data.js";
import { THUMBNAIL_STRIP } from "../styles.js";

export default function ThumbnailStrip({ labels, activeIndex, onSelect, sectionId }) {
  const S = THUMBNAIL_STRIP;
  const [bg, accent] = SECTION_ACCENTS[sectionId] || ["#1a1a2e", "#e94560"];

  return (
    <div style={S.container}>
      {labels.map((label, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={label}
            onClick={() => onSelect(i)}
            title={label}
            style={{
              ...S.button,
              border: isActive ? S.activeBorder : S.inactiveBorder,
              background: `linear-gradient(${S.gradientAngle}deg, ${bg} 0%, ${accent}${isActive ? S.activeGradientOpacity : S.inactiveGradientOpacity} 100%)`,
              opacity: isActive ? S.activeOpacity : S.inactiveOpacity,
            }}
          >
            <span
              style={{
                ...S.label,
                color: isActive ? S.labelActiveColor : S.labelInactiveColor,
              }}
            >
              {label.length > S.maxLabelLength ? label.slice(0, S.truncatedLength) + ".." : label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
