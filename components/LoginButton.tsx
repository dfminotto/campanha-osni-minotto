// components/LoginButton.tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { getSupabase } from '@/lib/supabase'

export function LoginButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await getSupabase().auth.getSession()
      setIsLoggedIn(!!session)
      setIsLoading(false)
    }

    checkSession()

    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setIsLoggedIn(!!session)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <Link
      href={isLoggedIn ? '/admin' : '/login'}
      className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded hover:bg-gray-100 transition-colors"
    >
      {isLoggedIn ? 'Área da campanha' : 'Área da campanha'}
    </Link>
  )
}
