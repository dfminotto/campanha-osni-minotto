// components/LoginButton.tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function LoginButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
      setIsLoading(false)
    }

    checkSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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
