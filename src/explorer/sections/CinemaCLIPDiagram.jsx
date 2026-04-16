import React, { useState } from "react";
import { FONT } from "../styles.js";

export default function CinemaCLIPDiagram() {
  const [hover, setHover] = useState(null); // { task, row, col } or null

  const CELL = 30;
  const CELL_GAP = 3;
  const accent = "rgba(100,200,255,";
  const textAt = (a) => `rgba(255,255,255,${a})`;
  const warm = "rgba(212,165,116,";

  const sharedImages = [
    { label: "I₁", bg: "linear-gradient(135deg, #5c4a1e, #8B7530)" },
    { label: "I₂", bg: "linear-gradient(135deg, #1a3050, #2a4a70)" },
    { label: "I₃", bg: "linear-gradient(135deg, #1a3c2a, #2a5c3a)" },
  ];

  const ROW_H = 38; // shared pipeline row height to match figure 1 proportions

  const tasks = [
    {
      num: 1,
      aspect: "Framing",
      captions: ['"Medium close-up"', '"Wide establishing shot"', '"Extreme close-up"'],
    },
    {
      num: 2,
      aspect: "Color Tone",
      captions: ['"Warm golden amber"', '"Cool desaturated blue"', '"Neutral balanced tones"'],
    },
    {
      num: 8,
      aspect: "Camera Angle",
      captions: ['"Low angle, looking up"', '"Eye-level, straight on"', '"High overhead angle"'],
    },
  ];

  const classifierChips = [
    { name: "Framing", tip: "softmax → ECU · CU · MCU · MS · MLS · LS · ELS" },
    { name: "Angle", tip: "softmax → Low · Eye-level · High · Overhead · Dutch" },
    { name: "Composition", tip: "softmax → Rule of thirds · Centered · Symmetrical · ..." },
    { name: "Focus", tip: "softmax → Shallow · Deep · Rack · Soft" },
    { name: "Lighting Dir.", tip: "softmax → Front · Side · Back · Top · Under" },
    { name: "Lighting Quality", tip: "sigmoid → Hard · Soft · Natural · Artificial" },
    { name: "Color Tone", tip: "softmax → Warm · Cool · Neutral · Mixed" },
    { name: "Saturation", tip: "softmax → Desaturated · Natural · Saturated · Hyper" },
    { name: "Color Key", tip: "softmax → High key · Low key · Normal" },
    { name: "Shot Type", tip: "softmax → Static · Pan · Tilt · Dolly · Tracking" },
    {
      name: "+9 more",
      tip: "Height · Lens · Level · Contrast · Cast · Edge · Silhouette · Subject · Location",
      muted: true,
    },
  ];

  const isSharedImageDimmed = (idx) => hover && hover.row !== idx;
  const isSharedImageHighlighted = (idx) => hover && hover.row === idx;

  const SharedImagePlaceholder = ({ idx }) => {
    const hl = isSharedImageHighlighted(idx);
    const dim = isSharedImageDimmed(idx);
    return (
      <div
        style={{
          width: 56,
          height: ROW_H,
          borderRadius: 3,
          position: "relative",
          overflow: "hidden",
          border: `1px solid ${hl ? accent + "0.4)" : textAt(0.1)}`,
          boxShadow: hl ? `0 0 12px ${accent}0.1)` : "none",
          background: sharedImages[idx].bg,
          opacity: dim ? 0.35 : 1,
          transition: "all 0.2s ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 4,
            background: "rgba(0,0,0,0.6)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 4,
            background: "rgba(0,0,0,0.6)",
          }}
        />
        <span
          style={{
            position: "absolute",
            bottom: 6,
            left: 5,
            fontFamily: FONT.mono,
            fontSize: 9,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          {sharedImages[idx].label}
        </span>
      </div>
    );
  };

  const TaskCard = ({ task, taskIdx }) => {
    const isThisTaskHovered = hover && hover.task === taskIdx;

    return (
      <div
        style={{
          border: `1px solid ${textAt(0.1)}`,
          borderRadius: 6,
          padding: "12px 14px",
          background: "rgba(255,255,255,0.015)",
          transition: "border-color 0.2s ease, background 0.2s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 10,
          }}
        >
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: 9,
              fontWeight: 500,
              color: accent + "1)",
              background: accent + "0.06)",
              border: `1px solid rgba(100,200,255,0.12)`,
              borderRadius: 3,
              padding: "2px 5px",
              letterSpacing: "0.04em",
            }}
          >
            TASK {task.num}
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              color: textAt(0.45),
            }}
          >
            {task.aspect}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {/* Mini matrix */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(3, ${CELL}px)`,
              gridTemplateRows: `repeat(3, ${CELL}px)`,
              gap: CELL_GAP,
            }}
          >
            {[0, 1, 2].map((row) =>
              [0, 1, 2].map((col) => {
                const isMatch = row === col;
                return (
                  <div
                    key={`${row}-${col}`}
                    style={{
                      width: CELL,
                      height: CELL,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 3,
                      fontFamily: FONT.mono,
                      fontSize: 8,
                      cursor: "default",
                      position: "relative",
                      background: isMatch ? accent + "0.1)" : textAt(0.06),
                      border: `1px solid ${
                        isMatch ? "rgba(100,200,255,0.15)" : "transparent"
                      }`,
                      color: isMatch ? accent + "1)" : textAt(0.18),
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={() => setHover({ task: taskIdx, row, col })}
                    onMouseLeave={() => setHover(null)}
                  >
                    {isMatch ? `v${row + 1}·t${col + 1}` : ""}
                  </div>
                );
              })
            )}
          </div>
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: 10,
              color: textAt(0.18),
            }}
          >
            ←
          </span>
          {/* Text embeddings */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: CELL_GAP,
            }}
          >
            {[0, 1, 2].map((i) => {
              const hl = isThisTaskHovered && hover.col === i;
              const dim = isThisTaskHovered && hover.col !== i;
              return (
                <div
                  key={i}
                  style={{
                    width: 24,
                    height: CELL,
                    border: `1px solid ${hl ? accent + "0.4)" : textAt(0.1)}`,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONT.mono,
                    fontSize: 8,
                    color: hl ? accent + "1)" : textAt(0.3),
                    background: textAt(0.06),
                    opacity: dim ? 0.35 : 1,
                    transition: "all 0.2s ease",
                  }}
                >
                  t{i + 1}
                </div>
              );
            })}
          </div>
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: 10,
              color: textAt(0.18),
            }}
          >
            ←
          </span>
          <div
            style={{
              width: 50,
              height: CELL * 3 + CELL_GAP * 2,
              border: `1px solid ${textAt(0.1)}`,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontFamily: FONT.mono,
              fontSize: 8,
              color: textAt(0.3),
              background: textAt(0.06),
              lineHeight: 1.3,
            }}
          >
            Text
            <br />
            Encoder
          </div>
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: 10,
              color: textAt(0.18),
            }}
          >
            ←
          </span>
          {/* Captions */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: CELL_GAP,
            }}
          >
            {task.captions.map((cap, i) => {
              const hl = isThisTaskHovered && hover.col === i;
              const dim = isThisTaskHovered && hover.col !== i;
              return (
                <div
                  key={i}
                  style={{
                    height: CELL,
                    display: "flex",
                    alignItems: "center",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 10,
                    whiteSpace: "nowrap",
                    color: hl ? accent + "1)" : textAt(0.3),
                    paddingLeft: 5,
                    borderLeft: `2px solid ${
                      hl ? accent + "0.4)" : "transparent"
                    }`,
                    opacity: dim ? 0.35 : 1,
                    transition: "all 0.2s ease",
                  }}
                >
                  {cap}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const pipelineRowGap = 4;
  const pipelineColH = ROW_H * 3 + pipelineRowGap * 2;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${textAt(0.06)}`,
        borderRadius: 12,
        padding: "32px 24px 24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: 0,
        }}
      >
        {/* Shared pipeline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          {/* Images */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {sharedImages.map((_, i) => (
              <div
                key={i}
                style={{
                  height: ROW_H,
                  marginBottom: pipelineRowGap,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <SharedImagePlaceholder idx={i} />
              </div>
            ))}
            <div
              style={{
                fontFamily: FONT.mono,
                fontSize: 9,
                color: textAt(0.18),
                textAlign: "center",
                marginTop: 4,
                letterSpacing: "0.04em",
              }}
            >
              batch
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 20,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: FONT.mono,
                fontSize: 12,
                color: textAt(0.18),
              }}
            >
              →
            </span>
          </div>
          <div
            style={{
              width: 72,
              height: pipelineColH,
              border: `1px solid ${textAt(0.1)}`,
              borderRadius: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontFamily: FONT.mono,
              fontSize: 10,
              fontWeight: 500,
              color: textAt(0.45),
              lineHeight: 1.4,
              background: textAt(0.06),
            }}
          >
            Vision
            <br />
            Encoder
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 20,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: FONT.mono,
                fontSize: 12,
                color: textAt(0.18),
              }}
            >
              →
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  height: ROW_H,
                  marginBottom: pipelineRowGap,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: ROW_H,
                    border: `1px solid ${textAt(0.1)}`,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONT.mono,
                    fontSize: 11,
                    color: textAt(0.45),
                    background: textAt(0.06),
                  }}
                >
                  v{i + 1}
                </div>
              </div>
            ))}
            <div
              style={{
                fontFamily: FONT.mono,
                fontSize: 9,
                color: textAt(0.18),
                textAlign: "center",
                marginTop: 4,
                letterSpacing: "0.04em",
              }}
            >
              shared
            </div>
          </div>
        </div>

        {/* Task branches */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: 12,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              flexShrink: 0,
            }}
          >
            {tasks.map((task, i) => (
              <React.Fragment key={task.num}>
                <TaskCard task={task} taskIdx={i} />
                {i === 1 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "4px 14px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT.mono,
                        fontSize: 16,
                        color: textAt(0.18),
                        letterSpacing: 3,
                      }}
                    >
                      ⋮
                    </span>
                    <span
                      style={{
                        fontFamily: FONT.mono,
                        fontSize: 10,
                        color: textAt(0.18),
                      }}
                    >
                      8 CLIP tasks total — each attending to a distinct aspect
                    </span>
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* Classifiers */}
            <div
              style={{
                marginTop: 4,
                border: `1px solid ${textAt(0.1)}`,
                borderRadius: 6,
                padding: "12px 14px",
                background: "rgba(255,255,255,0.015)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: 9,
                    fontWeight: 500,
                    color: warm + "1)",
                    background: warm + "0.08)",
                    border: `1px solid ${warm}0.15)`,
                    borderRadius: 3,
                    padding: "2px 5px",
                    letterSpacing: "0.04em",
                  }}
                >
                  ×19
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    fontWeight: 500,
                    color: textAt(0.45),
                  }}
                >
                  Classification Heads
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 5,
                }}
              >
                {classifierChips.map((chip) => (
                  <div
                    key={chip.name}
                    title={chip.tip}
                    style={{
                      fontFamily: FONT.mono,
                      fontSize: 9,
                      color: chip.muted ? textAt(0.18) : textAt(0.3),
                      background: textAt(0.06),
                      border: `1px solid ${
                        chip.muted ? textAt(0.06) : textAt(0.1)
                      }`,
                      borderRadius: 3,
                      padding: "3px 6px",
                      cursor: "default",
                    }}
                  >
                    {chip.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loss annotation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginTop: 16,
        }}
      >
        <span
          style={{
            fontFamily: FONT.mono,
            fontSize: 10,
            letterSpacing: "0.04em",
            padding: "4px 10px",
            borderRadius: 20,
            color: accent + "1)",
            background: accent + "0.06)",
            border: `1px solid rgba(100,200,255,0.12)`,
          }}
        >
          8× Contrastive Loss
        </span>
        <span
          style={{
            fontFamily: FONT.mono,
            fontSize: 14,
            color: textAt(0.18),
          }}
        >
          +
        </span>
        <span
          style={{
            fontFamily: FONT.mono,
            fontSize: 10,
            letterSpacing: "0.04em",
            padding: "4px 10px",
            borderRadius: 20,
            color: warm + "1)",
            background: warm + "0.06)",
            border: `1px solid ${warm}0.12)`,
          }}
        >
          19× Classification Loss
        </span>
      </div>
      <div
        style={{
          fontFamily: FONT.mono,
          fontSize: 11,
          color: textAt(0.18),
          marginTop: 14,
          textAlign: "center",
        }}
      >
        Hover over matrix cells or classifier chips to explore
      </div>
    </div>
  );
}

