import React from "react";
import { SECTION_NAV } from "../styles.js";

export default function SectionNav({ sections, activeId, onSelect }) {
  return (
    <div style={SECTION_NAV.container}>
      {sections.map((section, i) => (
        <span
          key={section.id}
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: 8,
          }}
        >
          {i > 0 && (
            <span style={SECTION_NAV.separator}>/</span>
          )}
          <button
            onClick={() => onSelect(section.id)}
            style={SECTION_NAV.button}
          >
            <span
              style={{
                ...SECTION_NAV.label,
                color: activeId === section.id ? SECTION_NAV.activeColor : SECTION_NAV.inactiveColor,
                borderBottom: activeId === section.id ? SECTION_NAV.activeBorder : SECTION_NAV.inactiveBorder,
              }}
            >
              {section.phrase}
            </span>
          </button>
        </span>
      ))}
    </div>
  );
}
