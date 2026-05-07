import type { Deal } from './supabase'

function hoursFromNow(h: number) {
  return new Date(Date.now() + h * 3600000).toISOString()
}

type DemoCity = Deal & { city_id: string }

export const DEMO_DEALS: DemoCity[] = [
  // ── DUBAI ──────────────────────────────────────────────────────────────────
  {
    id: 'dubai-1', business_id: 'biz-d1', city_id: 'dubai',
    title: 'Sunset Dhow Cruise Dinner — tonight',
    description: 'One table opened up on our luxury dhow sailing Dubai Creek. 3-course dinner, live music, and skyline views. Tonight only at this price.',
    category: 'entertainment',
    original_price: 350, discount_pct: 40, spots_total: 8, spots_remaining: 3,
    expires_at: hoursFromNow(3),
    businesses: { id: 'biz-d1', name: 'Golden Dhow Cruises', category: 'entertainment', address: 'Dubai Creek Harbour', city: 'Dubai' },
  },
  {
    id: 'dubai-2', business_id: 'biz-d2', city_id: 'dubai',
    title: 'Royal Hammam & Ghusl Ritual — this afternoon',
    description: 'Cancellation available at our flagship spa. Traditional hammam body scrub, ghusl ritual, and 30-min aromatherapy massage. Pure luxury.',
    category: 'spa',
    original_price: 480, discount_pct: 35, spots_total: 2, spots_remaining: 1,
    expires_at: hoursFromNow(4.5),
    businesses: { id: 'biz-d2', name: 'Talise Ottoman Spa', category: 'spa', address: 'Jumeirah, Dubai', city: 'Dubai' },
  },
  {
    id: 'dubai-3', business_id: 'biz-d3', city_id: 'dubai',
    title: '2-for-1 Wagyu Tasting Menu',
    description: 'Private dining room cancellation at our award-winning steakhouse. Full wagyu tasting menu for 2 — 5 courses, wine pairing optional.',
    category: 'restaurant',
    original_price: 900, discount_pct: 50, spots_total: 4, spots_remaining: 2,
    expires_at: hoursFromNow(2),
    businesses: { id: 'biz-d3', name: 'Prime at DIFC', category: 'restaurant', address: 'DIFC Gate Village', city: 'Dubai' },
  },
  {
    id: 'dubai-4', business_id: 'biz-d4', city_id: 'dubai',
    title: 'Desert Safari + BBQ — this evening',
    description: 'Last-minute spots on our premium dune-bashing safari. Includes quad biking, camel ride, and traditional BBQ dinner under the stars.',
    category: 'entertainment',
    original_price: 299, discount_pct: 30, spots_total: 6, spots_remaining: 4,
    expires_at: hoursFromNow(1.5),
    businesses: { id: 'biz-d4', name: 'Emirates Desert Safari', category: 'entertainment', address: 'Al Marmoom Desert', city: 'Dubai' },
  },
  {
    id: 'dubai-5', business_id: 'biz-d5', city_id: 'dubai',
    title: 'Pilates Reformer — 6 PM class',
    description: 'Cancellation in our signature reformer class at JBR. Small class (8 max), certified instructor, all equipment included.',
    category: 'fitness',
    original_price: 180, discount_pct: 45, spots_total: 8, spots_remaining: 1,
    expires_at: hoursFromNow(1),
    businesses: { id: 'biz-d5', name: 'The Reformers JBR', category: 'fitness', address: 'JBR Walk, Dubai', city: 'Dubai' },
  },
  {
    id: 'dubai-6', business_id: 'biz-d6', city_id: 'dubai',
    title: 'Keratin & Blowout — Marina salon',
    description: 'Prime Saturday afternoon slot freed up. Brazilian keratin treatment + blowout. Results last 3 months.',
    category: 'salon',
    original_price: 650, discount_pct: 30, spots_total: 1, spots_remaining: 1,
    expires_at: hoursFromNow(5),
    businesses: { id: 'biz-d6', name: 'Gloss Dubai Marina', category: 'salon', address: 'Dubai Marina Mall', city: 'Dubai' },
  },

  // ── NEW YORK ───────────────────────────────────────────────────────────────
  {
    id: 'nyc-1', business_id: 'biz-n1', city_id: 'new-york',
    title: '2-for-1 Pasta Night — tonight only!',
    description: 'Join us for a special pasta night. Order any pasta dish and get a second one free. Dine-in only, valid tonight until close.',
    category: 'restaurant',
    original_price: 28, discount_pct: 50, spots_total: 20, spots_remaining: 7,
    expires_at: hoursFromNow(2.5),
    businesses: { id: 'biz-n1', name: "Bella's Bistro", category: 'restaurant', address: '123 Mulberry St', city: 'New York' },
  },
  {
    id: 'nyc-2', business_id: 'biz-n2', city_id: 'new-york',
    title: 'Hot Yoga Class — 5 PM',
    description: 'One spot opened up in our 5 PM hot yoga class. 60 minutes, all levels welcome, mats provided.',
    category: 'fitness',
    original_price: 30, discount_pct: 40, spots_total: 15, spots_remaining: 1,
    expires_at: hoursFromNow(1),
    businesses: { id: 'biz-n2', name: 'FlowState Studio', category: 'fitness', address: '456 W 14th St', city: 'New York' },
  },
  {
    id: 'nyc-3', business_id: 'biz-n3', city_id: 'new-york',
    title: 'Escape Room for 4 — this afternoon',
    description: 'Last-minute booking for "The Heist". 60 minutes, fits up to 4 players. Rated #1 in Manhattan.',
    category: 'entertainment',
    original_price: 120, discount_pct: 30, spots_total: 4, spots_remaining: 4,
    expires_at: hoursFromNow(3),
    businesses: { id: 'biz-n3', name: 'MindTrap Rooms', category: 'entertainment', address: '321 W 36th St', city: 'New York' },
  },

  // ── LONDON ────────────────────────────────────────────────────────────────
  {
    id: 'ldn-1', business_id: 'biz-l1', city_id: 'london',
    title: 'Afternoon Tea for 2 — Mayfair',
    description: 'A table for 2 just freed up at our award-winning tearoom. Seasonal finger sandwiches, warm scones, and 12 loose-leaf teas.',
    category: 'restaurant',
    original_price: 95, discount_pct: 35, spots_total: 4, spots_remaining: 2,
    expires_at: hoursFromNow(3),
    businesses: { id: 'biz-l1', name: 'The Lanesborough', category: 'restaurant', address: 'Hyde Park Corner, Mayfair', city: 'London' },
  },
  {
    id: 'ldn-2', business_id: 'biz-l2', city_id: 'london',
    title: 'West End Show — tonight, front stalls',
    description: 'Two front stalls tickets just returned for tonight\'s sell-out show. Walking distance from Covent Garden.',
    category: 'entertainment',
    original_price: 145, discount_pct: 40, spots_total: 2, spots_remaining: 2,
    expires_at: hoursFromNow(2),
    businesses: { id: 'biz-l2', name: 'Apollo Victoria Theatre', category: 'entertainment', address: '17 Wilton Rd, Pimlico', city: 'London' },
  },
  {
    id: 'ldn-3', business_id: 'biz-l3', city_id: 'london',
    title: 'Balayage + Blowdry — Notting Hill',
    description: 'Cancellation with senior colourist Jade. Full balayage, toner, and blowdry. Normally waitlisted 3 weeks.',
    category: 'salon',
    original_price: 210, discount_pct: 30, spots_total: 1, spots_remaining: 1,
    expires_at: hoursFromNow(5),
    businesses: { id: 'biz-l3', name: 'OMG Hair Notting Hill', category: 'salon', address: '82 Portobello Rd', city: 'London' },
  },

  // ── PARIS ─────────────────────────────────────────────────────────────────
  {
    id: 'par-1', business_id: 'biz-p1', city_id: 'paris',
    title: 'Michelin Tasting Menu for 2',
    description: 'A couple just cancelled their reservation. 7-course menu with wine pairing at our one-star bistro in the Marais.',
    category: 'restaurant',
    original_price: 320, discount_pct: 35, spots_total: 2, spots_remaining: 2,
    expires_at: hoursFromNow(3),
    businesses: { id: 'biz-p1', name: 'Le Comptoir du Marais', category: 'restaurant', address: '14 Rue de Bretagne', city: 'Paris' },
  },
  {
    id: 'par-2', business_id: 'biz-p2', city_id: 'paris',
    title: 'Louvre Private After-Hours Tour',
    description: 'Exclusive small-group tour after closing. Stand before the Mona Lisa with just 12 people. Guide speaks English and French.',
    category: 'entertainment',
    original_price: 195, discount_pct: 25, spots_total: 4, spots_remaining: 4,
    expires_at: hoursFromNow(6),
    businesses: { id: 'biz-p2', name: 'Paris VIP Tours', category: 'entertainment', address: 'Rue de Rivoli, 1st arr.', city: 'Paris' },
  },

  // ── TOKYO ─────────────────────────────────────────────────────────────────
  {
    id: 'tok-1', business_id: 'biz-t1', city_id: 'tokyo',
    title: 'Omakase Sushi Counter — tonight',
    description: 'One seat returned at the counter. 18-piece chef\'s selection omakase with premium tuna, sea urchin, and wagyu nigiri.',
    category: 'restaurant',
    original_price: 28000, discount_pct: 30, spots_total: 1, spots_remaining: 1,
    expires_at: hoursFromNow(2),
    businesses: { id: 'biz-t1', name: 'Sushi Saito Annex', category: 'restaurant', address: 'Roppongi, Minato-ku', city: 'Tokyo' },
  },
  {
    id: 'tok-2', business_id: 'biz-t2', city_id: 'tokyo',
    title: 'Traditional Tea Ceremony',
    description: 'Private 45-min ceremony in a 150-year-old machiya. Learn preparation, enjoy seasonal wagashi sweet. English-speaking host.',
    category: 'entertainment',
    original_price: 8500, discount_pct: 25, spots_total: 4, spots_remaining: 3,
    expires_at: hoursFromNow(4),
    businesses: { id: 'biz-t2', name: 'Urasenke Tokyo', category: 'entertainment', address: 'Yanaka, Taito-ku', city: 'Tokyo' },
  },

  // ── SINGAPORE ─────────────────────────────────────────────────────────────
  {
    id: 'sgp-1', business_id: 'biz-s1', city_id: 'singapore',
    title: 'Rooftop Infinity Pool Day Pass — Marina Bay',
    description: 'Day-pass just returned. Access to the iconic Marina Bay Sands Sky Park infinity pool + sun lounger. Valid today only.',
    category: 'entertainment',
    original_price: 180, discount_pct: 35, spots_total: 2, spots_remaining: 2,
    expires_at: hoursFromNow(4),
    businesses: { id: 'biz-s1', name: 'Marina Bay Sands', category: 'entertainment', address: '10 Bayfront Ave', city: 'Singapore' },
  },
  {
    id: 'sgp-2', business_id: 'biz-s2', city_id: 'singapore',
    title: 'Hawker Heritage Cooking Class',
    description: 'Small-group class (6 max) learning iconic hawker dishes: char kway teow, laksa, and kaya toast. Eat what you cook.',
    category: 'entertainment',
    original_price: 120, discount_pct: 30, spots_total: 6, spots_remaining: 2,
    expires_at: hoursFromNow(3),
    businesses: { id: 'biz-s2', name: 'Coriander Leaf', category: 'entertainment', address: 'Clarke Quay, Singapore', city: 'Singapore' },
  },

  // ── SYDNEY ────────────────────────────────────────────────────────────────
  {
    id: 'syd-1', business_id: 'biz-sy1', city_id: 'sydney',
    title: 'Harbour Sailing with Lunch',
    description: 'Seat opened up on our iconic Sydney Harbour sail. 3 hours on the water, passing the Opera House, with gourmet lunch onboard.',
    category: 'entertainment',
    original_price: 195, discount_pct: 40, spots_total: 6, spots_remaining: 2,
    expires_at: hoursFromNow(2),
    businesses: { id: 'biz-sy1', name: 'Sydney by Sail', category: 'entertainment', address: 'National Maritime Museum, Darling Harbour', city: 'Sydney' },
  },
]

export function getDealsByCity(cityId: string): DemoCity[] {
  return DEMO_DEALS.filter((d) => d.city_id === cityId)
}
