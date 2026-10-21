/** Seeded, deterministic noise: no Math.random anywhere. */
export const hash = (n: number) => {
  let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
};

/** Seeded value in [a, b). */
export const rnd = (seed: number, a = 0, b = 1) => a + (b - a) * hash(seed);

/** Smooth 1D value noise in [-1, 1]. */
export const noise1 = (x: number, seed = 0) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  const a = hash(i * 7919 + seed * 104729) * 2 - 1;
  const b = hash((i + 1) * 7919 + seed * 104729) * 2 - 1;
  return a + (b - a) * u;
};
