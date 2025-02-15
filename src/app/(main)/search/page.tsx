'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { SearchFilters } from '@/components/search/search-filters'
import { SearchResults } from '@/components/search/search-results'
import { SearchInput } from '@/components/search/search-input'
import { useBusinessSearch } from '@/hooks/useBusinessSearch'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState({
    category: searchParams.get('category'),
    location: searchParams.get('location'),
    priceRange: searchParams.getAll('price'),
    rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
  })

  const { businesses, loading, error, total } = useBusinessSearch({
    query: searchParams.get('q') || undefined,
    ...filters,
  })

  return (
    <div className="container mx-auto flex min-h-screen gap-8 py-8">
      <aside className="hidden w-64 flex-shrink-0 lg:block">
        <SearchFilters
          filters={filters}
          onChange={setFilters}
        />
      </aside>

      <main className="flex-1 space-y-6">
        <div className="sticky top-16 z-10 -mx-4 bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SearchInput />
          
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {total} businesses found
            </p>
            <button className="lg:hidden">
              <span className="sr-only">Filters</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <SearchResults
          businesses={businesses}
          loading={loading}
          error={error}
        />
      </main>
    </div>
  )
}