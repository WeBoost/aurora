'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSupabase } from '@/components/providers/supabase-provider'
import { MainNav } from '@/components/main-nav'
import { UserNav } from '@/components/user-nav'
import { WeatherWidget } from '@/components/weather-widget'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { supabase } = useSupabase()
  const [userType, setUserType] = useState<'business' | 'visitor' | null>(null)

  useEffect(() => {
    const getUserType = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata?.user_type) {
        setUserType(user.user_metadata.user_type)
      }
    }

    getUserType()
  }, [supabase])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav userType={userType} />
          <div className="ml-auto flex items-center space-x-4">
            <WeatherWidget compact />
            <UserNav />
          </div>
        </div>
      </header>
      
      <div className="container flex-1 space-y-4 p-8 pt-6">
        {children}
      </div>
    </div>
  )
}