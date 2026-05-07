export type City = {
  id: string
  name: string
  country: string
  flag: string
  currency: string
  currencySymbol: string
  locale: string
  timezone: string
}

export const CITIES: City[] = [
  { id: 'dubai',       name: 'Dubai',         country: 'UAE',           flag: '🇦🇪', currency: 'AED', currencySymbol: 'AED', locale: 'en-AE', timezone: 'Asia/Dubai' },
  { id: 'new-york',    name: 'New York',       country: 'USA',           flag: '🇺🇸', currency: 'USD', currencySymbol: '$',   locale: 'en-US', timezone: 'America/New_York' },
  { id: 'london',      name: 'London',         country: 'UK',            flag: '🇬🇧', currency: 'GBP', currencySymbol: '£',   locale: 'en-GB', timezone: 'Europe/London' },
  { id: 'paris',       name: 'Paris',          country: 'France',        flag: '🇫🇷', currency: 'EUR', currencySymbol: '€',   locale: 'fr-FR', timezone: 'Europe/Paris' },
  { id: 'tokyo',       name: 'Tokyo',          country: 'Japan',         flag: '🇯🇵', currency: 'JPY', currencySymbol: '¥',   locale: 'ja-JP', timezone: 'Asia/Tokyo' },
  { id: 'singapore',   name: 'Singapore',      country: 'Singapore',     flag: '🇸🇬', currency: 'SGD', currencySymbol: 'S$',  locale: 'en-SG', timezone: 'Asia/Singapore' },
  { id: 'sydney',      name: 'Sydney',         country: 'Australia',     flag: '🇦🇺', currency: 'AUD', currencySymbol: 'A$',  locale: 'en-AU', timezone: 'Australia/Sydney' },
  { id: 'toronto',     name: 'Toronto',        country: 'Canada',        flag: '🇨🇦', currency: 'CAD', currencySymbol: 'C$',  locale: 'en-CA', timezone: 'America/Toronto' },
  { id: 'los-angeles', name: 'Los Angeles',    country: 'USA',           flag: '🇺🇸', currency: 'USD', currencySymbol: '$',   locale: 'en-US', timezone: 'America/Los_Angeles' },
  { id: 'miami',       name: 'Miami',          country: 'USA',           flag: '🇺🇸', currency: 'USD', currencySymbol: '$',   locale: 'en-US', timezone: 'America/New_York' },
  { id: 'amsterdam',   name: 'Amsterdam',      country: 'Netherlands',   flag: '🇳🇱', currency: 'EUR', currencySymbol: '€',   locale: 'nl-NL', timezone: 'Europe/Amsterdam' },
  { id: 'barcelona',   name: 'Barcelona',      country: 'Spain',         flag: '🇪🇸', currency: 'EUR', currencySymbol: '€',   locale: 'es-ES', timezone: 'Europe/Madrid' },
  { id: 'istanbul',    name: 'Istanbul',       country: 'Turkey',        flag: '🇹🇷', currency: 'TRY', currencySymbol: '₺',   locale: 'tr-TR', timezone: 'Europe/Istanbul' },
  { id: 'bangkok',     name: 'Bangkok',        country: 'Thailand',      flag: '🇹🇭', currency: 'THB', currencySymbol: '฿',   locale: 'th-TH', timezone: 'Asia/Bangkok' },
  { id: 'mumbai',      name: 'Mumbai',         country: 'India',         flag: '🇮🇳', currency: 'INR', currencySymbol: '₹',   locale: 'en-IN', timezone: 'Asia/Kolkata' },
]

export const DEFAULT_CITY = CITIES[0] // Dubai is the default

export function getCityById(id: string): City {
  return CITIES.find((c) => c.id === id) ?? DEFAULT_CITY
}

export function formatPrice(amount: number, city: City): string {
  if (city.currency === 'JPY' || city.currency === 'INR' || city.currency === 'THB') {
    return `${city.currencySymbol}${Math.round(amount).toLocaleString()}`
  }
  return `${city.currencySymbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}
