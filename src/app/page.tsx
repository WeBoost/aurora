import Link from 'next/link'
import { WeatherWidget } from '@/components/weather-widget'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2850&q=80)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/95" />
        
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
            Helping You Find Iceland
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Aurora are Iceland's first dedicated provider of digital tools and websites, 
            helping businesses be found and visitors find what they want.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/sign-up?type=business"
              className="inline-flex items-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
            >
              Create Business Profile
            </Link>
            <Link
              href="/sign-up?type=visitor"
              className="inline-flex items-center rounded-lg border border-primary bg-transparent px-6 py-3 font-medium text-primary hover:bg-primary/10"
            >
              Explore Iceland
            </Link>
          </div>
        </div>
      </section>

      {/* Weather Section */}
      <section className="bg-card py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Current Conditions</h2>
          <WeatherWidget />
        </div>
      </section>
    </main>
  )
}