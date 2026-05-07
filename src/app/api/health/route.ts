import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseOk = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url')
  const stripeOk = !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'your_stripe_secret_key')
  const eventbriteOk = !!process.env.EVENTBRITE_TOKEN
  const yelpOk = !!process.env.YELP_API_KEY

  return NextResponse.json({
    supabase: supabaseOk,
    stripe: stripeOk,
    eventbrite: eventbriteOk,
    yelp: yelpOk,
    timeout_scraper: true,
  })
}
