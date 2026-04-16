import React, { useState } from "react";
import { TEXT_SIMILARITY_MATRICES } from "../data.js";
import { FONT, TEXT_SIMILARITY } from "../styles.js";

const S = TEXT_SIMILARITY;

// ─── Color Mapping ───────────────────────────────────────────────────────────

function cellColor(value) {
  if (value >= 1.0) return "rgba(255,255,255,0.05)";
  const t = Math.pow(Math.max(0, (value - 0.3) / 0.7), 1.8);
  const r = Math.round(40 + t * 215);
  const g = Math.round(25 + t * 175);
  const b = Math.round(20 + t * 100);
  const a = 0.05 + t * 0.85;
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

function textColor(value) {
  if (value >= 1.0) return "rgba(255,255,255,0.18)";
  const t = Math.pow(Math.max(0, (value - 0.3) / 0.7), 1.8);
  if (t > 0.55) return "rgba(0,0,0,0.6)";
  if (t > 0.3) return "rgba(255,255,255,0.55)";
  return "rgba(255,255,255,0.3)";
}

// ─── Similarity Heatmap ──────────────────────────────────────────────────────

function SimilarityHeatmap({ matrix, labels, title, hoveredCell, onCellHover }) {
  const n = labels.length;

  const isHighlighted = (ri, ci) => {
    if (!hoveredCell) return false;
    return ri === hoveredCell.row || ci === hoveredCell.col;
  };

  return (
    <div style={{ display: "inline-block", verticalAlign: "top" }}>
      {matrix.map((row, ri) => (
        <div
          key={ri}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: ri < n - 1 ? S.gap : 0,
          }}
        >
          <div
            style={{
              width: S.labelWidth,
              textAlign: "right",
              paddingRight: S.labelPaddingRight,
              fontFamily: FONT.mono,
              fontSize: S.labelFontSize,
              color: hoveredCell
                ? ri === hoveredCell.row ? S.labelHovered : S.labelDimmed
                : S.labelDefault,
              flexShrink: 0,
              lineHeight: 1.2,
              transition: "color 0.15s ease",
            }}
          >
            {labels[ri]}
          </div>

          {row.map((value, ci) => {
            const isHovered = hoveredCell && hoveredCell.row === ri && hoveredCell.col === ci;
            const highlighted = isHighlighted(ri, ci);
            const dimmed = hoveredCell && !highlighted;

            return (
              <div
                key={ci}
                onMouseEnter={() => onCellHover({ row: ri, col: ci })}
                onMouseLeave={() => onCellHover(null)}
                style={{
                  width: S.cell,
                  height: S.cell,
                  marginRight: ci < n - 1 ? S.gap : 0,
                  background: cellColor(value),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: S.cellBorderRadius,
                  opacity: dimmed ? 0.3 : 1,
                  outline: isHovered ? S.hoveredOutline : "none",
                  transition: "opacity 0.15s ease",
                  cursor: "default",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: S.cellFontSize,
                    fontVariantNumeric: "tabular-nums",
                    color: textColor(value),
                  }}
                >
                  {value === 1 ? "" : value.toFixed(2).slice(1)}
                </span>
              </div>
            );
          })}
        </div>
      ))}

      <div
        style={{
          fontFamily: FONT.mono,
          fontSize: S.modelNameFontSize,
          color: S.modelNameColor,
          letterSpacing: S.modelNameLetterSpacing,
          marginTop: S.modelNameMarginTop,
          textAlign: "center",
          paddingLeft: S.labelWidth,
        }}
      >
        {title}
      </div>
    </div>
  );
}

// ─── Tooltip ────────────────────────────────────────────────────────────────

function PairTooltip({ hoveredCell, labels }) {
  if (!hoveredCell) return null;
  const { row, col } = hoveredCell;
  if (row === col) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: S.tooltip.marginTop, minHeight: S.tooltip.minHeight }}>
      <div style={{ fontFamily: FONT.mono, fontSize: S.tooltip.fontSize, display: "flex", alignItems: "center", gap: S.tooltip.gap }}>
        <span style={{ color: S.tooltip.labelColor }}>{labels[row]}</span>
        <span style={{ color: S.tooltip.separatorColor }}>×</span>
        <span style={{ color: S.tooltip.labelColor }}>{labels[col]}</span>
      </div>
    </div>
  );
}

// ─── Matrix Pair ─────────────────────────────────────────────────────────────

function MatrixPair({ data }) {
  const [hoveredCell, setHoveredCell] = useState(null);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", gap: S.matrixGap, flexWrap: "wrap" }}>
        <SimilarityHeatmap matrix={data.cinemaclip} labels={data.labels} title="CinemaCLIP" hoveredCell={hoveredCell} onCellHover={setHoveredCell} />
        <SimilarityHeatmap matrix={data.mobileclip} labels={data.labels} title="MobileCLIP (pre-trained)" hoveredCell={hoveredCell} onCellHover={setHoveredCell} />
      </div>
      <PairTooltip hoveredCell={hoveredCell} labels={data.labels} />
    </div>
  );
}

// ─── Tabbed Cinematic Section ────────────────────────────────────────────────

export function CinematicSimilarityMatrices() {
  const cinematic = TEXT_SIMILARITY_MATRICES.filter((m) => m.type === "cinematic");
  const [activeId, setActiveId] = useState(cinematic[0].id);
  const active = cinematic.find((m) => m.id === activeId);

  return (
    <div>
      <div style={{ display: "flex", gap: S.tabGap, alignItems: "baseline", justifyContent: "center", marginBottom: S.tabMarginBottom }}>
        {cinematic.map((m, i) => (
          <span key={m.id} style={{ display: "inline-flex", alignItems: "baseline", gap: S.tabGap }}>
            {i > 0 && <span style={S.tabSeparator}>/</span>}
            <button onClick={() => setActiveId(m.id)} style={S.tabButton}>
              <span style={{
                ...S.tabLabel,
                color: activeId === m.id ? S.tabLabel.activeColor : S.tabLabel.inactiveColor,
                borderBottom: activeId === m.id ? S.tabLabel.activeBorder : S.tabLabel.inactiveBorder,
              }}>
                {m.title}
              </span>
            </button>
          </span>
        ))}
      </div>
      <MatrixPair data={active} />
    </div>
  );
}

// ─── Non-Cinematic Section ───────────────────────────────────────────────────

export function NonCinematicSimilarityMatrices({ sectionIndex }) {
  const nonCinematic = TEXT_SIMILARITY_MATRICES.filter((m) => m.type === "non-cinematic");
  const toShow = sectionIndex !== undefined ? [nonCinematic[sectionIndex]] : nonCinematic;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: S.sectionGap }}>
      {toShow.map((m) => (
        <div key={m.id}>
          <div style={S.sectionTitle}>{m.title}</div>
          <MatrixPair data={m} />
        </div>
      ))}
    </div>
  );
}
