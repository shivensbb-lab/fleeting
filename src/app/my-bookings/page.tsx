'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  CalendarCheck, Star, Zap, MapPin, Clock, CheckCircle2,
  ChevronRight, Crown, QrCode, TrendingUp, Globe, Ticket,
  ArrowRight, Flame, User
} from 'lucide-react'

type BookingStatus = 'upcoming' | 'completed' | 'all'

const DEMO_BOOKINGS = [
  {
    id: 'bk-1',
    dealId: 'dubai-1',
    title: 'Sunset Dhow Cruise Dinner',
    business: 'Golden Dhow Cruises',
    city: 'Dubai', cityId: 'dubai', flag: '🇦🇪',
    category: 'entertainment',
    date: 'Today, 7:00 PM',
    paidAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    originalPrice: 350,
    paidPrice: 210,
    discountPct: 40,
    status: 'upcoming' as const,
    ref: 'FLT-8821',
    address: 'Dubai Creek Harbour',
  },
  {
    id: 'bk-2',
    dealId: 'ldn-1',
    title: 'Afternoon Tea for 2 — Mayfair',
    business: 'The Lanesborough',
    city: 'London', cityId: 'london', flag: '🇬🇧',
    category: 'restaurant',
    date: 'May 3, 3:00 PM',
    paidAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    originalPrice: 95,
    paidPrice: 62,
    discountPct: 35,
    status: 'completed' as const,
    ref: 'FLT-7214',
    address: 'Hyde Park Corner, Mayfair',
  },
  {
    id: 'bk-3',
    dealId: 'nyc-1',
    title: '2-for-1 Pasta Night',
    business: "Bella's Bistro",
    city: 'New York', cityId: 'new-york', flag: '🇺🇸',
    category: 'restaurant',
    date: 'Apr 29, 8:00 PM',
    paidAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    originalPrice: 56,
    paidPrice: 28,
    discountPct: 50,
    status: 'completed' as const,
    ref: 'FLT-6903',
    address: '123 Mulberry St, NYC',
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  restaurant: 'bg-amber-100 text-amber-700',
  spa: 'bg-pink-100 text-pink-700',
  entertainment: 'bg-purple-100 text-purple-700',
  fitness: 'bg-green-100 text-green-700',
  salon: 'bg-rose-100 text-rose-700',
}

const totalSaved = DEMO_BOOKINGS.reduce((s, b) => s + (b.originalPrice - b.paidPrice), 0)
const cities = [...new Set(DEMO_BOOKINGS.map((b) => b.city))]

export default function MyBookings() {
  const [filter, setFilter] = useState<BookingStatus>('all')
  const [showQr, setShowQr] = useState<string | null>(null)

  const filtered = filter === 'all' ? DEMO_BOOKINGS : DEMO_BOOKINGS.filter((b) => b.status === filter)
  const upcoming = DEMO_BOOKINGS.filter((b) => b.status === 'upcoming').length
  const completed = DEMO_BOOKINGS.filter((b) => b.status === 'completed').length

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex gap-6">

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside className="hidden md:flex flex-col gap-4 w-64 flex-shrink-0">

          {/* Profile */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <User className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Guest User</p>
                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  <Zap className="w-3 h-3" /> Free
                </span>
              </div>
            </div>
            <Link
              href="/auth"
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-xl transition-colors"
            >
              Sign in for real bookings
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Your stats</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Ticket className="w-4 h-4 text-orange-400" />
                  Bookings
                </div>
                <span className="font-bold text-gray-900">{DEMO_BOOKINGS.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Total saved
                </div>
                <span className="font-bold text-green-600">${totalSaved}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="w-4 h-4 text-blue-400" />
                  Cities
                </div>
                <span className="font-bold text-gray-900">{cities.length}</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Filter</p>
            <div className="space-y-1">
              {([
                { key: 'all', label: 'All bookings', count: DEMO_BOOKINGS.length },
                { key: 'upcoming', label: 'Upcoming', count: upcoming },
                { key: 'completed', label: 'Completed', count: completed },
              ] as { key: BookingStatus; label: string; count: number }[]).map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    filter === key
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === key ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Cities visited */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Cities visited</p>
            <div className="space-y-2">
              {DEMO_BOOKINGS.filter((b, i, arr) => arr.findIndex(x => x.city === b.city) === i).map((b) => (
                <Link
                  key={b.cityId}
                  href={`/?city=${b.cityId}`}
                  className="flex items-center justify-between text-sm text-gray-700 hover:text-orange-500 transition-colors group"
                >
                  <span>{b.flag} {b.city}</span>
                  <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-orange-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Upgrade card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
            <Crown className="w-6 h-6 mb-2 opacity-90" />
            <p className="font-bold text-sm mb-1">Upgrade to Pro</p>
            <p className="text-xs opacity-80 mb-3">Save an extra 5% on every deal you book.</p>
            <Link
              href="/pricing"
              className="block text-center bg-white text-orange-600 text-xs font-bold py-2 rounded-xl hover:bg-orange-50 transition-colors"
            >
              See plans →
            </Link>
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Quick links</p>
            {[
              { href: '/', icon: Flame, label: 'Browse deals' },
              { href: '/pricing', icon: Star, label: 'Upgrade plan' },
              { href: '/business/dashboard', icon: TrendingUp, label: 'Business dashboard' },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        </aside>

        {/* ── Main content ────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
            <Link href="/" className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              <Zap className="w-4 h-4" />
              Find deals
            </Link>
          </div>

          {/* Mobile filter tabs */}
          <div className="flex gap-2 mb-4 md:hidden">
            {(['all', 'upcoming', 'completed'] as BookingStatus[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                  filter === f ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Sign-in notice */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center justify-between mb-5 text-sm">
            <p className="text-blue-700"><span className="font-semibold">Showing demo bookings.</span> Sign in to track real ones.</p>
            <Link href="/auth" className="text-blue-600 font-semibold hover:underline whitespace-nowrap ml-3">Sign in →</Link>
          </div>

          {/* Booking cards */}
          <div className="space-y-4">
            {filtered.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Card header */}
                <div className="px-5 pt-5 pb-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${CATEGORY_COLORS[booking.category] ?? 'bg-gray-100 text-gray-600'}`}>
                          {booking.category}
                        </span>
                        {booking.status === 'upcoming' ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" /> Upcoming
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        )}
                      </div>
                      <h2 className="font-bold text-gray-900 text-base leading-snug">{booking.title}</h2>
                      <p className="text-sm text-gray-500 mt-0.5">{booking.business}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-bold text-gray-900">${booking.paidPrice}</p>
                      <p className="text-xs text-green-600 font-semibold">saved ${booking.originalPrice - booking.paidPrice}</p>
                    </div>
                  </div>

                  {/* Details row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <CalendarCheck className="w-3.5 h-3.5" /> {booking.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {booking.address}
                    </span>
                    <span className="flex items-center gap-1">
                      {booking.flag} {booking.city}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setShowQr(showQr === booking.id ? null : booking.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      {showQr === booking.id ? 'Hide' : 'Show'} ticket
                    </button>
                    <Link
                      href={`/deals/${booking.dealId}?city=${booking.cityId}`}
                      className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      View deal <ChevronRight className="w-3 h-3" />
                    </Link>
                    <span className="text-xs text-gray-400 ml-auto">Ref: {booking.ref}</span>
                  </div>
                </div>

                {/* QR ticket panel */}
                {showQr === booking.id && (
                  <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 flex items-center gap-5">
                    <div className="w-20 h-20 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <QrCode className="w-12 h-12 text-gray-800" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-0.5">{booking.title}</p>
                      <p className="text-xs text-gray-500 mb-2">{booking.business} · {booking.city}</p>
                      <p className="text-xs font-mono bg-white border border-gray-200 px-2 py-1 rounded-lg text-gray-700 inline-block">{booking.ref}</p>
                      <p className="text-xs text-gray-400 mt-1.5">Show this at the venue</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty state for filter */}
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <CalendarCheck className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="font-semibold text-gray-700 mb-1">No {filter} bookings</p>
              <p className="text-sm text-gray-400 mb-5">Grab a flash deal to fill your calendar.</p>
              <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl inline-block transition-colors text-sm">
                Browse deals
              </Link>
            </div>
          )}

          {/* Bottom promo */}
          <div className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-gray-900 text-sm mb-0.5">Unlock bigger savings</p>
              <p className="text-xs text-gray-600">Pro members save an extra 5% on every deal they book.</p>
            </div>
            <Link href="/pricing" className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
              Upgrade →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
