import React from "react";
import { COLOR } from "../lib/format";

export const Check: React.FC<{ size: number; color?: string; draw?: number }> = ({ size, color = COLOR.green, draw = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="11" fill="none" stroke={color} strokeWidth="2" opacity={0.55} />
    <path d="M6.5 12.5l3.6 3.6 7.4-8" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
  </svg>
);

export const Cross: React.FC<{ size: number; color?: string }> = ({ size, color = COLOR.red }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="11" fill="none" stroke={color} strokeWidth="2" opacity={0.55} />
    <path d="M8 8l8 8M16 8l-8 8" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

export const Dot: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" style={{ flexShrink: 0 }}>
    <circle cx="5" cy="5" r="5" fill={color} />
  </svg>
);

/** A mouse pointer, tip at the top-left corner. */
export const Pointer: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M3 2l15 11.5-6.6.9 3.9 7.4-3 1.5-3.8-7.5L3 20.5z" fill={COLOR.cream} stroke="#120E0C" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);
