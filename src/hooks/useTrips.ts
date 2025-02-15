'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/supabase-provider'

interface Trip {
  id: string
  user_id: string
  title: string
  start_date: string
  end_date: string
  status: 'upcoming' | 'past' | 'draft'
  locations: string[]
  activities: number
  image_url?: string
  created_at: string
  updated_at: string
}

export function useTrips() {
  const { supabase } = useSupabase()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .eq('user_id', user.id)
          .order('start_date', { ascending: true })

        if (error) throw error
        setTrips(data || [])
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()

    // Subscribe to changes
    const subscription = supabase
      .channel('trips_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trips',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTrips((current) => [...current, payload.new as Trip])
          } else if (payload.eventType === 'UPDATE') {
            setTrips((current) =>
              current.map((trip) =>
                trip.id === payload.new.id ? (payload.new as Trip) : trip
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setTrips((current) =>
              current.filter((trip) => trip.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const createTrip = async (data: Omit<Trip, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: newTrip, error } = await supabase
        .from('trips')
        .insert([
          {
            ...data,
            user_id: user.id,
          },
        ])
        .select()
        .single()

      if (error) throw error
      return newTrip
    } catch (e) {
      throw e
    }
  }

  const updateTrip = async (id: string, updates: Partial<Trip>) => {
    try {
      const { error } = await supabase
        .from('trips')
        .update(updates)
        .eq('id', id)

      if (error) throw error
    } catch (e) {
      throw e
    }
  }

  const deleteTrip = async (id: string) => {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (e) {
      throw e
    }
  }

  return {
    trips,
    loading,
    error,
    createTrip,
    updateTrip,
    deleteTrip,
  }
}