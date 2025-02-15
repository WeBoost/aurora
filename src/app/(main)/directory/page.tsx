'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CategoryGrid } from '@/components/directory/category-grid'
import { LocationGrid } from '@/components/directory/location-grid'
import { PopularBusinesses } from '@/components/directory/popular-businesses'
import { WeatherWidget } from '@/components/weather-widget'

export default function DirectoryPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedLocation) params.set('location', selectedLocation)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="container mx-auto space-y-12 py-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold">Discover Iceland</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Find and book amazing experiences across Iceland
        </p>
      </section>

      <section className="rounded-lg border bg-card p-6">
        <h2 className="mb-6 text-2xl font-bold">Categories</h2>
        <CategoryGrid
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </section>

      <section className="rounded-lg border bg-card p-6">
        <h2 className="mb-6 text-2xl font-bold">Popular Locations</h2>
        <LocationGrid
          selected={selectedLocation}
          onSelect={setSelectedLocation}
        />
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-6 text-2xl font-bold">Popular Businesses</h2>
          <PopularBusinesses />
        </div>
        
        <div>
          <h2 className="mb-6 text-2xl font-bold">Current Weather</h2>
          <WeatherWidget />
        </div>
      </section>
    </div>
  )
}