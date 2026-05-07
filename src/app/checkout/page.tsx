'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield, Clock, CheckCircle, Lock } from 'lucide-react'
import { DEMO_DEALS } from '@/lib/demo-data'
import { getCityById, formatPrice } from '@/lib/cities'
import { TIERS, getEffectiveDiscount } from '@/lib/subscriptions'
import type { Tier } from '@/lib/subscriptions'

function timeLeft(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return 'Expired'
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`
}

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ deal?: string; city?: string; qty?: string; tier?: string }>
}) {
  const params = use(searchParams)
  const dealId = params.deal ?? 'dubai-1'
  const cityId = params.city ?? 'dubai'
  const qty = Number(params.qty ?? '1')
  const tier = (params.tier ?? 'free') as Tier

  const city = getCityById(cityId)
  const deal = DEMO_DEALS.find((d) => d.id === dealId)

  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  if (!deal) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 mb-4">Deal not found or has expired.</p>
        <Link href={`/?city=${cityId}`} className="text-orange-500 hover:underline font-medium">
          ← Browse deals
        </Link>
      </div>
    )
  }

  const tierData = TIERS[tier]
  const effectiveDiscount = getEffectiveDiscount(deal.discount_pct, tier)
  const discountedPrice = Math.round(deal.original_price * (1 - effectiveDiscount / 100))
  const subtotal = discountedPrice * qty
  const extraSaved = tier !== 'free' ? Math.round(deal.original_price * (tierData.extraDiscount / 100)) * qty : 0
  const expires = timeLeft(deal.expires_at)

  async function handlePay() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, quantity: qty, cityId, tier }),
      })
      const data = await res.json()
      if (data.demo) { setDone(true) }
      else if (data.url) { window.location.href = data.url }
      else { alert(data.error ?? 'Something went wrong') }
    } catch { alert('Connection failed. Please try again.') }
    finally { setLoading(false) }
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re booked!</h2>
        <p className="text-gray-600 mb-1 font-medium">{qty > 1 ? `${qty}×` : ''} {deal.title}</p>
        <p className="text-gray-400 text-sm mb-8">Check your email for confirmation. Show it at the venue.</p>
        <div className="flex flex-col gap-3">
          <Link href="/my-bookings" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors">
            View my bookings
          </Link>
          <Link href={`/?city=${cityId}`} className="text-gray-500 text-sm hover:text-gray-700">
            Find more deals in {city.flag} {city.name}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href={`/deals/${dealId}?city=${cityId}`} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to deal
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Confirm booking</h1>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
        {/* Left — payment action */}
        <div className="sm:col-span-3 space-y-4">
          {/* Deal summary card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-orange-500 font-medium uppercase tracking-wide mb-1 capitalize">{deal.category}</p>
            <h2 className="font-semibold text-gray-900 mb-1">{deal.title}</h2>
            <p className="text-sm text-gray-500">{deal.businesses?.name} · {deal.businesses?.city}</p>
          </div>

          {/* Payment button — Stripe handles the real card form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(subtotal, city)}</p>
            </div>

            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-colors text-base flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {loading ? 'Redirecting to payment…' : `Pay securely — ${formatPrice(subtotal, city)}`}
            </button>

            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> SSL encrypted</span>
              <span>Powered by Stripe</span>
              <span>No cancellations</span>
            </div>
          </div>

          {/* Upgrade nudge */}
          {tier === 'free' && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-orange-800">Pro saves you {formatPrice(Math.round(deal.original_price * 0.05) * qty, city)} more</p>
                <p className="text-xs text-orange-600 mt-0.5">Pro members get an extra 5% off every deal.</p>
              </div>
              <Link href="/pricing" className="text-xs text-orange-600 font-semibold hover:underline whitespace-nowrap">
                Upgrade →
              </Link>
            </div>
          )}
        </div>

        {/* Right — order summary */}
        <div className="sm:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Order summary</h3>
            <div className="text-sm space-y-2.5 mb-4">
              <div className="flex justify-between text-gray-500">
                <span>Original price</span>
                <span className="line-through">{formatPrice(deal.original_price, city)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Deal ({deal.discount_pct}% off)</span>
                <span>−{formatPrice(Math.round(deal.original_price * deal.discount_pct / 100), city)}</span>
              </div>
              {tier !== 'free' && (
                <div className="flex justify-between text-purple-600">
                  <span>{tierData.name} (+{tierData.extraDiscount}%)</span>
                  <span>−{formatPrice(extraSaved, city)}</span>
                </div>
              )}
              {qty > 1 && (
                <div className="flex justify-between text-gray-500">
                  <span>Quantity</span>
                  <span>× {qty}</span>
                </div>
              )}
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
              <span>You pay</span>
              <span>{formatPrice(subtotal, city)}</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 flex items-center gap-2 text-sm text-amber-700">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span><strong>{expires}</strong> — expires soon</span>
          </div>
        </div>
      </div>
    </div>
  )
}
