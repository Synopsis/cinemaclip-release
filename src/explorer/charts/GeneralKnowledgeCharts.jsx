import React from "react";
import { COLOR, CHART, GENERAL_KNOWLEDGE_CHARTS } from "../styles.js";

const S = GENERAL_KNOWLEDGE_CHARTS;

// ── Summary data ──────────────────────────────────────────────────────────────

const EXTERNAL = [
  { label: "ImageNet-1K", subtitle: "1000 classes", ft: 63.35, pt: 71.2 },
];

const INTERNAL = [
  { label: "Simplified", subtitle: "7 tasks", ft: 64.4, pt: 55.2 },
  { label: "Fine-Grained", subtitle: "22 tasks", ft: 57.5, pt: 51.4 },
  { label: "Faces Only", subtitle: "9 tasks", ft: 57.4, pt: 53.3 },
];

function StripChart({ d, chartW, chartH }) {
  const pad = S.pad;
  const innerH = chartH - pad.top - pad.bottom;
  const innerW = chartW - pad.left - pad.right;
  const centerX = pad.left + innerW / 2;
  const { min: yMin, max: yMax } = S.yRange;
  const yScale = (v) => pad.top + innerH * (1 - (v - yMin) / (yMax - yMin));

  const delta = +(d.ft - d.pt).toFixed(1);
  const isPositive = delta >= 0;
  const higher = Math.max(d.ft, d.pt);
  const lower = Math.min(d.ft, d.pt);

  return (
    <svg width={chartW} height={chartH} style={{ display: "block" }}>
      {/* Y-axis gridlines + labels */}
      {[40, 50, 60, 70, 80].map((v) => (
        <g key={v}>
          <line
            x1={pad.left} y1={yScale(v)} x2={chartW - pad.right} y2={yScale(v)}
            stroke={CHART.gridline.stroke} strokeWidth={CHART.gridline.strokeWidth}
          />
          <text
            x={pad.left - 5} y={yScale(v) + 3}
            textAnchor="end" fill={CHART.axisLabel.fill}
            fontSize={S.axisLabelFontSize} fontFamily={CHART.fontFamily}
          >
            {v}
          </text>
        </g>
      ))}

      {/* Dumbbell connector */}
      <line
        x1={centerX} y1={yScale(d.ft)} x2={centerX} y2={yScale(d.pt)}
        stroke={isPositive ? CHART.gap.positiveStroke : CHART.gap.negativeStroke}
        strokeWidth={CHART.dumbbell.strokeWidth}
      />

      {/* Pre-trained dot */}
      <circle cx={centerX} cy={yScale(d.pt)} r={S.preTrained.radius}
        fill={S.preTrained.fill} stroke={S.preTrained.stroke}
        strokeWidth={S.preTrained.strokeWidth}
      />

      {/* Fine-tuned dot */}
      <circle cx={centerX} cy={yScale(d.ft)} r={S.fineTuned.radius}
        fill={COLOR.accent} stroke={COLOR.accentDim}
        strokeWidth={S.fineTuned.strokeWidth}
      />

      {/* Value label: fine-tuned */}
      <text
        x={centerX} y={d.ft >= d.pt ? yScale(d.ft) - 9 : yScale(d.ft) + 14}
        textAnchor="middle" fill={COLOR.accent}
        fontSize={S.fineTuned.valueFontSize} fontFamily={CHART.fontFamily}
        fontWeight={CHART.valueLabel.fontWeight}
      >
        {d.ft.toFixed(1)}%
      </text>

      {/* Value label: pre-trained */}
      <text
        x={centerX} y={d.pt > d.ft ? yScale(d.pt) - 9 : yScale(d.pt) + 14}
        textAnchor="middle" fill={S.preTrained.valueFill}
        fontSize={S.preTrained.valueFontSize} fontFamily={CHART.fontFamily}
      >
        {d.pt.toFixed(1)}%
      </text>

      {/* Delta annotation */}
      <text
        x={centerX + 16} y={(yScale(higher) + yScale(lower)) / 2 + 3}
        fill={isPositive ? CHART.gap.positiveFill : CHART.gap.negativeFill}
        fontSize={S.deltaFontSize} fontFamily={CHART.fontFamily}
        fontWeight={CHART.valueLabel.fontWeight}
      >
        {isPositive ? "+" : ""}{delta}
      </text>

      {/* Category label */}
      <text
        x={chartW / 2} y={chartH - 14}
        textAnchor="middle" fill={S.categoryLabel.fill}
        fontSize={S.categoryLabel.fontSize} fontFamily={CHART.fontFamily}
        fontWeight={S.categoryLabel.fontWeight}
      >
        {d.label}
      </text>

      {/* Subtitle */}
      <text
        x={chartW / 2} y={chartH - 4}
        textAnchor="middle" fill={S.subtitle.fill}
        fontSize={S.subtitle.fontSize} fontFamily={CHART.fontFamily}
      >
        {d.subtitle}
      </text>
    </svg>
  );
}

function ChartGroup({ label, items, chartW, chartH }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={S.groupLabel}>
        {label}
      </div>
      <div style={{ display: "flex", gap: S.chartGap }}>
        {items.map((d) => (
          <StripChart key={d.label} d={d} chartW={chartW} chartH={chartH} />
        ))}
      </div>
    </div>
  );
}

export default function GeneralKnowledgeCharts() {
  const chartW = S.chartWidth;
  const chartH = S.chartHeight;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 0,
      }}
    >
      <ChartGroup label="External" items={EXTERNAL} chartW={chartW} chartH={chartH} />

      {/* Separator */}
      <div style={S.separator} />

      <ChartGroup label="Internal (39 non-cinematic tasks)" items={INTERNAL} chartW={chartW} chartH={chartH} />

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: S.legend.gap,
          marginLeft: S.legend.marginLeft,
          paddingTop: S.legend.paddingTop,
          fontFamily: S.legend.fontFamily,
          fontSize: S.legend.fontSize,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: S.legend.dotSize, height: S.legend.dotSize, borderRadius: "50%", background: COLOR.accent, flexShrink: 0 }} />
          <span style={{ color: S.legend.labelColor, whiteSpace: "nowrap" }}>CinemaCLIP</span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: S.legend.dotSize, height: S.legend.dotSize, borderRadius: "50%", background: S.legend.preDotColor, flexShrink: 0 }} />
          <span style={{ color: S.legend.labelColor, whiteSpace: "nowrap" }}>Pre-Trained</span>
        </span>
      </div>
    </div>
  );
}
