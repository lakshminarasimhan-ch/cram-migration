import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface User {
  id: string // Supabase user ID
  name: string
  user_hash: string
}

export function useUserManager() {
  const [user, setUser] = useState<User | null>(null)
  const cookieName = 'comment_user_name'

  // Hash function for user identification
  const hashString = async (str: string): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32)
  }

  // Get user hash based on IP and user agent
  const getUserHash = useCallback(async (): Promise<string> => {
    try {
      // Get IP address
      const ipResponse = await fetch('https://api.ipify.org?format=json')
      const ipData = await ipResponse.json()
      const ip = ipData.ip

      // Create hash from IP + user agent
      const userAgent = navigator.userAgent
      const hashInput = `${ip}-${userAgent}`
      return await hashString(hashInput)
    } catch (error) {
      console.warn('Failed to get IP for user hash, using fallback:', error)
      // Fallback to just user agent hash
      const userAgent = navigator.userAgent
      return await hashString(userAgent)
    }
  }, [])

  // Cookie utilities
  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  }

  const getCookie = (name: string): string | null => {
    const nameEQ = name + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  // Get or create user in Supabase
  const getOrCreateUser = async (name: string, hash: string): Promise<User | null> => {
    try {
      console.log('[useUserManager] getOrCreateUser called with name:', name, 'hash:', hash)

      // First, try to find existing user by hash
      const { data: existingUsers, error: selectError } = await supabase
        .from('users')
        .select('id, name')
        .eq('email', hash) // Using email field to store hash for now
        .limit(1)

      if (selectError) {
        console.error('[useUserManager] Error finding user:', selectError)
      }

      console.log('[useUserManager] Existing users found:', existingUsers)

      if (existingUsers && existingUsers.length > 0) {
        // User exists, return it
        const userData = {
          id: existingUsers[0].id,
          name: existingUsers[0].name,
          user_hash: hash
        }
        console.log('[useUserManager] Returning existing user:', userData)
        return userData
      }

      // User doesn't exist, create new one
      console.log('[useUserManager] Creating new user...')
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          name: name,
          email: hash // Store hash in email field
        })
        .select('id, name')
        .single()

      if (insertError) {
        console.error('[useUserManager] Error creating user:', insertError)
        return null
      }

      const userData = {
        id: newUser.id,
        name: newUser.name,
        user_hash: hash
      }
      console.log('[useUserManager] Created new user:', userData)
      return userData
    } catch (error) {
      console.error('[useUserManager] Error in getOrCreateUser:', error)
      return null
    }
  }

  // Login function
  const login = useCallback(async (name: string) => {
    console.log('[useUserManager] login called with name:', name)
    if (name && name.trim()) {
      setCookie(cookieName, name.trim(), 365)
      const hash = await getUserHash()
      const userData = await getOrCreateUser(name.trim(), hash)

      console.log('[useUserManager] Setting user state to:', userData)
      if (userData) {
        setUser(userData)
      }
    }
  }, [getUserHash])

  // Initialize user on mount
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return

    const savedName = getCookie(cookieName)
    console.log('[useUserManager] useEffect - savedName from cookie:', savedName)

    if (savedName) {
      getUserHash().then(async hash => {
        const userData = await getOrCreateUser(savedName, hash)
        console.log('[useUserManager] useEffect - Setting user state to:', userData)
        if (userData) {
          setUser(userData)
        }
      })
    }
  }, [getUserHash])

  // Expose user for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).currentUser = user
      console.log('[useUserManager] User state updated:', user)
    }
  }, [user])

  return {
    user,
    login
  }
}
