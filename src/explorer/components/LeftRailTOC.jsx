import React, { useCallback, useEffect, useState } from "react";
import { TOC_RAIL } from "../styles.js";

const T = TOC_RAIL;

const SECTIONS = [
  { id: "intro", title: "Introduction" },
  { id: "visual-language", title: "The Problem" },
  { id: "training", title: "The Gap" },
  { id: "decomposition", title: "Decomposition" },
  { id: "taxonomy", title: "Taxonomy" },
  { id: "dataset", title: "Dataset" },
  { id: "architecture", title: "Architecture" },
  { id: "ablations", title: "Ablations" },
  { id: "augmentations", title: "Augmentations" },
  { id: "training-formulation", title: "Post Training" },
  { id: "evaluations", title: "Evaluations" },
  { id: "retention", title: "Knowledge Retention" },
  { id: "conclusion", title: "Conclusion" },
  { id: "technical-addendum", title: "Technical Addendum" },
];

export default function LeftRailTOC() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const [hoveredId, setHoveredId] = useState(null);
  const [visualInView, setVisualInView] = useState(false);
  const [narrow, setNarrow] = useState(false);

  // Track active section
  useEffect(() => {
    const ids = SECTIONS.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0 && ids.includes(visible[0].target.id)) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: T.observer.activeRootMargin },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Auto-hide when a visual-width block occupies a significant portion of the viewport.
  // Rule: the visible slice of any [data-visual] must cover >= threshold of the viewport
  // height. This is predictable regardless of visual height — a visual entering from the
  // bottom edge won't trigger hide until it's actually the focal element.
  useEffect(() => {
    const visualEls = document.querySelectorAll("[data-visual]");
    if (visualEls.length === 0) return;
    const threshold = T.observer.visualCoverageThreshold;
    let rafId = null;

    const check = () => {
      rafId = null;
      const vh = window.innerHeight;
      let prominent = false;
      for (const el of visualEls) {
        const r = el.getBoundingClientRect();
        const visible = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
        if (visible / vh >= threshold) {
          prominent = true;
          break;
        }
      }
      setVisualInView(prominent);
    };
    const schedule = () => {
      if (rafId == null) rafId = requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Hide entirely on narrow viewports
  useEffect(() => {
    const check = () => setNarrow(window.innerWidth < T.narrowViewportBreakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleClick = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - T.scrollOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
  }, []);

  if (narrow) return null;

  const hidden = visualInView;

  return (
    <nav
      aria-label="Table of contents"
      style={{
        position: "fixed",
        left: T.position.left,
        top: T.position.top,
        width: T.position.width,
        zIndex: T.zIndex,
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
        transition: T.rootTransition,
      }}
    >
      {SECTIONS.map((s, i) => {
        const isActive = activeId === s.id;
        const isHovered = hoveredId === s.id;
        const titleColor = isActive
          ? T.title.activeColor
          : isHovered
            ? T.title.hoverColor
            : T.title.color;
        return (
          <div
            key={s.id}
            onClick={() => handleClick(s.id)}
            onMouseEnter={() => setHoveredId(s.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: T.item.gap,
              padding: T.item.padding,
              cursor: "pointer",
            }}
          >
            <span
              style={{
                fontFamily: T.number.fontFamily,
                fontSize: T.number.fontSize,
                color: isActive ? T.number.activeColor : T.number.color,
                letterSpacing: T.number.letterSpacing,
                fontVariantNumeric: "tabular-nums",
                width: T.item.numberWidth,
                flexShrink: 0,
                transition: T.number.transition,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              style={{
                fontFamily: T.title.fontFamily,
                fontSize: T.title.fontSize,
                fontStyle: T.title.fontStyle,
                color: titleColor,
                lineHeight: T.title.lineHeight,
                transition: T.title.transition,
              }}
            >
              {s.title}
            </span>
          </div>
        );
      })}
    </nav>
  );
}
