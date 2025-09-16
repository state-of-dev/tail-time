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
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

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
      localStorage.clear()
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

  useEffect(() => {
    let mounted = true
    let initializationTimeout: NodeJS.Timeout
    
    // Get initial session with timeout protection
    const initializeAuth = async () => {
      try {
        
        // Set timeout to prevent infinite loading
        initializationTimeout = setTimeout(() => {
          if (mounted) {
            setLoading(false)
          }
        }, 5000) // 5 second timeout
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        // Clear timeout on successful response
        if (initializationTimeout) {
          clearTimeout(initializationTimeout)
        }
        
        if (error) {
          if (mounted) {
            setLoading(false)
          }
          return
        }

        
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            await fetchUserProfile(session.user.id)
          } else {
          }
          
          setLoading(false)
        }
      } catch (error) {
        if (initializationTimeout) {
          clearTimeout(initializationTimeout)
        }
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) {
        return
      }

      console.log('Auth state change:', event, session?.user?.id)

      // Handle TOKEN_REFRESHED separately to avoid unnecessary state updates
      if (event === 'TOKEN_REFRESHED') {
        // Only update session, don't refetch profile or change loading state
        setSession(session)
        setUser(session?.user ?? null)
        return
      }

      setSession(session)
      setUser(session?.user ?? null)

      // Only fetch profile for significant auth changes
      if (session?.user && ['SIGNED_IN', 'INITIAL_SESSION'].includes(event)) {
        await fetchUserProfile(session.user.id)
      } else if (!session && event === 'SIGNED_OUT') {
        setProfile(null)
        setBusinessProfile(null)
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
        } catch (error) {
          console.warn('Error clearing localStorage:', error)
        }
      }

      setLoading(false)
    })

    return () => {
      mounted = false
      if (initializationTimeout) {
        clearTimeout(initializationTimeout)
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