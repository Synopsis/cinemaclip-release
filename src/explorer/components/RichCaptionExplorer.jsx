import React, { useState, useRef, useLayoutEffect } from "react";
import { RICH_CAPTION_EXAMPLES } from "../data.js";
import { RICH_CAPTION } from "../styles.js";

export default function RichCaptionExplorer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = RICH_CAPTION_EXAMPLES[activeIndex];

  // Set on first paint to the natural height of the first caption so initial view needs no scroll; then fixed so switching images doesn't resize.
  const [sectionHeight, setSectionHeight] = useState(null);
  const containerRef = useRef(null);

  // Show a fade at bottom of caption when there's more to scroll — makes scrollability obvious.
  const [showBottomFade, setShowBottomFade] = useState(false);
  const captionScrollRef = useRef(null);

  useLayoutEffect(() => {
    if (sectionHeight != null) return;
    const el = containerRef.current;
    if (!el) return;
    const { height } = el.getBoundingClientRect();
    setSectionHeight(Math.ceil(height));
  }, [sectionHeight]);

  const updateFade = () => {
    const el = captionScrollRef.current;
    if (!el) return;
    const canScroll = el.scrollHeight > el.clientHeight;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
    setShowBottomFade(canScroll && !atBottom);
  };

  useLayoutEffect(() => {
    updateFade();
  }, [activeIndex, sectionHeight]);

  const sourceColor = RICH_CAPTION.sourceColors[active.source];

  return (
    <div style={{ marginBottom: RICH_CAPTION.layout.marginBottom }}>
      {/* Source label at top-left, sized to match image column so the caption below starts at the image's top edge */}
      <div
        style={{
          ...RICH_CAPTION.sourceLabel,
          color: sourceColor,
          borderBottom: `1px solid ${sourceColor}30`,
          width: RICH_CAPTION.layout.imageColumnWidth,
        }}
      >
        {active.source}
      </div>

      <div
        ref={containerRef}
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: RICH_CAPTION.layout.gap,
          ...(sectionHeight != null && { height: sectionHeight }),
        }}
      >
        {/* Left: Image + thumbnail selector — stretches to match caption column height */}
        <div
          style={{
            width: RICH_CAPTION.layout.imageColumnWidth,
            flexShrink: 0,
            // display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Main image */}
          <div
            style={{
              width: "100%",
              aspectRatio: RICH_CAPTION.image.aspectRatio,
              borderRadius: RICH_CAPTION.image.borderRadius,
              overflow: "hidden",
              background: RICH_CAPTION.image.background,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <img
              src={active.src}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>

          {/* Thumbnail row below image */}
          <div
            style={{
              display: "flex",
              gap: RICH_CAPTION.thumbnail.gap,
              marginTop: RICH_CAPTION.thumbnail.marginTop,
              justifyContent: "center",
            }}
          >
            {RICH_CAPTION_EXAMPLES.map((item, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  style={{
                    width: RICH_CAPTION.thumbnail.size,
                    height: RICH_CAPTION.thumbnail.size,
                    borderRadius: RICH_CAPTION.thumbnail.borderRadius,
                    border: isActive
                      ? `2px solid ${RICH_CAPTION.sourceColors[item.source]}`
                      : "1px solid rgba(255,255,255,0.08)",
                    padding: 0,
                    cursor: "pointer",
                    overflow: "hidden",
                    opacity: isActive ? RICH_CAPTION.thumbnail.activeOpacity : RICH_CAPTION.thumbnail.inactiveOpacity,
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                    background: RICH_CAPTION.thumbnail.background,
                  }}
                >
                  <img
                    src={item.src}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Caption area — starts at the image's top edge */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {/* Caption text — when sectionHeight is set, scrolls inside fixed height; minHeight: 0 lets flex shrink it */}
          <div
            ref={captionScrollRef}
            onScroll={updateFade}
            style={{
              ...(sectionHeight != null ? { flex: 1, minHeight: 0, overflowY: "auto" } : {}),
              paddingRight: RICH_CAPTION.caption.paddingRight,
              position: "relative",
            }}
          >
            <p
              style={{
                ...RICH_CAPTION.caption,
                margin: 0,
                whiteSpace: "pre-line",
              }}
            >
              {active.caption}
            </p>
            {/* Fade at bottom when more content is scrollable — signals that user can scroll */}
            {showBottomFade && (
              <div
                aria-hidden
                style={{
                  position: "sticky",
                  bottom: 0,
                  left: 0,
                  right: RICH_CAPTION.caption.paddingRight,
                  height: RICH_CAPTION.fade.height,
                  marginTop: -RICH_CAPTION.fade.height,
                  background: `linear-gradient(to bottom, transparent, ${RICH_CAPTION.bg})`,
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
