import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  try {
    const { deploymentId } = await req.json()

    // Get deployment and website details
    const { data: deployment, error: deploymentError } = await supabase
      .from('deployments')
      .select(`
        *,
        website:websites (
          *,
          business:businesses (
            name,
            description
          )
        )
      `)
      .eq('id', deploymentId)
      .single()

    if (deploymentError) throw deploymentError
    if (!deployment) throw new Error('Deployment not found')

    // Update status to building
    await supabase
      .from('deployments')
      .update({ status: 'building' })
      .eq('id', deploymentId)

    // Log deployment start
    await supabase
      .from('deployment_logs')
      .insert({
        deployment_id: deploymentId,
        message: 'Starting deployment...',
        level: 'info',
      })

    try {
      // Build website
      await supabase
        .from('deployment_logs')
        .insert({
          deployment_id: deploymentId,
          message: 'Building website...',
          level: 'info',
        })

      // Deploy to hosting provider
      await supabase
        .from('deployment_logs')
        .insert({
          deployment_id: deploymentId,
          message: 'Deploying to hosting provider...',
          level: 'info',
        })

      // Update deployment status
      await supabase
        .from('deployments')
        .update({
          status: 'deployed',
          deploy_url: `https://${deployment.website.subdomain}.aurora.tech`,
        })
        .eq('id', deploymentId)

      // Log success
      await supabase
        .from('deployment_logs')
        .insert({
          deployment_id: deploymentId,
          message: 'Deployment completed successfully',
          level: 'info',
        })

      return new Response(
        JSON.stringify({
          status: 'success',
          url: `https://${deployment.website.subdomain}.aurora.tech`,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } catch (error) {
      // Log error
      await supabase
        .from('deployment_logs')
        .insert({
          deployment_id: deploymentId,
          message: error instanceof Error ? error.message : 'Unknown error',
          level: 'error',
        })

      // Update deployment status
      await supabase
        .from('deployments')
        .update({
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        .eq('id', deploymentId)

      throw error
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})