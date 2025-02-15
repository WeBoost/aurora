import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

interface Business {
  id: string
  name: string
  description: string
  category: string
  city: string
  rating: number
  price_level: number
  image_url?: string
}

interface SearchResultsProps {
  businesses: Business[]
  loading: boolean
  error: Error | null
}

export function SearchResults({ businesses, loading, error }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border bg-card p-6"
          >
            <div className="h-32 w-full rounded-lg bg-muted" />
            <div className="mt-4 space-y-3">
              <div className="h-6 w-2/3 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
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
    )
  }

  if (businesses.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="mx-auto h-12 w-12 text-muted-foreground"
        >
          <path
            fillRule="evenodd"
            d="M10 3c-4.31 0-8 3.033-8 7 0 2.024.978 3.825 2.499 5.085a3.478 3.478 0 01-.522 1.756.75.75 0 00.584 1.143 5.976 5.976 0 003.936-1.108c.487.082.99.124 1.503.124 4.31 0 8-3.033 8-7s-3.69-7-8-7zm0 8a1 1 0 100-2 1 1 0 000 2zm-2-3a1 1 0 11-2 0 1 1 0 012 0zm5 1a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        <h3 className="mt-4 font-medium">No Results Found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {businesses.map((business) => (
        <Link
          key={business.id}
          href={`/business/${business.id}`}
          className="block rounded-lg border bg-card transition-colors hover:bg-accent"
        >
          <div className="flex flex-col gap-6 p-6 sm:flex-row">
            <div
              className="aspect-video w-full rounded-lg bg-cover bg-center sm:w-48"
              style={{
                backgroundImage: `url(${
                  business.image_url ||
                  'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2850&q=80'
                })`,
              }}
            />
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{business.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {business.category} • {business.city}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-sm text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{business.rating.toFixed(1)}</span>
                </div>
              </div>

              <p className="mt-2 line-clamp-2 text-sm">
                {business.description}
              </p>

              <div className="mt-4 flex items-center gap-4">
                <span className="text-sm font-medium">
                  {'₽'.repeat(business.price_level)}
                </span>
                <span className="text-sm text-muted-foreground">
                  Starting from {formatCurrency(9900)}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}