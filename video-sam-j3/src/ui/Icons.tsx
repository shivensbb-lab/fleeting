import React from "react";
import { COLOR } from "../lib/format";

/** A mouse pointer, tip at the top-left corner. */
export const Pointer: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 4px 6px rgba(30,27,46,0.3))" }}>
    <path d="M3 2l15 11.5-6.6.9 3.9 7.4-3 1.5-3.8-7.5L3 20.5z" fill={COLOR.white} stroke={COLOR.ink} strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);
