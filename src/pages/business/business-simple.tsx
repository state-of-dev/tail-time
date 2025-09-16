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
  CheckCircle,
  PawPrint,
  Sparkles,
  Trophy,
  Crown,
  Zap
} from 'lucide-react'
import {
  Star1, Star6, Star7, Star8, Star9, Star10, Star13, Star19, Star20, Star21, Star22, Star23, Star24, Star25, Star26, Star27, Star28, Star37, Star39, Star40,
  StarSizes
} from '@/components/ui/neobrutalism-stars'
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
    <div className="min-h-screen bg-chart-4">
      <Navigation />
      {/* Hero Section - Neobrutalism Style */}
      <section className="py-20 bg-chart-1 relative overflow-hidden border-t-4 border-black">
        {/* Floating Stars Background */}
        <div className="absolute inset-0 pointer-events-none">
          <Star1 className="absolute top-12 left-10 star-decoration" size={StarSizes.lg} />
          <Star6 className="absolute top-32 right-20 star-decoration" size={StarSizes.md} />
          <Star7 className="absolute bottom-20 left-32 star-decoration" size={StarSizes.xl} />
          <Star8 className="absolute top-20 right-1/3 star-decoration" size={StarSizes.sm} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="mb-12">
              <div className="p-8 bg-chart-2 brutal-border-thick brutal-shadow-xl rounded-base inline-block mb-8">
                <Scissors className="icon-hero text-main-foreground icon-float" />
              </div>
              <Badge className="bg-chart-8 text-main-foreground brutal-shadow-lg hover:brutal-hover px-8 py-4 text-xl font-black brutal-border-thick rounded-base transform -rotate-1 mb-8 inline-block">
                <PawPrint className="icon-large mr-2 icon-float" />
                <Star9 size={StarSizes.md} className="star-decoration" />
                GROOMING PROFESIONAL
                <Star10 size={StarSizes.md} className="star-decoration" />
                <Crown className="icon-large ml-2 icon-float" />
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black text-main-foreground uppercase mb-6">
                <Star13 size={StarSizes.lg} className="star-decoration inline-block mr-4" />
                {business.business_name.toUpperCase()}
                <Star19 size={StarSizes.lg} className="star-decoration inline-block ml-4" />
              </h1>
              <p className="text-2xl font-bold text-main-foreground/80 uppercase max-w-4xl mx-auto">
                <Heart className="icon-large inline-block mr-2 icon-float" />
                {(business.description || 'CUIDADO PROFESIONAL PARA TU MASCOTA').toUpperCase()}
                <Sparkles className="icon-large inline-block ml-2 icon-float" />
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Button
                className="bg-chart-3 hover:bg-chart-4 text-main-foreground brutal-border-thick brutal-shadow-xl hover:brutal-hover font-black text-2xl py-8 px-12 uppercase"
                onClick={() => navigate(`/business/${businessSlug}/book`)}
              >
                <Calendar className="icon-hero mr-4 icon-float" />
                <Star20 size={StarSizes.md} className="star-decoration mr-2" />
                AGENDAR CITA
                <ArrowRight className="icon-hero ml-4 icon-float" />
              </Button>
              <Button
                className="bg-chart-5 hover:bg-chart-6 text-main-foreground brutal-border-thick brutal-shadow-xl hover:brutal-hover font-black text-2xl py-8 px-12 uppercase"
                onClick={() => window.open(`tel:${business.phone}`, '_self')}
              >
                <Phone className="icon-hero mr-4 icon-float" />
                <Star21 size={StarSizes.md} className="star-decoration mr-2" />
                LLAMAR AHORA
                <Zap className="icon-hero ml-4 icon-float" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="py-16 bg-chart-3 border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Services Section */}
              <div className="mb-16">
                <div className="text-center mb-12">
                  <Badge className="bg-chart-5 text-main-foreground brutal-shadow-xl px-8 py-4 text-xl font-black brutal-border-thick rounded-base uppercase transform rotate-1">
                    <Scissors className="icon-large mr-2 icon-float" />
                    <Star22 size={StarSizes.md} className="star-decoration" />
                    NUESTROS SERVICIOS
                    <Star23 size={StarSizes.md} className="star-decoration" />
                    <Trophy className="icon-large ml-2 icon-float" />
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {services.length > 0 ? services.map((service) => (
                    <Card key={service.id} className="bg-chart-7 brutal-border-thick brutal-shadow-lg hover:brutal-hover transition-all duration-200 transform hover:-rotate-1">
                      <CardHeader className="bg-chart-2 brutal-border-thick border-b-4 border-l-0 border-r-0 border-t-0">
                        <div className="flex justify-between items-start mb-4">
                          <CardTitle className="text-2xl font-black text-main-foreground uppercase">
                            <Star24 size={StarSizes.sm} className="star-decoration inline-block mr-2" />
                            {service.name.toUpperCase()}
                          </CardTitle>
                          <Badge className="bg-chart-8 text-main-foreground brutal-border brutal-shadow font-black text-lg px-4 py-2">
                            <DollarSign className="icon-standard inline-block mr-1 icon-float" />
                            ${service.price}
                          </Badge>
                        </div>
                        <CardDescription className="text-main-foreground/80 font-bold text-lg">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="bg-chart-7 p-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center font-bold text-main-foreground">
                            <Clock className="icon-large mr-2 icon-float" />
                            <span className="text-lg uppercase">{service.duration} MIN</span>
                          </div>
                          <Button
                            className="bg-chart-1 hover:bg-chart-3 text-main-foreground brutal-border-thick brutal-shadow-lg hover:brutal-hover font-black text-lg py-4 px-6 uppercase"
                            onClick={() => navigate(`/business/${businessSlug}/book?service=${service.name}`)}
                          >
                            <CheckCircle className="icon-large mr-2 icon-float" />
                            RESERVAR
                            <ArrowRight className="icon-large ml-2 icon-float" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )) : (
                    <div className="col-span-2 text-center py-12">
                      <div className="p-8 bg-chart-6 brutal-border-thick brutal-shadow-lg rounded-base inline-block mb-6">
                        <Heart className="icon-hero text-main-foreground icon-float" />
                      </div>
                      <p className="text-main-foreground font-black text-xl uppercase">
                        <Star25 size={StarSizes.md} className="star-decoration inline-block mr-2" />
                        NO HAY SERVICIOS DISPONIBLES EN ESTE MOMENTO
                        <Star26 size={StarSizes.md} className="star-decoration inline-block ml-2" />
                      </p>
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
    </div>
  )
}