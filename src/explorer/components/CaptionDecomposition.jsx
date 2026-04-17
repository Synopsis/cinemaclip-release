import React, { useMemo, useState } from "react";
import { CAPTION_DECOMPOSITION } from "../styles.js";

import ajayDevgnData from "../../../public/assets/cinemaclip/general/ajay-devgn.json";

// ─── Data ────────────────────────────────────────────────────────────────────

const IMAGE = "assets/cinemaclip/general/ajay-devgn.jpg";
const DATA = ajayDevgnData;

const TASK_NAMES = [
  "Synthetic Caption",
  "Human Tags",
  "Color",
  "Composition",
  "Framing & Lens",
  "Shot Type",
  "Lighting",
  "Location & Time",
];

const TASK_SHORT = [
  "SYNTHETIC",
  "HUMAN TAGS",
  "COLOR",
  "COMPOSITION",
  "FRAMING",
  "SHOT TYPE",
  "LIGHTING",
  "LOCATION",
];

function buildTasks(data) {
  const synth = data.caption_noncinematic.synthetic;
  const out = [
    { name: TASK_NAMES[0], caption: synth[synth.length - 1] },
    { name: TASK_NAMES[1], caption: data.caption_noncinematic.real },
  ];
  data.caption_cinematic.forEach((c, i) => {
    out.push({ name: TASK_NAMES[i + 2], caption: c.caption });
  });
  return out;
}

function buildSegments(tasks) {
  const segs = [];
  tasks.forEach((task, taskIdx) => {
    task.caption.split(",").forEach((s) => {
      const text = s.trim();
      if (text) segs.push({ text, taskIdx });
    });
  });
  return segs;
}

// ─── Component ───────────────────────────────────────────────────────────────

const S = CAPTION_DECOMPOSITION;

export default function CaptionDecomposition() {
  const [hoveredTask, setHoveredTask] = useState(null);
  const tasks = useMemo(() => buildTasks(DATA), []);
  const segments = useMemo(() => buildSegments(tasks), [tasks]);

  return (
    <div>
      <div style={{ ...S.title, width: S.layout.imageColumnWidth }}>
        Caption Decomposition
      </div>
      <div style={{ display: "flex", gap: S.layout.gap }}>
        {/* Image */}
      <div style={{ flex: S.layout.imageColumnFlex }}>
        <img src={IMAGE} alt="" style={S.image} />
      </div>

      {/* Right column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Single caption blob */}
        <div style={{ marginBottom: S.layout.blobMarginBottom }}>
          <h4 style={S.heading}>Single Caption</h4>
          <div style={S.blob}>
            {segments.map((seg, i) => {
              const isHovered = hoveredTask === seg.taskIdx;
              const dim = hoveredTask !== null && !isHovered;
              return (
                <span key={i}>
                  <span
                    onMouseEnter={() => setHoveredTask(seg.taskIdx)}
                    onMouseLeave={() => setHoveredTask(null)}
                    style={{
                      color: dim ? S.text.dim : S.text.rest,
                      cursor: "default",
                      transition: S.transition,
                    }}
                  >
                    {seg.text}
                  </span>
                  {i < segments.length - 1 && (
                    <span style={{ color: S.text.separator }}>, </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>

        {/* Hard rule */}
        <div style={{ ...S.rule, margin: S.layout.ruleMargin }} />

        {/* Decomposed table */}
        <h4 style={S.heading}>Decomposed Captions</h4>
        <table style={S.table}>
          <tbody>
            {tasks.map((task, i) => {
              const isHovered = hoveredTask === i;
              const dim = hoveredTask !== null && !isHovered;
              return (
                <tr
                  key={i}
                  onMouseEnter={() => setHoveredTask(i)}
                  onMouseLeave={() => setHoveredTask(null)}
                  style={{ cursor: "default" }}
                >
                  <td
                    style={{
                      ...S.labelCell,
                      color: dim ? S.text.dimLabel : S.text.restLabel,
                    }}
                  >
                    {TASK_SHORT[i]}
                  </td>
                  <td
                    style={{
                      ...S.captionCell,
                      color: dim ? S.text.dim : S.text.rest,
                    }}
                  >
                    {task.caption}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
