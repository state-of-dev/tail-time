import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'
import { AuthRedirect } from '@/components/auth/auth-redirect'
import { AuthWrapper } from '@/components/auth-wrapper'
import { useSessionMonitor } from '@/hooks/useAuthGuard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  Mail, 
  Lock, 
  Heart,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react'

export default function LoginFinal() {
  
  const { signIn, user, loading } = useAuth()
  const { hasSessionIssue } = useSessionMonitor()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: 'groomer1@demo.com',
    password: 'demo123'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Debug: Log auth state changes
  useEffect(() => {
  }, [user, loading])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) {
      newErrors.email = 'Email es requerido'
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Email inválido'
    }
    
    if (!formData.password) {
      newErrors.password = 'Contraseña es requerida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const clearSessionData = () => {
    localStorage.removeItem('sb-auth-token')

  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})
    
    try {
      // Clear any problematic session data before login
      if (hasSessionIssue) {
        clearSessionData()
      }

      const { error } = await signIn(formData.email, formData.password)

      if (error) {
        setErrors({ submit: error.message })
        setIsLoading(false)
        return
      }

<<<<<<< HEAD
      // Navigation handled by AuthRedirect component
=======
      // Login successful - let AuthRedirect handle navigation
>>>>>>> 0ebe05dcd24e3bd47f2a58369ed0831615c5875e
      setIsLoading(false)
      
    } catch (error: any) {
      setErrors({ submit: error?.message || 'Error al iniciar sesión' })
      setIsLoading(false)
    }
  }

  // If user is already logged in, show redirect component
  if (user) {
    const currentPath = window.location.pathname
    if (currentPath.startsWith('/business/')) {
      // Don't show AuthRedirect, let the router handle it
      return null
    }
    return <AuthRedirect />
  }
  
  // If still loading auth initialization, show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-2 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <Heart className="w-12 h-12 text-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Accede a tu cuenta de Tail Time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="flex items-center gap-2 text-foreground">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 bg-background text-foreground border-border"
                  placeholder="tu@email.com"
                  disabled={isLoading}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="flex items-center gap-2 text-foreground">
                  <Lock className="w-4 h-4" />
                  Contraseña
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Tu contraseña"
                    disabled={isLoading}
                    className="pr-10 bg-background text-foreground border-border"
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex justify-end">
                <Link 
                  to="/auth/reset-password" 
                  className="text-sm text-foreground hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {errors.submit && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{errors.submit}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full hover:scale-105 hover:shadow-md transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    Iniciar Sesión
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <Separator className="bg-border" />

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  ¿No tienes cuenta?{' '}
                  <Link to="/auth/register" className="text-foreground hover:underline font-medium">
                    Crear cuenta gratis
                  </Link>
                </p>
              </div>

              <div className="p-3 rounded-md bg-muted/50 border border-border">
                <p className="text-xs text-foreground font-medium mb-2">Demo credentials:</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p><strong className="text-foreground">Groomer:</strong> groomer@demo.com / demo123</p>
                  <p><strong className="text-foreground">Cliente:</strong> customer@demo.com / demo123</p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}