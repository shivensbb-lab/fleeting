'use client'

import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { Zap, Settings, LogOut, User, Crown, Star, ChevronDown } from 'lucide-react'
import { Suspense, useState, useRef, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'

const TIER_BADGE: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  pro: { label: 'Pro', className: 'bg-orange-100 text-orange-700', icon: <Star className="w-3 h-3" /> },
  vip: { label: 'VIP', className: 'bg-purple-100 text-purple-700', icon: <Crown className="w-3 h-3" /> },
}

function UserMenu() {
  const { user, tier, signOut } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!user) return null

  const badge = TIER_BADGE[tier]
  const initials = (user.user_metadata?.name as string | undefined)
    ?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) ?? '?'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-xl px-3 py-1.5 transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </div>
        <span className="text-sm font-medium text-gray-800 max-w-[80px] truncate hidden sm:block">
          {(user.user_metadata?.name as string | undefined) ?? user.email?.split('@')[0]}
        </span>
        {badge && (
          <span className={`hidden sm:flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full ${badge.className}`}>
            {badge.icon}{badge.label}
          </span>
        )}
        <ChevronDown className="w-3 h-3 text-gray-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-gray-100 shadow-lg py-1.5 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {(user.user_metadata?.name as string | undefined) ?? 'Account'}
            </p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
            <p className="text-xs font-medium mt-0.5 capitalize text-orange-500">{tier} plan</p>
          </div>
          <Link href="/my-bookings" onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <User className="w-4 h-4 text-gray-400" /> My Bookings
          </Link>
          <Link href="/pricing" onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Crown className="w-4 h-4 text-gray-400" /> Upgrade Plan
          </Link>
          <Link href="/setup" onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Settings className="w-4 h-4 text-gray-400" /> Setup
          </Link>
          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              onClick={async () => { setOpen(false); await signOut(); router.push('/') }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function NavLinks() {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isBusiness = pathname.startsWith('/business')
  const cityParam = searchParams.get('city') ?? 'dubai'

  return (
    <div className="flex items-center gap-1">
      {isBusiness ? (
        <>
          <Link href="/business/dashboard"
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${pathname === '/business/dashboard' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
            Dashboard
          </Link>
          <Link href="/business/post-deal"
            className="ml-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            + Post Deal
          </Link>
        </>
      ) : (
        <>
          <Link href={`/?city=${cityParam}`}
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors hidden sm:block ${pathname === '/' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
            Deals
          </Link>
          <Link href="/pricing"
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors hidden sm:block ${pathname === '/pricing' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
            Pricing
          </Link>
          <Link href="/business/signup"
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors hidden sm:block ${pathname.startsWith('/business') ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
            For Business
          </Link>
          <Link href="/setup" title="Setup guide"
            className="text-gray-400 hover:text-orange-500 p-1.5 rounded-lg hidden sm:flex items-center transition-colors">
            <Settings className="w-4 h-4" />
          </Link>
          {!loading && (
            user
              ? <UserMenu />
              : (
                <Link href="/auth"
                  className="ml-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                  Sign In
                </Link>
              )
          )}
        </>
      )}
    </div>
  )
}

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 font-bold text-lg text-orange-500">
          <Zap className="w-5 h-5 fill-orange-500" />
          Fleeting
        </Link>
        <Suspense fallback={null}>
          <NavLinks />
        </Suspense>
      </div>
    </nav>
  )
}
