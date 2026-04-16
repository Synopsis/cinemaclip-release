import React, { useState } from "react";
import { COLOR, FONT, STANDARD_CLIP_DIAGRAM } from "../styles.js";

const S = STANDARD_CLIP_DIAGRAM;

export default function StandardCLIPDiagram() {
  const [hover, setHover] = useState(null);

  const N = S.N;
  const CELL = S.cell;
  const GAP = S.gap;

  const images = [
    { label: "I\u2081", bg: "linear-gradient(135deg, #5c4a1e, #8B7530)" },
    { label: "I\u2082", bg: "linear-gradient(135deg, #1a3050, #2a4a70)" },
    { label: "I\u2083", bg: "linear-gradient(135deg, #1a3c2a, #2a5c3a)" },
  ];

  const captions = [
    '"A dog on a sunny beach"',
    '"Red sports car on a highway"',
    '"Chef preparing fresh sushi"',
  ];

  const isDim = (type, idx) => {
    if (!hover) return false;
    if (type === "row") return hover.row !== idx;
    if (type === "col") return hover.col !== idx;
    return false;
  };
  const isHl = (type, idx) => {
    if (!hover) return false;
    if (type === "row") return hover.row === idx;
    if (type === "col") return hover.col === idx;
    return false;
  };

  const rowsHeight = N * CELL + (N - 1) * GAP;

  const encoderBox = {
    height: rowsHeight,
    ...S.encoderBox,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  };

  const matrixCellSize = CELL;
  const IT = S.imageThumb;
  const EC = S.embCell;

  const ImageThumb = ({ idx }) => (
    <div style={{
      width: IT.width, height: CELL, borderRadius: IT.borderRadius, position: "relative", overflow: "hidden",
      border: `1px solid ${isHl("row", idx) ? IT.activeBorder : IT.defaultBorder}`,
      boxShadow: isHl("row", idx) ? IT.activeShadow : "none",
      background: images[idx].bg,
      opacity: isDim("row", idx) ? IT.dimOpacity : 1, transition: IT.transition,
      flexShrink: 0,
    }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: IT.barHeight, background: IT.barBg }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: IT.barHeight, background: IT.barBg }} />
      <span style={{ position: "absolute", bottom: 5, left: 4, fontFamily: FONT.mono, fontSize: IT.labelFontSize, color: IT.labelColor }}>{images[idx].label}</span>
    </div>
  );

  const EmbCell = ({ type, idx }) => {
    const hl = isHl(type, idx);
    const dim = isDim(type, idx);
    const label = type === "row" ? `v${idx + 1}` : `t${idx + 1}`;
    return (
      <div style={{
        width: EC.width, height: CELL,
        border: `1px solid ${hl ? IT.activeBorder : IT.defaultBorder}`,
        borderRadius: EC.borderRadius, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: FONT.mono, fontSize: EC.fontSize, color: hl ? EC.activeColor : EC.defaultColor,
        background: EC.background, opacity: dim ? IT.dimOpacity : 1, transition: IT.transition,
        flexShrink: 0,
      }}>
        {label}
      </div>
    );
  };

  const Arrow = ({ dir = "→" }) => (
    <span style={{ fontFamily: FONT.mono, fontSize: S.arrow.fontSize, color: S.arrow.color, flexShrink: 0 }}>{dir}</span>
  );

  const MC = S.matrixCell;
  const MH = S.matrixHeaderColor;

  return (
    <div style={{ padding: S.padding }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}>
        {/* Left side: images → encoder → embeddings */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
            {[0, 1, 2].map(i => <ImageThumb key={i} idx={i} />)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ height: CELL, display: "flex", alignItems: "center" }}><Arrow /></div>
            ))}
          </div>
          <div style={encoderBox}><span>Vision<br />Encoder</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ height: CELL, display: "flex", alignItems: "center" }}><Arrow /></div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
            {[0, 1, 2].map(i => <EmbCell key={i} type="row" idx={i} />)}
          </div>
        </div>

        {/* Center: Similarity Matrix */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          margin: "0 12px", flexShrink: 0,
        }}>
          <div style={S.matrixLabel}>Similarity Matrix</div>
          <div style={{
            display: "grid",
            gridTemplateColumns: `20px repeat(${N}, ${matrixCellSize}px)`,
            gridTemplateRows: `16px repeat(${N}, ${matrixCellSize}px)`,
            gap: GAP,
          }}>
            <div />
            {[0, 1, 2].map(c => (
              <div key={c} style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT.mono, fontSize: 9,
                color: isHl("col", c) ? MH.active : MH.default,
                transition: "color 0.2s ease",
              }}>
                t{"\u2081\u2082\u2083"[c]}
              </div>
            ))}
            {[0, 1, 2].map(row => (
              <React.Fragment key={row}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: FONT.mono, fontSize: 9,
                  color: isHl("row", row) ? MH.active : MH.default,
                  transition: "color 0.2s ease",
                }}>
                  v{"\u2081\u2082\u2083"[row]}
                </div>
                {[0, 1, 2].map(col => {
                  const isMatch = row === col;
                  const isFocused = hover && hover.row === row && hover.col === col;
                  return (
                    <div
                      key={col}
                      style={{
                        width: matrixCellSize, height: matrixCellSize,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: MC.borderRadius, fontFamily: FONT.mono, fontSize: MC.fontSize, cursor: "default",
                        background: isMatch ? MC.matchBg : MC.defaultBg,
                        border: `1px solid ${isMatch ? MC.matchBorder : MC.defaultBorder}`,
                        color: isMatch ? MC.matchColor : MC.defaultColor,
                        boxShadow: isFocused ? MC.focusShadow : "none",
                        transition: MC.transition,
                      }}
                      onMouseEnter={() => setHover({ row, col })}
                      onMouseLeave={() => setHover(null)}
                    >
                      v{row + 1}·t{col + 1}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right side: embeddings ← encoder ← captions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
            {[0, 1, 2].map(i => <EmbCell key={i} type="col" idx={i} />)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ height: CELL, display: "flex", alignItems: "center" }}><Arrow dir="←" /></div>
            ))}
          </div>
          <div style={encoderBox}><span>Text<br />Encoder</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ height: CELL, display: "flex", alignItems: "center" }}><Arrow dir="←" /></div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ height: CELL, display: "flex", alignItems: "center" }}>
                <span style={{
                  fontFamily: S.caption.fontFamily, fontSize: S.caption.fontSize,
                  color: isHl("col", i) ? S.caption.activeColor : S.caption.defaultColor,
                  whiteSpace: "nowrap", paddingLeft: S.caption.paddingLeft,
                  borderLeft: `2px solid ${isHl("col", i) ? S.caption.activeBorderLeft : "transparent"}`,
                  opacity: isDim("col", i) ? IT.dimOpacity : 1, transition: IT.transition,
                }}>
                  {captions[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loss annotation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: S.lossAnnotation.gap, marginTop: S.lossAnnotation.marginTop }}>
        <span style={S.lossAnnotation}>Contrastive Loss</span>
      </div>
      <div style={S.instruction}>
        Hover over matrix cells to see image–caption pairs
      </div>
    </div>
  );
}
