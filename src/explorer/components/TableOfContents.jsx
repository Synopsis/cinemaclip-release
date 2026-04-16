import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { TOC_SECTIONS, FLAT_TOC } from "../data.js";
import { COLOR, FONT, SPACE, TABLE_OF_CONTENTS } from "../styles.js";

const T = TABLE_OF_CONTENTS;

export const TOC_HEADER_HEIGHT = T.headerHeight;

const TOC_SCROLL_MARGIN_CSS = `${FLAT_TOC.map((f) => `#${f.id}`).join(", ")} { scroll-margin-top: ${TOC_HEADER_HEIGHT + T.scrollMargin}px; }`;

// ─── TocItem ────────────────────────────────────────────────────────────────

function TocItem({ id, title, isActive, isParentOfActive, isTopLevel, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const dotSize = isTopLevel ? T.dot.topLevelSize : T.dot.childSize;
  return (
    <div
      onClick={() => onSelect(id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: T.item.gap,
        padding: isTopLevel ? T.item.topLevelPadding : T.item.childPadding,
        cursor: "pointer",
        background: hovered ? COLOR.ui.hover : "transparent",
        transition: T.item.transition,
      }}
    >
      <div style={{
        width: dotSize,
        height: dotSize,
        borderRadius: T.dot.borderRadius,
        border: isActive
          ? T.dot.activeBorder
          : isParentOfActive
            ? T.dot.parentBorder
            : T.dot.defaultBorder,
        background: isActive ? T.dot.activeBg : "transparent",
        flexShrink: 0,
        marginLeft: isTopLevel ? 0 : T.dot.childMarginLeft,
        transition: T.dot.transition,
      }} />
      <span style={{
        fontFamily: T.itemNumbering.fontFamily,
        fontSize: isTopLevel ? T.itemNumbering.topLevelFontSize : T.itemNumbering.childFontSize,
        color: isActive ? T.itemNumbering.activeColor : T.itemNumbering.defaultColor,
        fontVariantNumeric: "tabular-nums",
        width: T.itemNumbering.width,
        flexShrink: 0,
        transition: T.itemNumbering.transition,
      }}>
        {String(FLAT_TOC.findIndex((f) => f.id === id) + 1).padStart(2, "0")}
      </span>
      <span style={{
        fontFamily: T.itemTitle.fontFamily,
        fontSize: isTopLevel ? T.itemTitle.topLevelFontSize : T.itemTitle.childFontSize,
        fontStyle: T.itemTitle.fontStyle,
        color: isActive
          ? T.itemTitle.activeColor
          : isParentOfActive
            ? T.itemTitle.parentColor
            : isTopLevel
              ? T.itemTitle.topLevelColor
              : T.itemTitle.childColor,
        transition: T.itemTitle.transition,
        lineHeight: T.itemTitle.lineHeight,
      }}>
        {title}
      </span>
    </div>
  );
}

// ─── TocDropdown ────────────────────────────────────────────────────────────

function TocDropdown({ activeId, onSelect, onClose, triggerRef }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        triggerRef?.current && !triggerRef.current.contains(e.target)
      ) onClose();
    };
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose, triggerRef]);

  const groups = useMemo(() => {
    const gs = [];
    let cur = null;
    TOC_SECTIONS.forEach((s) => {
      if (s.group !== (cur?.name ?? null)) { cur = { name: s.group, items: [] }; gs.push(cur); }
      cur.items.push(s);
    });
    return gs;
  }, []);

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: TOC_HEADER_HEIGHT,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: T.dropdown.maxWidth,
        maxHeight: `calc(100vh - ${TOC_HEADER_HEIGHT}px - 8px)`,
        overflowY: "auto",
        zIndex: 999,
        background: T.dropdown.background,
        backdropFilter: `blur(${T.dropdown.blur}px)`,
        border: T.dropdown.border,
        borderTop: "none",
        borderRadius: T.dropdown.borderRadius,
        animation: T.dropdown.animation,
      }}
    >
      <style>{`@keyframes tocDropIn { from { opacity:0; transform:translateX(-50%) translateY(-4px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
      <div style={{ padding: T.dropdown.padding, position: "relative" }}>
        {/* Rail */}
        <div style={{ position: "absolute", left: T.rail.left, top: 12, bottom: 20, width: T.rail.width, background: COLOR.ui.divider }} />
        {groups.map((group) => (
          <div key={group.name || "ungrouped"} style={{ marginBottom: T.dropdown.groupMarginBottom }}>
            {group.name && (
              <div style={T.groupLabel}>
                {group.name}
              </div>
            )}
            {group.items.map((section) => {
              const isActiveParent = activeId === section.id;
              const hasActiveChild = (section.children || []).some((c) => c.id === activeId);
              return (
                <div key={section.id}>
                  <TocItem id={section.id} title={section.title} isActive={isActiveParent} isParentOfActive={hasActiveChild} isTopLevel={true} onSelect={onSelect} />
                  {(section.children || []).map((child) => (
                    <TocItem key={child.id} id={child.id} title={child.title} isActive={child.id === activeId} isParentOfActive={false} isTopLevel={false} onSelect={onSelect} />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TableOfContents ────────────────────────────────────────────────────────

export default function TableOfContents() {
  const [activeId, setActiveId] = useState(FLAT_TOC[0].id);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef(null);

  const activeFlat = useMemo(
    () => FLAT_TOC.find((f) => f.id === activeId) || FLAT_TOC[0],
    [activeId],
  );

  useEffect(() => {
    const allIds = FLAT_TOC.map((f) => f.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0].target.id;
          if (allIds.includes(id)) setActiveId(id);
        }
      },
      { rootMargin: `-${TOC_HEADER_HEIGHT + 20}px 0px -65% 0px` },
    );
    allIds.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setGlobalProgress(docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => { observer.disconnect(); window.removeEventListener("scroll", handleScroll); };
  }, []);

  const handleSelect = useCallback((id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - TOC_HEADER_HEIGHT - T.scrollMargin;
      window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
    }
  }, []);

  const item = activeFlat;
  const isChild = item.parentId !== null;
  const [headerHovered, setHeaderHovered] = useState(false);

  return (
    <>
      <style>{TOC_SCROLL_MARGIN_CSS}</style>

      {/* Sticky header */}
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: TOC_HEADER_HEIGHT,
        zIndex: T.header.zIndex,
        background: T.header.background,
        backdropFilter: `blur(${T.header.blur}px)`,
        borderBottom: `1px solid ${COLOR.ui.divider}`,
      }}>
        {/* Progress bar */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0,
          height: T.progressBar.height,
          width: `${globalProgress * 100}%`,
          background: `linear-gradient(to right, ${T.progressBar.gradientStart}, ${COLOR.accent})`,
          transition: T.progressBar.transition,
        }} />
        <div
          ref={triggerRef}
          onClick={() => setMenuOpen((prev) => !prev)}
          onMouseEnter={() => setHeaderHovered(true)}
          onMouseLeave={() => setHeaderHovered(false)}
          style={{
            maxWidth: T.trigger.maxWidth, margin: "0 auto", padding: `0 ${T.trigger.padding}px`,
            height: "100%", display: "flex", alignItems: "center",
            justifyContent: "space-between", cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <span style={{ ...T.numbering, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
              {String(item.globalIndex + 1).padStart(2, "0")}
            </span>
            <span style={{ width: 1, height: T.divider.height, background: COLOR.ui.border, flexShrink: 0 }} />
            <div style={{ display: "flex", alignItems: "baseline", minWidth: 0, overflow: "hidden" }}>
              {isChild && (
                <>
                  <span style={{ ...T.parentTitle, whiteSpace: "nowrap", flexShrink: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.parentTitle}
                  </span>
                  <span style={T.arrow}>&rarr;</span>
                </>
              )}
              <span style={{
                ...T.activeTitle,
                fontSize: isChild ? T.activeTitle.childFontSize : T.activeTitle.topFontSize,
                color: headerHovered ? T.activeTitle.activeColor : T.activeTitle.defaultColor,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {item.title}
              </span>
            </div>
          </div>
          <span style={{ ...T.chevron, transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block", flexShrink: 0 }}>&#9662;</span>
        </div>
      </div>

      {menuOpen && (
        <TocDropdown
          activeId={activeId}
          onSelect={handleSelect}
          onClose={() => setMenuOpen(false)}
          triggerRef={triggerRef}
        />
      )}
    </>
  );
}
