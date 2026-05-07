// Yelp Fusion API — pulls real highly-rated businesses and frames them as last-minute openings
// Free API key at: https://www.yelp.com/developers/v3/manage_app
// Env var needed: YELP_API_KEY
// Note: Yelp covers US, UK, Canada, Australia, Europe well. For Dubai/Asia use Eventbrite.

import type { FetchedDeal } from './normalize'
import { expiresInHours } from './normalize'

const CITY_CONFIG: Record<string, { location: string; currency: string }> = {
  'new-york':    { location: 'New York, NY', currency: 'USD' },
  'los-angeles': { location: 'Los Angeles, CA', currency: 'USD' },
  'miami':       { location: 'Miami, FL', currency: 'USD' },
  'london':      { location: 'London, UK', currency: 'GBP' },
  'sydney':      { location: 'Sydney, Australia', currency: 'AUD' },
  'toronto':     { location: 'Toronto, Canada', currency: 'CAD' },
  'amsterdam':   { location: 'Amsterdam, Netherlands', currency: 'EUR' },
  'barcelona':   { location: 'Barcelona, Spain', currency: 'EUR' },
  'paris':       { location: 'Paris, France', currency: 'EUR' },
}

const CATEGORY_TERMS: Record<string, { term: string; yelpCategories: string }> = {
  restaurant: { term: 'restaurants', yelpCategories: 'restaurants' },
  fitness:    { term: 'yoga pilates gym',  yelpCategories: 'yoga,pilates,gyms,fitness' },
  salon:      { term: 'hair salon beauty', yelpCategories: 'hair,beautysvc,nails' },
  spa:        { term: 'spa massage',       yelpCategories: 'massage,spas' },
}

// Estimated price ranges per category in local currency (for creating deal cards)
const PRICE_RANGES: Record<string, [number, number]> = {
  restaurant: [25, 80],
  fitness: [20, 50],
  salon: [60, 150],
  spa: [80, 200],
}

type YelpBusiness = {
  id: string
  name: string
  url: string
  rating: number
  categories: { title: string; alias: string }[]
  location: { display_address: string[] }
  price?: string
}

function estimatePrice(priceSymbol: string | undefined, category: string, currency: string): number {
  const [min, max] = PRICE_RANGES[category] ?? [30, 100]
  const multiplier = currency === 'GBP' ? 0.8 : currency === 'EUR' ? 0.9 : currency === 'AUD' ? 1.5 : currency === 'CAD' ? 1.35 : 1
  const dollarSymbols = (priceSymbol ?? '$$').length
  const base = min + ((max - min) * (dollarSymbols - 1)) / 3
  return Math.round(base * multiplier)
}

export async function fetchYelpDeals(cityId: string): Promise<FetchedDeal[]> {
  const apiKey = process.env.YELP_API_KEY
  if (!apiKey) return []

  const config = CITY_CONFIG[cityId]
  if (!config) return [] // Yelp doesn't cover all cities

  const deals: FetchedDeal[] = []

  for (const [category, { yelpCategories }] of Object.entries(CATEGORY_TERMS)) {
    try {
      const params = new URLSearchParams({
        location: config.location,
        categories: yelpCategories,
        sort_by: 'rating',
        limit: '5',
      })

      const res = await fetch(`https://api.yelp.com/v3/businesses/search?${params}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 3600 },
      })

      if (!res.ok) continue

      const json = await res.json() as { businesses?: YelpBusiness[] }
      const businesses = json.businesses ?? []

      for (const biz of businesses.slice(0, 3)) {
        const original = estimatePrice(biz.price, category, config.currency)
        const discount = Math.floor(Math.random() * 25) + 20 // 20-45% off

        deals.push({
          id: `yelp-${biz.id}`,
          city_id: cityId,
          title: `Last-minute opening at ${biz.name}`,
          description: `A cancellation just opened up at this ${biz.rating}★ ${category} spot. Book now before it's gone — ${discount}% off the regular rate today only.`,
          category: category as FetchedDeal['category'],
          original_price: original,
          discount_pct: discount,
          spots_remaining: Math.floor(Math.random() * 4) + 1,
          expires_at: expiresInHours(Math.floor(Math.random() * 6) + 2),
          source: 'yelp',
          source_url: biz.url,
          business_name: biz.name,
          business_address: biz.location.display_address.join(', '),
          currency: config.currency,
        })
      }
    } catch (err) {
      console.error(`Yelp fetch failed for ${category}:`, err)
    }
  }

  return deals
}
