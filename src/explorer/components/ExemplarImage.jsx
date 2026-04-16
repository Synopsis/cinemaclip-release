import React from "react";
import { EXEMPLAR_IMAGE } from "../styles.js";

export default function ExemplarImage({ label, exemplar }) {
  const S = EXEMPLAR_IMAGE;

  return (
    <div style={S.container}>
      <img
        src={exemplar.src}
        alt={label}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />

      {/* Active label — bottom left of container */}
      <div style={S.labelOverlay}>
        <span style={S.label}>
          {label}
        </span>
      </div>

      {/* Film title + year (only shown when metadata is provided) */}
      {exemplar.film && (
        <div style={S.filmCredit}>
          {exemplar.film}{exemplar.year ? ` (${exemplar.year})` : ""}
        </div>
      )}
    </div>
  );
}
