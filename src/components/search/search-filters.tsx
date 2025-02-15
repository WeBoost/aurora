'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const CATEGORIES = [
  { id: 'restaurants', name: 'Restaurants' },
  { id: 'hotels', name: 'Hotels' },
  { id: 'activities', name: 'Activities' },
  { id: 'tours', name: 'Tours' },
]

const PRICE_RANGES = [
  { id: '1', label: '₽' },
  { id: '2', label: '₽₽' },
  { id: '3', label: '₽₽₽' },
]

interface SearchFiltersProps {
  filters: {
    category: string | null
    location: string | null
    priceRange: string[]
    rating?: number
  }
  onChange: (filters: any) => void
}

export function SearchFilters({ filters, onChange }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilters = (updates: any) => {
    const newFilters = { ...filters, ...updates }
    onChange(newFilters)

    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        params.delete(key)
      } else if (Array.isArray(value)) {
        params.delete(key)
        value.forEach((v) => params.append(key, v))
      } else {
        params.set(key, String(value))
      }
    })

    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-sm font-medium">Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2"
            >
              <input
                type="radio"
                name="category"
                checked={filters.category === category.id}
                onChange={() => updateFilters({ category: category.id })}
                className="h-4 w-4 rounded-full border-primary text-primary"
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-medium">Price Range</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <label
              key={range.id}
              className="flex items-center gap-2"
            >
              <input
                type="checkbox"
                checked={filters.priceRange.includes(range.id)}
                onChange={(e) => {
                  const newPriceRange = e.target.checked
                    ? [...filters.priceRange, range.id]
                    : filters.priceRange.filter((id) => id !== range.id)
                  updateFilters({ priceRange: newPriceRange })
                }}
                className="h-4 w-4 rounded border-primary text-primary"
              />
              <span className="text-sm">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-medium">Rating</h3>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={filters.rating || 1}
          onChange={(e) => updateFilters({ rating: Number(e.target.value) })}
          className="w-full"
        />
        <div className="mt-2 flex justify-between text-sm">
          <span>1★</span>
          <span>{filters.rating || 1}★ and up</span>
        </div>
      </div>
    </div>
  )
}