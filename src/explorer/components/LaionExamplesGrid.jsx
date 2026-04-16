import React from "react";
import { LAION_EXAMPLES as LAION_DATA } from "../data.js";
import { LAION_EXAMPLES as S } from "../styles.js";

export default function LaionExamplesGrid() {
  return (
    <div style={{ marginBottom: S.marginBottom }}>
      {/* Cinematic row */}
      <div style={{ marginBottom: S.rowGap }}>
        <div style={S.rowLabel}>Cinematic</div>
        <div style={S.imageContainer}>
          {LAION_DATA.cinematic.map((item, i) => (
            <div key={i} style={S.item}>
              <img src={item.src} alt="" style={S.image} />
              <div style={S.caption}>{item.caption}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Non-cinematic row */}
      <div>
        <div style={S.rowLabel}>Non-Cinematic</div>
        <div style={S.imageContainer}>
          {LAION_DATA.nonCinematic.map((item, i) => (
            <div key={i} style={S.item}>
              <img src={item.src} alt="" style={S.image} />
              <div style={S.caption}>{item.caption}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
