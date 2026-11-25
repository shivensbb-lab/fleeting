const HOUR_MS = 3_600_000
const MINUTE_MS = 60_000

/** Milliseconds until `expiresAt` (negative once it has passed). */
export function msUntil(expiresAt: string): number {
  return new Date(expiresAt).getTime() - Date.now()
}

/** Human-readable countdown, e.g. "2h 15m left", "40m left" or "Expired". */
export function timeLeft(expiresAt: string): string {
  const diff = msUntil(expiresAt)
  if (diff <= 0) return 'Expired'
  const h = Math.floor(diff / HOUR_MS)
  const m = Math.floor((diff % HOUR_MS) / MINUTE_MS)
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`
}

/** True when a deal expires in less than an hour. */
export function isExpiringSoon(expiresAt: string): boolean {
  return msUntil(expiresAt) < HOUR_MS
}
