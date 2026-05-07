'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, Zap, Star, Crown, CheckCircle } from 'lucide-react'
import { TIERS } from '@/lib/subscriptions'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'

const ICONS = { free: Zap, pro: Star, vip: Crown }
const ICON_COLORS = { free: 'text-gray-500', pro: 'text-orange-500', vip: 'text-purple-500' }
const BG_COLORS = { free: 'bg-gray-50', pro: 'bg-orange-500', vip: 'bg-purple-600' }
const BORDER_COLORS = { free: 'border-gray-200', pro: 'border-orange-500', vip: 'border-purple-500' }

export default function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ subscribed?: string }>
}) {
  const params = use(searchParams)
  const { user, tier, refreshUser } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [justSubscribed, setJustSubscribed] = useState<string | null>(null)

  // After Stripe redirect, save tier to user metadata
  useEffect(() => {
    const newTier = params.subscribed
    if (!newTier || !user) return

    async function saveTier() {
      const { error } = await supabase.auth.updateUser({
        data: { tier: newTier },
      })
      if (!error) {
        await refreshUser()
        setJustSubscribed(newTier ?? null)
      }
    }
    saveTier()
  }, [params.subscribed, user]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubscribe(tierId: string) {
    if (tierId === 'free') { router.push('/'); return }
    if (!user) { router.push('/auth'); return }

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
        // Demo mode — simulate upgrade
        await supabase.auth.updateUser({ data: { tier: tierId } })
        await refreshUser()
        setJustSubscribed(tierId)
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
      {justSubscribed && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 mb-8 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <div>
            <p className="font-bold text-green-800 capitalize">{justSubscribed} plan activated!</p>
            <p className="text-sm text-green-600">Your extra discounts are now applied to every deal.</p>
          </div>
        </div>
      )}

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Get bigger discounts with a plan
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Free members see deals at standard prices. Pro and VIP members unlock extra discounts and see hot deals before anyone else.
        </p>
        {!user && (
          <p className="text-sm text-gray-400 mt-3">
            <Link href="/auth" className="text-orange-500 font-semibold hover:underline">Sign in</Link> to manage your plan.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {(Object.values(TIERS) as typeof TIERS[keyof typeof TIERS][]).map((planTier) => {
          const Icon = ICONS[planTier.id as keyof typeof ICONS]
          const isPro = planTier.id === 'pro'
          const isVip = planTier.id === 'vip'
          const isCurrent = user && tier === planTier.id
          const isDowngrade = user && (
            (tier === 'vip' && planTier.id !== 'vip') ||
            (tier === 'pro' && planTier.id === 'free')
          )

          let btnLabel = ''
          if (planTier.id === 'free') btnLabel = 'Browse deals'
          else if (isCurrent) btnLabel = 'Current plan'
          else if (isDowngrade) btnLabel = 'Downgrade'
          else if (loading === planTier.id) btnLabel = 'Loading…'
          else if (planTier.id === 'vip' && tier === 'pro') btnLabel = 'Upgrade to VIP'
          else btnLabel = `Get ${planTier.name} — $${planTier.price}/mo`

          return (
            <div
              key={planTier.id}
              className={`relative bg-white rounded-2xl border-2 shadow-sm overflow-hidden flex flex-col ${BORDER_COLORS[planTier.id as keyof typeof BORDER_COLORS]} ${isPro && !isCurrent ? 'scale-105' : ''} ${isCurrent ? 'ring-2 ring-offset-2 ring-orange-400' : ''}`}
            >
              {isCurrent && (
                <div className="bg-orange-500 text-center py-1.5 text-xs font-bold text-white">
                  YOUR CURRENT PLAN
                </div>
              )}
              {!isCurrent && planTier.badge && (
                <div className={`text-center py-1.5 text-xs font-bold text-white ${BG_COLORS[planTier.id as keyof typeof BG_COLORS]}`}>
                  {planTier.badge.toUpperCase()}
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Icon className={`w-5 h-5 ${ICON_COLORS[planTier.id as keyof typeof ICON_COLORS]}`} />
                  <h2 className="font-bold text-gray-900 text-lg">{planTier.name}</h2>
                </div>

                <div className="mb-6">
                  {planTier.price === 0 ? (
                    <span className="text-4xl font-bold text-gray-900">Free</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-gray-900">${planTier.price}</span>
                      <span className="text-gray-400 text-sm">/month</span>
                    </>
                  )}
                </div>

                <div className={`rounded-xl p-3 mb-5 text-sm font-medium ${isVip ? 'bg-purple-50 text-purple-700' : isPro ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-600'}`}>
                  {planTier.extraDiscount > 0
                    ? `Extra ${planTier.extraDiscount}% off every deal`
                    : 'Standard deal prices'}
                  {planTier.earlyAccess > 0 && planTier.earlyAccess < 999 && (
                    <span className="block text-xs mt-0.5 opacity-80">+ {planTier.earlyAccess}h early access</span>
                  )}
                  {planTier.earlyAccess >= 999 && (
                    <span className="block text-xs mt-0.5 opacity-80">+ Instant access when deals go live</span>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {planTier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isVip ? 'text-purple-500' : isPro ? 'text-orange-500' : 'text-gray-400'}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => !isCurrent && !isDowngrade && handleSubscribe(planTier.id)}
                  disabled={loading === planTier.id || !!isCurrent || !!isDowngrade}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-60 ${
                    isCurrent
                      ? 'bg-orange-100 text-orange-700 cursor-default'
                      : isVip
                      ? 'bg-purple-600 hover:bg-purple-700 text-white disabled:cursor-not-allowed'
                      : isPro
                      ? 'bg-orange-500 hover:bg-orange-600 text-white disabled:cursor-not-allowed'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {btnLabel}
                </button>

                {planTier.id !== 'free' && !isCurrent && (
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
            { label: 'Free', base: 30, extra: 0, price: 200, color: 'text-gray-600' },
            { label: 'Pro', base: 30, extra: 5, price: 200, color: 'text-orange-600' },
            { label: 'VIP', base: 30, extra: 12, price: 200, color: 'text-purple-600' },
          ].map(({ label, base, extra, price, color }) => {
            const effective = Math.min(90, base + extra)
            const final = Math.round(price * (1 - effective / 100))
            return (
              <div key={label} className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
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
