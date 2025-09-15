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
  Dog,
  PawPrint,
  Shield,
  Zap,
  Crown
} from 'lucide-react'
import {
  Star1, Star6, Star7, Star8, Star9, Star10, Star13, Star19, Star20, Star21, Star22, Star23, Star24, Star25, Star26, Star27, Star28, Star37, Star39, Star40,
  StarSizes
} from '@/components/ui/neobrutalism-stars'

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
    <div className="min-h-screen bg-chart-6 relative overflow-hidden">
      {/* Floating Stars Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Star1 className="absolute top-20 left-10 star-decoration" size={StarSizes.lg} />
        <Star6 className="absolute top-40 right-20 star-decoration" size={StarSizes.md} />
        <Star7 className="absolute bottom-32 left-32 star-decoration" size={StarSizes.xl} />
        <Star8 className="absolute top-60 left-1/2 star-decoration" size={StarSizes.sm} />
        <Star9 className="absolute bottom-20 right-40 star-decoration" size={StarSizes.lg} />
        <Star10 className="absolute top-32 right-1/3 star-decoration" size={StarSizes.md} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-8">
          {/* Hero Badge */}
          <div className="text-center">
            <Badge className="bg-chart-8 text-main-foreground brutal-shadow-lg hover:brutal-hover px-8 py-4 text-lg font-black brutal-border-thick rounded-base transform -rotate-1 mb-8">
              <Shield className="icon-large mr-2 icon-float" />
              <Star13 size={StarSizes.md} className="star-decoration" />
              ÁREA SEGURA
              <Star19 size={StarSizes.md} className="star-decoration" />
              <Crown className="icon-large ml-2 icon-float" />
            </Badge>
          </div>

          {/* Login Card with Neobrutalism */}
          <Card className="bg-main brutal-border-thick brutal-shadow-xl hover:brutal-hover transition-all duration-200">
            <CardHeader className="text-center space-y-6 bg-chart-1 brutal-border-thick border-b-4 border-l-0 border-r-0 border-t-0">
              <div className="flex justify-center">
                <div className="p-6 bg-chart-2 rounded-base brutal-border-thick brutal-shadow-lg">
                  <PawPrint className="icon-hero text-main-foreground icon-float" />
                </div>
              </div>
              <div className="space-y-4">
                <CardTitle className="text-4xl font-black text-main-foreground uppercase">
                  <Star20 size={StarSizes.lg} className="star-decoration inline-block mr-2" />
                  BIENVENIDO
                  <Star21 size={StarSizes.lg} className="star-decoration inline-block ml-2" />
                </CardTitle>
                <CardDescription className="text-xl font-bold text-main-foreground/80 uppercase">
                  ACCEDE A TU CUENTA
                  <Badge className="bg-chart-3 text-main-foreground brutal-border brutal-shadow ml-2 font-black">
                    TAILTIME
                  </Badge>
                </CardDescription>
              </div>
            </CardHeader>

          <CardContent className="space-y-8 bg-main p-8">
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="email" className="flex items-center gap-2 text-main-foreground font-black text-lg uppercase">
                  <Mail className="icon-large icon-float" />
                  <Star22 size={StarSizes.sm} className="star-decoration" />
                  EMAIL
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="brutal-border-thick brutal-shadow-lg hover:brutal-hover font-bold text-lg py-6 text-main-foreground bg-chart-4 placeholder:font-bold placeholder:uppercase"
                  placeholder="TU@EMAIL.COM"
                  disabled={isLoading}
                  autoComplete="email"
                />
                {errors.email && (
                  <Badge className="bg-destructive text-main-foreground brutal-border brutal-shadow font-black">
                    {errors.email.toUpperCase()}
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <Label htmlFor="password" className="flex items-center gap-2 text-main-foreground font-black text-lg uppercase">
                  <Lock className="icon-large icon-float" />
                  <Star23 size={StarSizes.sm} className="star-decoration" />
                  CONTRASEÑA
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="TU CONTRASEÑA"
                    disabled={isLoading}
                    className="brutal-border-thick brutal-shadow-lg hover:brutal-hover font-bold text-lg py-6 text-main-foreground bg-chart-4 placeholder:font-bold placeholder:uppercase pr-16"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-chart-5 hover:bg-chart-7 brutal-border brutal-shadow rounded-base transition-all hover:brutal-hover"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="icon-standard text-main-foreground" />
                    ) : (
                      <Eye className="icon-standard text-main-foreground" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <Badge className="bg-destructive text-main-foreground brutal-border brutal-shadow font-black">
                    {errors.password.toUpperCase()}
                  </Badge>
                )}
              </div>

              <div className="flex justify-center">
                <Link
                  to="/auth/reset-password"
                  className="font-black text-main-foreground hover:text-chart-8 underline underline-offset-4 uppercase text-lg"
                >
                  <Star24 size={StarSizes.sm} className="star-decoration inline-block mr-2" />
                  ¿OLVIDASTE TU CONTRASEÑA?
                </Link>
              </div>

              {errors.submit && (
                <div className="p-6 rounded-base bg-destructive brutal-border-thick brutal-shadow-lg">
                  <p className="font-black text-main-foreground text-center uppercase">{errors.submit}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-chart-1 hover:bg-chart-2 text-main-foreground brutal-border-thick brutal-shadow-xl hover:brutal-hover font-black text-xl py-8 uppercase"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="icon-large mr-2 animate-spin" />
                    <Star25 size={StarSizes.md} className="star-decoration mr-2" />
                    INICIANDO SESIÓN...
                  </>
                ) : (
                  <>
                    <Sparkles className="icon-large mr-2 icon-float" />
                    <Star26 size={StarSizes.md} className="star-decoration mr-2" />
                    INICIAR SESIÓN
                    <Star27 size={StarSizes.md} className="star-decoration ml-2" />
                    <ArrowRight className="icon-large ml-2 icon-float" />
                  </>
                )}
              </Button>

              {/* Separator line */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-4 border-black"></div>
                </div>
                <div className="relative flex justify-center">
                  <Badge className="bg-chart-7 text-main-foreground brutal-border brutal-shadow font-black px-6 py-2 uppercase">
                    <Star28 size={StarSizes.sm} className="star-decoration mr-2" />
                    ¿NO TIENES CUENTA?
                    <Star37 size={StarSizes.sm} className="star-decoration ml-2" />
                  </Badge>
                </div>
              </div>

              <div className="text-center">
                <Link to="/auth/register">
                  <Button className="w-full bg-chart-3 hover:bg-chart-4 text-main-foreground brutal-border-thick brutal-shadow-lg hover:brutal-hover font-black text-xl py-8 uppercase">
                    <Heart className="icon-large mr-2 icon-float" />
                    <Star39 size={StarSizes.md} className="star-decoration mr-2" />
                    CREAR CUENTA GRATIS
                    <Star40 size={StarSizes.md} className="star-decoration ml-2" />
                    <Zap className="icon-large ml-2 icon-float" />
                  </Button>
                </Link>
              </div>

              {/* Demo credentials with brutal design */}
              <div className="p-6 rounded-base bg-chart-5 brutal-border-thick brutal-shadow-lg">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Badge className="bg-chart-8 text-main-foreground brutal-border brutal-shadow font-black px-4 py-2">
                    DEMO
                  </Badge>
                  <span className="font-black text-main-foreground text-lg uppercase">CREDENCIALES DE PRUEBA</span>
                </div>
                <div className="space-y-4">
                  <div className="bg-main brutal-border brutal-shadow p-4 rounded-base">
                    <div className="flex items-center justify-between">
                      <strong className="text-main-foreground font-black uppercase">GROOMER:</strong>
                      <code className="bg-chart-2 text-main-foreground px-3 py-2 rounded-base brutal-border font-bold">
                        groomer@demo.com / demo123
                      </code>
                    </div>
                  </div>
                  <div className="bg-main brutal-border brutal-shadow p-4 rounded-base">
                    <div className="flex items-center justify-between">
                      <strong className="text-main-foreground font-black uppercase">CLIENTE:</strong>
                      <code className="bg-chart-2 text-main-foreground px-3 py-2 rounded-base brutal-border font-bold">
                        customer@demo.com / demo123
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer branding with brutal style */}
        <div className="text-center">
          <Badge className="bg-chart-4 text-main-foreground brutal-border brutal-shadow font-black px-8 py-4 text-lg uppercase">
            <PawPrint className="icon-standard mr-2 icon-float" />
            POWERED BY TAILTIME PLATFORM
            <Sparkles className="icon-standard ml-2 icon-float" />
          </Badge>
        </div>
      </div>
      </div>
    </div>
  )
}