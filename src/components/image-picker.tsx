'use client'

import { useState } from 'react'
import { useSupabase } from './providers/supabase-provider'

interface ImagePickerProps {
  value?: string
  onChange: (url: string) => void
}

export function ImagePicker({ value, onChange }: ImagePickerProps) {
  const { supabase } = useSupabase()
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = e.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const filePath = `${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('website-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('website-images')
        .getPublicUrl(filePath)

      onChange(data.publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {value && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <img
            src={value}
            alt="Selected image"
            className="h-full w-full object-cover"
          />
          <button
            onClick={() => onChange('')}
            className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex items-center justify-center">
        <label className="relative flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-6 py-10 hover:border-primary">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">Upload an image</span> or
              drag and drop
            </div>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
          <input
            type="file"
            className="absolute h-full w-full cursor-pointer opacity-0"
            onChange={handleUpload}
            accept="image/*"
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  )
}