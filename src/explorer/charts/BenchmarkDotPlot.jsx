import React, { useState } from "react";
import { BENCHMARK_DATA, BENCHMARK_MODELS, getBenchmarkStats, SECTIONS } from "../data.js";
import { COLOR, CHART, BENCHMARK_DOT_PLOT } from "../styles.js";

const S = BENCHMARK_DOT_PLOT;

export function BenchmarkTooltip({ tooltip }) {
  if (!tooltip) return null;
  const isOurs = tooltip.type === "ours";
  const isBaseline = tooltip.type === "baseline";
  const model = tooltip.model;
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
        padding: T.padding,
        fontSize: T.fontSize,
        fontFamily: T.fontFamily,
        color: T.color,
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: T.zIndex,
        lineHeight: T.lineHeight,
      }}
    >
      <div style={{ fontWeight: 600, color: isOurs ? T.oursNameColor : isBaseline ? T.baselineNameColor : T.defaultNameColor }}>
        {tooltip.name}
      </div>
      {model && model.arch && (
        <div style={{ color: T.archColor }}>
          {model.arch}{model.pretrained ? ` (${model.pretrained})` : ""}
        </div>
      )}
      <div style={{ color: isOurs ? T.oursAccColor : T.defaultAccColor }}>
        {(tooltip.acc * 100).toFixed(1)}%
      </div>
    </div>
  );
}

export default function BenchmarkDotPlot({ categoryId, width = S.defaultWidth }) {
  const [tooltip, setTooltip] = useState(null);
  const data = BENCHMARK_DATA[categoryId];
  if (!data) return null;

  const stats = getBenchmarkStats(data);
  const height = Math.round(width * S.aspectMultiplier);

  const pad = S.pad;
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const xScale = (v) => pad.left + innerW * v;
  const centerY = pad.top + innerH / 2;

  const jitter = [-6, -4.5, -3, -1.5, 0, 1.5, 3, 4.5, 6];

  const gapPct = Math.round(stats.gap * 100);
  const gapSign = gapPct >= 0 ? "+" : "";

  return (
    <div style={{ position: "relative", width, marginTop: S.marginTop }}>
      <svg width={width} height={height}>
        {/* Gridlines + axis labels */}
        {[0, 0.25, 0.5, 0.75, 1.0].map((v) => (
          <g key={v}>
            <line
              x1={xScale(v)} y1={pad.top}
              x2={xScale(v)} y2={height - pad.bottom}
              stroke={CHART.gridline.stroke} strokeWidth={CHART.gridline.strokeWidth}
            />
            <text
              x={xScale(v)} y={height - pad.bottom + 13}
              textAnchor="middle"
              fill={CHART.axisLabel.fill}
              fontSize={S.axisLabelFontSize}
              fontFamily={CHART.fontFamily}
            >
              {Math.round(v * 100)}
            </text>
          </g>
        ))}

        {/* Random baseline */}
        <line
          x1={xScale(data[0])} y1={pad.top}
          x2={xScale(data[0])} y2={height - pad.bottom}
          stroke={CHART.baseline.stroke} strokeWidth={CHART.baseline.strokeWidth}
          strokeDasharray="4 3"
        />
        <text
          x={xScale(data[0])} y={pad.top - 5}
          textAnchor="middle"
          fill={CHART.axisLabel.fill}
          fontSize={S.baselineFontSize}
          fontFamily={CHART.fontFamily}
        >
          random
        </text>

        {/* Gap connector */}
        {stats.gap !== 0 && (
          <line
            x1={xScale(stats.bestExisting)} y1={centerY}
            x2={xScale(stats.best)} y2={centerY}
            stroke={stats.gap > 0 ? CHART.gap.positiveStroke : CHART.gap.negativeStroke}
            strokeWidth={CHART.dumbbell.strokeWidth}
          />
        )}

        {/* Gap annotation */}
        {stats.gap !== 0 && (
          <text
            x={(xScale(stats.bestExisting) + xScale(stats.best)) / 2}
            y={centerY - 8}
            textAnchor="middle"
            fill={stats.gap > 0 ? CHART.gap.positiveFill : CHART.gap.negativeFill}
            fontSize={S.gapFontSize}
            fontFamily={CHART.fontFamily}
            fontWeight={600}
          >
            {gapSign}{gapPct}%
          </text>
        )}

        {/* Competitor dots */}
        {data.slice(1, 10).map((acc, i) => {
          if (acc == null) return null;
          const cx = xScale(acc);
          const cy = centerY + jitter[i];
          const isBest = acc === stats.bestExisting;
          const r = isBest ? S.competitorRadiusBest : S.competitorRadiusDefault;
          const isHovered = tooltip?.idx === i + 1;
          return (
            <circle
              key={i} cx={cx} cy={cy} r={r}
              fill={isHovered ? CHART.dot.competitorHovered : isBest ? CHART.dot.competitorBest.fill : CHART.dot.competitorDefault.fill}
              stroke={isBest ? CHART.dot.competitorBest.stroke : CHART.dot.competitorDefault.stroke}
              strokeWidth={isBest ? CHART.dot.competitorBest.strokeWidth : CHART.dot.competitorDefault.strokeWidth}
              style={{ cursor: "pointer", transition: "fill 0.15s" }}
              onMouseEnter={() => setTooltip({ idx: i + 1, x: cx, y: cy, name: BENCHMARK_MODELS[i + 1].name, acc, type: "competitor", model: BENCHMARK_MODELS[i + 1] })}
              onMouseLeave={() => setTooltip(null)}
            />
          );
        })}

        {/* CinemaCLIP dumbbell */}
        {(() => {
          const zs = stats.cinemaclip;
          const cl = stats.classifier;
          const hasCl = cl != null;
          const higher = hasCl ? Math.max(zs, cl) : zs;
          return (
            <>
              {hasCl && Math.abs(zs - cl) > 0.005 && (
                <line
                  x1={xScale(zs)} y1={centerY} x2={xScale(cl)} y2={centerY}
                  stroke={CHART.dumbbell.stroke} strokeWidth={CHART.dumbbell.strokeWidth}
                />
              )}
              <circle
                cx={xScale(zs)} cy={centerY} r={S.oursRadius}
                fill={CHART.dot.oursZeroShot.fill} stroke={CHART.dot.oursZeroShot.stroke}
                strokeWidth={S.oursZeroShotStrokeWidth}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setTooltip({ idx: 10, x: xScale(zs), y: centerY, name: "CinemaCLIP (zero-shot)", acc: zs, type: "ours", model: BENCHMARK_MODELS[10] })}
                onMouseLeave={() => setTooltip(null)}
              />
              {hasCl && (
                <circle
                  cx={xScale(cl)} cy={centerY} r={S.oursRadius}
                  fill={CHART.dot.oursClassifier.fill} stroke={CHART.dot.oursClassifier.stroke}
                  strokeWidth={S.oursClassifierStrokeWidth}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setTooltip({ idx: 11, x: xScale(cl), y: centerY, name: "CinemaCLIP (classifier)", acc: cl, type: "ours", model: BENCHMARK_MODELS[10] })}
                  onMouseLeave={() => setTooltip(null)}
                />
              )}
              <text
                x={xScale(higher)} y={centerY - S.valueLabelOffset}
                textAnchor="middle"
                fill={CHART.valueLabel.fill}
                fontSize={S.valueFontSize}
                fontFamily={CHART.fontFamily}
                fontWeight={CHART.valueLabel.fontWeight}
              >
                {Math.round(higher * 100)}%
              </text>
            </>
          );
        })()}
      </svg>
      <BenchmarkTooltip tooltip={tooltip} />
    </div>
  );
}
