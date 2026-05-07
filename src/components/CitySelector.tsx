'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, Globe, Search } from 'lucide-react'
import { CITIES, getCityById } from '@/lib/cities'

export default function CitySelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cityId = searchParams.get('city') ?? 'dubai'
  const city = getCityById(cityId)

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = query
    ? CITIES.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.country.toLowerCase().includes(query.toLowerCase()))
    : CITIES

  function select(id: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('city', id)
    if (params.has('category')) params.delete('category')
    router.push(`/?${params.toString()}`)
    setOpen(false)
    setQuery('')
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium hover:border-orange-400 transition-colors shadow-sm"
      >
        <Globe className="w-4 h-4 text-orange-500" />
        <span className="text-lg leading-none">{city.flag}</span>
        <span className="text-gray-800">{city.name}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city or country…"
                className="bg-transparent text-sm flex-1 outline-none text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </div>
          <ul className="py-1 max-h-72 overflow-y-auto">
            {filtered.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => select(c.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors text-left ${c.id === cityId ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'}`}
                >
                  <span className="text-xl leading-none">{c.flag}</span>
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.country} · {c.currency}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
