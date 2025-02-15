import Link from 'next/link'

export function VisitorDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Explore Iceland</h1>
        <Link
          href="/dashboard/trips/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Plan a Trip
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 text-primary"
            >
              <path d="M5.127 3.502L5.25 3.5h9.5c.041 0 .082 0 .123.002A2.251 2.251 0 0012.75 2h-5.5a2.251 2.251 0 00-2.123 1.502zM1 10.75A.75.75 0 011.75 10H4v7.25a.75.75 0 01-1.5 0v-5.5a.75.75 0 00-1.5 0v5.5z" />
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
          <p className="mt-2 text-2xl font-bold">2</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Next trip in 14 days
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
                d="M1 4a1 1 0 011-1h16a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4zm12 4a3 3 0 11-6 0 3 3 0 016 0zM4 9a1 1 0 100-2 1 1 0 000 2zm13-1a1 1 0 11-2 0 1 1 0 012 0zM1.75 14.5a.75.75 0 000 1.5c4.417 0 8.693.603 12.749 1.73 1.111.309 2.251-.512 2.251-1.696v-.784a.75.75 0 00-1.5 0v.784a.272.272 0 01-.35.25A49.043 49.043 0 001.75 14.5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-muted-foreground">
              Total Spent
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold">ISK 345,600</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Over 8 bookings
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-lg border bg-card">
          <div className="p-6">
            <h2 className="font-semibold">Upcoming Bookings</h2>
            {/* Add booking list component here */}
          </div>
        </div>

        <div className="col-span-3 rounded-lg border bg-card">
          <div className="p-6">
            <h2 className="font-semibold">Recommended</h2>
            {/* Add recommendations component here */}
          </div>
        </div>
      </div>
    </div>
  )
}