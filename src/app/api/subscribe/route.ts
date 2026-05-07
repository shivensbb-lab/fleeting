import { NextRequest, NextResponse } from 'next/server'

const PRICE_IDS: Record<string, string | undefined> = {
  pro: process.env.STRIPE_PRO_PRICE_ID,
  vip: process.env.STRIPE_VIP_PRICE_ID,
}

export async function POST(req: NextRequest) {
  const { tier } = await req.json()

  if (!PRICE_IDS[tier]) {
    // Demo mode or price IDs not configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'your_stripe_secret_key') {
      return NextResponse.json({ demo: true })
    }
    return NextResponse.json({ error: `Stripe price ID for "${tier}" is not configured. Add STRIPE_${tier.toUpperCase()}_PRICE_ID to .env.local.` }, { status: 400 })
  }

  try {
    const { stripe } = await import('@/lib/stripe')
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: PRICE_IDS[tier]!, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?subscribed=${tier}`,
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
