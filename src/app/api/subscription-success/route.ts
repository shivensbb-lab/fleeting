import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const tier = req.nextUrl.searchParams.get('tier')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  if (!tier || !['pro', 'vip'].includes(tier)) {
    return NextResponse.redirect(`${appUrl}/pricing`)
  }

  // Redirect to a page that will update the user's tier after they land
  return NextResponse.redirect(`${appUrl}/pricing?subscribed=${tier}`)
}
