'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { cn } from '@/lib/utils'

interface MainNavProps {
  userType: 'business' | 'visitor' | null
}

export function MainNav({ userType }: MainNavProps) {
  const segment = useSelectedLayoutSegment()

  const businessLinks = [
    {
      href: '/dashboard',
      label: 'Overview',
      active: segment === null,
    },
    {
      href: '/dashboard/website',
      label: 'Website',
      active: segment === 'website',
    },
    {
      href: '/dashboard/bookings',
      label: 'Bookings',
      active: segment === 'bookings',
    },
    {
      href: '/dashboard/analytics',
      label: 'Analytics',
      active: segment === 'analytics',
    },
  ]

  const visitorLinks = [
    {
      href: '/dashboard',
      label: 'Explore',
      active: segment === null,
    },
    {
      href: '/dashboard/trips',
      label: 'My Trips',
      active: segment === 'trips',
    },
    {
      href: '/dashboard/bookings',
      label: 'My Bookings',
      active: segment === 'bookings',
    },
    {
      href: '/dashboard/favorites',
      label: 'Favorites',
      active: segment === 'favorites',
    },
  ]

  const links = userType === 'business' ? businessLinks : visitorLinks

  return (
    <nav className="flex items-center space-x-6">
      <Link
        href="/"
        className="hidden items-center space-x-2 md:flex"
      >
        <span className="hidden font-bold sm:inline-block">
          AURORA
        </span>
      </Link>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            link.active ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}