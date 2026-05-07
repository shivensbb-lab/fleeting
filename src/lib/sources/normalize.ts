// Shared type for a deal coming from any external source

export type FetchedDeal = {
  id: string           // e.g. "eventbrite-12345"
  city_id: string      // e.g. "dubai"
  title: string
  description: string
  category: 'restaurant' | 'fitness' | 'salon' | 'spa' | 'entertainment'
  original_price: number | null
  discount_pct: number
  spots_remaining: number
  expires_at: string   // ISO string — when the deal/event ends
  source: 'eventbrite' | 'yelp' | 'timeout' | 'manual'
  source_url: string
  business_name: string
  business_address: string
  currency: string
}

// Maps raw category strings to our 5 categories
export function normalizeCategory(raw: string): FetchedDeal['category'] {
  const s = raw.toLowerCase()
  if (s.includes('food') || s.includes('restaurant') || s.includes('dining') || s.includes('drink') || s.includes('cuisine')) return 'restaurant'
  if (s.includes('fitness') || s.includes('sport') || s.includes('gym') || s.includes('yoga') || s.includes('pilates') || s.includes('workout')) return 'fitness'
  if (s.includes('salon') || s.includes('hair') || s.includes('beauty') || s.includes('nail') || s.includes('barber')) return 'salon'
  if (s.includes('spa') || s.includes('massage') || s.includes('wellness') || s.includes('health')) return 'spa'
  return 'entertainment'
}

// Returns a plausible "expires at" — either end of today or N hours from now
export function expiresInHours(h: number): string {
  return new Date(Date.now() + h * 3600000).toISOString()
}
