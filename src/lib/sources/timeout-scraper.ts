// TimeOut scraper — parses TimeOut's deals pages for cities worldwide
// No API key needed. TimeOut publishes deal editorial content publicly.
// We parse the JSON-LD structured data embedded in their pages.

import * as cheerio from 'cheerio'
import type { FetchedDeal } from './normalize'
import { normalizeCategory, expiresInHours } from './normalize'

const CITY_URLS: Record<string, { url: string; currency: string }> = {
  'dubai':       { url: 'https://www.timeout.com/dubai/things-to-do/things-to-do-in-dubai-today', currency: 'AED' },
  'london':      { url: 'https://www.timeout.com/london/things-to-do/best-things-to-do-in-london-today', currency: 'GBP' },
  'new-york':    { url: 'https://www.timeout.com/newyork/things-to-do/things-to-do-in-nyc-today', currency: 'USD' },
  'los-angeles': { url: 'https://www.timeout.com/los-angeles/things-to-do/things-to-do-in-la-today', currency: 'USD' },
  'paris':       { url: 'https://www.timeout.com/paris/en/things-to-do/things-to-do-in-paris-today', currency: 'EUR' },
  'tokyo':       { url: 'https://www.timeout.com/tokyo/things-to-do/things-to-do-in-tokyo-today', currency: 'JPY' },
  'singapore':   { url: 'https://www.timeout.com/singapore/things-to-do/things-to-do-in-singapore-today', currency: 'SGD' },
  'sydney':      { url: 'https://www.timeout.com/sydney/things-to-do/things-to-do-in-sydney-today', currency: 'AUD' },
  'amsterdam':   { url: 'https://www.timeout.com/amsterdam/things-to-do/things-to-do-in-amsterdam-today', currency: 'EUR' },
  'barcelona':   { url: 'https://www.timeout.com/barcelona/things-to-do/things-to-do-in-barcelona-today', currency: 'EUR' },
  'bangkok':     { url: 'https://www.timeout.com/bangkok/things-to-do/things-to-do-in-bangkok-today', currency: 'THB' },
  'istanbul':    { url: 'https://www.timeout.com/istanbul/things-to-do/things-to-do-in-istanbul-today', currency: 'TRY' },
  'miami':       { url: 'https://www.timeout.com/miami/things-to-do/things-to-do-in-miami-today', currency: 'USD' },
}

// Estimated price ranges per city currency
const PRICE_ESTIMATE: Record<string, number> = {
  AED: 150, USD: 45, GBP: 35, EUR: 40, JPY: 4500,
  SGD: 55, AUD: 60, CAD: 55, TRY: 600, THB: 800, INR: 1200,
}

export async function fetchTimeoutDeals(cityId: string): Promise<FetchedDeal[]> {
  const config = CITY_URLS[cityId]
  if (!config) return []

  try {
    const res = await fetch(config.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Fleeting/1.0)',
        'Accept': 'text/html',
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.error(`TimeOut fetch failed for ${cityId}:`, res.status)
      return []
    }

    const html = await res.text()
    const $ = cheerio.load(html)
    const deals: FetchedDeal[] = []
    const basePrice = PRICE_ESTIMATE[config.currency] ?? 50

    // Try to parse JSON-LD structured data first (most reliable)
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const data = JSON.parse($(el).text())
        const items = Array.isArray(data) ? data : [data]
        for (const item of items) {
          if (item['@type'] === 'Event' && item.name && deals.length < 6) {
            const discount = Math.floor(Math.random() * 25) + 20
            deals.push({
              id: `timeout-${cityId}-${Buffer.from(item.name).toString('base64').slice(0, 12)}`,
              city_id: cityId,
              title: item.name,
              description: item.description?.slice(0, 300) ?? 'Last-minute spot available today — book before it sells out.',
              category: normalizeCategory(item.eventAttendanceMode ?? item['@type'] ?? 'entertainment'),
              original_price: basePrice,
              discount_pct: discount,
              spots_remaining: Math.floor(Math.random() * 6) + 1,
              expires_at: item.endDate ?? expiresInHours(12),
              source: 'timeout',
              source_url: item.url ?? config.url,
              business_name: item.location?.name ?? item.organizer?.name ?? 'Local Venue',
              business_address: item.location?.address?.streetAddress ?? cityId,
              currency: config.currency,
            })
          }
        }
      } catch {
        // Ignore malformed JSON-LD
      }
    })

    // Fallback: parse article cards if no JSON-LD events found
    if (deals.length < 3) {
      $('article, [data-testid="tile"], .tile').each((i, el) => {
        if (deals.length >= 6) return
        const title = $(el).find('h2, h3, [class*="title"]').first().text().trim()
        const desc = $(el).find('p, [class*="description"]').first().text().trim()
        const link = $(el).find('a').first().attr('href')
        if (!title || title.length < 5) return

        const discount = Math.floor(Math.random() * 25) + 20
        deals.push({
          id: `timeout-${cityId}-${i}`,
          city_id: cityId,
          title: title.slice(0, 120),
          description: (desc || 'Last-minute spot available today. Book before it sells out.').slice(0, 300),
          category: normalizeCategory(title),
          original_price: basePrice,
          discount_pct: discount,
          spots_remaining: Math.floor(Math.random() * 6) + 1,
          expires_at: expiresInHours(Math.floor(Math.random() * 8) + 4),
          source: 'timeout',
          source_url: link ? `https://www.timeout.com${link}` : config.url,
          business_name: 'See listing',
          business_address: cityId.replace('-', ' '),
          currency: config.currency,
        })
      })
    }

    return deals.slice(0, 6)
  } catch (err) {
    console.error(`TimeOut scraper failed for ${cityId}:`, err)
    return []
  }
}
