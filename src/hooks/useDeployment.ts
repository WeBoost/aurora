'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/supabase-provider'

interface Deployment {
  id: string
  website_id: string
  status: 'pending' | 'building' | 'deployed' | 'failed'
  deploy_url: string | null
  error: string | null
  created_at: string
  updated_at: string
}

interface DeploymentLog {
  id: string
  deployment_id: string
  message: string
  level: 'info' | 'warning' | 'error'
  created_at: string
}

export function useDeployment(websiteId: string) {
  const { supabase } = useSupabase()
  const [deployment, setDeployment] = useState<Deployment | null>(null)
  const [logs, setLogs] = useState<DeploymentLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchDeployment = async () => {
      try {
        const { data, error } = await supabase
          .from('deployments')
          .select('*')
          .eq('website_id', websiteId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (error) throw error
        setDeployment(data)

        if (data) {
          const { data: logData, error: logError } = await supabase
            .from('deployment_logs')
            .select('*')
            .eq('deployment_id', data.id)
            .order('created_at', { ascending: true })

          if (logError) throw logError
          setLogs(logData || [])
        }
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchDeployment()

    // Subscribe to deployment updates
    const deploymentSubscription = supabase
      .channel('deployment_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deployments',
          filter: `website_id=eq.${websiteId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setDeployment(payload.new as Deployment)
          }
        }
      )
      .subscribe()

    // Subscribe to deployment logs
    const logsSubscription = supabase
      .channel('deployment_logs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'deployment_logs',
          filter: deployment
            ? `deployment_id=eq.${deployment.id}`
            : undefined,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLogs((current) => [...current, payload.new as DeploymentLog])
          }
        }
      )
      .subscribe()

    return () => {
      deploymentSubscription.unsubscribe()
      logsSubscription.unsubscribe()
    }
  }, [supabase, websiteId, deployment?.id])

  const deploy = async () => {
    try {
      // Create new deployment record
      const { data: newDeployment, error: deploymentError } = await supabase
        .from('deployments')
        .insert({
          website_id: websiteId,
          status: 'pending',
        })
        .select()
        .single()

      if (deploymentError) throw deploymentError

      // Trigger deployment via Edge Function
      const { error: functionError } = await supabase.functions.invoke(
        'deploy-website',
        {
          body: { deploymentId: newDeployment.id },
        }
      )

      if (functionError) throw functionError
      return newDeployment
    } catch (e) {
      throw e
    }
  }

  return {
    deployment,
    logs,
    loading,
    error,
    deploy,
  }
}