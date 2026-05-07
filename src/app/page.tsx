import { Suspense } from 'react'
import DealCard from '@/components/DealCard'
import CitySelector from '@/components/CitySelector'
import { getDealsByCity } from '@/lib/demo-data'
import { getCityById } from '@/lib/cities'
import { Zap, Clock, TrendingDown } from 'lucide-react'

const CATEGORIES = ['All', 'Restaurant', 'Fitness', 'Salon', 'Spa', 'Entertainment']

function avgTimeLeft(deals: { expires_at: string }[]): string {
  if (!deals.length) return '—'
  const avgMs = deals.reduce((s, d) => s + (new Date(d.expires_at).getTime() - Date.now()), 0) / deals.length
  if (avgMs <= 0) return '< 1m'
  const h = Math.floor(avgMs / 3600000)
  const m = Math.floor((avgMs % 3600000) / 60000)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

async function DealsSection({ cityId, category }: { cityId: string; category?: string }) {
  const city = getCityById(cityId)
  let deals = getDealsByCity(cityId)

  if (category && category !== 'all') {
    deals = deals.filter((d) => d.category === category)
  }

  const avgDiscount = deals.length
    ? Math.round(deals.reduce((s, d) => s + d.discount_pct, 0) / deals.length)
    : 0

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: Zap, label: 'Live deals', value: `${deals.length}` },
          { icon: Clock, label: 'Avg. time left', value: avgTimeLeft(deals) },
          { icon: TrendingDown, label: 'Avg. discount', value: `${avgDiscount}%` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-orange-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 truncate">{label}</p>
              <p className="font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const href = cat === 'All'
            ? `/?city=${cityId}`
            : `/?city=${cityId}&category=${cat.toLowerCase()}`
          const isActive = cat === 'All'
            ? !category || category === 'all'
            : category === cat.toLowerCase()
          return (
            <a
              key={cat}
              href={href}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${isActive ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-200 bg-white hover:border-orange-400 hover:text-orange-500'}`}
            >
              {cat}
            </a>
          )
        })}
      </div>

      {deals.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg font-medium mb-2">No deals right now</p>
          <p className="text-gray-400 text-sm">Check back soon — deals drop throughout the day.</p>
          <a href={`/?city=${cityId}`} className="mt-4 inline-block text-orange-500 text-sm hover:underline">
            Clear filter
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} city={city} />
          ))}
        </div>
      )}
    </>
  )
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; category?: string }>
}) {
  const params = await searchParams
  const cityId = params.city ?? 'dubai'
  const city = getCityById(cityId)
  const category = params.category

  return (
    <div>
      {/* Hero */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Flash deals in{' '}
            <span className="text-orange-500">{city.flag} {city.name}</span>
          </h1>
          <p className="text-gray-500">Last-minute openings — real savings, expiring today.</p>
        </div>
        <Suspense>
          <CitySelector />
        </Suspense>
      </div>

      <Suspense fallback={<div className="text-gray-400 text-sm">Loading deals…</div>}>
        <DealsSection cityId={cityId} category={category} />
      </Suspense>
    </div>
  )
}
