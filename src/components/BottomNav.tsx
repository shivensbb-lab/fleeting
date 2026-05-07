'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Home, Ticket, Star, Briefcase, User } from 'lucide-react'

function BottomNavInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const city = searchParams.get('city') ?? 'dubai'

  const links = [
    { href: `/?city=${city}`,          label: 'Deals',    Icon: Home },
    { href: '/my-bookings',             label: 'Bookings', Icon: Ticket },
    { href: '/pricing',                 label: 'Pricing',  Icon: Star },
    { href: '/business/dashboard',      label: 'Business', Icon: Briefcase },
    { href: '/auth',                    label: 'Account',  Icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 sm:hidden">
      <div className="flex">
        {links.map(({ href, label, Icon }) => {
          const isActive = href === `/?city=${city}`
            ? pathname === '/'
            : pathname.startsWith(href.split('?')[0]) && href !== `/?city=${city}`

          return (
            <Link
              key={label}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-xs font-medium transition-colors ${
                isActive ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-orange-500' : ''}`} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default function BottomNav() {
  return (
    <Suspense fallback={null}>
      <BottomNavInner />
    </Suspense>
  )
}
