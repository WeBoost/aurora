'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/components/providers/supabase-provider'
import { BusinessDashboard } from '@/components/business-dashboard'
import { VisitorDashboard } from '@/components/visitor-dashboard'

export default function DashboardPage() {
  const { supabase } = useSupabase()
  const [userType, setUserType] = useState<'business' | 'visitor' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUserType = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.user_metadata?.user_type) {
          setUserType(user.user_metadata.user_type)
        }
      } finally {
        setLoading(false)
      }
    }

    getUserType()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return userType === 'business' ? <BusinessDashboard /> : <VisitorDashboard />
}