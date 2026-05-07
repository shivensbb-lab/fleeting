import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import { AuthProvider } from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'Fleeting — Flash Deals Near You',
  description: 'Grab last-minute deals from local restaurants, gyms, salons, and more before they disappear.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 py-8 pb-24 sm:pb-8">{children}</main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  )
}
