import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { tier } = await req.json()

  // Read price IDs inside handler so env vars are always fresh
  const PRICE_IDS: Record<string, string | undefined> = {
    pro: process.env.STRIPE_PRO_PRICE_ID,
    vip: process.env.STRIPE_VIP_PRICE_ID,
  }

  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'your_stripe_secret_key') {
    return NextResponse.json({ demo: true })
  }

  const priceId = PRICE_IDS[tier]
  if (!priceId) {
    return NextResponse.json(
      { error: `Price ID for "${tier}" not configured. Add STRIPE_${tier.toUpperCase()}_PRICE_ID to env.` },
      { status: 400 }
    )
  }

  try {
    const { stripe } = await import('@/lib/stripe')
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/subscription-success?tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: { tier },
      allow_promotion_codes: true,
    })
    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Stripe error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
