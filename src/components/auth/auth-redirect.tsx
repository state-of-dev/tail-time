import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'

export function AuthRedirect() {
  const { user, profile, businessProfile, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const checkBusinessAndRedirect = async () => {
      // Wait for loading to complete
      if (loading) {
        return
      }
      
      // If no user after loading, redirect to home
      if (!user) {
        navigate('/', { replace: true })
        return
      }

      // Check if user is trying to access a public business page
      const currentPath = window.location.pathname
      if (currentPath.startsWith('/business/')) {
        return // Don't redirect, let them access the business page
      }

      // Wait for profile to load after user authentication
      if (!profile) {
        return // Don't redirect yet, wait for profile to load
      }

      if (profile.role === 'customer') {
        navigate('/customer/dashboard', { replace: true })
        return
      }

      if (profile.role === 'groomer') {
        // For groomers, we also need to wait for businessProfile to load
        if (!businessProfile) {
          return // Wait for business profile to load before deciding
        }

        navigate(`/groomer/${businessProfile.slug}/dashboard`, { replace: true })
        return
      }
    }

    checkBusinessAndRedirect()
  }, [user, profile, businessProfile, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-2 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  // If not loading and no user, don't render anything (let router handle)
  return null
}