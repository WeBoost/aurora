'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/supabase-provider'

interface Business {
  id: string
  name: string
  description: string
  category: string
  city: string
  rating: number
  price_level: number
  image_url?: string
}

export function useRecommendations() {
  const { supabase } = useSupabase()
  const [recommendations, setRecommendations] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        // Get user's interests and past bookings
        const [interestsResponse, bookingsResponse] = await Promise.all([
          supabase
            .from('user_interests')
            .select('category')
            .eq('user_id', user.id),
          supabase
            .from('bookings')
            .select('business_id')
            .eq('user_id', user.id)
            .limit(10),
        ])

        if (interestsResponse.error) throw interestsResponse.error
        if (bookingsResponse.error) throw bookingsResponse.error

        const interests = interestsResponse.data.map((i) => i.category)
        const pastBusinessIds = bookingsResponse.data.map((b) => b.business_id)

        // Get recommended businesses based on interests
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .in('category', interests)
          .not('id', 'in', `(${pastBusinessIds.join(',')})`)
          .order('rating', { ascending: false })
          .limit(5)

        if (error) throw error
        setRecommendations(data || [])
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [supabase])

  return {
    recommendations,
    loading,
    error,
  }
}