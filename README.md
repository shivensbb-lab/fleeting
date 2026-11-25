# Fleeting

**Last-minute deals from local businesses before they disappear.**

Fleeting is a web app where restaurants, gyms, salons, spas and entertainment venues post
time-limited discounts on spots they'd otherwise leave empty. Customers browse live deals in
their city, see a countdown on each one, and book before it expires.

Built with Next.js 16, React 19, Tailwind CSS 4, Supabase and Stripe.

## Features

- **Live deals by city:** Dubai, New York, London, Paris, Tokyo, Singapore, Sydney, Toronto,
  Los Angeles and more, each priced in the local currency.
- **Countdown timers:** deals show time left and are flagged when under an hour remains.
- **Category filters:** restaurant, fitness, salon, spa, entertainment.
- **Booking and checkout** through Stripe, with a platform fee taken on each booking.
- **My Bookings:** booking history with stats, filters and QR tickets.
- **Subscriptions:** Free, Pro and VIP tiers, with a Stripe billing portal to manage or cancel.
- **Business dashboard:** businesses can sign up and post their own deals.
- **Automatic deal refresh:** a daily Vercel Cron job pulls deals from Eventbrite, Yelp and
  Time Out into Supabase.
- **Demo mode:** with no API keys set, the app runs on built-in sample data.

## Getting started

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
git clone https://github.com/shivensbb-lab/fleeting.git
cd fleeting
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. With the placeholder values in `.env.example` the app runs in demo
mode. To use real data, fill in your keys (see below).

### Environment variables

All variables are listed in [`.env.example`](./.env.example).

| Variable | Needed for |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Database and sign-in |
| `SUPABASE_SERVICE_ROLE_KEY` | The cron job writing deals (server only) |
| `STRIPE_SECRET_KEY`, `STRIPE_PRO_PRICE_ID`, `STRIPE_VIP_PRICE_ID` | Payments and subscriptions |
| `PLATFORM_FEE_PERCENT` | Fee per booking (default 12) |
| `EVENTBRITE_TOKEN`, `YELP_API_KEY` | Optional deal sources |
| `CRON_SECRET` | Protecting the refresh endpoint |
| `NEXT_PUBLIC_APP_URL` | Stripe redirect URLs |

`GET /api/health` reports which services are configured.

### Database

Create a [Supabase](https://supabase.com) project, then run
[`supabase-schema.sql`](./supabase-schema.sql) in its SQL editor.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
  app/            Pages and API routes (App Router)
    api/          checkout, subscribe, deals, cron, health…
    business/     Business sign-up, dashboard, post a deal
    deals/[id]/   Deal detail and booking
  components/     Navbar, DealCard, CitySelector, AuthProvider…
  lib/            Supabase and Stripe clients, cities, demo data, helpers
    sources/      Eventbrite, Yelp and Time Out deal fetchers
```

## Deploying

The app is set up for [Vercel](https://vercel.com). Import the repo, add the environment
variables, and deploy. The daily refresh job is configured in [`vercel.json`](./vercel.json).

## Contributing

Issues and pull requests are welcome. Before opening a PR, check that
`npm run lint` and `npm run build` pass. CI runs both on every push.

## License

[MIT](./LICENSE)
