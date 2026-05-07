'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, ExternalLink, ChevronDown, ChevronUp, Zap } from 'lucide-react'
import Link from 'next/link'

type Health = {
  supabase: boolean
  stripe: boolean
  eventbrite: boolean
  yelp: boolean
  timeout_scraper: boolean
}

type Step = {
  title: string
  description: string
  instructions: string[]
  envKey: string
  link: string
  linkLabel: string
  impact: string
}

const STEPS: Step[] = [
  {
    title: 'Supabase',
    description: 'Your database. Stores deals, bookings, and users.',
    envKey: 'supabase',
    link: 'https://supabase.com',
    linkLabel: 'Create free project at supabase.com',
    impact: 'Required to go live. Without this, the app runs on demo data only.',
    instructions: [
      '1. Go to supabase.com and click "Start your project" — it\'s free.',
      '2. Create a new project. Name it "fleeting". Choose the region closest to your city.',
      '3. Once the project loads, click "Project Settings" in the left sidebar.',
      '4. Click "API" in the settings menu.',
      '5. Copy the "Project URL" — paste it as NEXT_PUBLIC_SUPABASE_URL in your .env.local file.',
      '6. Copy the "anon public" key — paste it as NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      '7. Copy the "service_role" key — paste it as SUPABASE_SERVICE_ROLE_KEY.',
      '8. Now click "SQL Editor" in the left sidebar.',
      '9. Paste the contents of the file "supabase-schema.sql" (in your fleeting folder) and click Run.',
      '10. Also run this extra SQL for real-deal caching (copy the block below):',
    ],
  },
  {
    title: 'Stripe',
    description: 'Payments. Charges customers and pays you and businesses.',
    envKey: 'stripe',
    link: 'https://dashboard.stripe.com/register',
    linkLabel: 'Create free account at stripe.com',
    impact: 'Required to take real payments. In demo mode, bookings are simulated.',
    instructions: [
      '1. Go to stripe.com and create a free account.',
      '2. In the Stripe Dashboard, click "Developers" in the top right.',
      '3. Click "API keys".',
      '4. Copy the "Publishable key" — paste it as NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local.',
      '5. Click "Reveal test key" next to "Secret key" — paste it as STRIPE_SECRET_KEY.',
      '6. For production, toggle "Live mode" (top right) and repeat — get your live keys.',
      '7. To receive payouts, complete Stripe identity verification under "Account settings".',
    ],
  },
  {
    title: 'Eventbrite (real events)',
    description: 'Pulls live events from cities worldwide — Dubai, London, NYC, Tokyo, and more.',
    envKey: 'eventbrite',
    link: 'https://www.eventbrite.com/platform/api',
    linkLabel: 'Get free API key at eventbrite.com/platform',
    impact: 'Adds real events (concerts, workshops, dining experiences) to every city automatically.',
    instructions: [
      '1. Go to eventbrite.com and sign in or create a free account.',
      '2. Visit eventbrite.com/platform/api and click "Get a Free API Key".',
      '3. Fill in the form — put "Fleeting" as the app name.',
      '4. After submitting, go to your app\'s settings page.',
      '5. Copy the "Private Token" — paste it as EVENTBRITE_TOKEN in your .env.local file.',
      '6. Save the file and restart your app (stop and run "npm run dev" again).',
    ],
  },
  {
    title: 'Yelp Fusion (restaurants & businesses)',
    description: 'Pulls highly-rated restaurants, spas, gyms and salons from US, UK, Europe.',
    envKey: 'yelp',
    link: 'https://www.yelp.com/developers/v3/manage_app',
    linkLabel: 'Get free API key at yelp.com/developers',
    impact: 'Adds real local businesses to restaurant, fitness, salon, and spa categories.',
    instructions: [
      '1. Go to yelp.com/developers and sign in or create a free account.',
      '2. Click "Create New App" on the developer dashboard.',
      '3. Fill in the form — name your app "Fleeting", category "Local & Travel".',
      '4. Agree to the terms and submit.',
      '5. Your API key will appear on the app page — copy it.',
      '6. Paste it as YELP_API_KEY in your .env.local file.',
      '7. Free tier gives you 500 API calls per day.',
    ],
  },
]

const FETCHED_DEALS_SQL = `-- Add this to Supabase SQL Editor
create table if not exists fetched_deals (
  id text primary key,
  city_id text not null,
  title text not null,
  description text,
  category text not null,
  original_price numeric,
  discount_pct integer default 20,
  spots_remaining integer default 5,
  expires_at timestamptz not null,
  source text not null,
  source_url text,
  business_name text,
  business_address text,
  currency text default 'USD',
  fetched_at timestamptz default now()
);
create index if not exists fetched_deals_city_idx on fetched_deals(city_id);
create index if not exists fetched_deals_expires_idx on fetched_deals(expires_at);`

export default function SetupPage() {
  const [health, setHealth] = useState<Health | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/health').then((r) => r.json()).then(setHealth)
  }, [])

  const connected = health ? Object.values(health).filter(Boolean).length : 0
  const total = 5

  function copySQL() {
    navigator.clipboard.writeText(FETCHED_DEALS_SQL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <Zap className="w-6 h-6 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-900">Fleeting Setup</h1>
      </div>
      <p className="text-gray-500 mb-8">Connect these services to go from demo to fully live. Each step has exact instructions — no coding needed.</p>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-gray-800">Setup progress</p>
          <p className="text-sm text-gray-500">{connected} / {total} connected</p>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-700"
            style={{ width: `${(connected / total) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {connected === total
            ? '🎉 All set! Your app is fully live.'
            : connected === 0
            ? 'Running in demo mode. Connect services below to go live.'
            : `Partially live — ${total - connected} service${total - connected > 1 ? 's' : ''} still to connect.`}
        </p>
      </div>

      {/* Status overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {health && (
          <>
            {[
              { key: 'supabase', label: 'Database' },
              { key: 'stripe', label: 'Payments' },
              { key: 'eventbrite', label: 'Events' },
              { key: 'yelp', label: 'Businesses' },
              { key: 'timeout_scraper', label: 'TimeOut (always on)' },
            ].map(({ key, label }) => {
              const ok = health[key as keyof Health]
              return (
                <div key={key} className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium ${ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                  {ok ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                  {label}
                </div>
              )
            })}
          </>
        )}
        {!health && <p className="text-sm text-gray-400 col-span-3">Checking status…</p>}
      </div>

      {/* Step-by-step instructions */}
      <div className="space-y-3">
        {STEPS.map((step) => {
          const ok = health?.[step.envKey as keyof Health]
          const isOpen = expanded === step.title

          return (
            <div key={step.title} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-colors ${ok ? 'border-green-200' : 'border-gray-100'}`}>
              <button
                onClick={() => setExpanded(isOpen ? null : step.title)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  {ok
                    ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    : <XCircle className="w-5 h-5 text-gray-300 flex-shrink-0" />}
                  <div>
                    <p className={`font-semibold ${ok ? 'text-green-700' : 'text-gray-900'}`}>{step.title}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
              </button>

              {isOpen && (
                <div className="px-6 pb-6 border-t border-gray-50">
                  <div className="bg-orange-50 rounded-xl p-3 text-xs text-orange-700 mb-4 mt-4">
                    <strong>Why this matters:</strong> {step.impact}
                  </div>

                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-orange-500 hover:underline mb-5"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {step.linkLabel}
                  </a>

                  <ol className="space-y-2">
                    {step.instructions.map((inst, i) => (
                      <li key={i} className="text-sm text-gray-700 leading-relaxed">{inst}</li>
                    ))}
                  </ol>

                  {step.envKey === 'supabase' && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-gray-600">Fetched deals table SQL (copy and run in Supabase SQL Editor):</p>
                        <button onClick={copySQL} className="text-xs text-orange-500 font-medium hover:underline">
                          {copied ? 'Copied!' : 'Copy SQL'}
                        </button>
                      </div>
                      <pre className="bg-gray-900 text-green-400 text-xs p-4 rounded-xl overflow-x-auto whitespace-pre-wrap">{FETCHED_DEALS_SQL}</pre>
                    </div>
                  )}

                  <div className="mt-5 bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Then add to your <code className="bg-gray-200 px-1 rounded">.env.local</code> file:</p>
                    <div className="font-mono text-xs text-gray-800 space-y-1">
                      {step.envKey === 'supabase' && (
                        <>
                          <p>NEXT_PUBLIC_SUPABASE_URL=<span className="text-orange-500">your_project_url</span></p>
                          <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=<span className="text-orange-500">your_anon_key</span></p>
                          <p>SUPABASE_SERVICE_ROLE_KEY=<span className="text-orange-500">your_service_role_key</span></p>
                        </>
                      )}
                      {step.envKey === 'stripe' && (
                        <>
                          <p>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<span className="text-orange-500">pk_test_...</span></p>
                          <p>STRIPE_SECRET_KEY=<span className="text-orange-500">sk_test_...</span></p>
                        </>
                      )}
                      {step.envKey === 'eventbrite' && (
                        <p>EVENTBRITE_TOKEN=<span className="text-orange-500">your_private_token</span></p>
                      )}
                      {step.envKey === 'yelp' && (
                        <p>YELP_API_KEY=<span className="text-orange-500">your_api_key</span></p>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">After editing .env.local, stop the app (Ctrl+C) and run <code className="bg-gray-200 px-1 rounded">npm run dev</code> again.</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
        <Link href="/" className="hover:text-orange-500 transition-colors">← Browse deals</Link>
        <span>·</span>
        <Link href="/business/dashboard" className="hover:text-orange-500 transition-colors">Business dashboard →</Link>
      </div>
    </div>
  )
}
