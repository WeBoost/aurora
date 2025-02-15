import React from 'react'
import { Link } from 'react-router-dom'
import { Globe, Phone, Mail } from 'lucide-react'

function Navbar() {
  return (
    <header className="text-white">
      <div className="bg-gray-800/50 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe size={16} />
              <select className="bg-transparent">
                <option value="en">English</option>
                <option value="is">ISK</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+354123456" className="flex items-center gap-2">
              <Phone size={16} />
              +354 123 4567
            </a>
            <a href="mailto:support@aurora.is" className="flex items-center gap-2">
              <Mail size={16} />
              support@aurora.is
            </a>
          </div>
        </div>
      </div>
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">AURORA</Link>
        <div className="flex items-center gap-8">
          <Link to="/pricing">Pricing</Link>
          <Link to="/features">Features</Link>
          <Link to="/help">Help Center</Link>
          <button className="bg-blue-600 px-4 py-2 rounded-lg">Sign In</button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar 