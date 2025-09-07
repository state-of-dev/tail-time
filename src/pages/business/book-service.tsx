import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft,
  ArrowRight,
  Clock,
  DollarSign,
  CheckCircle,
  Scissors,
  Heart,
  Star,
  Info,
  Tag
} from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { useAuth } from '@/contexts/auth-context-simple'
import { supabase } from '@/lib/supabase'

interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number
  category: string
  business_id: string
}

interface BusinessProfile {
  id: string
  business_name: string
  slug: string
  description: string
  is_active: boolean
}

interface BookingState {
  selectedService: Service | null
  selectedServiceIndex: number | null
}

export default function BookService() {
  const { businessSlug } = useParams<{ businessSlug: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { profile } = useAuth()
  const [business, setBusiness] = useState<BusinessProfile | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookingState, setBookingState] = useState<BookingState>({
    selectedService: null,
    selectedServiceIndex: null
  })

  // Get pre-selected service from URL params
  const preSelectedService = searchParams.get('service')

  const loadBusiness = useCallback(async () => {
    try {

      // Load business from database
      const { data: businessData, error: businessError } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('slug', businessSlug)
        .eq('is_active', true)
        .single()
      
      if (businessError || !businessData) {

        setError('Negocio no encontrado. Este negocio debe ser creado desde la base de datos.')
        return
      }
      
      // Load services for this business
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', businessData.id)

      if (servicesError) {
      }

      const realServices = servicesData || []

      setBusiness(businessData)
      setServices(realServices)

    } catch (error: any) {
      setError('Error al cargar el negocio')
    } finally {
      setIsLoading(false)
    }
  }, [businessSlug])

  useEffect(() => {

    if (!businessSlug) {
      setError('Negocio no encontrado')
      setIsLoading(false)
      return
    }
    loadBusiness()
  }, [businessSlug])

  useEffect(() => {
    if (services.length > 0 && preSelectedService) {
      // Parse pre-selected service (could be index or category-index)
      if (preSelectedService.includes('-')) {
        const [category, indexStr] = preSelectedService.split('-')
        const index = parseInt(indexStr)
        const servicesInCategory = services.filter(s => s.category === category)
        if (servicesInCategory[index]) {
          const globalIndex = services.findIndex(s => s === servicesInCategory[index])
          setBookingState({
            selectedService: servicesInCategory[index],
            selectedServiceIndex: globalIndex
          })
        }
      } else {
        const serviceByName = services.find(s => s.name === preSelectedService)
        if (serviceByName) {
          const globalIndex = services.findIndex(s => s === serviceByName)
          setBookingState({
            selectedService: serviceByName,
            selectedServiceIndex: globalIndex
          })
        }
      }
    }
  }, [services, preSelectedService])

  const handleServiceSelect = (index: number) => {

    if (!services || services.length === 0) return
    
    setBookingState({
      selectedService: services[index],
      selectedServiceIndex: index
    })

  }

  const handleContinue = (e?: React.MouseEvent) => {
    e?.preventDefault()

    if (!bookingState.selectedService || bookingState.selectedServiceIndex === null) {

      return
    }

    // Store selection in localStorage for the booking flow
    localStorage.setItem('booking-state', JSON.stringify({
      businessSlug,
      service: bookingState.selectedService,
      serviceIndex: bookingState.selectedServiceIndex,
      step: 'datetime',
      selectedDate: null,
      selectedTime: null
    }))
    
    const nextUrl = `/business/${businessSlug}/book/datetime`

    navigate(nextUrl)
  }

  // Helper function to group services by category
  const groupedServices = services?.reduce((groups, service, index) => {
    const category = service.category || 'otros'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push({ ...service, index })
    return groups
  }, {} as Record<string, (Service & { index: number })[]>) || {}

  // Category display names in Spanish
  const categoryNames: Record<string, string> = {
    'baño': 'Baño',
    'corte': 'Corte',
    'spa': 'Spa Completo',
    'veterinaria': 'Veterinaria',
    'otros': 'Otros Servicios'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="flex-1 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Cargando servicios...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="flex-1 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Card className="border-destructive">
              <CardContent className="pt-6 text-center">
                <div className="text-destructive text-xl mb-4">⚠️</div>
                <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => navigate('/')}>
                  Volver al inicio
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (!business || !services || services.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="flex-1 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <Scissors className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">No hay servicios disponibles</h2>
                <p className="text-muted-foreground mb-4">
                  Este negocio aún no ha configurado sus servicios.
                </p>
                <Button onClick={() => navigate('/')}>
                  Volver al inicio
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={() => navigate(`/business/${businessSlug}`)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al perfil
              </Button>
              <div className="text-sm text-muted-foreground">
                Paso 1 de 3
              </div>
            </div>
            <Progress value={33} className="w-full" />
          </div>

          {/* Business header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {business.business_name}
            </h1>
            <p className="text-muted-foreground">
              Selecciona el servicio que deseas reservar
            </p>
          </div>

          {/* Services by category */}
          <div className="space-y-8">
            {Object.entries(groupedServices).map(([category, services]) => (
              <div key={category}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  {categoryNames[category] || category}
                </h2>
                
                <div className="grid gap-4">
                  {services.map((service, categoryIndex) => {
                    const isSelected = bookingState.selectedServiceIndex === service.index
                    return (
                      <Card 
                        key={service.index}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          isSelected 
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => handleServiceSelect(service.index)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">
                                  {service.name}
                                </h3>
                                {isSelected && (
                                  <CheckCircle className="w-5 h-5 text-primary" />
                                )}
                              </div>
                              <p className="text-muted-foreground text-sm mb-3">
                                {service.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="w-4 h-4" />
                                  {service.duration} min
                                </div>
                                <div className="flex items-center gap-1 font-semibold text-foreground">
                                  <DollarSign className="w-4 h-4" />
                                  ${service.price}
                                </div>
                              </div>
                            </div>
                            
                            <div className="ml-4">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Scissors className="w-6 h-6 text-primary" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Continue button */}
          <div className="mt-8 flex justify-center">
            <Button 
              type="button"
              size="lg" 
              onClick={handleContinue}
              disabled={!bookingState.selectedService}
              className="flex items-center gap-2"
            >
              Continuar
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Selected service summary */}
          {bookingState.selectedService && (
            <Card className="mt-8 bg-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  Servicio Seleccionado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {bookingState.selectedService.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {bookingState.selectedService.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      ${bookingState.selectedService.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {bookingState.selectedService.duration} minutos
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}