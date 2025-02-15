'use client'

import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface Trip {
  id: string
  title: string
  start_date: string
  end_date: string
  status: 'upcoming' | 'past' | 'draft'
  locations: string[]
  activities: number
  image_url?: string
}

interface TripCardProps {
  trip: Trip
  compact?: boolean
}

export function TripCard({ trip, compact }: TripCardProps) {
  if (compact) {
    return (
      <Link
        href={`/dashboard/trips/${trip.id}`}
        className="block rounded-lg border bg-card p-4 hover:bg-accent"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{trip.title}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(trip.start_date)}
            </p>
          </div>
          <div
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              trip.status === 'upcoming'
                ? 'bg-primary/10 text-primary'
                : trip.status === 'past'
                ? 'bg-muted text-muted-foreground'
                : 'bg-yellow-500/10 text-yellow-500'
            }`}
          >
            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/dashboard/trips/${trip.id}`}
      className="block rounded-lg border bg-card hover:bg-accent"
    >
      <div className="flex flex-col gap-6 p-6 sm:flex-row">
        <div
          className="aspect-video w-full rounded-lg bg-cover bg-center sm:w-48"
          style={{
            backgroundImage: `url(${
              trip.image_url ||
              'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2850&q=80'
            })`,
          }}
        />
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{trip.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
              </p>
            </div>
            <div
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                trip.status === 'upcoming'
                  ? 'bg-primary/10 text-primary'
                  : trip.status === 'past'
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-yellow-500/10 text-yellow-500'
              }`}
            >
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {trip.locations.map((location) => (
              <span
                key={location}
                className="rounded-full bg-accent px-2 py-1 text-xs"
              >
                {location}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{trip.activities} activities</span>
            </div>
            <div className="flex items-center gap-1 ```
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{trip.locations.length} locations</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}