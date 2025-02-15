'use client'

import { useState } from 'react'
import { useWebsiteBuilder } from '@/hooks/useWebsiteBuilder'

const SECTION_TYPES = [
  {
    id: 'hero',
    name: 'Hero Section',
    icon: 'image',
    description: 'Large header section with image background',
  },
  {
    id: 'features',
    name: 'Features',
    icon: 'grid',
    description: 'Showcase your key features or services',
  },
  {
    id: 'gallery',
    name: 'Gallery',
    icon: 'images',
    description: 'Display photos in a grid layout',
  },
  {
    id: 'contact',
    name: 'Contact Form',
    icon: 'mail',
    description: 'Contact form with map',
  },
]

export function WebsiteSectionManager() {
  const { content, addSection, removeSection, reorderContent } = useWebsiteBuilder()
  const [showAddSection, setShowAddSection] = useState(false)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => {
    setDraggingIndex(index)
  }

  const handleDragEnd = () => {
    setDraggingIndex(null)
  }

  const handleDrop = (targetIndex: number) => {
    if (draggingIndex === null) return
    
    const newSections = [...content]
    const [movedSection] = newSections.splice(draggingIndex, 1)
    newSections.splice(targetIndex, 0, movedSection)
    
    reorderContent(newSections.map((section, index) => ({
      ...section,
      order: index,
    })))
    
    setDraggingIndex(null)
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between p-4">
        <h2 className="font-semibold">Page Sections</h2>
        <button
          onClick={() => setShowAddSection(true)}
          className="inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Add Section
        </button>
      </div>

      {showAddSection ? (
        <div className="border-t p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">Add New Section</h3>
            <button
              onClick={() => setShowAddSection(false)}
              className="rounded-md p-1 hover:bg-accent hover:text-accent-foreground"
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SECTION_TYPES.map((type) => (
              <button
                key={type.id}
                className="flex flex-col items-start rounded-lg border p-4 text-left hover:border-primary hover:bg-accent"
                onClick={() => {
                  addSection(type.id)
                  setShowAddSection(false)
                }}
              >
                <div className="mb-2 rounded-full bg-primary/10 p-2 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                  </svg>
                </div>
                <h4 className="font-medium">{type.name}</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {type.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="border-t p-4">
          {content.length === 0 ? (
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="mx-auto h-12 w-12 text-muted-foreground"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="mt-4 font-medium">No Sections Yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Start building your website by adding sections
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {content.map((section, index) => (
                <div
                  key={section.id}
                  className={`flex items-center gap-4 rounded-lg border bg-card p-4 ${
                    draggingIndex === index ? 'opacity-50' : ''
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => {
                    e.preventDefault()
                    handleDrop(index)
                  }}
                >
                  <div className="cursor-move text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <div className="font-medium capitalize">
                      {section.type} Section
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {section.content.heading || section.content.title || 'No title'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        // Navigate to section editor
                      }}
                      className="rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeSection(section.id)}
                      className="rounded-md p-2 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}