'use client'

import { use, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, MapPin, Users, ArrowLeft, CheckCircle } from 'lucide-react'
import { DEMO_DEALS } from '@/lib/demo-data'
import { getCityById, formatPrice } from '@/lib/cities'

function timeLeft(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return 'Expired'
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`
}

export default function DealPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ city?: string }>
}) {
  const { id } = use(params)
  const { city: cityId = 'dubai' } = use(searchParams)
  const city = getCityById(cityId)

  const deal = DEMO_DEALS.find((d) => d.id === id)
  const [booked, setBooked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [qty, setQty] = useState(1)

  if (!deal) notFound()

  const discountedPrice = Math.round(deal.original_price * (1 - deal.discount_pct / 100))
  const total = discountedPrice * qty
  const expires = timeLeft(deal.expires_at)
  const isUrgent = new Date(deal.expires_at).getTime() - Date.now() < 3600000

  async function handleBook() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId: deal!.id, quantity: qty, cityId }),
      })
      const data = await res.json()
      if (data.demo) {
        setBooked(true)
      } else if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error ?? 'Something went wrong')
      }
    } catch {
      alert('Failed to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (booked) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking confirmed!</h2>
        <p className="text-gray-500 mb-6">
          You booked <strong>{qty}x {deal.title}</strong> at {deal.businesses?.name}.
          Check your email for details.
        </p>
        <Link href={`/?city=${cityId}`} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors inline-block">
          Find more deals in {city.flag} {city.name}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href={`/?city=${cityId}`} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to {city.flag} {city.name} deals
      </Link>

      {/* Image */}
      <div className="h-64 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl mb-6 relative overflow-hidden">
        {deal.image_url && (
          <img src={deal.image_url} alt={deal.title} className="w-full h-full object-cover" />
        )}
        <div className={`absolute top-4 right-4 flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full ${isUrgent ? 'bg-red-500 text-white' : 'bg-white text-gray-800'}`}>
          <Clock className="w-4 h-4" />
          {expires}
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <p className="text-sm font-medium text-orange-500 mb-1 capitalize">{deal.category} · {deal.businesses?.name}</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{deal.title}</h1>
        <p className="text-gray-600 mb-4">{deal.description}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {deal.businesses?.address}, {deal.businesses?.city}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {deal.spots_remaining} of {deal.spots_total} spots left
          </span>
        </div>
      </div>

      {/* Booking */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-3xl font-bold text-gray-900">{formatPrice(discountedPrice, city)}</span>
            <span className="text-gray-400 line-through ml-2">{formatPrice(deal.original_price, city)}</span>
            <span className="ml-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{deal.discount_pct}% off</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-8 h-8 rounded-full border border-gray-200 font-bold text-lg flex items-center justify-center hover:bg-gray-50"
            >
              −
            </button>
            <span className="font-semibold w-4 text-center">{qty}</span>
            <button
              onClick={() => setQty(Math.min(deal.spots_remaining, qty + 1))}
              className="w-8 h-8 rounded-full border border-gray-200 font-bold text-lg flex items-center justify-center hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>Total ({city.currency})</span>
          <span className="font-semibold text-gray-900">{formatPrice(total, city)}</span>
        </div>

        <button
          onClick={handleBook}
          disabled={loading || deal.spots_remaining === 0}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-colors text-lg"
        >
          {loading ? 'Processing…' : deal.spots_remaining === 0 ? 'Sold out' : `Book now — ${formatPrice(total, city)}`}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">No cancellations — flash deal pricing</p>
      </div>
    </div>
  )
}
