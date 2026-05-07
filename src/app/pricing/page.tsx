'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Zap, Star, Crown } from 'lucide-react'
import { TIERS } from '@/lib/subscriptions'

const ICONS = { free: Zap, pro: Star, vip: Crown }
const ICON_COLORS = { free: 'text-gray-500', pro: 'text-orange-500', vip: 'text-purple-500' }
const BG_COLORS = { free: 'bg-gray-50', pro: 'bg-orange-500', vip: 'bg-purple-600' }
const BORDER_COLORS = { free: 'border-gray-200', pro: 'border-orange-500', vip: 'border-purple-500' }

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleSubscribe(tierId: string) {
    if (tierId === 'free') { window.location.href = '/' ; return }
    setLoading(tierId)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: tierId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.demo) {
        alert('Subscription demo — connect Stripe to enable real payments.\n\nYou would be redirected to Stripe Checkout here.')
      } else {
        alert(data.error ?? 'Something went wrong')
      }
    } catch {
      alert('Connection failed. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Get bigger discounts with a plan
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Free members see deals at standard prices. Pro and VIP members unlock extra discounts and see hot deals before anyone else.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {(Object.values(TIERS) as typeof TIERS[keyof typeof TIERS][]).map((tier) => {
          const Icon = ICONS[tier.id as keyof typeof ICONS]
          const isPro = tier.id === 'pro'
          const isVip = tier.id === 'vip'

          return (
            <div
              key={tier.id}
              className={`relative bg-white rounded-2xl border-2 shadow-sm overflow-hidden flex flex-col ${BORDER_COLORS[tier.id as keyof typeof BORDER_COLORS]} ${isPro ? 'scale-105' : ''}`}
            >
              {tier.badge && (
                <div className={`text-center py-1.5 text-xs font-bold text-white ${BG_COLORS[tier.id as keyof typeof BG_COLORS]}`}>
                  {tier.badge.toUpperCase()}
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Icon className={`w-5 h-5 ${ICON_COLORS[tier.id as keyof typeof ICON_COLORS]}`} />
                  <h2 className="font-bold text-gray-900 text-lg">{tier.name}</h2>
                </div>

                <div className="mb-6">
                  {tier.price === 0 ? (
                    <span className="text-4xl font-bold text-gray-900">Free</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-gray-900">${tier.price}</span>
                      <span className="text-gray-400 text-sm">/month</span>
                    </>
                  )}
                </div>

                {/* Key benefits highlight */}
                <div className={`rounded-xl p-3 mb-5 text-sm font-medium ${isVip ? 'bg-purple-50 text-purple-700' : isPro ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-600'}`}>
                  {tier.extraDiscount > 0
                    ? `Extra ${tier.extraDiscount}% off every deal`
                    : 'Standard deal prices'}
                  {tier.earlyAccess > 0 && tier.earlyAccess < 999 && (
                    <span className="block text-xs mt-0.5 opacity-80">+ {tier.earlyAccess}h early access</span>
                  )}
                  {tier.earlyAccess >= 999 && (
                    <span className="block text-xs mt-0.5 opacity-80">+ Instant access when deals go live</span>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isVip ? 'text-purple-500' : isPro ? 'text-orange-500' : 'text-gray-400'}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(tier.id)}
                  disabled={loading === tier.id}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-60 ${
                    isVip
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : isPro
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {loading === tier.id
                    ? 'Loading…'
                    : tier.id === 'free'
                    ? 'Browse deals'
                    : `Get ${tier.name} — $${tier.price}/mo`}
                </button>

                {tier.id !== 'free' && (
                  <p className="text-center text-xs text-gray-400 mt-2">Cancel anytime. No contracts.</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Savings calculator */}
      <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 mb-8">
        <h3 className="font-bold text-gray-900 mb-1">How much can you save?</h3>
        <p className="text-sm text-gray-600 mb-4">Example: a $200 spa booking with a 30% deal discount</p>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { tier: 'Free', base: 30, extra: 0, price: 200, color: 'text-gray-600' },
            { tier: 'Pro', base: 30, extra: 5, price: 200, color: 'text-orange-600' },
            { tier: 'VIP', base: 30, extra: 12, price: 200, color: 'text-purple-600' },
          ].map(({ tier, base, extra, price, color }) => {
            const effective = Math.min(90, base + extra)
            const final = Math.round(price * (1 - effective / 100))
            return (
              <div key={tier} className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-xs font-medium text-gray-500 mb-1">{tier}</p>
                <p className={`text-2xl font-bold ${color}`}>${final}</p>
                <p className="text-xs text-gray-400">{effective}% off</p>
                <p className="text-xs text-gray-400">saved ${price - final}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
        <Link href="/" className="hover:text-orange-500 transition-colors">← Browse deals</Link>
        <span>·</span>
        <a href="mailto:hello@fleeting.app" className="hover:text-orange-500 transition-colors">Contact us</a>
      </div>
    </div>
  )
}
