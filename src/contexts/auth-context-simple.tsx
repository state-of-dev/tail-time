import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  id: string
  email: string
  full_name: string
  phone?: string
  role: 'groomer' | 'customer' | 'admin'
  created_at: string
  updated_at: string
}

interface BusinessProfile {
  id: string
  owner_id: string
  business_name: string
  slug: string
  description?: string
  phone?: string
  email?: string
  address?: string
  logo_url?: string
  cover_image_url?: string
  business_hours: any
  services: any[]
  portfolio: any[]
  setup_completed: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  businessProfile: BusinessProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: AuthError | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: AuthError | null }>
  signOut: () => Promise<{ error?: AuthError | null }>
  refreshBusinessProfile: () => Promise<void>
  clearCorruptedSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const [isFetchingProfile, setIsFetchingProfile] = useState(false)

  const fetchUserProfile = async (userId: string) => {
    try {
      // Prevent multiple concurrent fetches
      if (isFetchingProfile) {
        console.log('Already fetching profile, skipping...')
        return
      }

      setIsFetchingProfile(true)
      console.log('Fetching user profile for:', userId.slice(-4))
      
      // Add timeout protection for database calls
      const profilePromise = supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
      })

      const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any

      if (error) {
        
        // If no profile exists, create one
        if (error.code === 'PGRST116') {
          
          // Get user email from session
          const userEmail = user?.email || session?.user?.email || 'demo@customer.com'
          
          // Determine role from user metadata first, fallback to email for existing users
          const metadataRole = user?.user_metadata?.role
          const isGroomer = userEmail.includes('groomer')
          const role = metadataRole || (isGroomer ? 'groomer' : 'customer')
          
          
          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert({
              id: userId,
              email: userEmail,
              full_name: user?.user_metadata?.full_name || (isGroomer ? 'New Groomer' : 'New Customer'),
              phone: null,
              role: role
            })
            .select()
            .single()
            
          if (createError) {
            setProfile(null)
            return
          }
          
          const profileWithEmail = {
            ...newProfile,
            email: userEmail
          }
          setProfile(profileWithEmail)
          
          
          // Create customer record for customer users (new architecture) - NON-BLOCKING
          if (profileWithEmail.role === 'customer') {
            ensureCustomerRecord(userId, userEmail, profileWithEmail.full_name).catch(err => {}
            )
          }
          
          // Load business profile if user is groomer - NON-BLOCKING
          if (profileWithEmail.role === 'groomer') {
            fetchBusinessProfile(userId).catch(err => {}
            )
          }
          
          return
        }
        
        setProfile(null)
        return
      }

      if (!data) {
        setProfile(null)
        return
      }
      
      const profileWithEmail = {
        ...data,
        email: user?.email || session?.user?.email || data.email
      }
      setProfile(profileWithEmail)
      
      
      // Ensure customer record exists for customer users (new architecture) - NON-BLOCKING
      if (data.role === 'customer') {
        ensureCustomerRecord(userId, profileWithEmail.email, data.full_name).catch(err => {}
        )
      }
      
      // Load business profile if user is groomer - NON-BLOCKING
      if (data.role === 'groomer') {
        fetchBusinessProfile(userId).catch(err => {}
        )
      }
      
    } catch (error: any) {
      setProfile(null)
    } finally {
      setIsFetchingProfile(false)
    }
  }
  
  const fetchBusinessProfile = async (userId: string) => {
    try {
      
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('owner_id', userId)
        .single()
        
      if (error) {
        if (error.code === 'PGRST116') {
          setBusinessProfile(null)
          return
        }
        setBusinessProfile(null)
        return
      }
      
      setBusinessProfile(data)
      
    } catch (error: any) {
      setBusinessProfile(null)
    }
  }
  
  const ensureCustomerRecord = async (userId: string, email: string, fullName: string) => {
    try {
      
      // Check if customer record already exists
      const { data: existingCustomer, error: checkError } = await supabase
        .from('customers')
        .select('id, user_id')
        .eq('user_id', userId)
        .single()
        
      if (existingCustomer) {
        return existingCustomer
      }
      
      if (checkError && checkError.code !== 'PGRST116') {
        return null
      }
      
      // Create new customer record linked to auth user
      const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert({
          user_id: userId,
          name: fullName,
          email: email,
          phone: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id, user_id')
        .single()
        
      if (createError) {
        return null
      }
      
      return newCustomer
      
    } catch (error: any) {
      return null
    }
  }

  const refreshBusinessProfile = async () => {
    if (user?.id && profile?.role === 'groomer') {
      await fetchBusinessProfile(user.id)
    }
  }

  const clearCorruptedSession = async () => {
    console.log('Clearing corrupted session...')

    // Clear all local state
    setProfile(null)
    setBusinessProfile(null)
    setUser(null)
    setSession(null)
    setIsFetchingProfile(false)
    setLoading(false)

    // Clear all storage
    try {
      const keysToRemove = Object.keys(localStorage).filter(key =>
        key.includes('supabase') || key.startsWith('sb-')
      )
      console.log('Removing keys:', keysToRemove)
      keysToRemove.forEach(key => localStorage.removeItem(key))
      sessionStorage.clear()
    } catch (error) {
      console.warn('Error clearing storage:', error)
    }

    // Force sign out
    try {
      await supabase.auth.signOut({ scope: 'global' })
    } catch (error) {
      console.warn('Error during force signout:', error)
    }
  }

  // Add debugging function for the loading issue
  const debugAuth = () => {
    const authKeys = Object.keys(localStorage).filter(key =>
      key.includes('supabase') || key.startsWith('sb-')
    )

    console.log('🔍 AUTH DEBUG:', {
      loading,
      user: !!user,
      session: !!session,
      profile: !!profile,
      isFetchingProfile,
      userId: user?.id?.slice(-4),
      sessionExpiry: session?.expires_at,
      storageKeys: authKeys,
      storageValues: authKeys.reduce((acc, key) => {
        try {
          acc[key] = JSON.parse(localStorage.getItem(key) || '{}')
        } catch {
          acc[key] = localStorage.getItem(key)
        }
        return acc
      }, {} as Record<string, any>)
    })
  }

  // Expose debug function globally
  if (typeof window !== 'undefined') {
    window.debugAuth = debugAuth
    window.clearCorruptedAuth = clearCorruptedSession
  }

  useEffect(() => {
    let mounted = true
    let initializationTimeout: NodeJS.Timeout
    let fallbackTimeout: NodeJS.Timeout

    // Get initial session with improved error handling and aggressive fallbacks
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...')

        // First timeout - only for detecting hanging requests
        initializationTimeout = setTimeout(() => {
          if (mounted) {
            console.warn('Auth initialization taking longer than expected (5s)')
            // Don't clear tokens yet, just set loading to false and let the auth flow continue
            setLoading(false)
          }
        }, 5000) // Give more time for normal auth flow

        // Second timeout - absolute fallback only for real hangs
        fallbackTimeout = setTimeout(() => {
          if (mounted) {
            console.error('Auth initialization absolute timeout (10s) - checking for real issues')

            // Only clear if we truly have no session AND there are potentially corrupted tokens
            const hasStorageTokens = Object.keys(localStorage).some(key =>
              key.includes('supabase') || key.startsWith('sb-')
            )

            if (hasStorageTokens && !session && !user) {
              console.log('Detected truly corrupted tokens after 10s - clearing')
              Object.keys(localStorage).forEach(key => {
                if (key.includes('supabase') || key.startsWith('sb-')) {
                  localStorage.removeItem(key)
                }
              })
            }

            setLoading(false)
          }
        }, 10000) // Much longer timeout - only for real hangs

        const { data: { session }, error } = await supabase.auth.getSession()

        // Clear both timeouts on successful response
        if (initializationTimeout) clearTimeout(initializationTimeout)
        if (fallbackTimeout) clearTimeout(fallbackTimeout)

        if (error) {
          console.error('Error getting session:', error)
          if (mounted) {
            setSession(null)
            setUser(null)
            setLoading(false)
          }
          return
        }

        console.log('Initial session loaded:', !!session, session?.user?.id?.slice(-4))

        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)

          if (session?.user) {
            // Add timeout protection for profile fetch too
            const profileTimeout = setTimeout(() => {
              if (mounted) {
                console.warn('Profile fetch timeout - continuing without profile')
                setLoading(false)
              }
            }, 3000)

            try {
              await fetchUserProfile(session.user.id)
              clearTimeout(profileTimeout)
            } catch (profileError) {
              console.error('Profile fetch error:', profileError)
              clearTimeout(profileTimeout)
            }
          }

          setLoading(false)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (initializationTimeout) clearTimeout(initializationTimeout)
        if (fallbackTimeout) clearTimeout(fallbackTimeout)
        if (mounted) {
          setSession(null)
          setUser(null)
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for changes with improved event handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) {
        return
      }

      console.log('Auth state change:', event, !!session, session?.user?.id?.slice(-4))

      // Handle different auth events appropriately
      switch (event) {
        case 'TOKEN_REFRESHED':
          // Only update session silently, don't trigger profile refetch
          if (session) {
            setSession(session)
            setUser(session.user)
          }
          return

        case 'SIGNED_IN':
        case 'INITIAL_SESSION':
          setSession(session)
          setUser(session?.user ?? null)
          if (session?.user && !isFetchingProfile) {
            await fetchUserProfile(session.user.id)
          }
          setLoading(false)
          break

        case 'SIGNED_OUT':
          setSession(null)
          setUser(null)
          setProfile(null)
          setBusinessProfile(null)
          setIsFetchingProfile(false)

          // Clear storage more selectively to avoid conflicts
          try {
            // Get current storage key from supabase config
            const storageKey = `sb-${supabase.supabaseUrl.split('//')[1].split('.')[0]}-auth-token`
            localStorage.removeItem(storageKey)
            localStorage.removeItem('sb-auth-token') // fallback

            // Clear any other supabase keys but be more careful
            Object.keys(localStorage).forEach(key => {
              if (key.startsWith('sb-') && key.includes('auth')) {
                localStorage.removeItem(key)
              }
            })
          } catch (error) {
            console.warn('Error clearing localStorage:', error)
          }
          setLoading(false)
          break

        default:
          // For other events, just update the basic state
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
      }
    })

    return () => {
      mounted = false
      if (initializationTimeout) {
        clearTimeout(initializationTimeout)
      }
      if (fallbackTimeout) {
        clearTimeout(fallbackTimeout)
      }
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    return { error }
  }

  const signUp = async (email: string, password: string, fullName: string, role: 'customer' | 'groomer' = 'customer') => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role // Store role in user metadata
        }
      }
    })
    return { error }
  }

  const signOut = async () => {
    try {
      console.log('Signing out...')

      // Clear local state immediately to prevent UI glitches
      setProfile(null)
      setBusinessProfile(null)
      setUser(null)
      setSession(null)
      setIsFetchingProfile(false)

      // Clear all possible token storage locations
      try {
        localStorage.removeItem('sb-auth-token')
        localStorage.removeItem('supabase.auth.token')
        // Clear all supabase related keys
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key)
          }
        })
        sessionStorage.clear() // Also clear session storage
      } catch (storageError) {
        console.warn('Error clearing storage:', storageError)
      }

      const { error } = await supabase.auth.signOut({ scope: 'global' })

      if (error) {
        console.error('SignOut error:', error)
      }

      return { error }
    } catch (error: any) {
      console.error('SignOut catch error:', error)
      return { error }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      businessProfile,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      refreshBusinessProfile,
      clearCorruptedSession
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}