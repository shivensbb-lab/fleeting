import { NextRequest, NextResponse } from 'next/server'

const isDemo = () =>
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cityId = searchParams.get('city') ?? 'dubai'

  if (isDemo()) {
    const { getDealsByCity } = await import('@/lib/demo-data')
    return NextResponse.json({ deals: getDealsByCity(cityId), source: 'demo' })
  }

  const { supabase } = await import('@/lib/supabase')

  // 1. Fetch business-posted deals (from the deals table)
  const { data: businessDeals } = await supabase
    .from('deals')
    .select('*, businesses(*)')
    .gt('spots_remaining', 0)
    .gt('expires_at', new Date().toISOString())
    .eq('businesses.city', cityId)
    .order('expires_at', { ascending: true })

  // 2. Fetch externally-pulled deals (from fetched_deals cache)
  const { data: fetchedDeals } = await supabase
    .from('fetched_deals')
    .select('*')
    .eq('city_id', cityId)
    .gt('spots_remaining', 0)
    .gt('expires_at', new Date().toISOString())
    .order('expires_at', { ascending: true })
    .limit(20)

  // 3. If fetched_deals cache is empty, trigger a refresh in the background
  if (!fetchedDeals?.length) {
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cron/refresh-deals`, {
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
    }).catch(() => null)
  }

  // 4. Normalize fetched_deals into the same shape as business deals
  const normalizedFetched = (fetchedDeals ?? []).map((d) => ({
    id: d.id,
    business_id: null,
    title: d.title,
    description: d.description,
    category: d.category,
    original_price: d.original_price ?? 0,
    discount_pct: d.discount_pct,
    spots_total: d.spots_remaining,
    spots_remaining: d.spots_remaining,
    image_url: null,
    expires_at: d.expires_at,
    source: d.source,
    source_url: d.source_url,
    businesses: {
      id: d.id,
      name: d.business_name,
      category: d.category,
      address: d.business_address,
      city: cityId,
    },
  }))

  const all = [...(businessDeals ?? []), ...normalizedFetched]

  // 5. If still nothing (first deploy), fall back to demo data for this city
  if (all.length === 0) {
    const { getDealsByCity } = await import('@/lib/demo-data')
    return NextResponse.json({ deals: getDealsByCity(cityId), source: 'demo-fallback' })
  }

  return NextResponse.json({ deals: all, source: 'live' })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (isDemo()) {
    return NextResponse.json({ demo: true, success: true, message: 'Deal posted (demo mode)' })
  }

  const { supabase } = await import('@/lib/supabase')
  const expiresAt = new Date(Date.now() + Number(body.hours_until_expiry) * 3600000).toISOString()

  const { data, error } = await supabase
    .from('deals')
    .insert({
      title: body.title,
      description: body.description,
      category: body.category,
      original_price: Number(body.original_price),
      discount_pct: Number(body.discount_pct),
      spots_total: Number(body.spots_total),
      spots_remaining: Number(body.spots_total),
      expires_at: expiresAt,
      business_id: body.business_id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, deal: data })
}
