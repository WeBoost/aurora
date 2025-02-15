'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWebsiteBuilder } from '@/hooks/useWebsiteBuilder'
import { SectionEditor } from '@/components/section-editor'

export default function SectionEditorPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const { content, updateContent } = useWebsiteBuilder()
  const [saving, setSaving] = useState(false)

  const section = content.find((s) => s.id === params.id)

  const handleSave = async (updates: any) => {
    try {
      setSaving(true)
      await updateContent(params.id, updates)
      router.back()
    } catch (error) {
      console.error('Failed to save section:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!section) {
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
          <h2 className="mt-4 text-lg font-semibold">Section Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The section you're looking for doesn't exist
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
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
          <h1 className="text-2xl font-bold">
            Edit {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
          </h1>
        </div>
        <button
          onClick={() => handleSave(section.content)}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <SectionEditor
        type={section.type}
        content={section.content}
        onChange={(content) => handleSave({ content })}
      />
    </div>
  )
}