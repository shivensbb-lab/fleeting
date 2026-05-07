// Vercel Cron Job — runs every hour to refresh real deals from all sources
// Configured in vercel.json. Protected by CRON_SECRET env var.

import { NextRequest, NextResponse } from 'next/server'
import { fetchAllDeals } from '@/lib/sources'
import { CITIES } from '@/lib/cities'

export async function GET(req: NextRequest) {
  // Verify the request is from Vercel Cron (or our own calls)
  const secret = req.headers.get('authorization')?.replace('Bearer ', '')
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only refresh if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
    return NextResponse.json({ skipped: true, reason: 'Supabase not configured — using demo data' })
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const results: Record<string, number> = {}

  for (const city of CITIES) {
    try {
      const deals = await fetchAllDeals(city.id)
      if (deals.length === 0) { results[city.id] = 0; continue }

      // Upsert fetched deals into Supabase (replace old ones for this city)
      const rows = deals.map((d) => ({
        id: d.id,
        city_id: d.city_id,
        title: d.title,
        description: d.description,
        category: d.category,
        original_price: d.original_price,
        discount_pct: d.discount_pct,
        spots_remaining: d.spots_remaining,
        expires_at: d.expires_at,
        source: d.source,
        source_url: d.source_url,
        business_name: d.business_name,
        business_address: d.business_address,
        currency: d.currency,
        fetched_at: new Date().toISOString(),
      }))

      const { error } = await supabase
        .from('fetched_deals')
        .upsert(rows, { onConflict: 'id' })

      if (error) console.error(`Supabase upsert error for ${city.id}:`, error.message)

      // Delete expired deals older than 2 hours
      await supabase
        .from('fetched_deals')
        .delete()
        .lt('expires_at', new Date(Date.now() - 2 * 3600000).toISOString())
        .eq('city_id', city.id)

      results[city.id] = deals.length
    } catch (err) {
      console.error(`Failed to refresh ${city.id}:`, err)
      results[city.id] = -1
    }
  }

  return NextResponse.json({ ok: true, refreshed: results, timestamp: new Date().toISOString() })
}
