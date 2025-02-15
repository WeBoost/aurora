'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/providers/supabase-provider'

export function UserNav() {
  const router = useRouter()
  const { supabase } = useSupabase()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary hover:bg-secondary/20"
        onClick={() => {
          const menu = document.getElementById('user-menu')
          menu?.classList.toggle('hidden')
        }}
      >
        <span>Account</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div
        id="user-menu"
        className="absolute right-0 mt-2 hidden w-48 origin-top-right rounded-md bg-card py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <Link
          href="/dashboard/settings"
          className="block px-4 py-2 text-sm text-card-foreground hover:bg-muted"
        >
          Settings
        </Link>
        <button
          onClick={handleSignOut}
          className="block w-full px-4 py-2 text-left text-sm text-destructive hover:bg-muted"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}