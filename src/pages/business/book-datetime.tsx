import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Scissors,
  Heart,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { supabase } from '@/lib/supabase'

interface Service {
  name: string
  description: string
  duration: number
  price: number
  category: string
}

interface BusinessProfile {
  id: string
  business_name: string
  slug: string
  description: string
  business_hours: BusinessHours
  is_active: boolean
}

interface BusinessHours {
  [key: string]: {
    is_open: boolean
    open_time: string
    close_time: string
  }
}

interface BookingState {
  businessSlug: string
  service: Service
  serviceIndex: number
  step: string
  selectedDate?: string
  selectedTime?: string
}

interface TimeSlot {
  time: string
  available: boolean
  reason?: string
}

const DAYS_OF_WEEK = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
]

const DAY_NAMES = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
]

export default function BookDatetime() {
  const { businessSlug } = useParams<{ businessSlug: string }>()
  const navigate = useNavigate()
  const [business, setBusiness] = useState<BusinessProfile | null>(null)
  const [bookingState, setBookingState] = useState<BookingState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  useEffect(() => {
    // Load booking state from localStorage
    const savedState = localStorage.getItem('booking-state')
    if (!savedState) {
      navigate(`/business/${businessSlug}/book`)
      return
    }

    try {
      const state = JSON.parse(savedState) as BookingState
      if (state.businessSlug !== businessSlug || state.step !== 'datetime') {
        navigate(`/business/${businessSlug}/book`)
        return
      }
      setBookingState(state)
    } catch (error) {
      navigate(`/business/${businessSlug}/book`)
      return
    }

    loadBusiness()
  }, [businessSlug, navigate])

  useEffect(() => {
    if (selectedDate && business && bookingState) {
      loadTimeSlots(selectedDate)
    }
  }, [selectedDate, business, bookingState])

  const loadBusiness = async () => {
    try {

      // Use mock data with business hours
      const mockBusinesses = {
        'demo-groomer': {
          id: '1',
          business_name: 'Grooming Paradise Demo',
          slug: 'demo-groomer',
          description: 'El mejor salon de belleza para mascotas en la ciudad',
          business_hours: {
            monday: { is_open: true, open_time: '09:00', close_time: '17:00' },
            tuesday: { is_open: true, open_time: '09:00', close_time: '17:00' },
            wednesday: { is_open: true, open_time: '09:00', close_time: '17:00' },
            thursday: { is_open: true, open_time: '09:00', close_time: '17:00' },
            friday: { is_open: true, open_time: '09:00', close_time: '17:00' },
            saturday: { is_open: true, open_time: '10:00', close_time: '16:00' },
            sunday: { is_open: false, open_time: '', close_time: '' }
          },
          is_active: true
        },
        'vetfriendly': {
          id: '2', 
          business_name: 'Vet Friendly',
          slug: 'vetfriendly',
          description: 'Cuidado veterinario y estética profesional',
          business_hours: {
            monday: { is_open: true, open_time: '08:00', close_time: '18:00' },
            tuesday: { is_open: true, open_time: '08:00', close_time: '18:00' },
            wednesday: { is_open: true, open_time: '08:00', close_time: '18:00' },
            thursday: { is_open: true, open_time: '08:00', close_time: '18:00' },
            friday: { is_open: true, open_time: '08:00', close_time: '18:00' },
            saturday: { is_open: true, open_time: '09:00', close_time: '15:00' },
            sunday: { is_open: false, open_time: '', close_time: '' }
          },
          is_active: true
        },
        'salon-fluffy': {
          id: '3',
          business_name: 'Salon Fluffy',
          slug: 'salon-fluffy', 
          description: 'Servicios de grooming premium para tu mascota',
          business_hours: {
            monday: { is_open: true, open_time: '10:00', close_time: '19:00' },
            tuesday: { is_open: true, open_time: '10:00', close_time: '19:00' },
            wednesday: { is_open: true, open_time: '10:00', close_time: '19:00' },
            thursday: { is_open: true, open_time: '10:00', close_time: '19:00' },
            friday: { is_open: true, open_time: '10:00', close_time: '19:00' },
            saturday: { is_open: true, open_time: '09:00', close_time: '17:00' },
            sunday: { is_open: true, open_time: '11:00', close_time: '16:00' }
          },
          is_active: true
        },
        'fluffy-x': {
          id: '4',
          business_name: 'Fluffy X',
          slug: 'fluffy-x',
          description: 'Estética moderna y cuidado especializado',
          business_hours: {
            monday: { is_open: true, open_time: '09:00', close_time: '18:00' },
            tuesday: { is_open: true, open_time: '09:00', close_time: '18:00' },
            wednesday: { is_open: true, open_time: '09:00', close_time: '18:00' },
            thursday: { is_open: true, open_time: '09:00', close_time: '18:00' },
            friday: { is_open: true, open_time: '09:00', close_time: '18:00' },
            saturday: { is_open: true, open_time: '10:00', close_time: '16:00' },
            sunday: { is_open: false, open_time: '', close_time: '' }
          },
          is_active: true
        },
        'salon-flurry': {
          id: '5',
          business_name: 'Salon Flurry',
          slug: 'salon-flurry',
          description: 'Tratamientos de spa y belleza para mascotas',
          business_hours: {
            monday: { is_open: true, open_time: '08:30', close_time: '17:30' },
            tuesday: { is_open: true, open_time: '08:30', close_time: '17:30' },
            wednesday: { is_open: true, open_time: '08:30', close_time: '17:30' },
            thursday: { is_open: true, open_time: '08:30', close_time: '17:30' },
            friday: { is_open: true, open_time: '08:30', close_time: '17:30' },
            saturday: { is_open: true, open_time: '09:00', close_time: '16:00' },
            sunday: { is_open: false, open_time: '', close_time: '' }
          },
          is_active: true
        },
        'salon-rluxxy': {
          id: '6',
          business_name: 'Salon Rluxxy',
          slug: 'salon-rluxxy',
          description: 'Experiencia de grooming de lujo para tu mascota',
          business_hours: {
            monday: { is_open: true, open_time: '10:00', close_time: '20:00' },
            tuesday: { is_open: true, open_time: '10:00', close_time: '20:00' },
            wednesday: { is_open: true, open_time: '10:00', close_time: '20:00' },
            thursday: { is_open: true, open_time: '10:00', close_time: '20:00' },
            friday: { is_open: true, open_time: '10:00', close_time: '20:00' },
            saturday: { is_open: true, open_time: '09:00', close_time: '18:00' },
            sunday: { is_open: true, open_time: '12:00', close_time: '17:00' }
          },
          is_active: true
        }
      }

      // ✅ PATRÓN EXITOSO: Load real data from Supabase instead of mock data
      const { data: realBusinessData, error: businessError } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('slug', businessSlug)
        .eq('is_active', true)
        .single()

      if (businessError || !realBusinessData) {
        setError('Negocio no encontrado o inactivo')
        return
      }

      // Extract business hours from embedded JSON in description
      const extractBusinessHours = (description: string) => {
        try {
          const hoursMatch = description.match(/HOURS:(.+)$/)
          if (!hoursMatch) return {
            monday: { is_open: true, open_time: '09:00', close_time: '18:00' },
            tuesday: { is_open: true, open_time: '09:00', close_time: '18:00' },
            wednesday: { is_open: true, open_time: '09:00', close_time: '18:00' },
            thursday: { is_open: true, open_time: '09:00', close_time: '18:00' },
            friday: { is_open: true, open_time: '09:00', close_time: '18:00' },
            saturday: { is_open: true, open_time: '09:00', close_time: '16:00' },
            sunday: { is_open: false, open_time: '', close_time: '' }
          }
          
          const hoursData = JSON.parse(hoursMatch[1])
          
          // Convert from our JSON format to the format expected by this component
          const businessHours: BusinessHours = {}
          Object.entries(hoursData).forEach(([day, data]: [string, any]) => {
            businessHours[day] = {
              is_open: data.open,
              open_time: data.start || '',
              close_time: data.end || ''
            }
          })
          return businessHours
        } catch {
          return {
            monday: { is_open: true, open_time: '09:00', close_time: '18:00' },
            tuesday: { is_open: true, open_time: '09:00', close_time: '18:00' },
            wednesday: { is_open: true, open_time: '09:00', close_time: '18:00' },
            thursday: { is_open: true, open_time: '09:00', close_time: '18:00' },
            friday: { is_open: true, open_time: '09:00', close_time: '18:00' },
            saturday: { is_open: true, open_time: '09:00', close_time: '16:00' },
            sunday: { is_open: false, open_time: '', close_time: '' }
          }
        }
      }

      const businessHours = extractBusinessHours(realBusinessData.description || '')
      const cleanDescription = realBusinessData.description?.split('\nHOURS:')[0] || realBusinessData.description || 'Servicios profesionales de grooming'

      setBusiness({
        ...realBusinessData,
        description: cleanDescription,
        business_hours: businessHours
      })
    } catch (error: any) {
      setError('Error al cargar el negocio')
    } finally {
      setIsLoading(false)
    }
  }

  const loadTimeSlots = async (date: string) => {
    if (!business || !bookingState) return

    setLoadingSlots(true)
    try {
      const dateObj = new Date(date)
      const dayOfWeek = DAYS_OF_WEEK[dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1]
      const dayHours = business.business_hours?.[dayOfWeek]

      if (!dayHours || !dayHours.is_open) {
        setTimeSlots([])
        return
      }

      // Generate time slots based on business hours
      const slots: TimeSlot[] = []
      const serviceDuration = bookingState.service.duration
      const openTime = dayHours.open_time
      const closeTime = dayHours.close_time
      
      let currentTime = openTime
      while (currentTime < closeTime) {
        const [hours, minutes] = currentTime.split(':').map(Number)
        const slotTime = new Date()
        slotTime.setHours(hours, minutes, 0, 0)
        
        // Check if there's enough time for the service
        const endTime = new Date(slotTime.getTime() + serviceDuration * 60000)
        const closeDateTime = new Date()
        const [closeHours, closeMinutes] = closeTime.split(':').map(Number)
        closeDateTime.setHours(closeHours, closeMinutes, 0, 0)
        
        if (endTime <= closeDateTime) {
          // Check if slot is in the past
          const now = new Date()
          const slotDateTime = new Date(date + 'T' + currentTime)
          const isAvailable = slotDateTime > now
          
          slots.push({
            time: currentTime,
            available: isAvailable,
            reason: !isAvailable ? 'Hora pasada' : undefined
          })
        }
        
        // Move to next 30-minute slot
        const nextSlot = new Date(slotTime.getTime() + 30 * 60000)
        currentTime = nextSlot.toTimeString().slice(0, 5)
      }

      setTimeSlots(slots)
    } catch (error) {
      setTimeSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedTime(null)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleContinue = () => {

    if (!selectedDate || !selectedTime || !bookingState) {

      return
    }

    // Update booking state
    const updatedState = {
      ...bookingState,
      selectedDate,
      selectedTime,
      step: 'pet-info'
    }

    localStorage.setItem('booking-state', JSON.stringify(updatedState))
    const nextUrl = `/business/${businessSlug}/book/pet-info`

    navigate(nextUrl)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDate = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return days
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  if (isLoading || !bookingState) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-8 h-8 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando calendario...</p>
        </div>
      </div>
    )
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(`/business/${businessSlug}/book`)}>
              Volver a Servicios
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const today = new Date()
  const currentMonthNumber = currentMonth.getMonth()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/business/${businessSlug}/book`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cambiar Servicio
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Seleccionar Fecha y Hora - {business.business_name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Paso 2 de 4: Elige cuándo quieres tu cita
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Servicio</span>
              <span className="text-primary font-medium">Fecha y Hora</span>
              <span>Información</span>
              <span>Confirmación</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar and Time Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Seleccionar Fecha
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const prevMonth = new Date(currentMonth)
                        prevMonth.setMonth(prevMonth.getMonth() - 1)
                        setCurrentMonth(prevMonth)
                      }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[120px] text-center">
                      {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const nextMonth = new Date(currentMonth)
                        nextMonth.setMonth(nextMonth.getMonth() + 1)
                        setCurrentMonth(nextMonth)
                      }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {DAY_NAMES.map((day, index) => (
                    <div key={index} className="text-center text-xs font-medium text-muted-foreground p-2">
                      {day.slice(0, 3)}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {daysInMonth.map((date, index) => {
                    const dateStr = date.toISOString().split('T')[0]
                    const isCurrentMonth = date.getMonth() === currentMonthNumber
                    const isToday = date.toDateString() === today.toDateString()
                    const isPast = date < today && !isToday
                    const isSelected = selectedDate === dateStr
                    
                    return (
                      <button
                        key={index}
                        onClick={() => !isPast && isCurrentMonth && handleDateSelect(dateStr)}
                        disabled={isPast || !isCurrentMonth}
                        className={`
                          aspect-square p-2 text-sm rounded-md transition-all duration-200
                          ${!isCurrentMonth ? 'text-muted-foreground/30' : ''}
                          ${isPast ? 'text-muted-foreground/50 cursor-not-allowed' : ''}
                          ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                          ${isToday && !isSelected ? 'bg-muted border border-primary' : ''}
                          ${!isPast && isCurrentMonth ? 'cursor-pointer' : ''}
                        `}
                      >
                        {date.getDate()}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Time Slots */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Horarios Disponibles
                  </CardTitle>
                  <CardDescription>
                    {new Date(selectedDate).toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingSlots ? (
                    <div className="text-center py-8">
                      <Clock className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Cargando horarios...</p>
                    </div>
                  ) : timeSlots.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-8 h-8 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No hay horarios disponibles en esta fecha</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => slot.available && handleTimeSelect(slot.time)}
                          disabled={!slot.available}
                          className={`
                            p-3 rounded-md text-sm font-medium transition-all duration-200
                            ${slot.available 
                              ? selectedTime === slot.time 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted hover:bg-muted/80 border border-border hover:border-primary/50'
                              : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                            }
                          `}
                        >
                          {formatTime(slot.time)}
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Booking Summary */}
          <div className="space-y-6">
            {/* Selected Details */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="w-5 h-5" />
                  Resumen de Cita
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Service */}
                <div className="pb-4 border-b border-border">
                  <Label className="text-xs text-muted-foreground">SERVICIO</Label>
                  <h4 className="font-semibold text-foreground">
                    {bookingState.service.name}
                  </h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{bookingState.service.duration} min</span>
                    <span className="text-primary font-semibold">${bookingState.service.price}</span>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="pb-4 border-b border-border">
                  <Label className="text-xs text-muted-foreground">FECHA Y HORA</Label>
                  {selectedDate && selectedTime ? (
                    <div className="space-y-1">
                      <div className="font-semibold text-foreground">
                        {new Date(selectedDate).toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatTime(selectedTime)}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {!selectedDate ? 'Selecciona una fecha' : 'Selecciona una hora'}
                    </p>
                  )}
                </div>

                {/* Continue Button */}
                <div className="pt-4">
                  <Button 
                    className="w-full"
                    disabled={!selectedDate || !selectedTime}
                    onClick={handleContinue}
                  >
                    Continuar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">
                      Política de Cancelación
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Puedes cancelar o reprogramar tu cita hasta 24 horas antes sin costo adicional.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}