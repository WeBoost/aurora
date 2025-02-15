'use client'

import { useEffect, useRef, useState } from 'react'

interface WebsitePreviewProps {
  scale?: number
}

export function WebsitePreview({ scale = 1 }: WebsitePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState('100%')

  useEffect(() => {
    const updateHeight = () => {
      if (iframeRef.current) {
        try {
          const contentHeight = iframeRef.current.contentWindow?.document.body.scrollHeight
          if (contentHeight) {
            setHeight(`${contentHeight}px`)
          }
        } catch (error) {
          console.error('Failed to update iframe height:', error)
        }
      }
    }

    const iframe = iframeRef.current
    if (iframe) {
      iframe.addEventListener('load', updateHeight)
      return () => iframe.removeEventListener('load', updateHeight)
    }
  }, [])

  return (
    <div
      style={{
        width: `${100 / scale}%`,
        height,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      <iframe
        ref={iframeRef}
        src="/api/preview"
        className="h-full w-full border-0"
        title="Website Preview"
      />
    </div>
  )
}