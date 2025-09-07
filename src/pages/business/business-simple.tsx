import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Star,
  Clock,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Scissors,
  Heart,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { Navigation } from '@/components/navigation'

interface BusinessProfile {
  id: string
  business_name: string
  slug: string
  description: string
  phone: string
  email: string
  address: string
  city: string
  logo_url: string
  cover_image_url: string
  is_active: boolean
}

interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number
  category: string
  business_id: string
}

export default function BusinessSimple() {
  const { businessSlug } = useParams<{ businessSlug: string }>()
  const navigate = useNavigate()
  const [business, setBusiness] = useState<BusinessProfile | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!businessSlug) {
      navigate('/')
      return
    }
    loadBusiness()
  }, [businessSlug])

  const loadBusiness = async () => {
    try {

      // ✅ PATRÓN EXITOSO: Load real data from Supabase
      const { data: businessData, error: businessError } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('slug', businessSlug)
        .eq('is_active', true)
        .single()

      if (businessError || !businessData) {
        console.error('[BUSINESS] Business not found:', businessError?.message)
        setError('Negocio no encontrado o no disponible')
        return
      }

      // Load services for this business
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', businessData.id)

      if (servicesError) {
        console.error('[BUSINESS] Error loading services:', servicesError.message)
      }

      const realServices = servicesData || []
      
      // Clean description by removing embedded JSON hours
      const cleanDescription = businessData.description?.split('\nHOURS:')[0] || businessData.description || 'Servicios profesionales de grooming'

      setBusiness({...businessData, description: cleanDescription})
      setServices(realServices)
    } catch (err) {
      console.error('[BUSINESS] Error loading business:', err)
      setError('Error cargando información del negocio')
    } finally {
      setIsLoading(false)
    }
  }

  const defaultServices = [
    {
      name: 'Baño Básico',
      description: 'Baño completo con champú especializado',
      duration: 60,
      price: 250,
      category: 'baño'
    },
    {
      name: 'Corte y Baño',
      description: 'Baño completo + corte de pelo personalizado',
      duration: 90,
      price: 350,
      category: 'corte'
    },
    {
      name: 'Spa Completo',
      description: 'Baño, corte, corte de uñas, limpieza de oídos',
      duration: 120,
      price: 500,
      category: 'spa'
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-8 h-8 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Negocio no encontrado</CardTitle>
            <CardDescription>{error || 'Este negocio no está disponible'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')}>
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary/20 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scissors className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {business.business_name}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {business.description || 'Cuidado profesional para tu mascota'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate(`/business/${businessSlug}/book`)}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Cita
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open(`tel:${business.phone}`, '_self')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Llamar Ahora
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Services Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Nuestros Servicios</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.length > 0 ? services.map((service) => (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <Badge variant="secondary" className="text-primary">
                          ${service.price}
                        </Badge>
                      </div>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {service.duration} min
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/business/${businessSlug}/book?service=${service.name}`)}
                        >
                          Reservar
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-muted-foreground">No hay servicios disponibles en este momento</p>
                  </div>
                )}
              </div>
            </div>

            {/* Features Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">¿Por qué elegirnos?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-foreground">Profesionales Certificados</h3>
                    <p className="text-sm text-muted-foreground">
                      Nuestros groomers están certificados y tienen años de experiencia
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-foreground">Productos de Calidad</h3>
                    <p className="text-sm text-muted-foreground">
                      Usamos solo los mejores productos para el cuidado de tu mascota
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-foreground">Ambiente Seguro</h3>
                    <p className="text-sm text-muted-foreground">
                      Instalaciones limpias y seguras para la comodidad de tu mascota
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-foreground">Citas Flexibles</h3>
                    <p className="text-sm text-muted-foreground">
                      Horarios flexibles que se adaptan a tu disponibilidad
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {business.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Teléfono</p>
                      <p className="text-sm text-muted-foreground">{business.phone}</p>
                    </div>
                  </div>
                )}
                {business.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">{business.email}</p>
                    </div>
                  </div>
                )}
                {business.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-foreground">Dirección</p>
                      <p className="text-sm text-muted-foreground">
                        {business.address}
                        {business.city && `, ${business.city}`}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Horarios de Atención</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-muted-foreground">Lunes - Viernes</span>
                    <span className="text-sm font-medium text-foreground">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-muted-foreground">Sábado</span>
                    <span className="text-sm font-medium text-foreground">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-muted-foreground">Domingo</span>
                    <span className="text-sm font-medium text-foreground">Cerrado</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-medium text-foreground mb-2">
                    ¿Listo para consentir a tu mascota?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Agenda tu cita ahora y dale a tu mascota el cuidado que se merece
                  </p>
                  <Button 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => navigate(`/business/${businessSlug}/book`)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Ahora
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}