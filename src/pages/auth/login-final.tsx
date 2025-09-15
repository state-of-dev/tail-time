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
import { Badge } from '@/components/ui/badge'
import {
  Mail,
  Lock,
  Heart,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Dog
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

      // Login successful - let AuthRedirect handle navigation
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-border border-t-pet-blue mx-auto"></div>
          <p className="text-sm text-foreground font-base">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">

        {/* Login Card with Neobrutalism */}
        <Card className="brutal-shadow hover:brutal-hover transition-all duration-200">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-chart-2 rounded-base brutal-border brutal-shadow-sm">
                <Dog className="w-8 h-8 text-main-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-semibold text-foreground">
                Bienvenido de vuelta
              </CardTitle>
              <CardDescription className="text-base text-foreground/80">
                Accede a tu cuenta de <Badge variant="pet-blue" className="ml-1">TailTime</Badge>
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-foreground font-base font-semibold">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="brutal-hover"
                  placeholder="tu@email.com"
                  disabled={isLoading}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1 font-base">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2 text-foreground font-base font-semibold">
                  <Lock className="w-4 h-4" />
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Tu contraseña"
                    disabled={isLoading}
                    className="pr-12 brutal-hover"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary-background rounded-sm transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-foreground/70" />
                    ) : (
                      <Eye className="w-4 h-4 text-foreground/70" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive mt-1 font-base">{errors.password}</p>
                )}
              </div>

              <div className="flex justify-end">
                <Link
                  to="/auth/reset-password"
                  className="text-sm text-foreground hover:underline font-base underline-offset-4"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {errors.submit && (
                <div className="p-4 rounded-base bg-destructive/20 border-2 border-destructive brutal-shadow-sm">
                  <p className="text-sm text-destructive font-base">{errors.submit}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                variant="pet-blue"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Iniciar Sesión
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              {/* Separator line */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-main px-2 text-foreground/70 font-base">¿No tienes cuenta?</span>
                </div>
              </div>

              <div className="text-center">
                <Link to="/auth/register">
                  <Button variant="pet-green" className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Crear cuenta gratis
                  </Button>
                </Link>
              </div>

              {/* Demo credentials with colorful design */}
              <div className="p-4 rounded-base bg-pet-yellow/20 border-2 border-border brutal-shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="pet-purple">DEMO</Badge>
                  <span className="text-sm text-foreground font-base font-semibold">Credenciales de prueba</span>
                </div>
                <div className="space-y-2 text-sm text-foreground/80 font-base">
                  <div className="flex justify-between">
                    <strong className="text-foreground">Groomer:</strong>
                    <code className="text-xs bg-secondary-background px-2 py-1 rounded border border-border">
                      groomer@demo.com / demo123
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <strong className="text-foreground">Cliente:</strong>
                    <code className="text-xs bg-secondary-background px-2 py-1 rounded border border-border">
                      customer@demo.com / demo123
                    </code>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer branding */}
        <div className="text-center">
          <Badge variant="neutral" className="text-xs">
            Powered by Tail Time Platform ✨
          </Badge>
        </div>
      </div>
    </div>
  )
}