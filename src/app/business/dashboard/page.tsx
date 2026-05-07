'use client'

import Link from 'next/link'
import { DollarSign, Users, TrendingUp, Plus, Zap } from 'lucide-react'

export default function BusinessDashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
        <Link
          href="/business/post-deal"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Post Deal
        </Link>
      </div>

      {/* Stats — zeroed out until real data */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: DollarSign, label: 'Revenue today', value: '$0', sub: 'after 12% fee' },
          { icon: Users,      label: 'Bookings today', value: '0',  sub: 'confirmed' },
          { icon: TrendingUp, label: 'Active deals',   value: '0',  sub: 'live right now' },
        ].map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-orange-500" />
              <p className="text-xs text-gray-500 font-medium">{label}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Active deals — empty state */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Active deals</h2>
        </div>
        <div className="p-12 text-center">
          <Zap className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="font-medium text-gray-600 mb-1">No active deals</p>
          <p className="text-sm text-gray-400 mb-5">
            Post a flash deal — it goes live instantly and customers can book within seconds.
          </p>
          <Link
            href="/business/post-deal"
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl inline-block transition-colors"
          >
            Post your first deal
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 text-sm text-orange-800">
        <p className="font-semibold mb-1">How Fleeting works for you</p>
        <p>You post a deal in 30 seconds. Customers book and pay instantly. You keep <strong>88%</strong> of every booking — we take 12% only when a deal converts. No subscription, no upfront cost.</p>
      </div>
    </div>
  )
}
