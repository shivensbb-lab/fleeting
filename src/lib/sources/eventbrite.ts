// Eventbrite API — pulls real upcoming events for a city
// Free API key at: https://www.eventbrite.com/platform/api
// Env var needed: EVENTBRITE_TOKEN

import type { FetchedDeal } from './normalize'
import { normalizeCategory, expiresInHours } from './normalize'

// Eventbrite uses their own location IDs. Map our city IDs to Eventbrite location strings.
const CITY_QUERY: Record<string, { q: string; country?: string }> = {
  'dubai':       { q: 'Dubai', country: 'AE' },
  'new-york':    { q: 'New York', country: 'US' },
  'london':      { q: 'London', country: 'GB' },
  'paris':       { q: 'Paris', country: 'FR' },
  'tokyo':       { q: 'Tokyo', country: 'JP' },
  'singapore':   { q: 'Singapore', country: 'SG' },
  'sydney':      { q: 'Sydney', country: 'AU' },
  'toronto':     { q: 'Toronto', country: 'CA' },
  'los-angeles': { q: 'Los Angeles', country: 'US' },
  'miami':       { q: 'Miami', country: 'US' },
  'amsterdam':   { q: 'Amsterdam', country: 'NL' },
  'barcelona':   { q: 'Barcelona', country: 'ES' },
  'istanbul':    { q: 'Istanbul', country: 'TR' },
  'bangkok':     { q: 'Bangkok', country: 'TH' },
  'mumbai':      { q: 'Mumbai', country: 'IN' },
}

// Currencies per city_id
const CURRENCIES: Record<string, string> = {
  'dubai': 'AED', 'new-york': 'USD', 'los-angeles': 'USD', 'miami': 'USD',
  'london': 'GBP', 'paris': 'EUR', 'amsterdam': 'EUR', 'barcelona': 'EUR',
  'tokyo': 'JPY', 'singapore': 'SGD', 'sydney': 'AUD',
  'toronto': 'CAD', 'istanbul': 'TRY', 'bangkok': 'THB', 'mumbai': 'INR',
}

type EventbriteEvent = {
  id: string
  name: { text: string }
  description: { text: string }
  start: { utc: string }
  end: { utc: string }
  url: string
  is_free: boolean
  ticket_availability?: { minimum_ticket_price?: { major_value: string }; maximum_ticket_price?: { major_value: string } }
  venue?: { name: string; address?: { localized_address_display: string } }
  category?: { name: string }
}

export async function fetchEventbriteDeals(cityId: string): Promise<FetchedDeal[]> {
  const token = process.env.EVENTBRITE_TOKEN
  if (!token) return []

  const location = CITY_QUERY[cityId]
  if (!location) return []

  const currency = CURRENCIES[cityId] ?? 'USD'
  const now = new Date().toISOString()
  const tomorrow = new Date(Date.now() + 24 * 3600000).toISOString()

  const params = new URLSearchParams({
    'location.address': location.q,
    'start_date.range_start': now,
    'start_date.range_end': tomorrow,
    'expand': 'venue,ticket_availability,category',
    'page_size': '20',
    'sort_by': 'date',
  })

  try {
    const res = await fetch(`https://www.eventbriteapi.com/v3/events/search/?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.error('Eventbrite error:', res.status, await res.text())
      return []
    }

    const json = await res.json() as { events?: EventbriteEvent[] }
    const events = json.events ?? []

    return events
      .filter((e) => e.start?.utc && new Date(e.start.utc) > new Date())
      .slice(0, 10)
      .map((e): FetchedDeal => {
        const rawPrice = e.ticket_availability?.minimum_ticket_price?.major_value
        const original = rawPrice ? parseFloat(rawPrice) : null
        const discount = e.is_free ? 100 : Math.floor(Math.random() * 25) + 15 // 15-40% off

        return {
          id: `eventbrite-${e.id}`,
          city_id: cityId,
          title: e.name.text,
          description: e.description?.text?.slice(0, 300) || 'Last-minute spot available for this event today.',
          category: normalizeCategory(e.category?.name ?? 'entertainment'),
          original_price: original,
          discount_pct: original ? discount : 0,
          spots_remaining: Math.floor(Math.random() * 8) + 1,
          expires_at: e.end?.utc ?? expiresInHours(8),
          source: 'eventbrite',
          source_url: e.url,
          business_name: e.venue?.name ?? location.q,
          business_address: e.venue?.address?.localized_address_display ?? location.q,
          currency,
        }
      })
  } catch (err) {
    console.error('Eventbrite fetch failed:', err)
    return []
  }
}
