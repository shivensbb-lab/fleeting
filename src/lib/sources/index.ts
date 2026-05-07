// Main entry point — combines all deal sources for a given city

import { fetchEventbriteDeals } from './eventbrite'
import { fetchYelpDeals } from './yelp'
import { fetchTimeoutDeals } from './timeout-scraper'
import type { FetchedDeal } from './normalize'

export type { FetchedDeal }

export async function fetchAllDeals(cityId: string): Promise<FetchedDeal[]> {
  const [eventbrite, yelp, timeout] = await Promise.allSettled([
    fetchEventbriteDeals(cityId),
    fetchYelpDeals(cityId),
    fetchTimeoutDeals(cityId),
  ])

  const all: FetchedDeal[] = [
    ...(eventbrite.status === 'fulfilled' ? eventbrite.value : []),
    ...(yelp.status === 'fulfilled' ? yelp.value : []),
    ...(timeout.status === 'fulfilled' ? timeout.value : []),
  ]

  // Deduplicate by id
  const seen = new Set<string>()
  return all.filter((d) => {
    if (seen.has(d.id)) return false
    seen.add(d.id)
    return true
  })
}

export function getSourceStatus() {
  return {
    eventbrite: !!process.env.EVENTBRITE_TOKEN,
    yelp: !!process.env.YELP_API_KEY,
    timeout: true, // No key needed
  }
}
