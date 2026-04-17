// ─── Design Tokens ──────────────────────────────────────────────────────────
// Single source of truth for all visual styling in the blog post.
// Change a font, color, or spacing value here and it updates everywhere.

import { MONO, SERIF, LAYOUT, CHART_ACCENT, CHART_ACCENT_DIM, CHART_ACCENT_GLOW } from "./constants.js";
import { PIXMO_SOURCE_NAME, SHAREGPT4V_SOURCE_NAME } from "./data.js";

import fontOzuSans from "./assets/fonts/1bcd8637363caedc-s.p.woff2";       // OZU-Sans 400
import fontOzuDisplay from "./assets/fonts/79d898901754430b-s.p.woff2";    // OZU-Display 700

if (typeof document !== "undefined" && !document.getElementById("ozu-font-faces")) {
  const style = document.createElement("style");
  style.id = "ozu-font-faces";
  style.textContent = `
    @font-face {
      font-family: 'OZU-Sans';
      src: url(${fontOzuSans}) format('woff2');
      font-weight: 100;
    }
    @font-face {
      font-family: 'OZU-Display';
      src: url(${fontOzuDisplay}) format('woff2');
      font-weight: 100;
    }
  `;
  document.head.appendChild(style);
}

export const OZU_SANS    = "'OZU-Sans', system-ui, -apple-system, Helvetica, Arial, sans-serif";
export const OZU_DISPLAY = "'OZU-Display', 'OZU-Sans', system-ui, sans-serif";

// ─── Colors ─────────────────────────────────────────────────────────────────

const white = (a) => `rgba(255,255,255,${a})`;

export const COLOR = {
  bg:    "#0a0a0c",
  bgAlt: "#d9d9e5",

  // Text hierarchy — ordered by prominence
  text: {
    primary:   white(0.92),   // h1, h2
    strong:    white(0.85),   // h3, metadata values, table headings
    heading:   white(0.75),   // subtitle, subheadings
    mid:       white(0.65),   // table header text, secondary emphasis
    body:      white(0.60),   // paragraph text, table cells
    bodySecondary: white(0.55),
    secondary: white(0.40),   // metadata labels
    tertiary:  white(0.25),   // figure captions, axis labels
    ghost:     white(0.15),   // inactive TOC items, breadcrumb arrows
  },

  // UI surfaces — borders, dividers, backgrounds
  ui: {
    border:    white(0.08),   // standard borders, metadata shelf
    divider:   white(0.06),   // section dividers, TOC rail
    subtle:    white(0.04),   // figure caption border-top
    hover:     white(0.03),   // hover backgrounds
    borderDefault: `1px solid ${white(0.08)}`,
    borderSubtle:  `1px solid ${white(0.06)}`,
  },

  // Accent — single source, replaces all duplicated TOC_ACCENT etc.
  accent:     CHART_ACCENT,
  accentDim:  CHART_ACCENT_DIM,
  accentGlow: CHART_ACCENT_GLOW,
};

// ─── Fonts ──────────────────────────────────────────────────────────────────
// Swap any typeface by editing one line here.

// export const FONT = {
//   serif: SERIF,                    // headings (H1–H4, Subtitle)
//   mono:  MONO,                            // 'JetBrains Mono', monospace
//   sans:  "'Inter', system-ui, sans-serif",                    // body (Paragraph, Description, List)
// };

export const FONT = {
  serif: OZU_DISPLAY,                     // headings (H1–H4, Subtitle)
  mono:  MONO,                            // 'JetBrains Mono', monospace
  sans:  OZU_SANS,                        // body (Paragraph, Description, List)
};

// ─── Spacing Scale ──────────────────────────────────────────────────────────
// Numbered 1–10. Use SPACE[n] for px values.

export const SPACE = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 48,
  9: 64,
  10: 96,
};

// Semantic aliases
SPACE.sectionGap  = SPACE[10]; // 96 — major chapter breaks
SPACE.blockGap    = SPACE[8];  // 48 — between content blocks
SPACE.elementGap  = SPACE[6];  // 24 — between elements within a block

// ─── Font Sizes ─────────────────────────────────────────────────────────────
// Every font size in the app lives here. Bump a class (body, caption, chart,
// toc, etc.) in one place and it flows through every component. Use semantic
// keys — different contexts may share a value now but drift later.

export const TEXT_SIZE = {
  // Display / headings
  h1:         50,
  h2:         40,
  h3:         30,
  h4:         20,
  subtitle:   24,

  // Body copy
  body:       22,   // paragraphs, list items
  bodySmall:  18,   // secondary body, table cells, decorative italic labels

  // Caption — single 14px token (figure captions, chart labels, axis ticks, tooltips, TOC children)
  caption:    14,

  // Micro — small mono annotations, baselines, subtitles
  micro:      12,

  // Labels — mono uppercase with tracking
  label:      11,   // standard labels, table headers, category tags
  labelSmall: 10,   // smaller labels, child numbering

  // Film credit — shared between HTML overlays and SVG diagrams
  filmCredit: 9,
};

// SVG / diagram font sizes. Tiny intentionally — sized to viewBox geometry.
// Use these for in-diagram labels, tick marks, and overlay annotations.
export const SVG_TEXT = {
  xs: 6,
  sm: 7,
  md: 8,
  lg: 9,
};

// ─── Typography ─────────────────────────────────────────────────────────────
// Every text style defined once. Spread into any element: <h2 style={TYPE.h2}>

export const STYLES = {
  H1: {
    fontFamily: FONT.serif,
    fontSize: TEXT_SIZE.h1,
    fontWeight: 400,
    color: COLOR.text.primary,
    lineHeight: 1.1,
    margin: 0,
    paddingTop: SPACE[9],
    paddingBottom: SPACE[9]
  },
  H2: {
    fontFamily: FONT.serif,
    fontSize: TEXT_SIZE.h2,
    fontWeight: 400,
    color: COLOR.text.primary,
    lineHeight: 1.15,
    // margin: `${SPACE[6]}px 0 ${SPACE[4]}px 0`,
    paddingTop: SPACE[6],
    paddingBottom: SPACE[6]
  },
  H3: {
    fontFamily: FONT.serif,
    fontSize: TEXT_SIZE.h3,
    fontWeight: 400,
    color: COLOR.text.heading,
    lineHeight: 1.3,
    // margin: `${SPACE[5]}px 0 ${SPACE[3]}px 0`,
    paddingTop: SPACE[1],
    paddingBottom: SPACE[1]
  },
  H4: {
    fontFamily: FONT.serif,
    fontSize: TEXT_SIZE.h4,
    fontWeight: 400,
    color: COLOR.text.heading,
    lineHeight: 1.3,
    margin: `${SPACE[4]}px 0 ${SPACE[2]}px 0`,
  },
  Subtitle: {
    fontFamily: FONT.serif,
    fontSize: TEXT_SIZE.subtitle,
    fontWeight: 400,
    color: COLOR.text.primary,
    // fontStyle: "italic",
    lineHeight: 1.3,
    margin: `${SPACE[2]}px 0 ${SPACE[7]}px 0`,
  },
  Paragraph: {
    fontFamily: FONT.sans,
    fontSize: TEXT_SIZE.body,
    color: COLOR.text.body,
    lineHeight: 1.65,
    margin: `0 0 ${SPACE[5]}px 0`,
  },
  Description: {
    fontFamily: FONT.sans,
    fontSize: TEXT_SIZE.bodySmall,
    color: COLOR.text.secondary,
    lineHeight: 1.6,
    maxWidth: 520,
    margin: `0 0 ${SPACE[7]}px 0`,
  },
  Link: {
    color: "rgba(100,200,255,0.75)",
    textDecoration: "none",
    borderBottom: "1px solid rgba(100,200,255,0.45)",
    transition: "border-color 0.2s ease, color 0.2s ease",
  },
  Label: {
    fontFamily: FONT.mono,
    fontSize: TEXT_SIZE.label,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: COLOR.text.secondary,
  },
  InlineCode: {
    fontFamily: FONT.mono,
    fontSize: "0.87em",
    color: COLOR.text.mid,
    background: "rgba(255,255,255,0.04)",
    padding: "1px 5px",
    borderRadius: 3,
  },
  List: {
    fontFamily: FONT.sans,
    fontSize: TEXT_SIZE.body,
    color: COLOR.text.body,
    lineHeight: 1.65,
    margin: `0 0 ${SPACE[5]}px 0`,
    paddingLeft: SPACE[5],
    listStyleType: "disc",
  },
  ListItem: {
    margin: `${SPACE[1]}px 0`,
    paddingLeft: SPACE[1],
  },
  FigureCaption: {
    fontFamily: FONT.sans,
    fontSize: TEXT_SIZE.bodySmall,  // Fuck it.
    color: COLOR.text.secondary,
    textAlign: "center",
    lineHeight: 1.5,
    margin: `${SPACE[3]}px auto`,
    maxWidth: LAYOUT.PROSE_WIDTH,
  },
};

// ─── Layout Containers ──────────────────────────────────────────────────────
// Prose-width for text, visual-width for interactive elements.

export const LAYOUT_CONTAINERS = {
  Prose: {
    maxWidth: LAYOUT.PROSE_WIDTH,
    marginLeft: "auto",
    marginRight: "auto",
    paddingLeft: LAYOUT.PAGE_PADDING,
    paddingRight: LAYOUT.PAGE_PADDING,
  },
  Visual: {
    maxWidth: LAYOUT.VISUAL_WIDTH,
    marginLeft: "auto",
    marginRight: "auto",
    padding: LAYOUT.PAGE_PADDING,
    paddingTop: SPACE[9],
    paddingBottom: SPACE[9]
  },
};

// ─── Shared UI Patterns ─────────────────────────────────────────────────────

export const dividerStyle = {
  height: 1,
  background: `linear-gradient(to right, transparent, ${COLOR.ui.divider}, transparent)`,
};

// ─── Shared Media Tokens ────────────────────────────────────────────────────

export const MEDIA = {
  aspectRatio: "16 / 9",
  imageRadius: 4,
  cardRadius: 6,
  thumbnailRadius: 3,
  imageBg: "#000",
};

// ─── Component Specific Styles ──────────────────────────────────────────────

export const RICH_CAPTION = {
  sourceColors: {
    [PIXMO_SOURCE_NAME]: white(0.8),           // soft purple
    [SHAREGPT4V_SOURCE_NAME]: white(0.8),      // soft blue
  },
  bg: COLOR.bg,
  layout: {
    gap: 24,
    marginBottom: 36,
    imageColumnWidth: "50%",
  },
  image: {
    aspectRatio: MEDIA.aspectRatio,
    borderRadius: 4,
    background: "#000",
  },
  thumbnail: {
    size: 48,
    gap: 6,
    marginTop: 8,
    borderRadius: 3,
    activeOpacity: 1,
    inactiveOpacity: 0.45,
    background: "#000",
  },
  sourceLabel: {
    fontFamily: FONT.sans,
    // color: COLOR.text.tertiary,
    fontSize: TEXT_SIZE.body,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: 12,
    paddingBottom: 8,
  },
  caption: {
    fontFamily: FONT.sans,
    fontSize: TEXT_SIZE.bodySmall,
    color: COLOR.text.bodySecondary,
    lineHeight: 1.7,
    paddingRight: 8,
  },
  fade: {
    height: 48,
  },
};

export const PAGE_SHELL = {
  container: {
    background: COLOR.bg,
    minHeight: "100vh",
    color: "#fff",
    fontFamily: FONT.sans,
  },
  heroByline: {
    row: {
      display: "flex",
      alignItems: "baseline",
      flexWrap: "wrap",
      gap: `${SPACE[2]}px ${SPACE[4]}px`,
      fontFamily: FONT.sans,
      fontSize: TEXT_SIZE.bodySmall,
      fontStyle: "italic",
      fontWeight: 400,
      color: white(0.5),
      lineHeight: 1.4,
      paddingBottom: SPACE[9],
    },
    link: {
      fontFamily: FONT.sans,
      fontSize: TEXT_SIZE.bodySmall,
      fontWeight: 400,
      color: COLOR.accent,
      textDecoration: "none",
    },
    separator: {
      color: COLOR.text.ghost,
      fontWeight: 400,
    },
  },
  hyperparameterTable: {
    col1Pct: 28,
    col2Pct: 8,
    col3Pct: 64,
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: FONT.sans,
      fontSize: TEXT_SIZE.bodySmall,
    },
    th: {
      textAlign: "left",
      padding: "8px 16px 8px 0",
      borderBottom: `1px solid ${white(0.15)}`,
      color: COLOR.text.mid,
      fontWeight: 500,
      fontFamily: FONT.serif,
      fontSize: TEXT_SIZE.body,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    },
    td: {
      padding: "12px 16px 12px 0",
      borderBottom: `1px solid ${white(0.05)}`,
      verticalAlign: "middle",
      lineHeight: 1.55,
      color: COLOR.text.body,
      fontSize: TEXT_SIZE.bodySmall,
    },
    paramTd: {
      fontFamily: FONT.sans,
      color: COLOR.text.mid,
    },
    valueTd: {
      fontFamily: FONT.mono,
      textAlign: "center",
      whiteSpace: "nowrap",
      color: COLOR.text.body,
      fontWeight: 500,
    },
    notesTd: {},
    notesPaddingLeft: 28,
    notesLineHeight: 1.6,
    rowEven: {
      background: white(0.02),
    },
    groupBorder: `1px solid ${white(0.1)}`,
  },
  ablationTable: {
    padding: 10,
    table: {
      borderCollapse: "collapse",
      fontFamily: FONT.mono,
      fontSize: TEXT_SIZE.bodySmall,
      whiteSpace: "nowrap",
    },
    th: {
      textAlign: "center",
      padding: "6px 20px",
      borderBottom: `1px solid ${white(0.15)}`,
      color: COLOR.text.mid,
      fontWeight: 500,
      fontSize: TEXT_SIZE.label,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    },
    td: {
      textAlign: "center",
      padding: "5px 20px",
      borderBottom: `1px solid ${white(0.04)}`,
      color: COLOR.text.secondary,
      verticalAlign: "middle",
      fontSize: TEXT_SIZE.bodySmall,
    },
    rowHeader: {
      color: COLOR.text.mid,
    },
    value: {
      color: COLOR.text.secondary,
    },
    highlight: {
      color: COLOR.text.body,
    },
  },
};

export const LAION_EXAMPLES = {
  marginBottom: 36,
  rowGap: 28,
  rowLabel: {
    fontFamily: FONT.sans,
    fontSize: TEXT_SIZE.body,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: COLOR.text.bodySecondary,
    marginBottom: 12,
  },
  imageContainer: {
    display: "flex",
    gap: 16,
  },
  item: {
    flex: 1,
    minWidth: 0,
  },
  image: {
    width: "100%",
    aspectRatio: MEDIA.aspectRatio,
    objectFit: "cover",
    borderRadius: MEDIA.imageRadius,
    border: `1px solid ${COLOR.ui.border}`,
  },
  caption: {
    fontFamily: FONT.sans,
    fontSize: TEXT_SIZE.bodySmall,
    color: COLOR.text.body,
    lineHeight: 1.5,
    marginTop: 8,
  },
};

export const SECTION_NAV = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px 16px",
    alignItems: "baseline",
    justifyContent: "center",
    lineHeight: 2,
  },
  // Separator between titles on the top. Framing | Composition | ...
  separator: {
    color: COLOR.text.tertiary,
    fontFamily: FONT.mono,
    fontSize: TEXT_SIZE.caption,
  },
  button: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px 0",
    outline: "none",
  },
  label: {
    fontFamily: FONT.serif,
    fontSize: TEXT_SIZE.body,
    transition: "all 0.3s ease",
    paddingBottom: 2,
  },
  activeColor: COLOR.text.body,
  inactiveColor: COLOR.text.tertiary,
  activeBorder: `1px solid ${white(0.4)}`,
  inactiveBorder: "1px solid transparent",
};

export const HERO_ANNOTATION = {
  zIndex: 10,
  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  entryOffset: 8,
  stagger: 0.12,
  chip: {
    background: "rgba(0,0,0,0.72)",
    blur: 12,
    borderRadius: 4,
    padding: "5px 10px",
    border: `1px solid ${white(0.12)}`,
  },
  category: {
    fontFamily: FONT.mono,
    fontSize: TEXT_SIZE.micro,
    color: white(0.35),
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: 1,
  },
  label: {
    fontFamily: FONT.serif,
    fontSize: TEXT_SIZE.caption,
    color: white(0.92),
    fontStyle: "italic",
  },
};

export const EXEMPLAR_IMAGE = {
  container: {
    width: "100%",
    aspectRatio: MEDIA.aspectRatio,
    borderRadius: MEDIA.cardRadius,
    overflow: "hidden",
    position: "relative",
    background: MEDIA.imageBg,
    border: `1px solid ${COLOR.ui.divider}`,
  },
  labelOverlay: {
    position: "absolute",
    bottom: 14,
    left: 14,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  label: {
    fontFamily: FONT.serif,
    fontSize: TEXT_SIZE.bodySmall,
    fontStyle: "italic",
    color: white(0.85),
    textShadow: "0 1px 8px rgba(0,0,0,0.6)",
  },
  filmCredit: {
    position: "absolute",
    bottom: 14,
    right: 12,
    fontFamily: FONT.mono,
    fontSize: TEXT_SIZE.filmCredit,
    color: white(0.4),
    letterSpacing: "0.03em",
    textShadow: "0 1px 6px rgba(0,0,0,0.8)",
    textAlign: "right",
  },
};

export const EXEMPLAR_PLACEHOLDER = {
  container: {
    width: "100%",
    aspectRatio: MEDIA.aspectRatio,
    borderRadius: MEDIA.cardRadius,
    overflow: "hidden",
    position: "relative",
    border: `1px solid ${COLOR.ui.divider}`,
  },
  gradientAngle: 135,
  gradientOpacitySuffix: "18",
  letterbox: {
    height: "12%",
    background: "rgba(0,0,0,0.5)",
  },
  centerContent: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  placeholderText: {
    fontFamily: FONT.mono,
    fontSize: TEXT_SIZE.labelSmall,
    color: white(0.2),
    letterSpacing: "0.05em",
  },
  labelOverlay: {
    position: "absolute",
    bottom: "14%",
    left: 14,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  label: {
    fontFamily: FONT.serif,
    fontSize: TEXT_SIZE.bodySmall,
    fontStyle: "italic",
    color: white(0.85),
    textShadow: "0 1px 8px rgba(0,0,0,0.6)",
  },
  filmCredit: {
    position: "absolute",
    bottom: "14%",
    right: 12,
    fontFamily: FONT.mono,
    fontSize: TEXT_SIZE.filmCredit,
    color: white(0.25),
    letterSpacing: "0.03em",
  },
};

export const TAXONOMY_THUMBNAIL_STRIP = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: "0 4px",
    overflowY: "auto",
    maxHeight: 320,
  },
  button: {
    width: 52,
    height: 32,
    borderRadius: MEDIA.thumbnailRadius,
    cursor: "pointer",
    padding: 0,
    position: "relative",
    overflow: "hidden",
    transition: "all 0.25s ease",
    flexShrink: 0,
  },
  activeBorder: `2px solid ${white(0.6)}`,
  inactiveBorder: `1px solid ${COLOR.ui.border}`,
  defaultBorder: `1px solid ${white(0.15)}`,
  activeOpacity: 1,
  inactiveOpacity: 0.5,
  defaultOpacity: 0.7,
  gradientAngle: 135,
  activeGradientOpacity: "30",
  inactiveGradientOpacity: "10",
  label: {
    position: "absolute",
    bottom: 2,
    right: 3,
    fontFamily: FONT.mono,
    fontSize: SVG_TEXT.xs,
    pointerEvents: "none",
    letterSpacing: "0.02em",
  },
  labelActiveColor: white(0.7),
  labelInactiveColor: white(0.25),
  maxLabelLength: 10,
  truncatedLength: 8,
};

export const TAXONOMY_CATEGORY_ROW = {
  marginBottom: 48,
  layout: {
    display: "flex",
    gap: 16,
    alignItems: "center",
  },
  diagramColumnWidth: 280,
  categoryName: {
    fontFamily: FONT.mono,
    fontSize: TEXT_SIZE.label,
    color: white(0.35),
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  description: {
    fontSize: TEXT_SIZE.bodySmall,
    color: white(0.32),
    lineHeight: 1.5,
    margin: "0 0 14px 0",
  },
  thumbnailRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    marginTop: 8,
    overflowX: "auto",
    padding: "2px 0",
  },
};

export const TAXONOMY_EXEMPLAR_GRID = {
  gap: 6,
  transition: "0.3s ease",
  focusedFlex: 2.5,
  unfocusedFlex: 1,
  otherRowPadPct: 5,
  labelFocusedSize: TEXT_SIZE.body,
  labelDefaultSize: TEXT_SIZE.bodySmall,
  labelOtherRowSize: TEXT_SIZE.labelSmall,
  image: {
    aspectRatio: MEDIA.aspectRatio,
    borderRadius: MEDIA.cardRadius,
    background: MEDIA.imageBg,
    border: `1px solid ${COLOR.ui.divider}`,
  },
  label: {
    fontFamily: FONT.serif,
    fontStyle: "italic",
    textShadow: "0 1px 8px rgba(0,0,0,0.6)",
    focusedColor: white(0.85),
    otherRowColor: white(0.25),
    defaultColor: white(0.45),
  },
  labelPosition: {
    default: 10,
    otherRow: 4,
  },
  filmCredit: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontFamily: FONT.mono,
    fontSize: TEXT_SIZE.filmCredit,
    color: white(0.4),
    letterSpacing: "0.03em",
    textShadow: "0 1px 6px rgba(0,0,0,0.8)",
  },
};


export const TOC_RAIL = {
  position: {
    left: 32,
    top: 96,
    width: 180,
  },
  narrowViewportBreakpoint: 1280,
  zIndex: 50,
  rootTransition: "opacity 260ms cubic-bezier(0.4, 0, 0.2, 1)",
  scrollOffset: 32,
  observer: {
    activeRootMargin: "-20% 0px -70% 0px",
    visualCoverageThreshold: 0.99,
  },
  item: {
    gap: 12,
    padding: "5px 0",
    numberWidth: 22,
  },
  number: {
    fontFamily: FONT.OZU_SANS,
    fontSize: TEXT_SIZE.label,
    color: white(0.2),
    activeColor: COLOR.text.body,
    letterSpacing: "0.08em",
    transition: "color 180ms ease",
  },
  title: {
    fontFamily: FONT.OZU_SANS,
    fontSize: TEXT_SIZE.caption,
    // fontStyle: "italic",
    color: white(0.32),
    hoverColor: white(0.6),
    activeColor: white(0.88),
    lineHeight: 1.3,
    transition: "color 180ms ease",
  },
};

export const CAPTION_DECOMPOSITION = {
  layout: {
    gap: 40,                    // between image column and content column
    imageColumnFlex: "0 0 50%",
    blobMarginBottom: 18,
    ruleMargin: "24px 0 20px",
  },
  image: {
    width: "100%",
    aspectRatio: MEDIA.aspectRatio,
    objectFit: "cover",
    borderRadius: MEDIA.imageRadius,
    border: `1px solid ${COLOR.ui.border}`,
    background: MEDIA.imageBg,
  },
  heading: {
    fontFamily: FONT.sans,
    fontSize: TEXT_SIZE.body,
    fontWeight: 300,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: COLOR.text.body,
    margin: "0 0 12px 0",
    lineHeight: 1.2,
  },
  blob: {
    fontSize: TEXT_SIZE.bodySmall,
    lineHeight: 1.65,
  },
  rule: {
    height: 1,
    background: COLOR.text.ghost,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: FONT.sans,
    // verticalAlign: "center",
  },
  labelCell: {
    fontFamily: FONT.sans,
    fontSize: TEXT_SIZE.bodySmall,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    verticalAlign: "center",
    padding: "9px 16px 9px 0",
    width: 140,
    whiteSpace: "nowrap",
    borderBottom: `1px solid ${white(0.05)}`,
    transition: "color 0.15s ease",
  },
  captionCell: {
    fontSize: TEXT_SIZE.bodySmall,
    lineHeight: 1.5,
    padding: "9px 0",
    verticalAlign: "center",
    borderBottom: `1px solid ${white(0.05)}`,
    transition: "color 0.15s ease",
  },
  text: {
    rest:      COLOR.text.bodySecondary,  // blob phrases, table captions — matches paragraph body text
    dim:       COLOR.text.tertiary,      // non-hovered body text when something is hovered
    restLabel: COLOR.text.bodySecondary,      // table left col for broken down captions
    dimLabel:  COLOR.text.tertiary,      // non-hovered mono label when something is hovered
    separator: COLOR.text.tertiary,      // ", " between segments in the blob
  },
  transition: "color 0.15s ease",
};

// ─── Chart Shared Tokens ────────────────────────────────────────────────────
// TODO: margin: 10px; padding: 10px;

export const CHART = {
  fontFamily: FONT.mono,
  gridline: { stroke: white(0.2), strokeWidth: 0.5 },
  axisLabel: { fill: white(0.4) },
  baseline: { stroke: white(0.3), strokeWidth: 1 },
  baselineLabelColor: white(0.3),
  dumbbell: { stroke: "rgba(100,200,255,0.35)", strokeWidth: 1.5 },
  gap: {
    positiveStroke: CHART_ACCENT_DIM,
    negativeStroke: "rgba(255,100,100,0.3)",
    positiveFill: CHART_ACCENT,
    negativeFill: "rgba(255,100,100,0.7)",
  },
  dot: {
    competitorDefault: { fill: white(0.22), stroke: white(0.08), strokeWidth: 0.5 },
    competitorBest: { fill: white(0.35), stroke: white(0.2), strokeWidth: 1 },
    competitorHovered: white(0.6),
    oursZeroShot: { fill: CHART_ACCENT, stroke: CHART_ACCENT_DIM },
    oursClassifier: { fill: "none", stroke: CHART_ACCENT },
  },
  valueLabel: { fill: CHART_ACCENT, fontWeight: 600 },
  categoryLabel: { fill: white(0.3) },
  tooltip: {
    background: "rgba(15, 15, 20, 0.95)",
    oursBorder: `1px solid ${CHART_ACCENT_DIM}`,
    defaultBorder: `1px solid ${white(0.15)}`,
    borderRadius: 5,
    padding: "5px 9px",
    fontSize: TEXT_SIZE.caption,
    fontFamily: FONT.mono,
    color: white(0.85),
    zIndex: 10,
    lineHeight: 1.5,
    oursNameColor: CHART_ACCENT,
    defaultNameColor: white(0.9),
    baselineNameColor: white(0.5),
    archColor: white(0.4),
    oursAccColor: CHART_ACCENT,
    defaultAccColor: white(0.7),
    flopsColor: white(0.35),
  },
};

export const OVERALL_ACCURACY_PLOT = {
  pad: { top: 30, right: 90, bottom: 30, left: 200 },
  rowHeight: 30,
  innerWidth: 500,
  accMax: 0.95,
  maxWidth: 900,
  modelNameOffset: 10,
  oursModelName: { fill: COLOR.text.primary, fontSize: TEXT_SIZE.caption, fontWeight: 600 },
  competitorModelName: { fill: CHART.axisLabel.fill, fontSize: TEXT_SIZE.micro, fontWeight: 400 },
  baselineModelName: { fill: COLOR.text.tertiary, fontSize: TEXT_SIZE.micro, fontWeight: 400 },
  oursRadius: 6,
  oursZeroShotStrokeWidth: 2,
  oursClassifierStrokeWidth: 1.75,
  competitorRadius: 4,
  baselineRadius: 3,
  competitorFill: "rgba(158,165,173,0.6)",
  baselineFill: COLOR.text.ghost,
  connectorStroke: CHART.gridline.stroke,
  connectorStrokeWidth: 0.5,
  oursConnectorStroke: COLOR.accentDim,
  oursConnectorStrokeWidth: 1,
  refLineStroke: CHART.baseline.stroke,
  refLineDash: "3 3",
  zeroShotDotStroke: "rgba(100,200,255,0.3)",
  valueFontSize: TEXT_SIZE.caption,  // Hero percentages (82%, 88%)
  gapFontSize: TEXT_SIZE.micro,    // Gap deltas and x-axis ticks
  zeroShotGapColor: "rgba(100,200,255,0.55)",
  classifierValueColor: "rgba(100,200,255,0.75)",
  classifierGapColor: "rgba(100,200,255,0.4)",
  inlineLabelFontSize: TEXT_SIZE.micro, // "zero-shot" / "classifiers" labels
  zeroShotLabelColor: "rgba(100,200,255,0.45)",
  classifierLabelColor: "rgba(100,200,255,0.38)",
  tooltipPadding: "6px 10px",
  tooltipLineHeight: 1.6,
  tooltipArchColor: CHART.tooltip.archColor,
};

export const BENCHMARK_STRIP_PLOT = {
  defaultWidth: 250,
  defaultHeight: 300,
  pad: { top: 30, right: 30, bottom: 30, left: 30 },
  competitorRadiusDefault: 2.5,
  competitorRadiusBest: 4,
  oursRadius: 5,
  oursZeroShotStrokeWidth: 2,
  oursClassifierStrokeWidth: 1.5,
  gapFontSize: TEXT_SIZE.caption,
  valueFontSize: TEXT_SIZE.caption,
  axisLabelFontSize: TEXT_SIZE.caption,
  baselineFontSize: TEXT_SIZE.micro,
  categoryFontSize: TEXT_SIZE.caption,
  valueLabelOffset: 9,
};

export const BENCHMARK_DOT_PLOT = {
  defaultWidth: 280,
  aspectMultiplier: 100 / 235,
  pad: { top: 18, right: 14, bottom: 20, left: 28 },
  marginTop: 10,
  competitorRadiusDefault: 3,
  competitorRadiusBest: 4.5,
  oursRadius: 6,
  oursZeroShotStrokeWidth: 2.5,
  oursClassifierStrokeWidth: 1.5,
  gapFontSize: TEXT_SIZE.caption,
  valueFontSize: TEXT_SIZE.caption,
  axisLabelFontSize: TEXT_SIZE.caption,
  baselineFontSize: TEXT_SIZE.micro,
  valueLabelOffset: 12,
  tooltipPadding: "5px 9px",
};

export const GENERAL_KNOWLEDGE_CHARTS = {
  chartWidth: 160,
  chartHeight: 190,
  pad: { top: 10, right: 8, bottom: 32, left: 28 },
  yRange: { min: 40, max: 80 },
  preTrained: {
    radius: 4,
    fill: CHART.baselineLabelColor,
    stroke: COLOR.text.ghost,
    strokeWidth: 1,
    valueFill: CHART.dot.competitorBest.fill,
    valueFontSize: TEXT_SIZE.caption,
  },
  fineTuned: {
    radius: 5,
    strokeWidth: 2,
    valueFontSize: TEXT_SIZE.caption,
  },
  deltaFontSize: TEXT_SIZE.caption,
  axisLabelFontSize: TEXT_SIZE.caption,
  categoryLabel: {
    fontSize: TEXT_SIZE.caption,
    fill: CHART.categoryLabel.fill,
    fontWeight: 500,
  },
  subtitle: {
    fontSize: TEXT_SIZE.micro,
    fill: COLOR.text.ghost,
  },
  groupLabel: {
    fontFamily: FONT.mono,
    fontSize: TEXT_SIZE.caption,
    color: COLOR.text.body,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: 6,
  },
  chartGap: 4,
  separator: {
    width: 1,
    background: COLOR.ui.border,
    margin: "22px 24px 32px",
  },
  legend: {
    gap: 8,
    marginLeft: 32,
    paddingTop: 28,
    fontFamily: FONT.mono,
    fontSize: TEXT_SIZE.caption,
    dotSize: 8,
    labelColor: COLOR.text.body,
    preDotColor: CHART.baselineLabelColor,
  },
};

export const TEXT_SIMILARITY = {
  cell: 46,
  labelWidth: 108,
  gap: 2,
  labelPaddingRight: 10,
  labelFontSize: TEXT_SIZE.caption,
  labelDefault: white(0.35),
  labelHovered: white(0.7),
  labelDimmed: white(0.2),
  cellBorderRadius: 1,
  hoveredOutline: `1px solid ${white(0.5)}`,
  cellFontSize: TEXT_SIZE.caption,
  modelNameFontSize: TEXT_SIZE.caption,
  modelNameColor: white(0.35),
  modelNameLetterSpacing: "0.04em",
  modelNameMarginTop: 10,
  matrixGap: 48,
  tabSeparator: {
    color: white(0.12),
    fontFamily: FONT.mono,
    fontSize: TEXT_SIZE.caption,
  },
  tabButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px 0",
    outline: "none",
  },
  tabLabel: {
    fontFamily: FONT.serif,
    fontSize: TEXT_SIZE.bodySmall,
    fontStyle: "italic",
    activeColor: white(0.85),
    inactiveColor: white(0.3),
    activeBorder: `1px solid ${white(0.35)}`,
    inactiveBorder: "1px solid transparent",
    transition: "all 0.3s ease",
    paddingBottom: 2,
  },
  tabMarginBottom: 24,
  tabGap: 16,
  tooltip: {
    marginTop: 8,
    minHeight: 28,
    fontSize: TEXT_SIZE.bodySmall,
    gap: 8,
    labelColor: white(0.85),
    separatorColor: white(0.35),
  },
  sectionTitle: {
    fontFamily: FONT.serif,
    fontSize: TEXT_SIZE.bodySmall,
    fontStyle: "italic",
    color: white(0.5),
    marginBottom: 16,
    textAlign: "center",
  },
  sectionGap: 48,
};

export const BENCHMARK_SECTION = {
  cardWidth: 250,
  colGap: 6,
  header: {
    fontFamily: FONT.mono,
    fontSize: TEXT_SIZE.caption,
    color: COLOR.text.body,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    paddingBottom: 4,
    paddingLeft: 2,
    lineHeight: 1,
    topPadding: 10,
  },
  card: {
    background: white(0.01),
    border: `1px solid ${white(0.2)}`,
    borderRadius: 4,
  },
};

export const STANDARD_CLIP_DIAGRAM = {
  padding: "24px 0 16px",
  N: 3,
  cell: 36,
  gap: 3,
  encoderBox: {
    border: `1px solid ${white(0.1)}`,
    borderRadius: 5,
    fontFamily: FONT.mono,
    fontSize: TEXT_SIZE.label,
    fontWeight: 500,
    color: white(0.45),
    lineHeight: 1.4,
    background: white(0.04),
    padding: "0 12px",
  },
  imageThumb: {
    width: 50,
    borderRadius: 3,
    activeBorder: "rgba(100,200,255,0.4)",
    defaultBorder: white(0.1),
    activeShadow: "0 0 12px rgba(100,200,255,0.1)",
    dimOpacity: 0.35,
    transition: "all 0.2s ease",
    barHeight: 3,
    barBg: "rgba(0,0,0,0.6)",
    labelFontSize: TEXT_SIZE.caption,
    labelColor: white(0.7),
  },
  embCell: {
    width: 28,
    borderRadius: 3,
    activeColor: "rgba(100,200,255,1)",
    defaultColor: white(0.45),
    background: white(0.04),
    fontSize: TEXT_SIZE.label,
  },
  arrow: {
    fontSize: TEXT_SIZE.label,
    color: white(0.18),
  },
  caption: {
    fontFamily: FONT.sans,
    fontSize: TEXT_SIZE.caption,
    activeColor: "rgba(100,200,255,1)",
    defaultColor: white(0.3),
    activeBorderLeft: "rgba(100,200,255,0.4)",
    paddingLeft: 4,
  },
  matrixLabel: {
    fontFamily: FONT.mono,
    fontSize: TEXT_SIZE.label,
    fontWeight: 500,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: white(0.2),
    marginBottom: 4,
  },
  matrixCell: {
    borderRadius: 4,
    fontSize: TEXT_SIZE.caption,
    matchBg: "rgba(100,200,255,0.1)",
    defaultBg: white(0.04),
    matchBorder: "rgba(100,200,255,0.15)",
    defaultBorder: white(0.06),
    matchColor: "rgba(100,200,255,1)",
    defaultColor: white(0.2),
    focusShadow: "0 0 8px rgba(100,200,255,0.15)",
    transition: "all 0.15s ease",
  },
  matrixHeaderColor: {
    active: "rgba(100,200,255,0.8)",
    default: white(0.3),
  },
  lossAnnotation: {
    gap: 8,
    marginTop: 16,
    fontFamily: FONT.mono,
    fontSize: TEXT_SIZE.label,
    letterSpacing: "0.04em",
    padding: "4px 10px",
    borderRadius: 20,
    color: "rgba(100,200,255,1)",
    background: "rgba(100,200,255,0.06)",
    border: "1px solid rgba(100,200,255,0.12)",
  },
  instruction: {
    fontFamily: FONT.mono,
    fontSize: TEXT_SIZE.caption,
    color: white(0.18),
    marginTop: 10,
    textAlign: "center",
  },
};
