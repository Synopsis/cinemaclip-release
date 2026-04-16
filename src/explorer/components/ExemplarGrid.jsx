import React from "react";
import { GRID_MAX_PER_ROW } from "../data.js";
import { TAXONOMY_EXEMPLAR_GRID } from "../styles.js";

export default function ExemplarGrid({ labels, exemplarByLabel, activeIndex, onSelect, categoryId }) {
  const S = TAXONOMY_EXEMPLAR_GRID;
  const maxPerRow = GRID_MAX_PER_ROW[categoryId] || (labels.length > 5 ? Math.ceil(labels.length / 2) : labels.length);

  // Color tones: diagram order is B&W → Cool → Neutral → Warm, Mixed last. Labels array has Mixed at index 2.
  const displayOrder = categoryId === "color-tones"
    ? [0, 1, 3, 4, 2]  // label indices: B&W, Cool, Neutral, Warm, Mixed
    : labels.map((_, i) => i);
  const orderedLabels = displayOrder.map((i) => labels[i]);

  const rows = [];
  for (let i = 0; i < orderedLabels.length; i += maxPerRow) {
    rows.push(orderedLabels.slice(i, i + maxPerRow));
  }

  const gridToLabelIndex = (gridIndex) => displayOrder[gridIndex];

  const handleClick = (gridIndex) => {
    const labelIndex = gridToLabelIndex(gridIndex);
    if (labelIndex === activeIndex) {
      onSelect(null);
    } else {
      onSelect(labelIndex);
    }
  };

  const focusedRowIdx = activeIndex != null
    ? (() => {
        const focusedGridIndex = displayOrder.indexOf(activeIndex);
        if (focusedGridIndex < 0) return -1;
        let count = 0;
        for (let r = 0; r < rows.length; r++) {
          count += rows[r].length;
          if (focusedGridIndex < count) return r;
        }
        return -1;
      })()
    : -1;

  let globalIndex = 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: S.gap }}>
      {rows.map((row, rowIdx) => {
        const hasFocus = activeIndex != null;
        const isActiveRow = rowIdx === focusedRowIdx;
        const isOtherRow = hasFocus && !isActiveRow;

        return (
          <div
            key={rowIdx}
            style={{
              display: "flex",
              gap: S.gap,
              alignItems: "center",
              padding: isOtherRow ? `0 ${S.otherRowPadPct}%` : "0",
              transition: `padding ${S.transition}`,
            }}
          >
            {row.map((label) => {
              const gridIndex = globalIndex++;
              const exemplar = exemplarByLabel[label];
              if (!exemplar) return null;

              const isFocused = gridToLabelIndex(gridIndex) === activeIndex;
              const flex = isFocused ? S.focusedFlex : S.unfocusedFlex;

              return (
                <div
                  key={label}
                  onClick={() => handleClick(gridIndex)}
                  style={{
                    flex,
                    transition: `flex ${S.transition}`,
                    cursor: isFocused ? "zoom-out" : "pointer",
                    ...S.image,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    src={exemplar.src}
                    alt={label}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                  {/* Label overlay */}
                  <div style={{
                    position: "absolute",
                    bottom: isOtherRow ? S.labelPosition.otherRow : S.labelPosition.default,
                    left: isOtherRow ? S.labelPosition.otherRow : S.labelPosition.default,
                    transition: `all ${S.transition}`,
                  }}>
                    <span style={{
                      fontFamily: S.label.fontFamily,
                      fontSize: isFocused ? S.labelFocusedSize : (isOtherRow ? S.labelOtherRowSize : S.labelDefaultSize),
                      fontStyle: S.label.fontStyle,
                      color: isFocused
                        ? S.label.focusedColor
                        : isOtherRow
                        ? S.label.otherRowColor
                        : S.label.defaultColor,
                      textShadow: S.label.textShadow,
                      transition: `all ${S.transition}`,
                    }}>
                      {label}
                    </span>
                  </div>
                  {/* Film credit — only on focused image */}
                  {isFocused && exemplar.film && (
                    <div style={S.filmCredit}>
                      {exemplar.film}{exemplar.year ? ` (${exemplar.year})` : ""}
                    </div>
                  )}
                </div>
              );
            })}
            {/* Invisible spacers so short rows match the first row's sizing */}
            {row.length < maxPerRow &&
              Array.from({ length: maxPerRow - row.length }, (_, i) => (
                <div key={`spacer-${i}`} style={{ flex: S.unfocusedFlex, visibility: "hidden" }} />
              ))
            }
          </div>
        );
      })}
    </div>
  );
}
