import React from 'react'
import { Plane, Hotel, Utensils, Bike } from 'lucide-react'

function Home() {
  return (
    <main className="min-h-screen bg-stars bg-cover bg-no-repeat bg-center text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-6xl font-bold mb-6">Helping You Find Iceland</h1>
          <p className="text-xl text-gray-300 mb-12">
            Aurora are Iceland's first dedicated provider of digital tools and websites,
            helping businesses be found and visitors find what they want.
          </p>
          
          {/* Features */}
          <div className="flex justify-center gap-12 mb-16">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500/20 p-2 rounded-lg">
                <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Trusted by 500+ Businesses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500/20 p-2 rounded-lg">
                <span className="text-emerald-500">24/7</span>
              </div>
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500/20 p-2 rounded-lg">
                <span className="text-emerald-500">🌐</span>
              </div>
              <span>Multi-language</span>
            </div>
          </div>
        </section>

        {/* Two Column Section */}
        <div className="grid grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* For Businesses */}
          <div className="bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl">
            <div className="mb-4">
              <svg className="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">For Businesses</h2>
            <p className="text-gray-300 mb-6">
              Create your professional website with AI-powered tools and grow your
              business online.
            </p>
            <button className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-lg font-medium transition-colors">
              Get Started →
            </button>
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>AI-powered website builder</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Multi-language support</span>
              </div>
            </div>
          </div>

          {/* For Visitors */}
          <div className="bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl">
            <div className="mb-4">
              <svg className="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">For Visitors</h2>
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search businesses..."
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-emerald-500"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="flex items-center gap-2 bg-gray-700/50 px-4 py-2 rounded-lg hover:bg-gray-600/50 transition-colors">
                <Plane className="w-4 h-4" />
                Tours
              </button>
              <button className="flex items-center gap-2 bg-gray-700/50 px-4 py-2 rounded-lg hover:bg-gray-600/50 transition-colors">
                <Hotel className="w-4 h-4" />
                Hotels
              </button>
              <button className="flex items-center gap-2 bg-gray-700/50 px-4 py-2 rounded-lg hover:bg-gray-600/50 transition-colors">
                <Utensils className="w-4 h-4" />
                Restaurants
              </button>
              <button className="flex items-center gap-2 bg-gray-700/50 px-4 py-2 rounded-lg hover:bg-gray-600/50 transition-colors">
                <Bike className="w-4 h-4" />
                Activities
              </button>
            </div>
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded-lg font-medium transition-colors">
              Sign up for free
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home 