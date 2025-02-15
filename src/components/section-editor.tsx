'use client'

import { useState } from 'react'
import { ImagePicker } from './image-picker'

interface SectionEditorProps {
  type: string
  content: any
  onChange: (content: any) => void
}

export function SectionEditor({ type, content, onChange }: SectionEditorProps) {
  const [localContent, setLocalContent] = useState(content)

  const handleChange = (updates: any) => {
    const newContent = { ...localContent, ...updates }
    setLocalContent(newContent)
    onChange(newContent)
  }

  switch (type) {
    case 'hero':
      return (
        <div className="space-y-8 rounded-lg border bg-card p-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Heading</span>
              <input
                type="text"
                value={localContent.heading}
                onChange={(e) => handleChange({ heading: e.target.value })}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter heading text"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Subheading</span>
              <textarea
                value={localContent.subheading}
                onChange={(e) => handleChange({ subheading: e.target.value })}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter subheading text"
                rows={3}
              />
            </label>

            <div className="space-y-2">
              <span className="text-sm font-medium">Background Image</span>
              <ImagePicker
                value={localContent.backgroundImage}
                onChange={(url) => handleChange({ backgroundImage: url })}
              />
            </div>

            <div className="space-y-4 rounded-lg border bg-card p-4">
              <span className="text-sm font-medium">Call to Action</span>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-muted-foreground">Button Text</span>
                  <input
                    type="text"
                    value={localContent.cta?.text}
                    onChange={(e) =>
                      handleChange({
                        cta: { ...localContent.cta, text: e.target.value },
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter button text"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-muted-foreground">Button URL</span>
                  <input
                    type="text"
                    value={localContent.cta?.url}
                    onChange={(e) =>
                      handleChange({
                        cta: { ...localContent.cta, url: e.target.value },
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter button URL"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )

    case 'features':
      return (
        <div className="space-y-8 rounded-lg border bg-card p-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Section Title</span>
              <input
                type="text"
                value={localContent.title}
                onChange={(e) => handleChange({ title: e.target.value })}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter section title"
              />
            </label>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Features</span>
                <button
                  onClick={() =>
                    handleChange({
                      features: [
                        ...(localContent.features || []),
                        {
                          title: 'New Feature',
                          description: 'Feature description',
                          icon: 'star',
                        },
                      ],
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  Add Feature
                </button>
              </div>

              <div className="space-y-4">
                {localContent.features?.map((feature: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-lg border bg-card p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-medium">Feature {index + 1}</span>
                      <button
                        onClick={() =>
                          handleChange({
                            features: localContent.features.filter(
                              (_: any, i: number) => i !== index
                            ),
                          })
                        }
                        className="rounded-md p-1 text-destructive hover:bg-destructive/10"
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

                    <div className="grid gap-4">
                      <label className="block">
                        <span className="text-sm text-muted-foreground">Title</span>
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => {
                            const newFeatures = [...localContent.features]
                            newFeatures[index] = {
                              ...feature,
                              title: e.target.value,
                            }
                            handleChange({ features: newFeatures })
                          }}
                          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Enter feature title"
                        />
                      </label>

                      <label className="block">
                        <span className="text-sm text-muted-foreground">Description</span>
                        <textarea
                          value={feature.description}
                          onChange={(e) => {
                            const newFeatures = [...localContent.features]
                            newFeatures[index] = {
                              ...feature,
                              description: e.target.value,
                            }
                            handleChange({ features: newFeatures })
                          }}
                          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Enter feature description"
                          rows={3}
                        />
                      </label>

                      <label className="block">
                        <span className="text-sm text-muted-foreground">Icon</span>
                        <select
                          value={feature.icon}
                          onChange={(e) => {
                            const newFeatures = [...localContent.features]
                            newFeatures[index] = {
                              ...feature,
                              icon: e.target.value,
                            }
                            handleChange({ features: newFeatures })
                          }}
                          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="star">Star</option>
                          <option value="shield">Shield</option>
                          <option value="heart">Heart</option>
                          <option value="bolt">Bolt</option>
                          <option value="flag">Flag</option>
                        </select>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )

    case 'contact':
      return (
        <div className="space-y-8 rounded-lg border bg-card p-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Section Title</span>
              <input
                type="text"
                value={localContent.title}
                onChange={(e) => handleChange({ title: e.target.value })}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter section title"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                value={localContent.email}
                onChange={(e) => handleChange({ email: e.target.value })}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter contact email"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Phone</span>
              <input
                type="tel"
                value={localContent.phone}
                onChange={(e) => handleChange({ phone: e.target.value })}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter contact phone"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Address</span>
              <textarea
                value={localContent.address}
                onChange={(e) => handleChange({ address: e.target.value })}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter business address"
                rows={3}
              />
            </label>
          </div>
        </div>
      )

    default:
      return (
        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground">
            No editor available for this section type
          </p>
        </div>
      )
  }
}