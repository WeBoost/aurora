'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { useTrips } from '@/hooks/useTrips'
import { TripCard } from '@/components/trip-card'

const TRIP_STATUS = {
  upcoming: 'Upcoming',
  past: 'Past',
  draft: 'Draft',
}

export default function TripsPage() {
  const { trips, loading, error } = useTrips()
  const [selectedStatus, setSelectedStatus] = useState<keyof typeof TRIP_STATUS>('upcoming')

  const filteredTrips = trips?.filter((trip) => trip.status === selectedStatus)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Trips</h1>
          <p className="text-muted-foreground">
            Plan and manage your Iceland adventures
          </p>
        </div>
        <Link
          href="/dashboard/trips/new"
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="mr-2 h-5 w-5"
          >
            <path d="M5.127 3.502L5.25 3.5h9.5c.041 0 .082 0 .123.002A2.251 2.251 0 0012.75 2h-5.5a2.25 2.25 0 00-2.123 1.502zM1 10.75A.75.75 0 011.75 10H4v7.25a.75.75 0 01-1.5 0v-5.5a.75.75 0 00-1.5 0v5.5z" />
            <path
              fillRule="evenodd"
              d="M3.5 10.75v-2.5a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v2.5a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75zm.75-1.75v1h10.5v-1H4.25z"
              clipRule="evenodd"
            />
          </svg>
          Plan New Trip
        </Link>
      </div>

      <div className="flex space-x-1 rounded-lg border bg-card p-1">
        {Object.entries(TRIP_STATUS).map(([status, label]) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status as keyof typeof TRIP_STATUS)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedStatus === status
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-lg border bg-card"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border bg-card p-6 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="mx-auto h-12 w-12 text-destructive"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="mt-4 font-medium">Error</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {error.message}
          </p>
        </div>
      ) : filteredTrips?.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="mx-auto h-12 w-12 text-muted-foreground"
          >
            <path d="M5.127 3.502L5.25 3.5h9.5c.041 0 .082 0 .123.002A2.251 2.251 0 0012.75 2h-5.5a2.25 2.25 0 00-2.123 1.502zM1 10.75A.75.75 0 011.75 10H4v7.25a.75.75 0 01-1.5 0v-5.5a.75.75 0 00-1.5 0v5.5z" />
            <path
              fillRule="evenodd"
              d="M3.5 10.75v-2.5a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v2.5a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75zm.75-1.75v1h10.5v-1H4.25z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium">No Trips Found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {selectedStatus === 'upcoming'
              ? "You don't have any upcoming trips"
              : selectedStatus === 'past'
              ? "You haven't completed any trips yet"
              : "You don't have any draft trips"}
          </p>
          <Link
            href="/dashboard/trips/new"
            className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            Plan your first trip
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="ml-1 h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTrips?.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  )
}