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
  Camera,
  ArrowRight,
  CheckCircle,
  Globe,
  Share2
} from 'lucide-react'

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
  business_hours: any
  services: any[]
  portfolio: any[]
  is_active: boolean
}

const DAYS_ES = {
  monday: 'Lunes',
  tuesday: 'Martes', 
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo'
}

export default function BusinessLanding() {
  const { businessSlug } = useParams<{ businessSlug: string }>()
  const navigate = useNavigate()
  const [business, setBusiness] = useState<BusinessProfile | null>(null)
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!businessSlug) {
      setError('Negocio no encontrado')
      setIsLoading(false)
      return
    }
    loadBusiness()
  }, [businessSlug])

  const loadBusiness = async () => {
    try {

      const { data: businessData, error: businessError } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('slug', businessSlug)
        .eq('is_active', true)
        .single()

      if (businessError || !businessData) {
        console.error('[BUSINESS] ❌ Business not found:', businessError)
        setError('Negocio no encontrado o inactivo')
        return
      }

      setBusiness(businessData)

      // Load services from separate table

      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', businessData.id)
        .order('price')

      if (servicesError) {
        console.error('[BUSINESS] ⚠️ Services load error:', servicesError.message)
        // Don't fail if services don't load, just continue without them
        setServices([])
      } else {

        setServices(servicesData || [])
      }

    } catch (error: any) {
      console.error('[BUSINESS] 💥 Exception loading business:', error)
      setError('Error al cargar el negocio')
    } finally {
      setIsLoading(false)
    }
  }

  const getTodayHours = () => {
    if (!business?.business_hours) return null
    
    const today = new Date().toLocaleDateString('en', { weekday: 'long' }).toLowerCase()
    const todayHours = business.business_hours[today]
    
    if (!todayHours || !todayHours.isOpen) {
      return 'Cerrado hoy'
    }
    
    return `${todayHours.openTime} - ${todayHours.closeTime}`
  }

  const getOpenDays = () => {
    if (!business?.business_hours) return []
    
    return Object.entries(business.business_hours)
      .filter(([_, hours]: [string, any]) => hours.isOpen)
      .map(([day, hours]: [string, any]) => ({
        day: DAYS_ES[day as keyof typeof DAYS_ES] || day,
        hours: `${hours.openTime} - ${hours.closeTime}`
      }))
  }

  const shareUrl = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({
        title: business?.business_name,
        text: `¡Agenda tu cita en ${business?.business_name}!`,
        url
      })
    } else {
      navigator.clipboard.writeText(url)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-8 h-8 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando negocio...</p>
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
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')}>
              Ir a Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Use only real services from database - no fallbacks
  const featuredServices = services.slice(0, 3)
  const portfolioItems = business?.portfolio?.slice(0, 6) || []

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/10 to-primary/5">
        {business.cover_image_url && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${business.cover_image_url})` }}
          />
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {business.logo_url && (
              <img
                src={business.logo_url}
                alt={business.business_name}
                className="w-20 h-20 mx-auto mb-6 rounded-full object-cover shadow-lg"
              />
            )}
            
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {business.business_name}
            </h1>
            
            {business.description && (
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {business.description}
              </p>
            )}

            {/* Status & Hours */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-foreground">
                  {getTodayHours()}
                </span>
              </div>
              
              {business.address && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {business.address}, {business.city}
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => navigate(`/business/${businessSlug}/services`)}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Cita
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <div className="flex gap-2">
                {business.phone && (
                  <Button variant="outline" onClick={() => window.open(`tel:${business.phone}`)}>
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar
                  </Button>
                )}
                <Button variant="outline" onClick={shareUrl}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Services */}
            {featuredServices.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Scissors className="w-6 h-6" />
                    Servicios Destacados
                  </h2>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/business/${businessSlug}/services`)}
                  >
                    Ver Todos
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {featuredServices.map((service: any, index: number) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-foreground">
                                {service.name}
                              </h3>
                              <Badge variant="outline">
                                {service.category}
                              </Badge>
                            </div>
                            
                            {service.description && (
                              <p className="text-sm text-muted-foreground mb-3">
                                {service.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {service.duration} min
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                ${service.price}
                              </div>
                            </div>
                          </div>
                          
                          <Button onClick={() => navigate(`/business/${businessSlug}/book?service=${index}`)}>
                            Agendar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Portfolio */}
            {portfolioItems.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Camera className="w-6 h-6" />
                    Nuestros Trabajos
                  </h2>
                  <Button variant="outline">
                    Ver Galería
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {portfolioItems.map((item: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="grid grid-cols-2 gap-1">
                        {item.beforeImageUrl && (
                          <div className="relative aspect-square">
                            <img
                              src={item.beforeImageUrl}
                              alt="Antes"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              Antes
                            </div>
                          </div>
                        )}
                        {item.afterImageUrl && (
                          <div className="relative aspect-square">
                            <img
                              src={item.afterImageUrl}
                              alt="Después"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute top-2 left-2 bg-primary/90 text-white text-xs px-2 py-1 rounded">
                              Después
                            </div>
                          </div>
                        )}
                      </div>
                      {item.title && (
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {business.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Teléfono</p>
                      <a 
                        href={`tel:${business.phone}`}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {business.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {business.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <a 
                        href={`mailto:${business.email}`}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {business.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {business.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Dirección</p>
                      <p className="text-sm text-muted-foreground">
                        {business.address}, {business.city}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Horarios de Atención</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getOpenDays().map((dayInfo) => (
                    <div key={dayInfo.day} className="flex justify-between text-sm">
                      <span className="text-foreground">{dayInfo.day}</span>
                      <span className="text-muted-foreground">{dayInfo.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6 text-center">
                <Heart className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold text-foreground mb-2">
                  ¿Listo para agendar?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Agenda tu cita en línea de forma rápida y sencilla
                </p>
                <Button 
                  className="w-full"
                  onClick={() => navigate(`/business/${businessSlug}/services`)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Ahora
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}