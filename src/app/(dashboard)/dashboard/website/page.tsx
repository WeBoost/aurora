'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useWebsiteBuilder } from '@/hooks/useWebsiteBuilder'
import { WebsitePreview } from '@/components/website-preview'
import { WebsiteSectionManager } from '@/components/website-section-manager'

export default function WebsiteBuilderPage() {
  const router = useRouter()
  const { website, content, loading, error, publishWebsite } = useWebsiteBuilder()
  const [publishing, setPublishing] = useState(false)

  const handlePublish = async () => {
    try {
      setPublishing(true)
      await publishWebsite()
      router.push('/dashboard/website/deploy')
    } catch (error) {
      console.error('Failed to publish website:', error)
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-2 text-sm text-muted-foreground">Loading website...</p>
        </div>
      </div>
    )
  }

  if (error) {
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
          <h2 className="mt-4 text-lg font-semibold">Failed to load website</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!website) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="mx-auto h-12 w-12 text-primary"
          >
            <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
            <path
              fillRule="evenodd"
              d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="mt-4 text-lg font-semibold">Create Your Website</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started by choosing a template for your website
          </p>
          <Link
            href="/dashboard/website/templates"
            className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Choose Template
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Website Builder</h1>
          <p className="text-muted-foreground">
            Build and customize your business website
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/website/preview"
            className="inline-flex items-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Preview
          </Link>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {publishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h2 className="mb-4 font-semibold">Website Information</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-muted-foreground">Website URL</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <span className="text-sm">
                    https://{website.subdomain}.aurora.tech
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://${website.subdomain}.aurora.tech`
                      )
                    }}
                    className="rounded-md p-1 hover:bg-accent hover:text-accent-foreground"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                      <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                    </svg>
                  </button>
                </dd>
              </div>
              {website.custom_domain && (
                <div>
                  <dt className="text-sm text-muted-foreground">Custom Domain</dt>
                  <dd className="mt-1 flex items-center gap-2">
                    <span className="text-sm">
                      https://{website.custom_domain}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `https://${website.custom_domain}`
                        )
                      }}
                      className="rounded-md p-1 hover:bg-accent hover:text-accent-foreground"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                        <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                      </svg>
                    </button>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-muted-foreground">Status</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      website.status === 'published'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}
                  >
                    {website.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <WebsiteSectionManager />
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card">
            <div className="p-4">
              <h2 className="font-semibold">Preview</h2>
            </div>
            <div className="aspect-[3/4] overflow-hidden rounded-b-lg border-t bg-background">
              <WebsitePreview scale={0.5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}