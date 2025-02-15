'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWebsiteBuilder } from '@/hooks/useWebsiteBuilder'

const CHECKLIST_ITEMS = [
  {
    id: 'content',
    name: 'Website Content',
    description: 'Add sections and content to your website',
  },
  {
    id: 'design',
    name: 'Design & Branding',
    description: 'Customize colors, fonts, and layout',
  },
  {
    id: 'seo',
    name: 'SEO Settings',
    description: 'Configure meta tags and descriptions',
  },
  {
    id: 'domain',
    name: 'Domain Setup',
    description: 'Configure your domain settings',
  },
]

export default function DeployPage() {
  const router = useRouter()
  const { website, loading, error, deployWebsite } = useWebsiteBuilder()
  const [deploying, setDeploying] = useState(false)
  const [deployError, setDeployError] = useState<string | null>(null)
  const [deployStatus, setDeployStatus] = useState<'pending' | 'building' | 'deployed' | 'failed'>('pending')

  const handleDeploy = async () => {
    try {
      setDeploying(true)
      setDeployError(null)
      setDeployStatus('building')
      
      await deployWebsite()
      setDeployStatus('deployed')
    } catch (error) {
      console.error('Failed to deploy:', error)
      setDeployError(error instanceof Error ? error.message : 'Failed to deploy website')
      setDeployStatus('failed')
    } finally {
      setDeploying(false)
    }
  }

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

  if (error || !website) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="mx-auto h-12 w-12 text-destructive"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="mt-4 text-lg font-semibold">Website Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {error?.message || 'Please set up your website first'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Deploy Website</h1>
          <p className="text-muted-foreground">
            Review and deploy your website changes
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="rounded-lg border border-input bg-background p-2.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Pre-deployment Checklist</h2>
          <div className="mt-4 space-y-4">
            {CHECKLIST_ITEMS.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-lg border bg-card p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5 text-primary"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <button className="rounded-lg border px-3 py-1 text-sm hover:bg-accent hover:text-accent-foreground">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Domain Settings</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your Website URL</p>
                  <p className="mt-1 font-medium">
                    https://{website.subdomain}.aurora.tech
                  </p>
                </div>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Active
                </div>
              </div>
            </div>

            {website.custom_domain && (
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Custom Domain</p>
                    <p className="mt-1 font-medium">
                      https://{website.custom_domain}
                    </p>
                  </div>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Active
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {deployStatus === 'failed' ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="mx-auto h-12 w-12 text-destructive"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-destructive">
            Deployment Failed
          </h3>
          <p className="mt-2 text-sm text-destructive">
            {deployError || 'An error occurred during deployment'}
          </p>
          <button
            onClick={handleDeploy}
            className="mt-4 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
          >
            Try Again
          </button>
        </div>
      ) : deployStatus === 'deployed' ? (
        <div className="rounded-lg border border-primary bg-primary/10 p-6 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="mx-auto h-12 w-12 text-primary"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-primary">
            Website Deployed!
          </h3>
          <p className="mt-2 text-sm text-primary">
            Your website is now live and accessible to visitors
          </p>
          <button
            onClick={() => window.open(`https://${website.subdomain}.aurora.tech`, '_blank')}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            View Website
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ) : (
        <button
          onClick={handleDeploy}
          disabled={deploying}
          className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deploying ? 'Deploying...' : 'Deploy Website'}
        </button>
      )}
    </div>
  )
}