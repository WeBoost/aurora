import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface DeploymentStatus {
  status: 'pending' | 'building' | 'deployed' | 'failed';
  url?: string;
  error?: string;
}

export function useDeployment(businessId: string | undefined) {
  const [status, setStatus] = useState<DeploymentStatus>({ status: 'pending' });

  const deploy = async () => {
    if (!businessId) return;

    try {
      setStatus({ status: 'building' });

      // Update website status
      const { error: updateError } = await supabase
        .from('websites')
        .update({
          status: 'building',
          updated_at: new Date().toISOString(),
        })
        .eq('business_id', businessId);

      if (updateError) throw updateError;

      // Trigger deployment
      const { data: deployData, error: deployError } = await supabase
        .functions.invoke('deploy-website', {
          body: { businessId },
        });

      if (deployError) throw deployError;

      setStatus({
        status: 'deployed',
        url: deployData.url,
      });

      // Update website with deployment info
      await supabase
        .from('websites')
        .update({
          status: 'active',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('business_id', businessId);

    } catch (error) {
      console.error('Deployment failed:', error);
      setStatus({
        status: 'failed',
        error: 'Failed to deploy website',
      });
    }
  };

  return {
    status,
    deploy,
  };
}