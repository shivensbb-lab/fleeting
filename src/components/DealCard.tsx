import Link from 'next/link'
import { Clock, MapPin, Users } from 'lucide-react'
import type { Deal } from '@/lib/supabase'
import { type City, formatPrice } from '@/lib/cities'

function timeLeft(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return 'Expired'
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`
}

const CATEGORY_COLORS: Record<string, string> = {
  restaurant: 'bg-red-100 text-red-700',
  fitness: 'bg-green-100 text-green-700',
  salon: 'bg-purple-100 text-purple-700',
  spa: 'bg-blue-100 text-blue-700',
  entertainment: 'bg-yellow-100 text-yellow-700',
  default: 'bg-gray-100 text-gray-700',
}

export default function DealCard({ deal, city }: { deal: Deal; city: City }) {
  const discountedPrice = Math.round(deal.original_price * (1 - deal.discount_pct / 100))
  const expires = timeLeft(deal.expires_at)
  const isUrgent = new Date(deal.expires_at).getTime() - Date.now() < 3600000
  const colorClass = CATEGORY_COLORS[deal.category] ?? CATEGORY_COLORS.default

  return (
    <Link href={`/deals/${deal.id}?city=${city.id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="h-44 bg-gradient-to-br from-orange-100 to-orange-200 relative">
          {deal.image_url && (
            <img src={deal.image_url} alt={deal.title} className="w-full h-full object-cover" />
          )}
          <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full capitalize ${colorClass}`}>
            {deal.category}
          </span>
          <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${isUrgent ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}>
            <Clock className="w-3 h-3" />
            {expires}
          </span>
        </div>

        <div className="p-4">
          <p className="text-xs text-gray-500 font-medium mb-1">{deal.businesses?.name}</p>
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
            {deal.title}
          </h3>

          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {deal.businesses?.city ?? city.name}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {deal.spots_remaining} spots left
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">{formatPrice(discountedPrice, city)}</span>
              <span className="text-sm text-gray-400 line-through">{formatPrice(deal.original_price, city)}</span>
            </div>
            <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              {deal.discount_pct}% off
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
