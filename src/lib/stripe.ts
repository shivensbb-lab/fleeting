import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

export function getDiscountedPrice(originalPrice: number, discountPct: number) {
  return Math.round(originalPrice * (1 - discountPct / 100))
}

export function getPlatformFee(amount: number) {
  const feePct = Number(process.env.PLATFORM_FEE_PERCENT ?? 12)
  return Math.round(amount * (feePct / 100))
}
