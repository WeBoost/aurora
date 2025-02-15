'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/supabase-provider'

interface Website {
  id: string
  business_id: string
  template_id: string
  subdomain: string
  custom_domain: string | null
  status: 'draft' | 'published'
  published_at: string | null
  created_at: string
  updated_at: string
}

interface WebsiteContent {
  id: string
  business_id: string
  type: string
  content: any
  order: number
}

export function useWebsiteBuilder() {
  const { supabase } = useSupabase()
  const [website, setWebsite] = useState<Website | null>(null)
  const [content, setContent] = useState<WebsiteContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        // Get business ID
        const { data: business, error: businessError } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .single()

        if (businessError) throw businessError
        if (!business) throw new Error('Business not found')

        // Get website data
        const [websiteResponse, contentResponse] = await Promise.all([
          supabase
            .from('websites')
            .select('*')
            .eq('business_id', business.id)
            .single(),
          supabase
            .from('website_content')
            .select('*')
            .eq('business_id', business.id)
            .order('order'),
        ])

        if (websiteResponse.error) throw websiteResponse.error
        if (contentResponse.error) throw contentResponse.error

        setWebsite(websiteResponse.data)
        setContent(contentResponse.data || [])
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchWebsite()
  }, [supabase])

  const addSection = async (type: string) => {
    if (!website) return

    try {
      const { data, error } = await supabase
        .from('website_content')
        .insert([
          {
            business_id: website.business_id,
            type,
            content: getDefaultContent(type),
            order: content.length,
          },
        ])
        .select()
        .single()

      if (error) throw error
      setContent([...content, data])
    } catch (e) {
      throw e
    }
  }

  const removeSection = async (sectionId: string) => {
    try {
      const { error } = await supabase
        .from('website_content')
        .delete()
        .eq('id', sectionId)

      if (error) throw error
      setContent(content.filter(s => s.id !== sectionId))
    } catch (e) {
      throw e
    }
  }

  const reorderContent = async (orderedContent: WebsiteContent[]) => {
    try {
      const { error } = await supabase
        .from('website_content')
        .upsert(
          orderedContent.map((section, index) => ({
            id: section.id,
            order: index,
          }))
        )

      if (error) throw error
      setContent(orderedContent)
    } catch (e) {
      throw e
    }
  }

  const publishWebsite = async () => {
    if (!website) return

    try {
      const { error } = await supabase
        .from('websites')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
        })
        .eq('id', website.id)

      if (error) throw error
      setWebsite(prev => prev ? { ...prev, status: 'published' } : null)
    } catch (e) {
      throw e
    }
  }

  return {
    website,
    content,
    loading,
    error,
    addSection,
    removeSection,
    reorderContent,
    publishWebsite,
  }
}

function getDefaultContent(type: string) {
  switch (type) {
    case 'hero':
      return {
        heading: 'Welcome',
        subheading: 'Discover what makes us unique',
        backgroundImage: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2850&q=80',
        cta: {
          text: 'Learn More',
          url: '#',
        },
      }
    case 'features':
      return {
        title: 'Our Features',
        features: [
          {
            title: 'Feature 1',
            description: 'Description of feature 1',
            icon: 'star',
          }, ```
          {
            title: 'Feature 2',
            description: 'Description of feature 2', 
            icon: 'shield',
          },
          {
            title: 'Feature 3',
            description: 'Description of feature 3',
            icon: 'heart',
          },
        ],
      }
    case 'gallery':
      return {
        title: 'Gallery',
        images: [],
      }
    case 'contact':
      return {
        title: 'Contact Us',
        email: '',
        phone: '',
        address: '',
      }
    default:
      return {}
  }
}
        ]
      }
  }
}