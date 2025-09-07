import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/lib/supabase'
import { 
  CheckCircle,
  ArrowRight,
  Globe,
  Calendar,
  Scissors,
  Camera,
  Share2,
  ExternalLink,
  Loader2,
  Sparkles,
  Star
} from 'lucide-react'

interface BusinessProfile {
  id: string
  business_name: string
  slug: string
  description: string
  business_hours: any
  services: any[]
  portfolio: any[]
}

export default function LaunchConfirmation() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isLaunching, setIsLaunching] = useState(false)
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null)
  const [error, setError] = useState<string | null>(null)

  const businessUrl = businessProfile ? `https://${businessProfile.slug}.tailtime.mx` : ''
  
  useEffect(() => {
    if (!user) {
      navigate('/auth/login')
      return
    }

    loadBusinessProfile()
  }, [user])

  const loadBusinessProfile = async () => {
    if (!user) return

    try {
      const { data: business, error: businessError } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('owner_id', user.id)
        .single()

      if (businessError || !business) {
        setError('No se encontró el perfil del negocio')
        return
      }

      setBusinessProfile(business)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLaunch = async () => {
    if (!businessProfile) return

    setIsLaunching(true)
    try {
      // Mark business as setup completed and active
      const { error: updateError } = await supabase
        .from('business_profiles')
        .update({
          setup_completed: true,
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', businessProfile.id)

      if (updateError) {
        setError(updateError.message)
        return
      }

      // Navigate to the groomer dashboard
      navigate(`/groomer/${businessProfile.slug}/dashboard`, { replace: true })

    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLaunching(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando información del negocio...</p>
        </div>
      </div>
    )
  }

  if (error || !businessProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error || 'No se pudo cargar la información'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/setup/business')}>
              Volver a Configuración
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const completedSteps = [
    { 
      name: 'Información del Negocio', 
      completed: !!businessProfile.business_name,
      icon: CheckCircle
    },
    { 
      name: 'Horarios de Atención', 
      completed: businessProfile.business_hours && Object.keys(businessProfile.business_hours).length > 0,
      icon: Calendar
    },
    { 
      name: 'Servicios', 
      completed: businessProfile.services && businessProfile.services.length > 0,
      icon: Scissors
    },
    { 
      name: 'Portfolio', 
      completed: businessProfile.portfolio && businessProfile.portfolio.length > 0,
      icon: Camera
    }
  ]

  const totalSteps = completedSteps.length
  const completedCount = completedSteps.filter(step => step.completed).length

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Sparkles className="w-12 h-12 text-primary" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">
              ¡Todo Listo para Lanzar!
            </CardTitle>
            <CardDescription className="text-xl text-muted-foreground mt-2">
              Tu negocio {businessProfile.business_name} está configurado y listo para recibir clientes
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Progress Summary */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Progreso de Configuración
                  </h3>
                  <span className="text-sm font-medium text-primary">
                    {completedCount}/{totalSteps} completados
                  </span>
                </div>
                
                <div className="space-y-3">
                  {completedSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <step.icon className="w-4 h-4" />
                        )}
                      </div>
                      <span className={`text-sm ${
                        step.completed 
                          ? 'text-foreground font-medium' 
                          : 'text-muted-foreground'
                      }`}>
                        {step.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Business Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="w-5 h-5" />
                    Tu Página Web
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Tu página estará disponible en:
                  </p>
                  <div className="p-3 bg-muted rounded-lg">
                    <code className="text-sm font-mono text-foreground">
                      {businessUrl}
                    </code>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(businessUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver Mi Página
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Star className="w-5 h-5" />
                    Próximos Pasos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      Acceder al panel de administración
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      Comenzar a recibir citas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      Compartir tu página con clientes
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => window.open(businessUrl, '_blank')}
              >
                <Globe className="w-6 h-6" />
                <span className="font-medium">Ver mi página</span>
                <span className="text-xs text-muted-foreground">Como la ven tus clientes</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => navigator.share ? 
                  navigator.share({
                    title: businessProfile.business_name,
                    text: `¡Agenda tu cita en ${businessProfile.business_name}!`,
                    url: businessUrl
                  }) : 
                  navigator.clipboard.writeText(businessUrl)
                }
              >
                <Share2 className="w-6 h-6" />
                <span className="font-medium">Compartir</span>
                <span className="text-xs text-muted-foreground">Envía tu página a clientes</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => navigate(`/groomer/${businessProfile.slug}/calendar`)}
              >
                <Calendar className="w-6 h-6" />
                <span className="font-medium">Ver calendario</span>
                <span className="text-xs text-muted-foreground">Gestiona tus citas</span>
              </Button>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Separator className="bg-border" />

            <Button
              onClick={handleLaunch}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 hover:shadow-lg transition-all duration-200 h-12"
              disabled={isLaunching}
            >
              {isLaunching ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Activando tu negocio...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  ¡Activar mi Negocio!
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}