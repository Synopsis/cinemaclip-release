import React from "react";
import { FONT } from "../styles.js";

export default function GenericSelector({ labels, activeIndex, onSelect }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "8px 0",
      }}
    >
      {labels.map((label, i) => {
        const isActive = i === activeIndex;
        const isAdjacent = activeIndex != null && Math.abs(i - activeIndex) === 1;
        return (
          <button
            key={label}
            onClick={() => onSelect(i)}
            style={{
              background: isActive
                ? "rgba(255,255,255,0.08)"
                : "transparent",
              border: isActive
                ? "1px solid rgba(255,255,255,0.2)"
                : activeIndex === null
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid rgba(255,255,255,0.04)",
              borderRadius: 4,
              padding: "8px 14px",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.25s ease",
              outline: "none",
            }}
          >
            <span
              style={{
                fontFamily: FONT.mono,
                fontSize: 12,
                color: isActive
                  ? "rgba(255,255,255,0.9)"
                  : isAdjacent
                  ? "rgba(255,255,255,0.4)"
                  : activeIndex === null
                  ? "rgba(255,255,255,0.55)"
                  : "rgba(255,255,255,0.2)",
                letterSpacing: "0.01em",
                transition: "color 0.25s ease",
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
