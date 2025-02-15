import React from 'react'
import { Plane, Hotel, Utensils, Bike } from 'lucide-react'

function Home() {
  return (
    <main className="container mx-auto px-4 py-16 text-white">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Helping You Find Iceland</h1>
        <p className="text-xl text-gray-300 mb-8">
          Aurora are Iceland's first dedicated provider of digital tools and websites,
          helping businesses be found and visitors find what they want.
        </p>
        <div className="flex justify-center gap-8 mb-12">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 p-2 rounded">✓</span>
            <span>Trusted by 500+ Businesses</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 p-2 rounded">⏰</span>
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 p-2 rounded">🌐</span>
            <span>Multi-language</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-gray-800/50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">For Businesses</h2>
          <p className="mb-6">Create your professional website with AI-powered tools and grow your business online.</p>
          <button className="bg-emerald-500 px-6 py-2 rounded-lg">Get Started →</button>
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-emerald-500">✓</span>
              <span>AI-powered website builder</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              <span>Multi-language support</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">For Visitors</h2>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search businesses..."
              className="w-full p-3 rounded-lg bg-gray-700/50"
            />
          </div>
          <div className="flex gap-4 mb-6">
            <button className="flex items-center gap-2 bg-gray-700/50 px-4 py-2 rounded-lg">
              <Plane size={16} />
              Tours
            </button>
            <button className="flex items-center gap-2 bg-gray-700/50 px-4 py-2 rounded-lg">
              <Hotel size={16} />
              Hotels
            </button>
            <button className="flex items-center gap-2 bg-gray-700/50 px-4 py-2 rounded-lg">
              <Utensils size={16} />
              Restaurants
            </button>
            <button className="flex items-center gap-2 bg-gray-700/50 px-4 py-2 rounded-lg">
              <Bike size={16} />
              Activities
            </button>
          </div>
          <button className="w-full bg-emerald-500 py-2 rounded-lg">Sign up for free</button>
        </div>
      </div>
    </main>
  )
}

export default Home 