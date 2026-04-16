import React, { useState, useRef } from "react";
import { SORTED_DATA, BENCHMARK_MODELS } from "../data.js";
import { COLOR, CHART, OVERALL_ACCURACY_PLOT } from "../styles.js";

const S = OVERALL_ACCURACY_PLOT;

function OverallAccuracyTooltip({ tooltip }) {
  if (!tooltip) return null;
  const d = tooltip.data;
  const isOurs = d.isOurs;
  const isBaseline = d.isBaseline;
  const T = CHART.tooltip;
  return (
    <div
      style={{
        position: "absolute",
        left: tooltip.x,
        top: tooltip.y - 10,
        transform: "translate(-50%, -100%)",
        background: T.background,
        border: isOurs ? T.oursBorder : T.defaultBorder,
        borderRadius: T.borderRadius,
        padding: S.tooltipPadding,
        fontSize: T.fontSize,
        fontFamily: T.fontFamily,
        color: T.color,
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: T.zIndex,
        lineHeight: S.tooltipLineHeight,
      }}
    >
      <div style={{ fontWeight: 600, color: isOurs ? T.oursNameColor : T.defaultNameColor }}>
        {d.name}{tooltip.variant ? ` (${tooltip.variant})` : ""}
      </div>
      {!isBaseline && d.arch && (
        <div style={{ color: S.tooltipArchColor }}>
          {d.arch}{d.pretrained ? ` (${d.pretrained})` : ""}
        </div>
      )}
      <div style={{ color: isOurs ? T.oursAccColor : T.defaultAccColor }}>
        Accuracy: {(tooltip.acc * 100).toFixed(1)}%
      </div>
      {d.flops != null && (
        <div style={{ color: T.flopsColor }}>
          {d.flops}B FLOPs
        </div>
      )}
    </div>
  );
}

export default function OverallAccuracyDotPlot() {
  const [tooltip, setTooltip] = useState(null);
  const containerRef = useRef(null);
  const sorted = SORTED_DATA;
  const cinemaclip = sorted.find(d => d.isOurs);
  const nextBest = sorted.find(d => !d.isOurs && !d.isBaseline);
  const zeroShotGap = cinemaclip && nextBest
    ? Math.round((cinemaclip.accuracy - nextBest.accuracy) * 100) : 0;
  const classifierGap = cinemaclip && nextBest && cinemaclip.classifierAccuracy
    ? Math.round((cinemaclip.classifierAccuracy - nextBest.accuracy) * 100) : 0;

  const pad = S.pad;
  const rowH = S.rowHeight;
  const innerW = S.innerWidth;
  const svgW = pad.left + innerW + pad.right;
  const svgH = pad.top + sorted.length * rowH + pad.bottom;

  const accMax = S.accMax;
  const x = (acc) => pad.left + (acc / accMax) * innerW;
  const y = (i) => pad.top + i * rowH + rowH / 2;

  const gridVals = [0, 0.25, 0.50, 0.75];
  const refX = nextBest ? x(nextBest.accuracy) : null;

  const handleDotHover = (e, data, acc, variant) => {
    const svgEl = e.target.closest("svg");
    const rect = svgEl.getBoundingClientRect();
    const containerRect = svgEl.parentElement.getBoundingClientRect();
    const scaleX = rect.width / svgW;
    const scaleY = rect.height / svgH;
    const cx = parseFloat(e.target.getAttribute("cx"));
    const cy = parseFloat(e.target.getAttribute("cy"));
    setTooltip({
      x: (cx * scaleX) + (rect.left - containerRect.left),
      y: (cy * scaleY) + (rect.top - containerRect.top),
      data, acc, variant,
    });
  };

  return (
    <div style={{ position: "relative" }} ref={containerRef}>
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      style={{ width: "100%", maxWidth: S.maxWidth, display: "block", margin: "0 auto" }}
    >
      {/* Vertical gridlines */}
      {gridVals.map(val => (
        <line key={val}
          x1={x(val)} y1={pad.top} x2={x(val)} y2={svgH - pad.bottom}
          stroke={CHART.gridline.stroke} strokeWidth={CHART.gridline.strokeWidth}
        />
      ))}

      {/* Reference line at next-best accuracy */}
      {refX && (
        <line
          x1={refX} y1={pad.top} x2={refX} y2={svgH - pad.bottom}
          stroke={S.refLineStroke} strokeWidth={CHART.gridline.strokeWidth}
          strokeDasharray={S.refLineDash}
        />
      )}

      {/* Rows */}
      {sorted.map((d, i) => {
        const isOurs = d.isOurs;
        const isBaseline = d.isBaseline;
        const hasDumbbell = isOurs && d.classifierAccuracy;

        if (isOurs && hasDumbbell) {
          const zX = x(d.accuracy);
          const cX = x(d.classifierAccuracy);
          const cy = y(i);

          return (
            <g key={i}>
              <line x1={pad.left} y1={cy} x2={zX} y2={cy}
                stroke={S.oursConnectorStroke} strokeWidth={S.oursConnectorStrokeWidth}
              />
              <line x1={zX} y1={cy} x2={cX} y2={cy}
                stroke={CHART.dumbbell.stroke} strokeWidth={CHART.dumbbell.strokeWidth}
              />
              <text x={pad.left - S.modelNameOffset} y={cy} textAnchor="end"
                fill={S.oursModelName.fill} fontSize={S.oursModelName.fontSize}
                fontFamily={CHART.fontFamily} fontWeight={S.oursModelName.fontWeight}
                dominantBaseline="middle"
              >
                {d.name}
              </text>
              <circle cx={zX} cy={cy} r={S.oursRadius}
                fill={CHART.dot.oursZeroShot.fill} stroke={S.zeroShotDotStroke}
                strokeWidth={S.oursZeroShotStrokeWidth}
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => handleDotHover(e, d, d.accuracy, "zero-shot")}
                onMouseLeave={() => setTooltip(null)}
              />
              <circle cx={cX} cy={cy} r={S.oursRadius}
                fill={CHART.dot.oursClassifier.fill} stroke={CHART.dot.oursClassifier.stroke}
                strokeWidth={S.oursClassifierStrokeWidth}
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => handleDotHover(e, d, d.classifierAccuracy, "classifiers")}
                onMouseLeave={() => setTooltip(null)}
              />
              <text x={zX - 12} y={cy - 20} textAnchor="end"
                fill={CHART.valueLabel.fill} fontSize={S.valueFontSize}
                fontFamily={CHART.fontFamily} fontWeight={CHART.valueLabel.fontWeight}
              >
                {Math.round(d.accuracy * 100)}%
              </text>
              <text x={zX - 12} y={cy - 6} textAnchor="end"
                fill={S.zeroShotLabelColor} fontSize={S.inlineLabelFontSize}
                fontFamily={CHART.fontFamily}
              >
                zero-shot
              </text>
              <text x={zX - 12} y={cy + 16} textAnchor="end"
                fill={S.zeroShotGapColor} fontSize={S.gapFontSize}
                fontFamily={CHART.fontFamily}
              >
                +{zeroShotGap}%
              </text>
              <text x={cX + 12} y={cy - 20} textAnchor="start"
                fill={S.classifierValueColor} fontSize={S.valueFontSize}
                fontFamily={CHART.fontFamily} fontWeight={CHART.valueLabel.fontWeight}
              >
                {Math.round(d.classifierAccuracy * 100)}%
              </text>
              <text x={cX + 12} y={cy - 6} textAnchor="start"
                fill={S.classifierLabelColor} fontSize={S.inlineLabelFontSize}
                fontFamily={CHART.fontFamily}
              >
                classifiers
              </text>
              <text x={cX + 12} y={cy + 16} textAnchor="start"
                fill={S.classifierGapColor} fontSize={S.gapFontSize}
                fontFamily={CHART.fontFamily}
              >
                +{classifierGap}%
              </text>
            </g>
          );
        }

        const dotR = isBaseline ? S.baselineRadius : S.competitorRadius;
        const dotFill = isBaseline ? S.baselineFill : S.competitorFill;
        const nameStyle = isBaseline ? S.baselineModelName : S.competitorModelName;

        return (
          <g key={i}>
            <line x1={pad.left} y1={y(i)} x2={x(d.accuracy)} y2={y(i)}
              stroke={S.connectorStroke} strokeWidth={S.connectorStrokeWidth}
            />
            <text x={pad.left - S.modelNameOffset} y={y(i)} textAnchor="end"
              fill={nameStyle.fill} fontSize={nameStyle.fontSize}
              fontFamily={CHART.fontFamily} fontWeight={nameStyle.fontWeight}
              dominantBaseline="middle"
            >
              {d.name}
            </text>
            <circle cx={x(d.accuracy)} cy={y(i)} r={dotR}
              fill={tooltip?.data === d ? CHART.dot.competitorHovered : dotFill}
              style={{ cursor: isBaseline ? "default" : "pointer", transition: "fill 0.15s" }}
              onMouseEnter={(e) => handleDotHover(e, d, d.accuracy)}
              onMouseLeave={() => setTooltip(null)}
            />
          </g>
        );
      })}

      {/* X-axis labels */}
      {gridVals.map(val => (
        <text key={val} x={x(val)} y={svgH - pad.bottom + 14}
          textAnchor="middle" fill={CHART.axisLabel.fill}
          fontSize={S.gapFontSize} fontFamily={CHART.fontFamily}
        >
          {Math.round(val * 100)}%
        </text>
      ))}
    </svg>
    <OverallAccuracyTooltip tooltip={tooltip} />
    </div>
  );
}
