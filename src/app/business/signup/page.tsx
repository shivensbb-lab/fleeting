'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Zap, DollarSign, TrendingUp } from 'lucide-react'

const BENEFITS = [
  { icon: Zap, text: 'Go live in 30 seconds — post a deal instantly' },
  { icon: DollarSign, text: 'You keep 88% of every booking. We take 12%.' },
  { icon: TrendingUp, text: 'Fill dead capacity and earn revenue you would have lost' },
  { icon: CheckCircle, text: 'No subscription, no upfront cost — pay only when you earn' },
]

export default function BusinessSignup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', business_name: '', category: 'restaurant', address: '', city: '', password: '' })

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Demo: just redirect to dashboard
    setTimeout(() => router.push('/business/dashboard'), 800)
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left — benefits */}
      <div className="py-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Grow your business with Fleeting</h1>
        <p className="text-gray-500 mb-8">Turn empty seats and last-minute cancellations into real revenue.</p>
        <ul className="space-y-5">
          {BENEFITS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <div className="w-9 h-9 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-gray-700">{text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8 bg-orange-50 rounded-xl p-4 text-sm text-orange-700">
          Already have an account?{' '}
          <Link href="/auth" className="font-semibold hover:underline">Sign in →</Link>
        </div>
      </div>

      {/* Right — form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 h-fit">
        <h2 className="font-semibold text-gray-900 text-lg">Create your business account</h2>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">First name</label>
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Alex" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
            <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="alex@salon.com" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Business name</label>
          <input required value={form.business_name} onChange={(e) => update('business_name', e.target.value)} placeholder="Studio Luxe" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Category</label>
          <select value={form.category} onChange={(e) => update('category', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 capitalize">
            {['restaurant', 'fitness', 'salon', 'spa', 'entertainment', 'other'].map((c) => (
              <option key={c} value={c} className="capitalize">{c}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Address</label>
            <input required value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="123 Main St" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">City</label>
            <input required value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="San Francisco" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Password</label>
          <input required type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="••••••••" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-colors">
          {loading ? 'Creating account…' : 'Create account — free'}
        </button>
        <p className="text-center text-xs text-gray-400">No credit card required to sign up.</p>
      </form>
    </div>
  )
}
