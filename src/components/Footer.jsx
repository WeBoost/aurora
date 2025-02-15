import React from 'react'
import { Link } from 'react-router-dom'
import { Home, Search, Building2, User } from 'lucide-react'

function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-gray-800/50 py-4">
      <div className="container mx-auto">
        <nav className="flex justify-around items-center">
          <Link to="/" className="flex flex-col items-center text-white">
            <Home size={24} />
            <span>Home</span>
          </Link>
          <Link to="/explore" className="flex flex-col items-center text-white">
            <Search size={24} />
            <span>Explore</span>
          </Link>
          <Link to="/business" className="flex flex-col items-center text-white">
            <Building2 size={24} />
            <span>Business</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center text-white">
            <User size={24} />
            <span>Profile</span>
          </Link>
        </nav>
      </div>
    </footer>
  )
}

export default Footer 