export type Tier = 'free' | 'pro' | 'vip'

export const TIERS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    perMonth: 'Free forever',
    color: 'gray',
    badge: null,
    extraDiscount: 0,       // no extra discount on deals
    earlyAccess: 0,         // no early access — see deals at the same time as everyone
    bookingFee: 0,          // % fee added to each booking
    features: [
      'Browse all flash deals',
      'Book any deal at listed price',
      'Access in all 15+ cities',
      'Instant booking confirmation',
    ],
    limitations: [
      'No early access to deals',
      'Standard pricing only',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    currency: 'USD',
    perMonth: '$9.99 / month',
    color: 'orange',
    badge: 'Most popular',
    extraDiscount: 5,       // extra 5% off every deal
    earlyAccess: 2,         // see deals 2 hours before free users
    bookingFee: 0,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      'Everything in Free',
      'Extra 5% off every deal',
      'See deals 2 hours before free users',
      'Priority booking on hot deals',
      'Email alerts for new deals in your cities',
    ],
    limitations: [],
  },
  vip: {
    id: 'vip',
    name: 'VIP',
    price: 24.99,
    currency: 'USD',
    perMonth: '$24.99 / month',
    color: 'purple',
    badge: 'Best deals',
    extraDiscount: 12,      // extra 12% off every deal
    earlyAccess: 999,       // see deals the instant they're posted
    bookingFee: 0,
    stripePriceId: process.env.STRIPE_VIP_PRICE_ID,
    features: [
      'Everything in Pro',
      'Extra 12% off every deal (biggest savings)',
      'See deals the INSTANT they go live',
      'Dedicated deals concierge (WhatsApp)',
      'Early access to exclusive member-only deals',
      'Cancel anytime',
    ],
    limitations: [],
  },
} as const

export function getExtraDiscount(tier: Tier): number {
  return TIERS[tier].extraDiscount
}

export function getEffectiveDiscount(basePct: number, tier: Tier): number {
  return Math.min(90, basePct + getExtraDiscount(tier))
}
