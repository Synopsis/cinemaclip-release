# Text Similarity Matrices — Developer Guide

This document covers the text encoder similarity heatmaps in `TextSimilarityMatrices.jsx` and their data in `data.js`.

## What these show

Cosine similarity between text embeddings for terms within a taxonomy, comparing CinemaCLIP vs MobileCLIP (pre-trained). The key insight: CinemaCLIP clusters cinematic terms tightly (high similarity → bright cells), while MobileCLIP does the same for non-cinematic terms like dog breeds. The pattern reverses between the two domains.

## File structure

| File | Role |
|------|------|
| `data.js` → `TEXT_SIMILARITY_MATRICES` | Raw similarity values, labels, and metadata |
| `TextSimilarityMatrices.jsx` | Two named exports: `CinematicSimilarityMatrices` (tabbed) and `NonCinematicSimilarityMatrices` |
| `explorer-v1.jsx` | Wires them into the page with prose between the two sections |

## Data format

Each entry in `TEXT_SIMILARITY_MATRICES`:

```js
{
  id: "shot-framing",       // unique key
  title: "Shot Framing",    // display name
  type: "cinematic",        // or "non-cinematic" — controls which export renders it
  labels: ["Extreme Wide", "Wide", ...],  // row labels (no column labels — matrix is symmetric)
  cinemaclip: [[1.00, 0.89, ...], ...],   // NxN similarity matrix
  mobileclip: [[1.00, 0.86, ...], ...],   // NxN similarity matrix
}
```

Adding a new matrix: push another object to `TEXT_SIMILARITY_MATRICES` with `type: "cinematic"` or `"non-cinematic"`. Cinematic ones appear as tabs; non-cinematic ones stack vertically.

## Color mapping

Both models use the same single warm amber palette — intentional so the comparison is purely about the pattern, not about which color "belongs" to which model.

### `cellColor(value)`

1. Diagonal cells (value = 1.0) → neutral `rgba(255,255,255,0.05)`, intentionally de-emphasized
2. Off-diagonal: non-linear power curve maps value to color intensity

```
t = ((value - 0.3) / 0.7) ^ 1.8
```

- **Floor at 0.3**: values below 0.3 are treated as 0 (none exist in the current data)
- **Exponent 1.8**: compresses low values and stretches high values, making the 0.5–0.9 range visually dramatic
- The RGB channels interpolate from near-black `(40, 25, 20)` to bright amber `(255, 200, 120)`
- Alpha ranges from 0.05 to 0.90

### `textColor(value)`

Uses the same `t` curve. Flips to dark text (`rgba(0,0,0,0.6)`) on bright cells (t > 0.55) for readability.

### Tuning the palette

To adjust visual contrast:
- **More dramatic**: increase the exponent (e.g. 2.2). Low values get darker, high values stay bright.
- **Less dramatic**: decrease the exponent (e.g. 1.4). More even distribution.
- **Shift the floor**: change `0.3` to include/exclude lower similarity values from the visible range.
- **Change the hue**: modify the RGB channel formulas. Current values produce warm amber. For a cooler look, swap the R and B interpolation ranges.

## Layout dimensions

| Constant | Value | Purpose |
|----------|-------|---------|
| `CELL` | 46px | Cell width and height |
| `LABEL_W` | 108px | Row label column width |
| `GAP` | 2px | Gap between cells |

These are tight for 6–7 label matrices. If adding a taxonomy with more labels (8+), consider reducing `CELL` to 40px or abbreviating labels.

## Component architecture

```
CinematicSimilarityMatrices (stateful — manages active tab)
  └── MatrixPair (side-by-side layout)
        ├── SimilarityHeatmap (CinemaCLIP)
        └── SimilarityHeatmap (MobileCLIP)

NonCinematicSimilarityMatrices (stateless)
  └── MatrixPair × N
        ├── SimilarityHeatmap (CinemaCLIP)
        └── SimilarityHeatmap (MobileCLIP)
```

### Tab interface

The cinematic section uses a tabbed selector matching the `SectionNav` style (Instrument Serif italic, `/` separator, underline on active). Tabs are derived from `TEXT_SIMILARITY_MATRICES` entries with `type: "cinematic"` — adding a new cinematic matrix automatically adds a tab.

### Labels

Only row labels are shown (left side, right-aligned, JetBrains Mono 9px). Column labels were removed because the matrix is symmetric — the reader can cross-reference by position. This was a deliberate choice to keep the grid compact and avoid ugly rotated text.

## Page integration (`explorer-v1.jsx`)

The section sits after the general knowledge retention discussion. The flow is:

1. **Prose** — heading + two paragraphs (intro + cinematic insight)
2. **Visual** — `CinematicSimilarityMatrices` (tabbed, visual-width)
3. **Prose** — two paragraphs (transition to non-cinematic discussion)
4. **Visual** — `NonCinematicSimilarityMatrices` + caption

The section has TOC id `text-encoder` under the "Benchmarks" group.
