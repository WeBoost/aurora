'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import { WeatherWidget } from '@/components/weather-widget'
import { TripCard } from '@/components/trip-card'
import { BusinessCard } from '@/components/business-card'
import { useBookings } from '@/hooks/useBookings'
import { useTrips } from '@/hooks/useTrips'
import { useRecommendations } from '@/hooks/useRecommendations'

export default function TouristDashboardPage() {
  const { bookings, loading: bookingsLoading } = useBookings()
  const { trips, loading: tripsLoading } = useTrips()
  const { recommendations, loading: recommendationsLoading } = useRecommendations()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tourist Dashboard</h1>
          <p className="text-muted-foreground">
            Plan your perfect Iceland adventure
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 text-primary"
            >
              <path d="M5.127 3.502L5.25 3.5h9.5c.041 0 .082 0 .123.002A2.251 2.251 0 0012.75 2h-5.5a2.25 2.25 0 00-2.123 1.502zM1 10.75A.75.75 0 011.75 10H4v7.25a.75.75 0 01-1.5 0v-5.5a.75.75 0 00-1.5 0v5.5z" />
              <path
                fillRule="evenodd"
                d="M3.5 10.75v-2.5a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v2.5a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75zm.75-1.75v1h10.5v-1H4.25z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-muted-foreground">
              Upcoming Trips
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold">{trips?.length || 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Next trip in {trips?.length ? '14 days' : 'N/A'}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 text-primary"
            >
              <path
                fillRule="evenodd"
                d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 001.075.676L10 15.082l5.925 2.844A.75.75 0 0017 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0010 2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-muted-foreground">
              Saved Places
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold">12</p>
          <p className="mt-1 text-xs text-muted-foreground">
            4 new this month
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 text-primary"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-muted-foreground">
              Bookings
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold">{bookings?.length || 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {bookings?.filter(b => b.status === 'upcoming').length || 0} upcoming
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 text-primary"
            >
              <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.25 13c.35 0 .69-.04 1.022-.118.254.302.48.623.687.961a5.598 5.598 0 01-2.257.634 3.001 3.001 0 01-4.539-1.441c-.91.23-1.688.65-2.327 1.262a1.5 1.5 0 01-2.4-1.8 6.01 6.01 0 012.98-3.182 6.039 6.039 0 01.236-.098 5.522 5.522 0 01-.262-.568 1.5 1.5 0 012.036-1.872A4.992 4.992 0 0111.5 7c.5 0 .994.055 1.418.157a1.5 1.5 0 012.036 1.872 5.52 5.52 0 01-.262.568c.084.03.162.062.236.098a6.01 6.01 0 012.98 3.182 1.5 1.5 0 01-2.4 1.8c-.638-.612-1.417-1.033-2.327-1.262a3.001 3.001 0 01-4.539 1.441 5.598 5.598 0 01-2.257-.634 8.005 8.005 0 00.687-.961A3.13 3.13 0 008.75 13c.35 0 .69-.04 1.022-.118V10.818l-1.072.787a.75.75 0 01-.89-1.21l2-1.5a.75.75 0 01.89 0l2 1.5a.75.75 0 01-.89 1.21l-1.072-.787zM3.28 2.22a.75.75 0 10-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06L3.28 2.22z" />
            </svg>
            <span className="text-sm font-medium text-muted-foreground">
              Total Spent
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {formatCurrency(345600)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Over {bookings?.length || 0} bookings
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-lg border bg-card">
            <div className="border-b p-6">
              <h2 className="font-semibold">Upcoming Trips</h2>
            </div>
            <div className="p-6">
              {tripsLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="h-32 animate-pulse rounded-lg bg-muted"
                    />
                  ))}
                </div>
              ) : trips?.length === 0 ? (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    No upcoming trips
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
                  {trips?.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-card">
            <div className="border-b p-6">
              <h2 className="font-semibold">Upcoming Bookings</h2>
            </div>
            <div className="p-6">
              {bookingsLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="h-32 animate-pulse rounded-lg bg-muted"
                    />
                  ))}
                </div>
              ) : bookings?.length === 0 ? (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    No upcoming bookings
                  </p>
                  <Link
                    href="/search"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    Explore activities
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
                  {bookings
                    ?.filter((b) => b.status === 'upcoming')
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center gap-4 rounded-lg border p-4"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{booking.service.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(booking.date)} at {booking.time}
                          </p>
                        </div>
                        <Link
                          href={`/dashboard/bookings/${booking.id}`}
                          className="rounded-lg border px-3 py-1 text-sm hover:bg-accent"
                        >
                          View Details
                        </Link>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-lg border bg-card">
            <div className="border-b p-6">
              <h2 className="font-semibold">Weather</h2>
            </div>
            <div className="p-6">
              <WeatherWidget useUserLocation />
            </div>
          </div>

          <div className="rounded-lg border bg-card">
            <div className="border-b p-6">
              <h2 className="font-semibold">Recommended</h2>
            </div>
            <div className="p-6">
              {recommendationsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-24 animate-pulse rounded-lg bg-muted"
                    />
                  ))}
                </div>
              ) : recommendations?.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No recommendations yet
                </p>
              ) : (
                <div className="space-y-4">
                  {recommendations?.map((business) => (
                    <BusinessCard
                      key={business.id}
                      business={business}
                      compact
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}