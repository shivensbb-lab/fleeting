import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { dealId, quantity = 1 } = body

  // Demo mode when Stripe keys aren't configured
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'your_stripe_secret_key') {
    return NextResponse.json({ demo: true, message: 'Booking confirmed (demo mode)' })
  }

  try {
    const { stripe } = await import('@/lib/stripe')
    const { supabase } = await import('@/lib/supabase')

    // Fetch deal from Supabase
    const { data: deal, error } = await supabase
      .from('deals')
      .select('*, businesses(*)')
      .eq('id', dealId)
      .single()

    if (error || !deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    if (deal.spots_remaining < quantity) {
      return NextResponse.json({ error: 'Not enough spots' }, { status: 400 })
    }

    const discountedPrice = Math.round(deal.original_price * (1 - deal.discount_pct / 100))
    const unitAmountCents = discountedPrice * 100

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: deal.title,
              description: `${deal.businesses?.name} · Flash deal (${deal.discount_pct}% off)`,
            },
            unit_amount: unitAmountCents,
          },
          quantity,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/deals/${dealId}?booked=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/deals/${dealId}`,
      metadata: { dealId, quantity: String(quantity) },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
