import React, { useState, useRef, useEffect, useMemo, Fragment } from "react";
import { BENCHMARK_GROUPS } from "../data.js";
import { BENCHMARK_SECTION } from "../styles.js";
import BenchmarkStripPlot from "../charts/BenchmarkStripPlot.jsx";

const S = BENCHMARK_SECTION;

export default function BenchmarkSection() {
  const gridRef = useRef(null);
  const [numCols, setNumCols] = useState(5);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      setNumCols(Math.max(1, Math.floor((w + S.colGap) / (S.cardWidth + S.colGap))));
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, []);

  const rows = useMemo(() => {
    const segs = [];
    let pos = 0;

    BENCHMARK_GROUPS.forEach((group) => {
      let catIdx = 0;
      let remaining = group.categories.length;

      while (remaining > 0) {
        const col = pos % numCols;
        const slotsLeft = numCols - col;
        const count = Math.min(remaining, slotsLeft);

        segs.push({
          groupName: group.name,
          categories: group.categories.slice(catIdx, catIdx + count),
          startCol: col,
          count,
        });

        pos += count;
        catIdx += count;
        remaining -= count;
      }
    });

    const rowList = [];
    let cur = [];
    segs.forEach((seg) => {
      if (seg.startCol === 0 && cur.length > 0) {
        rowList.push(cur);
        cur = [];
      }
      cur.push(seg);
    });
    if (cur.length > 0) rowList.push(cur);
    return rowList;
  }, [numCols]);

  return (
    <div>
      <div
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, ${S.cardWidth}px)`,
          columnGap: S.colGap,
          rowGap: 0,
        }}
      >
        {rows.map((row, rowIdx) => (
          <Fragment key={rowIdx}>
            {row.map((seg, segIdx) => (
              <div
                key={`h-${rowIdx}-${segIdx}`}
                style={{
                  gridRow: rowIdx * 2 + 1,
                  gridColumn: `${seg.startCol + 1} / span ${seg.count}`,
                  ...S.header,
                  paddingTop: rowIdx > 0 ? S.header.topPadding : 0,
                }}
              >
                {seg.groupName}
              </div>
            ))}

            {row.flatMap((seg) =>
              seg.categories.map((catId, i) => (
                <div
                  key={catId}
                  style={{
                    gridRow: rowIdx * 2 + 2,
                    gridColumn: seg.startCol + i + 1,
                    ...S.card,
                    margin: 10,
                    padding: 10
                  }}
                >
                  <BenchmarkStripPlot categoryId={catId} />
                </div>
              ))
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
