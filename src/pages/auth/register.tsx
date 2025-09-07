import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'
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
  EyeOff,
  User,
  Building2
} from 'lucide-react'

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
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <Heart className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Crear Cuenta
            </CardTitle>
            <CardDescription>
              Únete a Tail Time y comienza tu experiencia personalizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Account Type Selector */}
              <div>
                <Label className="text-base font-semibold">Tipo de Cuenta</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Elige el tipo de cuenta que mejor se adapte a ti
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, accountType: 'customer' }))}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.accountType === 'customer'
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50 hover:bg-accent'
                    }`}
                    disabled={isLoading}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <Heart className={`w-8 h-8 ${
                        formData.accountType === 'customer' ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <div>
                        <div className="font-semibold text-foreground">Cliente</div>
                        <div className="text-xs text-muted-foreground">
                          Buscar servicios para mis mascotas
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, accountType: 'groomer' }))}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.accountType === 'groomer'
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50 hover:bg-accent'
                    }`}
                    disabled={isLoading}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <Building2 className={`w-8 h-8 ${
                        formData.accountType === 'groomer' ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <div>
                        <div className="font-semibold text-foreground">Negocio</div>
                        <div className="text-xs text-muted-foreground">
                          Ofrecer servicios de grooming
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nombre Completo
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="mt-1"
                  placeholder="Tu nombre completo"
                  disabled={isLoading}
                  autoComplete="name"
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1"
                  placeholder="tu@email.com"
                  disabled={isLoading}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="flex items-center gap-2">
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
                    className="pr-10"
                    autoComplete="new-password"
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

              <div>
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Confirmar Contraseña
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirma tu contraseña"
                    disabled={isLoading}
                    className="pr-10"
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
                )}
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
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    Crear Cuenta
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <Separator />

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/auth/login" className="text-primary hover:underline font-medium">
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}