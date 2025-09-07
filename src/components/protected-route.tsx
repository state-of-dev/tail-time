import { ReactNode } from 'react'
import { useAuth } from '@/contexts/auth-context-simple'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { ShieldX, ArrowLeft } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: ('customer' | 'groomer')[]
  requiresAuth?: boolean
  redirectPath?: string
  message?: string
}

export function ProtectedRoute({ 
  children, 
  allowedRoles,
  requiresAuth = false,
  redirectPath,
  message = "No tienes acceso a esta página"
}: ProtectedRouteProps) {
  const { user, profile, businessProfile } = useAuth()
  const navigate = useNavigate()

  // Check if user is required and not authenticated
  if (requiresAuth && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <ShieldX className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Acceso Restringido</CardTitle>
            <CardDescription>
              Debes iniciar sesión para acceder a esta página
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => navigate('/auth/login')}
              className="w-full"
            >
              Iniciar Sesión
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ir a Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check role restrictions
  if (allowedRoles && user && profile) {
    const userRole = profile.role as 'customer' | 'groomer'
    
    if (!allowedRoles.includes(userRole)) {
      const defaultRedirect = userRole === 'groomer' && businessProfile 
        ? `/groomer/${businessProfile.slug}/dashboard`
        : '/customer/dashboard'

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <ShieldX className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <CardTitle>Acceso Restringido</CardTitle>
              <CardDescription>
                {message}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => navigate(redirectPath || defaultRedirect)}
                className="w-full"
              >
                Ir a Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ir a Inicio
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }
  }

  return <>{children}</>
}