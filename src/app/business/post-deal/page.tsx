'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const CATEGORIES = ['restaurant', 'fitness', 'salon', 'spa', 'entertainment', 'other']

export default function PostDeal() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'restaurant',
    original_price: '',
    discount_pct: '30',
    spots_total: '10',
    hours_until_expiry: '4',
  })

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  const discountedPrice = form.original_price
    ? Math.round(Number(form.original_price) * (1 - Number(form.discount_pct) / 100))
    : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success || data.demo) {
        router.push('/business/dashboard')
      } else {
        alert(data.error ?? 'Failed to post deal')
      }
    } catch {
      alert('Failed to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <Link href="/business/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a flash deal</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deal title</label>
            <input
              required
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. Last-minute blowout — $45 instead of $85"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Tell customers what they're getting and why it's available…"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 capitalize"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="capitalize">{c}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original price ($)</label>
              <input
                required
                type="number"
                min="1"
                value={form.original_price}
                onChange={(e) => update('original_price', e.target.value)}
                placeholder="85"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
              <input
                required
                type="number"
                min="10"
                max="70"
                value={form.discount_pct}
                onChange={(e) => update('discount_pct', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {discountedPrice && (
            <div className="bg-orange-50 rounded-xl px-4 py-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">Customer pays</span>
              <div>
                <span className="font-bold text-orange-600 text-lg">${discountedPrice}</span>
                <span className="text-gray-400 line-through ml-2">${form.original_price}</span>
                <span className="text-gray-500 ml-2">· you earn ${Math.round(discountedPrice * 0.88)}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available spots</label>
              <input
                required
                type="number"
                min="1"
                value={form.spots_total}
                onChange={(e) => update('spots_total', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expires in (hours)</label>
              <select
                value={form.hours_until_expiry}
                onChange={(e) => update('hours_until_expiry', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                {[1, 2, 3, 4, 6, 8, 12, 24].map((h) => (
                  <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-colors text-lg"
        >
          {loading ? 'Posting…' : 'Go live now'}
        </button>
        <p className="text-center text-xs text-gray-400">
          Your deal goes live instantly. You keep 88% of every booking.
        </p>
      </form>
    </div>
  )
}
