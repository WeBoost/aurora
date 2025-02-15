import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export function BusinessDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Business Dashboard</h1>
        <Link
          href="/dashboard/website"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Edit Website
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 text-primary"
            >
              <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
              <path
                fillRule="evenodd"
                d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-muted-foreground">
              Profile Views
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold">1,234</p>
          <p className="mt-1 text-xs text-muted-foreground">
            +12% from last month
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
          <p className="mt-2 text-2xl font-bold">156</p>
          <p className="mt-1 text-xs text-muted-foreground">
            +8% from last month
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
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.732 6.232a2.5 2.5 0 013.536 0 .75.75 0 101.06-1.06A4 4 0 006.5 8v.165c0 .364.034.728.1 1.085h-.35a.75.75 0 000 1.5h.737a5.25 5.25 0 01-.367 3.072l-.055.123a.75.75 0 00.848 1.037l1.272-.283a3.493 3.493 0 011.604.021 4.992 4.992 0 002.422 0l.97-.242a.75.75 0 00-.363-1.456l-.971.243a3.491 3.491 0 01-1.694 0 4.992 4.992 0 00-2.422 0c.146-.69.178-1.405.09-2.108l.463-.347a.75.75 0 10-.742-1.307l-.463.347a3.75 3.75 0 01-.775.393A6.75 6.75 0 018.732 6.232z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-muted-foreground">
              Revenue
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {formatCurrency(1234567)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            +23% from last month
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
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-muted-foreground">
              Rating
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold">4.8</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Based on 48 reviews
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-lg border bg-card">
          <div className="p-6">
            <h2 className="font-semibold">Recent Bookings</h2>
            {/* Add booking list component here */}
          </div>
        </div>

        <div className="col-span-3 rounded-lg border bg-card">
          <div className="p-6">
            <h2 className="font-semibold">Popular Services</h2>
            {/* Add services list component here */}
          </div>
        </div>
      </div>
    </div>
  )
}