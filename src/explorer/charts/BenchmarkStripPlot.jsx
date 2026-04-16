import React, { useState } from "react";
import { BENCHMARK_DATA, BENCHMARK_MODELS, getBenchmarkStats, SECTIONS, CATEGORY_DISPLAY_NAMES } from "../data.js";
import { CHART, BENCHMARK_STRIP_PLOT } from "../styles.js";
import { BenchmarkTooltip } from "./BenchmarkDotPlot.jsx";

const S = BENCHMARK_STRIP_PLOT;

export default function BenchmarkStripPlot({ categoryId, width = S.defaultWidth, height = S.defaultHeight }) {
  const [tooltip, setTooltip] = useState(null);
  const data = BENCHMARK_DATA[categoryId];
  if (!data) return null;

  const stats = getBenchmarkStats(data);
  const categoryName = CATEGORY_DISPLAY_NAMES[categoryId] || categoryId;

  const pad = S.pad;
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const yScale = (v) => pad.top + innerH * (1 - v);
  const centerX = pad.left + innerW / 2;

  const jitter = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

  const gapPct = Math.round(stats.gap * 100);
  const gapSign = gapPct >= 0 ? "+" : "";

  const zeroShot = stats.cinemaclip;
  const classifier = stats.classifier;
  const hasClassifier = classifier != null;
  const bestVal = stats.best;
  const higherVal = hasClassifier ? Math.max(zeroShot, classifier) : zeroShot;

  return (
    <div style={{ position: "relative", width, height }}>
      <svg width={width} height={height}>
        {/* Y-axis gridlines + labels */}
        {[0, 0.25, 0.5, 0.75, 1.0].map((v) => (
          <g key={v}>
            <line
              x1={pad.left} y1={yScale(v)} x2={width - pad.right} y2={yScale(v)}
              stroke={CHART.gridline.stroke} strokeWidth={CHART.gridline.strokeWidth}
            />
            <text
              x={pad.left - 5} y={yScale(v) + 3}
              textAnchor="end"
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
          x1={pad.left} y1={yScale(data[0])} x2={width - pad.right} y2={yScale(data[0])}
          stroke={CHART.baseline.stroke} strokeWidth={CHART.baseline.strokeWidth}
          strokeDasharray="3 2"
        />
        <text
          x={width - pad.right} y={yScale(data[0]) - 4}
          textAnchor="end"
          fill={CHART.baselineLabelColor}
          fontSize={S.baselineFontSize}
          fontFamily={CHART.fontFamily}
        >
          random
        </text>

        {/* Gap connector */}
        {stats.gap !== 0 && (
          <line
            x1={centerX} y1={yScale(stats.bestExisting)} x2={centerX} y2={yScale(bestVal)}
            stroke={stats.gap > 0 ? CHART.gap.positiveStroke : CHART.gap.negativeStroke}
            strokeWidth={CHART.dumbbell.strokeWidth}
          />
        )}

        {/* Gap annotation */}
        {stats.gap !== 0 && (
          <text
            x={centerX + 14} y={(yScale(stats.bestExisting) + yScale(bestVal)) / 2 + 3}
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
          const cx = centerX + jitter[i];
          const cy = yScale(acc);
          const isBest = acc === stats.bestExisting;
          const isHovered = tooltip?.idx === i + 1;
          const r = isBest ? S.competitorRadiusBest : S.competitorRadiusDefault;
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

        {/* Dumbbell connector */}
        {hasClassifier && Math.abs(zeroShot - classifier) > 0.005 && (
          <line
            x1={centerX} y1={yScale(zeroShot)} x2={centerX} y2={yScale(classifier)}
            stroke={CHART.dumbbell.stroke} strokeWidth={CHART.dumbbell.strokeWidth}
          />
        )}

        {/* Zero-shot dot */}
        <circle
          cx={centerX} cy={yScale(zeroShot)} r={S.oursRadius}
          fill={CHART.dot.oursZeroShot.fill} stroke={CHART.dot.oursZeroShot.stroke}
          strokeWidth={S.oursZeroShotStrokeWidth}
          style={{ cursor: "pointer" }}
          onMouseEnter={() => setTooltip({ idx: 10, x: centerX, y: yScale(zeroShot), name: "CinemaCLIP (zero-shot)", acc: zeroShot, type: "ours", model: BENCHMARK_MODELS[10] })}
          onMouseLeave={() => setTooltip(null)}
        />

        {/* Classifier dot */}
        {hasClassifier && (
          <circle
            cx={centerX} cy={yScale(classifier)} r={S.oursRadius}
            fill={CHART.dot.oursClassifier.fill} stroke={CHART.dot.oursClassifier.stroke}
            strokeWidth={S.oursClassifierStrokeWidth}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setTooltip({ idx: 11, x: centerX, y: yScale(classifier), name: "CinemaCLIP (classifier)", acc: classifier, type: "ours", model: BENCHMARK_MODELS[10] })}
            onMouseLeave={() => setTooltip(null)}
          />
        )}

        {/* Value label */}
        <text
          x={centerX} y={yScale(higherVal) - S.valueLabelOffset}
          textAnchor="middle"
          fill={CHART.valueLabel.fill}
          fontSize={S.valueFontSize}
          fontFamily={CHART.fontFamily}
          fontWeight={CHART.valueLabel.fontWeight}
        >
          {Math.round(higherVal * 100)}%
        </text>

        {/* Category name */}
        <text
          x={width / 2} y={height - 6}
          textAnchor="middle"
          fill={CHART.categoryLabel.fill}
          fontSize={S.categoryFontSize}
          fontFamily={CHART.fontFamily}
        >
          {categoryName}
        </text>
      </svg>
      <BenchmarkTooltip tooltip={tooltip} />
    </div>
  );
}
