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
  Tag,
  Sparkles,
  Trophy,
  Crown,
  PawPrint
} from 'lucide-react'
import {
  Star1, Star6, Star7, Star8, Star9, Star10, Star13, Star19, Star20, Star21, Star22, Star23, Star24, Star25, Star26, Star27, Star28, Star37, Star39, Star40,
  StarSizes
} from '@/components/ui/neobrutalism-stars'
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
    <div className="min-h-screen bg-chart-4">
      <Navigation />

      {/* Hero Section - Neobrutalism Style */}
      <section className="py-16 bg-chart-1 relative overflow-hidden border-t-4 border-black">
        {/* Floating Stars Background */}
        <div className="absolute inset-0 pointer-events-none">
          <Star1 className="absolute top-10 left-10 star-decoration" size={StarSizes.lg} />
          <Star6 className="absolute top-20 right-20 star-decoration" size={StarSizes.md} />
          <Star7 className="absolute bottom-16 left-32 star-decoration" size={StarSizes.xl} />
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          {/* Progress indicator - Neobrutalism Style */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <Button
                className="bg-chart-8 hover:bg-chart-6 text-main-foreground brutal-border-thick brutal-shadow-lg hover:brutal-hover font-black py-4 px-6 uppercase"
                onClick={() => navigate(`/business/${businessSlug}`)}
              >
                <ArrowLeft className="icon-large mr-2 icon-float" />
                <Star8 size={StarSizes.sm} className="star-decoration mr-2" />
                VOLVER AL PERFIL
              </Button>
              <Badge className="bg-chart-7 text-main-foreground brutal-border brutal-shadow font-black px-6 py-3 text-lg uppercase">
                <Trophy className="icon-standard mr-2 icon-float" />
                PASO 1 DE 3
              </Badge>
            </div>
            <div className="bg-chart-2 brutal-border-thick brutal-shadow-lg rounded-base p-4">
              <Progress value={33} className="w-full h-6 bg-chart-3" />
            </div>
          </div>

          {/* Business header - Neobrutalism Style */}
          <div className="text-center mb-12">
            <Badge className="bg-chart-8 text-main-foreground brutal-shadow-lg hover:brutal-hover px-8 py-4 text-xl font-black brutal-border-thick rounded-base transform -rotate-1 mb-8">
              <Scissors className="icon-large mr-2 icon-float" />
              <Star9 size={StarSizes.md} className="star-decoration" />
              RESERVAR SERVICIO
              <Star10 size={StarSizes.md} className="star-decoration" />
              <Crown className="icon-large ml-2 icon-float" />
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-main-foreground uppercase mb-6">
              <Star13 size={StarSizes.lg} className="star-decoration inline-block mr-4" />
              {business.business_name.toUpperCase()}
              <Star19 size={StarSizes.lg} className="star-decoration inline-block ml-4" />
            </h1>
            <p className="text-2xl font-bold text-main-foreground/80 uppercase">
              <Heart className="icon-large inline-block mr-2 icon-float" />
              SELECCIONA EL SERVICIO QUE DESEAS RESERVAR
              <Sparkles className="icon-large inline-block ml-2 icon-float" />
            </p>
          </div>
        </div>
      </section>

      <main className="py-16 bg-chart-3 border-t-4 border-black">
        <div className="max-w-4xl mx-auto px-4">

          {/* Services by category - Neobrutalism Style */}
          <div className="space-y-12">
            {Object.entries(groupedServices).map(([category, services]) => (
              <div key={category}>
                <div className="text-center mb-8">
                  <Badge className="bg-chart-6 text-main-foreground brutal-shadow-xl px-6 py-3 text-lg font-black brutal-border-thick rounded-base uppercase transform rotate-1">
                    <Tag className="icon-large mr-2 icon-float" />
                    <Star20 size={StarSizes.sm} className="star-decoration" />
                    {(categoryNames[category] || category).toUpperCase()}
                    <Star21 size={StarSizes.sm} className="star-decoration" />
                    <PawPrint className="icon-large ml-2 icon-float" />
                  </Badge>
                </div>
                
                <div className="grid gap-4">
                  {services.map((service, categoryIndex) => {
                    const isSelected = bookingState.selectedServiceIndex === service.index
                    return (
                      <Card
                        key={service.index}
                        className={`cursor-pointer brutal-shadow-lg hover:brutal-hover transition-all duration-200 brutal-border-thick ${
                          isSelected
                            ? 'bg-chart-1 text-main-foreground'
                            : 'bg-chart-4 hover:bg-chart-1/20'
                        }`}
                        onClick={() => handleServiceSelect(service.index)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className={`text-lg font-black uppercase ${
                                  isSelected ? 'text-main-foreground' : 'text-foreground'
                                }`}>
                                  {service.name}
                                </h3>
                                {isSelected && (
                                  <CheckCircle className="w-5 h-5 text-main-foreground icon-float" />
                                )}
                              </div>
                              <p className={`text-sm mb-3 font-bold uppercase ${
                                isSelected ? 'text-main-foreground/80' : 'text-muted-foreground'
                              }`}>
                                {service.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <div className={`flex items-center gap-1 font-bold ${
                                  isSelected ? 'text-main-foreground/80' : 'text-muted-foreground'
                                }`}>
                                  <Clock className="w-4 h-4 icon-float" />
                                  {service.duration} MIN
                                </div>
                                <div className={`flex items-center gap-1 font-black text-lg ${
                                  isSelected ? 'text-main-foreground' : 'text-foreground'
                                }`}>
                                  <DollarSign className="w-4 h-4 icon-float" />
                                  ${service.price}
                                </div>
                              </div>
                            </div>

                            <div className="ml-4">
                              <div className={`w-12 h-12 rounded-full brutal-border flex items-center justify-center ${
                                isSelected ? 'bg-chart-8' : 'bg-chart-6'
                              }`}>
                                <Scissors className="w-6 h-6 text-main-foreground icon-float" />
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

          {/* Continue button - Neobrutalism Style */}
          <div className="mt-8 flex justify-center">
            <Button
              type="button"
              size="lg"
              onClick={handleContinue}
              disabled={!bookingState.selectedService}
              className="flex items-center gap-4 bg-chart-2 hover:bg-chart-2/90 text-main-foreground brutal-border-thick brutal-shadow-xl hover:brutal-hover font-black py-6 px-12 text-xl uppercase"
            >
              <ArrowRight className="icon-large icon-float" />
              <Star25 size={StarSizes.sm} className="star-decoration" />
              CONTINUAR AL SIGUIENTE PASO
              <Star26 size={StarSizes.sm} className="star-decoration" />
              <Trophy className="icon-large icon-float" />
            </Button>
          </div>

          {/* Selected service summary - Neobrutalism Style */}
          {bookingState.selectedService && (
            <Card className="mt-8 bg-chart-3 brutal-shadow-xl brutal-border-thick relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <Star27 className="star-decoration" size={StarSizes.md} />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-4 text-main-foreground font-black text-xl uppercase">
                  <Star className="w-5 h-5 text-main-foreground icon-float" />
                  <Star28 size={StarSizes.sm} className="star-decoration" />
                  SERVICIO SELECCIONADO
                  <Crown className="icon-large icon-float" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-xl text-main-foreground uppercase mb-2">
                      {bookingState.selectedService.name}
                    </h3>
                    <p className="text-main-foreground/80 text-sm font-bold uppercase">
                      {bookingState.selectedService.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-main-foreground mb-1">
                      ${bookingState.selectedService.price}
                    </div>
                    <div className="text-sm text-main-foreground/80 font-bold uppercase">
                      {bookingState.selectedService.duration} MINUTOS
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