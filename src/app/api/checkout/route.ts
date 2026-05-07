import { NextRequest, NextResponse } from 'next/server'
import { DEMO_DEALS } from '@/lib/demo-data'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { dealId, quantity = 1, cityId } = body

  // Demo mode when Stripe keys aren't configured
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'your_stripe_secret_key') {
    return NextResponse.json({ demo: true, message: 'Booking confirmed (demo mode)' })
  }

  try {
    const { stripe } = await import('@/lib/stripe')

    // Try Supabase first, fall back to demo deals
    let dealTitle = ''
    let businessName = ''
    let discountPct = 0
    let originalPrice = 0
    let spotsOk = true

    const { supabase } = await import('@/lib/supabase')
    const { data: dbDeal } = await supabase
      .from('deals')
      .select('*, businesses(*)')
      .eq('id', dealId)
      .single()

    if (dbDeal) {
      if (dbDeal.spots_remaining < quantity) {
        return NextResponse.json({ error: 'Not enough spots' }, { status: 400 })
      }
      dealTitle = dbDeal.title
      businessName = dbDeal.businesses?.name ?? ''
      discountPct = dbDeal.discount_pct
      originalPrice = dbDeal.original_price
    } else {
      // Fall back to demo deal
      const demoDeal = DEMO_DEALS.find((d) => d.id === dealId)
      if (!demoDeal) {
        return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
      }
      if (demoDeal.spots_remaining < quantity) spotsOk = false
      if (!spotsOk) return NextResponse.json({ error: 'Not enough spots' }, { status: 400 })
      dealTitle = demoDeal.title
      businessName = demoDeal.businesses?.name ?? ''
      discountPct = demoDeal.discount_pct
      originalPrice = demoDeal.original_price
    }

    const discountedPrice = Math.round(originalPrice * (1 - discountPct / 100))
    const unitAmountCents = Math.max(50, discountedPrice * 100)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: dealTitle,
              description: `${businessName} · Flash deal (${discountPct}% off)`,
            },
            unit_amount: unitAmountCents,
          },
          quantity,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/deals/${dealId}?city=${cityId ?? 'dubai'}&booked=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/deals/${dealId}?city=${cityId ?? 'dubai'}`,
      metadata: { dealId, quantity: String(quantity) },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
