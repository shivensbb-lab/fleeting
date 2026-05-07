import Link from 'next/link'
import { CalendarCheck, Star, Zap } from 'lucide-react'

export default function MyBookings() {
  return (
    <div className="max-w-md mx-auto pt-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

      {/* Empty state */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center mb-6">
        <CalendarCheck className="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <p className="font-semibold text-gray-700 mb-1">No bookings yet</p>
        <p className="text-sm text-gray-400 mb-6">
          Sign in to track your bookings, or grab your first deal now.
        </p>
        <Link href="/auth" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl inline-block transition-colors text-sm">
          Sign in
        </Link>
      </div>

      {/* Quick nav */}
      <div className="space-y-2">
        <Link href="/" className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 hover:border-orange-200 transition-colors">
          <Zap className="w-5 h-5 text-orange-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Browse flash deals</p>
            <p className="text-xs text-gray-400">Find your next booking</p>
          </div>
        </Link>
        <Link href="/pricing" className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 hover:border-orange-200 transition-colors">
          <Star className="w-5 h-5 text-orange-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Upgrade for bigger discounts</p>
            <p className="text-xs text-gray-400">Pro saves you 5% more on every deal</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
