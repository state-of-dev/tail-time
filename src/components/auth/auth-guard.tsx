import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'
import { Card, CardContent } from '@/components/ui/card'
import { Heart } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requireRole?: 'groomer' | 'customer' | 'admin'
  requireSetup?: boolean
  redirectTo?: string
}

export default function AuthGuard({ 
  children, 
  requireRole, 
  requireSetup = false,
  redirectTo 
}: AuthGuardProps) {
  const { user, profile, businessProfile, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return

    // Not authenticated
    if (!user) {
      navigate('/auth/login')
      return
    }

    // No profile loaded
    if (!profile) {
      navigate('/auth/login')
      return
    }

    // Role requirement check
    if (requireRole && profile.role !== requireRole) {
      if (redirectTo) {
        navigate(redirectTo)
      } else {
        // Default redirects based on role
        switch (profile.role) {
          case 'groomer':
            if (businessProfile?.setup_completed) {
              navigate(`/groomer/${businessProfile.slug}/dashboard`)
            } else {
              navigate('/setup/business')
            }
            break
          case 'customer':
            navigate('/')
            break
          default:
            navigate('/auth/login')
        }
      }
      return
    }

    // Setup completion check for groomers
    if (requireSetup && profile.role === 'groomer') {
      if (!businessProfile?.setup_completed) {
        navigate('/setup/business')
        return
      }
    }

    // Business profile access verification
    if (profile.role === 'groomer' && requireSetup && !businessProfile) {
      navigate('/setup/business')
      return
    }

  }, [user, profile, businessProfile, loading, navigate, requireRole, requireSetup, redirectTo])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <Heart className="w-8 h-8 animate-pulse text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Verificando acceso...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show loading if we don't have required data yet
  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <Heart className="w-8 h-8 animate-pulse text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Cargando...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show loading for groomers if business profile is required but not loaded
  if (requireSetup && profile.role === 'groomer' && !businessProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <Heart className="w-8 h-8 animate-pulse text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Cargando perfil del negocio...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // All checks passed, render children
  return <>{children}</>
}