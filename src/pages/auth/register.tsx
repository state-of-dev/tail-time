import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Mail,
  Lock,
  Heart,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Building2,
  PawPrint,
  Sparkles,
  Zap,
  Crown,
  Star,
  Trophy
} from 'lucide-react'
import {
  Star1, Star6, Star7, Star8, Star9, Star10, Star13, Star19, Star20, Star21, Star22, Star23, Star24, Star25, Star26, Star27, Star28, Star37, Star39, Star40,
  StarSizes
} from '@/components/ui/neobrutalism-stars'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'customer' // 'customer' or 'groomer'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.fullName) {
      newErrors.fullName = 'Nombre completo es requerido'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email es requerido'
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Email inválido'
    }
    
    if (!formData.password) {
      newErrors.password = 'Contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmar contraseña es requerido'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})
    
    try {
      // Determine role based on account type
      const role = formData.accountType === 'groomer' ? 'groomer' : 'customer'
      const { error } = await signUp(formData.email, formData.password, formData.fullName, role)

      if (error) {
        setErrors({ submit: error.message })
        return
      }

      // Redirect based on account type to appropriate onboarding
      if (formData.accountType === 'groomer') {
        navigate('/setup/business', { replace: true })
      } else {
        navigate('/onboarding/pet', { replace: true })
      }
      
    } catch (error: any) {
      setErrors({ submit: error?.message || 'Error al crear cuenta' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-chart-7 relative overflow-hidden">
      {/* Floating Stars Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Star6 className="absolute top-20 left-10 star-decoration" size={StarSizes.lg} />
        <Star7 className="absolute top-40 right-20 star-decoration" size={StarSizes.md} />
        <Star8 className="absolute bottom-32 left-32 star-decoration" size={StarSizes.xl} />
        <Star9 className="absolute top-60 left-1/2 star-decoration" size={StarSizes.sm} />
        <Star10 className="absolute bottom-20 right-40 star-decoration" size={StarSizes.lg} />
        <Star1 className="absolute top-32 right-1/3 star-decoration" size={StarSizes.md} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-8">
          {/* Hero Badge */}
          <div className="text-center">
            <Badge className="bg-chart-8 text-main-foreground brutal-shadow-lg hover:brutal-hover px-8 py-4 text-lg font-black brutal-border-thick rounded-base transform rotate-1 mb-8">
              <Star className="icon-large mr-2 icon-float" />
              <Star13 size={StarSizes.md} className="star-decoration" />
              ÚNETE A TAILTIME
              <Star19 size={StarSizes.md} className="star-decoration" />
              <Trophy className="icon-large ml-2 icon-float" />
            </Badge>
          </div>

          <Card className="bg-main brutal-border-thick brutal-shadow-xl hover:brutal-hover transition-all duration-200">
            <CardHeader className="text-center space-y-6 bg-chart-3 brutal-border-thick border-b-4 border-l-0 border-r-0 border-t-0">
              <div className="flex justify-center">
                <div className="p-6 bg-chart-4 rounded-base brutal-border-thick brutal-shadow-lg">
                  <PawPrint className="icon-hero text-main-foreground icon-float" />
                </div>
              </div>
              <div className="space-y-4">
                <CardTitle className="text-4xl font-black text-main-foreground uppercase">
                  <Star20 size={StarSizes.lg} className="star-decoration inline-block mr-2" />
                  CREAR CUENTA
                  <Star21 size={StarSizes.lg} className="star-decoration inline-block ml-2" />
                </CardTitle>
                <CardDescription className="text-xl font-bold text-main-foreground/80 uppercase">
                  ÚNETE A LA REVOLUCIÓN
                  <Badge className="bg-chart-5 text-main-foreground brutal-border brutal-shadow ml-2 font-black">
                    GROOMING
                  </Badge>
                </CardDescription>
              </div>
            </CardHeader>
          <CardContent className="space-y-8 bg-main p-8">
            <form onSubmit={handleRegister} className="space-y-8">
              {/* Account Type Selector */}
              <div className="space-y-6">
                <div className="text-center">
                  <Label className="font-black text-main-foreground text-2xl uppercase flex items-center justify-center gap-2">
                    <Star22 size={StarSizes.md} className="star-decoration" />
                    TIPO DE CUENTA
                    <Star23 size={StarSizes.md} className="star-decoration" />
                  </Label>
                  <p className="font-bold text-main-foreground/80 text-lg uppercase mt-2">
                    ELIGE TU AVENTURA
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, accountType: 'customer' }))}
                    className={`p-6 rounded-base brutal-border-thick brutal-shadow-lg hover:brutal-hover transition-all duration-200 ${
                      formData.accountType === 'customer'
                        ? 'bg-chart-1 text-main-foreground'
                        : 'bg-chart-2 text-main-foreground hover:bg-chart-1'
                    }`}
                    disabled={isLoading}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <Heart className="icon-hero icon-float" />
                      <Star24 size={StarSizes.md} className="star-decoration" />
                      <div>
                        <div className="font-black text-xl uppercase">CLIENTE</div>
                        <div className="font-bold text-sm uppercase">
                          BUSCAR SERVICIOS PARA MIS MASCOTAS
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, accountType: 'groomer' }))}
                    className={`p-6 rounded-base brutal-border-thick brutal-shadow-lg hover:brutal-hover transition-all duration-200 ${
                      formData.accountType === 'groomer'
                        ? 'bg-chart-6 text-main-foreground'
                        : 'bg-chart-5 text-main-foreground hover:bg-chart-6'
                    }`}
                    disabled={isLoading}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <Building2 className="icon-hero icon-float" />
                      <Star25 size={StarSizes.md} className="star-decoration" />
                      <div>
                        <div className="font-black text-xl uppercase">NEGOCIO</div>
                        <div className="font-bold text-sm uppercase">
                          OFRECER SERVICIOS DE GROOMING
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="fullName" className="flex items-center gap-2 text-main-foreground font-black text-lg uppercase">
                  <User className="icon-large icon-float" />
                  <Star26 size={StarSizes.sm} className="star-decoration" />
                  NOMBRE COMPLETO
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="brutal-border-thick brutal-shadow-lg hover:brutal-hover font-bold text-lg py-6 text-main-foreground bg-chart-4 placeholder:font-bold placeholder:uppercase"
                  placeholder="TU NOMBRE COMPLETO"
                  disabled={isLoading}
                  autoComplete="name"
                />
                {errors.fullName && (
                  <Badge className="bg-destructive text-main-foreground brutal-border brutal-shadow font-black">
                    {errors.fullName.toUpperCase()}
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <Label htmlFor="email" className="flex items-center gap-2 text-main-foreground font-black text-lg uppercase">
                  <Mail className="icon-large icon-float" />
                  <Star27 size={StarSizes.sm} className="star-decoration" />
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
                  <Star28 size={StarSizes.sm} className="star-decoration" />
                  CONTRASEÑA
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="brutal-border-thick brutal-shadow-lg hover:brutal-hover font-bold text-lg py-6 text-main-foreground bg-chart-4 placeholder:font-bold placeholder:uppercase pr-16"
                    placeholder="TU CONTRASEÑA"
                    disabled={isLoading}
                    autoComplete="new-password"
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

              <div className="space-y-4">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-main-foreground font-black text-lg uppercase">
                  <Lock className="icon-large icon-float" />
                  <Star37 size={StarSizes.sm} className="star-decoration" />
                  CONFIRMAR CONTRASEÑA
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="brutal-border-thick brutal-shadow-lg hover:brutal-hover font-bold text-lg py-6 text-main-foreground bg-chart-4 placeholder:font-bold placeholder:uppercase pr-16"
                    placeholder="CONFIRMA TU CONTRASEÑA"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-chart-5 hover:bg-chart-7 brutal-border brutal-shadow rounded-base transition-all hover:brutal-hover"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="icon-standard text-main-foreground" />
                    ) : (
                      <Eye className="icon-standard text-main-foreground" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <Badge className="bg-destructive text-main-foreground brutal-border brutal-shadow font-black">
                    {errors.confirmPassword.toUpperCase()}
                  </Badge>
                )}
              </div>

              {errors.submit && (
                <div className="p-6 rounded-base bg-destructive brutal-border-thick brutal-shadow-lg">
                  <p className="font-black text-main-foreground text-center uppercase">{errors.submit.toUpperCase()}</p>
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
                    <Star39 size={StarSizes.md} className="star-decoration mr-2" />
                    CREANDO CUENTA...
                  </>
                ) : (
                  <>
                    <Sparkles className="icon-large mr-2 icon-float" />
                    <Star40 size={StarSizes.md} className="star-decoration mr-2" />
                    CREAR CUENTA
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
                    ¿YA TIENES CUENTA?
                  </Badge>
                </div>
              </div>

              <div className="text-center">
                <Link to="/auth/login">
                  <Button className="w-full bg-chart-3 hover:bg-chart-4 text-main-foreground brutal-border-thick brutal-shadow-lg hover:brutal-hover font-black text-xl py-8 uppercase">
                    <Heart className="icon-large mr-2 icon-float" />
                    INICIAR SESIÓN
                    <Zap className="icon-large ml-2 icon-float" />
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}