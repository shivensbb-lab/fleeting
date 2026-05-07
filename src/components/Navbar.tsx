'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Zap, Settings } from 'lucide-react'
import { Suspense } from 'react'

function NavLinks() {
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
          <Link href="/auth"
            className="ml-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            Sign In
          </Link>
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
