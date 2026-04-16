import React, { useState, useMemo } from "react";
import { EXEMPLAR_IMAGES, SECTION_ACCENTS } from "../data.js";
import { TAXONOMY_CATEGORY_ROW, TAXONOMY_THUMBNAIL_STRIP, COLOR } from "../styles.js";
import { DIAGRAM_MAP } from "../diagrams/index.js";
import ExemplarGrid from "./ExemplarGrid.jsx";
import ExemplarPlaceholder from "./ExemplarPlaceholder.jsx";

export default function CategoryRow({ category, sectionId }) {
  const S = TAXONOMY_CATEGORY_ROW;
  const exemplars = EXEMPLAR_IMAGES[category.id];
  const [activeIndex, setActiveIndex] = useState(null);

  const exemplarByLabel = useMemo(() => {
    if (!exemplars) return null;
    const map = {};
    for (const e of exemplars) map[e.label] = e;
    return map;
  }, [exemplars]);

  const DiagramComponent = DIAGRAM_MAP[category.diagram];

  return (
    <div style={{ marginBottom: S.marginBottom }}>
      <div style={S.layout}>
        {/* Left column: name + description + diagram */}
        <div
          style={{
            flex: `0 0 ${S.diagramColumnWidth}px`,
            width: S.diagramColumnWidth,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={S.categoryName}>
            {category.name}
          </div>

          {category.description && (
            <p style={S.description}>
              {category.description}
            </p>
          )}

          <DiagramComponent
            labels={category.labels}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
          />
        </div>

        {/* Right column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {exemplarByLabel ? (
            <ExemplarGrid
              labels={category.labels}
              exemplarByLabel={exemplarByLabel}
              activeIndex={activeIndex}
              onSelect={setActiveIndex}
              categoryId={category.id}
            />
          ) : (
            <>
              <ExemplarPlaceholder
                label={category.labels[activeIndex]}
                sectionId={sectionId}
              />
              {/* Horizontal thumbnail strip */}
              <div style={S.thumbnailRow}>
                {category.labels.map((label, i) => {
                  const isActive = i === activeIndex;
                  const [bg, accent] = SECTION_ACCENTS[sectionId] || ["#1a1a2e", "#e94560"];
                  return (
                    <button
                      key={label}
                      onClick={() => setActiveIndex(i)}
                      title={label}
                      style={{
                        ...TAXONOMY_THUMBNAIL_STRIP.button,
                        border: isActive
                          ? TAXONOMY_THUMBNAIL_STRIP.activeBorder
                          : activeIndex === null
                          ? TAXONOMY_THUMBNAIL_STRIP.defaultBorder
                          : TAXONOMY_THUMBNAIL_STRIP.inactiveBorder,
                        background: `linear-gradient(${TAXONOMY_THUMBNAIL_STRIP.gradientAngle}deg, ${bg} 0%, ${accent}${isActive ? TAXONOMY_THUMBNAIL_STRIP.activeGradientOpacity : TAXONOMY_THUMBNAIL_STRIP.inactiveGradientOpacity} 100%)`,
                        opacity: isActive ? TAXONOMY_THUMBNAIL_STRIP.activeOpacity : activeIndex === null ? TAXONOMY_THUMBNAIL_STRIP.defaultOpacity : TAXONOMY_THUMBNAIL_STRIP.inactiveOpacity,
                      }}
                    >
                      <span
                        style={{
                          ...TAXONOMY_THUMBNAIL_STRIP.label,
                          color: isActive ? TAXONOMY_THUMBNAIL_STRIP.labelActiveColor : TAXONOMY_THUMBNAIL_STRIP.labelInactiveColor,
                        }}
                      >
                        {label.length > TAXONOMY_THUMBNAIL_STRIP.maxLabelLength ? label.slice(0, TAXONOMY_THUMBNAIL_STRIP.truncatedLength) + ".." : label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
