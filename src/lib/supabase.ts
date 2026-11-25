import { createClient } from '@supabase/supabase-js'

// When Supabase isn't configured (demo mode), fall back to a dummy URL so the
// client can still be created; createClient throws on a missing or non-HTTP URL.
const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseUrl = /^https?:\/\//.test(configuredUrl) ? configuredUrl : 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Deal = {
  id: string
  business_id: string
  title: string
  description: string
  category: string
  original_price: number
  discount_pct: number
  spots_total: number
  spots_remaining: number
  expires_at: string
  image_url?: string
  businesses?: Business
}

export type Business = {
  id: string
  name: string
  category: string
  address: string
  city: string
  image_url?: string
}

export type Booking = {
  id: string
  deal_id: string
  user_id: string
  amount_paid: number
  platform_fee: number
  created_at: string
  deals?: Deal
}
