import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

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
