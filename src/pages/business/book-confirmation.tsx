import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { createNotification, NotificationTemplates } from '@/lib/notifications'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft,
  CheckCircle,
  Calendar,
  Clock,
  DollarSign,
  PawPrint,
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  Scissors,
  Share2,
  Download,
  MessageSquare
} from 'lucide-react'
import { Navigation } from '@/components/navigation'

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
  address: string
  phone: string
  email: string
  is_active: boolean
}

interface BookingState {
  businessSlug: string
  service: Service
  serviceIndex: number
  step: string
  selectedDate: string
  selectedTime: string
}

interface PetInfo {
  petName: string
  petBreed: string
  petAge: string
  petWeight: string
  petSpecialNotes: string
  ownerName: string
  ownerEmail: string
  ownerPhone: string
  additionalNotes: string
}

export default function BookConfirmation() {
  const { businessSlug } = useParams<{ businessSlug: string }>()
  const navigate = useNavigate()
  const [business, setBusiness] = useState<BusinessProfile | null>(null)
  const [bookingState, setBookingState] = useState<BookingState | null>(null)
  const [petInfo, setPetInfo] = useState<PetInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [appointmentId, setAppointmentId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load booking state from localStorage
    const savedState = localStorage.getItem('booking-state')
    const savedPetInfo = localStorage.getItem('booking-pet-info')
    
    if (!savedState || !savedPetInfo) {
      navigate(`/business/${businessSlug}/book`)
      return
    }

    try {
      const state = JSON.parse(savedState) as BookingState
      const petInfoData = JSON.parse(savedPetInfo) as PetInfo
      
      if (state.businessSlug !== businessSlug || state.step !== 'confirmation') {
        navigate(`/business/${businessSlug}/book`)
        return
      }
      
      setBookingState(state)
      setPetInfo(petInfoData)
    } catch (error) {
      navigate(`/business/${businessSlug}/book`)
      return
    }

    loadBusiness()
  }, [businessSlug, navigate])

  const loadBusiness = async () => {
    try {

      // Try to load from database first
      const { data: businessData, error: businessError } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('slug', businessSlug)
        .eq('is_active', true)
        .single()
      
      if (businessData && !businessError) {

        setBusiness(businessData)
        setIsLoading(false)
        return
      }

      setError('Negocio no encontrado. Este negocio debe ser creado desde la base de datos.')
    } catch (error: any) {
      setError('Error al cargar el negocio')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmBooking = async () => {
    if (!bookingState || !petInfo || !business) return

    setIsSubmitting(true)
    setError(null)

    try {

      // First, find or create customer record
      let customerId: string

      const { data: customerResults, error: customerSearchError } = await supabase
        .from('customers')
        .select('id')
        .eq('email', petInfo.ownerEmail)
        .limit(1)

      if (customerSearchError) {

      }

      const existingCustomer = customerResults && customerResults.length > 0 ? customerResults[0] : null
      
      if (existingCustomer && !customerSearchError) {
        customerId = existingCustomer.id

      } else {
        // Create new customer

        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            business_id: business.id,
            name: petInfo.ownerName,
            email: petInfo.ownerEmail,
            phone: petInfo.ownerPhone
          })
          .select('id')
          .single()

        if (customerError) {
          throw customerError
        }
        customerId = newCustomer.id

      }

      // Create appointment record (matching schema)
      const calculatedEndTime = calculateEndTime(bookingState.selectedTime, bookingState.service.duration)

      const appointmentData = {
        business_id: business.id,
        customer_id: customerId,
        pet_id: null, // We'll add pet support later  
        appointment_date: bookingState.selectedDate,
        start_time: bookingState.selectedTime,
        end_time: calculatedEndTime,
        status: 'pending' as const,
        total_amount: bookingState.service.price,
        customer_notes: `Cliente: ${petInfo.ownerName} | Tel: ${petInfo.ownerPhone} | Email: ${petInfo.ownerEmail} | Mascota: ${petInfo.petName} (${petInfo.petBreed})${petInfo.additionalNotes ? ` | Notas: ${petInfo.additionalNotes}` : ''}`,
        internal_notes: `Servicio: ${bookingState.service.name} (${bookingState.service.duration} min)`
      }

      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select('id')
        .single()

      if (appointmentError) {
        throw appointmentError
      }

      setAppointmentId(appointment.id)
      setIsConfirmed(true)

      // Clear booking data from localStorage
      localStorage.removeItem('booking-state')
      localStorage.removeItem('booking-pet-info')

      // Trigger real-time notification to business owner (non-blocking)

      try {
        await triggerNewAppointmentNotification(appointment.id, appointmentData)
      } catch (notificationError) {
      }

    } catch (error: any) {
      setError('Error al confirmar la cita. Por favor intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to calculate end time
  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const startDateTime = new Date()
    startDateTime.setHours(hours, minutes, 0, 0)
    
    const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000)
    return `${endDateTime.getHours().toString().padStart(2, '0')}:${endDateTime.getMinutes().toString().padStart(2, '0')}`
  }

  // Function to trigger real-time notification
  const triggerNewAppointmentNotification = async (appointmentId: string, appointmentData: any) => {
    try {

      if (!business?.id) {
        return
      }

      // Parse customer info from notes
      const customerNotesMatch = appointmentData.customer_notes.match(/Cliente: ([^|]+)/)
      const customerName = customerNotesMatch ? customerNotesMatch[1].trim() : 'Cliente'
      
      // Parse service info from internal notes  
      const serviceNotesMatch = appointmentData.internal_notes.match(/Servicio: ([^(]+)/)
      const serviceName = serviceNotesMatch ? serviceNotesMatch[1].trim() : 'Servicio'
      
      // Create notification using our template system
      const template = NotificationTemplates.newAppointment(
        customerName,
        serviceName,
        appointmentData.appointment_date,
        appointmentData.start_time
      )

      const notification = await createNotification({
        recipientId: business.id, // Use business.id as recipient
        ...template,
        metadata: {
          appointment_id: appointmentId,
          business_id: business.id,
          customer_name: customerName,
          service_name: serviceName,
          appointment_date: appointmentData.appointment_date,
          start_time: appointmentData.start_time,
          total_amount: appointmentData.total_amount
        }
      })

      if (notification) {

      } else {
      }

    } catch (error) {
      // Don't throw - notification failure shouldn't break booking
    }
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (isLoading || !bookingState || !petInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-8 h-8 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Preparando confirmación...</p>
        </div>
      </div>
    )
  }

  if (error && !business) {
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

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                ¡Cita Confirmada!
              </h1>
              <p className="text-primary">
                Tu cita ha sido agendada exitosamente
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Appointment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="w-5 h-5" />
                  Detalles de tu Cita
                </CardTitle>
                <CardDescription>
                  ID de Cita: #{appointmentId?.slice(-8).toUpperCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">SERVICIO</Label>
                      <p className="font-semibold">{bookingState.service.name}</p>
                      <Badge variant="outline" className="mt-1">
                        {bookingState.service.category}
                      </Badge>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-muted-foreground">FECHA Y HORA</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{formatDate(bookingState.selectedDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{formatTime(bookingState.selectedTime)}</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">DURACIÓN Y PRECIO</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{bookingState.service.duration} minutos</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="font-bold text-primary">${bookingState.service.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">MASCOTA</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <PawPrint className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{petInfo.petName}</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">
                        {petInfo.petBreed}
                        {petInfo.petAge && ` • ${petInfo.petAge}`}
                      </p>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">PROPIETARIO</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{petInfo.ownerName}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{petInfo.ownerEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{petInfo.ownerPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Info */}
            {business && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {business.business_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {business.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">{business.address}</span>
                    </div>
                  )}
                  {business.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{business.phone}</span>
                    </div>
                  )}
                  {business.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{business.email}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Next Steps */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-blue-800 mb-3">Próximos pasos:</h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Recibirás un email de confirmación en los próximos minutos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Te enviaremos un recordatorio 24 horas antes de tu cita</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Puedes cancelar o reprogramar hasta 24 horas antes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => window.print()}
              >
                <Download className="w-4 h-4 mr-2" />
                Imprimir Confirmación
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Cita Confirmada',
                      text: `Cita para ${petInfo.petName} el ${formatDate(bookingState.selectedDate)} a las ${formatTime(bookingState.selectedTime)}`,
                    })
                  }
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
              <Button 
                className="flex-1"
                onClick={() => navigate(`/business/${businessSlug}`)}
              >
                Volver al Inicio
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
              onClick={() => navigate(`/business/${businessSlug}/book/pet-info`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Editar Información
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Confirmar tu Cita
              </h1>
              <p className="text-sm text-muted-foreground">
                Paso 4 de 4: Revisa y confirma los detalles
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Servicio</span>
              <span>Fecha y Hora</span>
              <span>Información</span>
              <span className="text-primary font-medium">Confirmación</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="w-5 h-5" />
                  Resumen del Servicio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{bookingState.service.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {bookingState.service.category}
                    </Badge>
                    {bookingState.service.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {bookingState.service.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      ${bookingState.service.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {bookingState.service.duration} minutos
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Fecha y Hora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{formatDate(bookingState.selectedDate)}</p>
                      <p className="text-sm text-muted-foreground">Fecha de la cita</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{formatTime(bookingState.selectedTime)}</p>
                      <p className="text-sm text-muted-foreground">Hora de la cita</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pet & Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PawPrint className="w-5 h-5" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-xs text-muted-foreground">MASCOTA</Label>
                    <p className="font-semibold">{petInfo.petName}</p>
                    <p className="text-sm text-muted-foreground">
                      {petInfo.petBreed}
                      {petInfo.petAge && ` • ${petInfo.petAge}`}
                      {petInfo.petWeight && ` • ${petInfo.petWeight}`}
                    </p>
                    {petInfo.petSpecialNotes && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Notas: {petInfo.petSpecialNotes}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">PROPIETARIO</Label>
                    <p className="font-semibold">{petInfo.ownerName}</p>
                    <div className="space-y-1 mt-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span>{petInfo.ownerEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span>{petInfo.ownerPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {petInfo.additionalNotes && (
                  <div className="pt-4 border-t border-border">
                    <Label className="text-xs text-muted-foreground">COMENTARIOS ADICIONALES</Label>
                    <p className="text-sm mt-1">{petInfo.additionalNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Confirmation Card */}
            <Card className="sticky top-6">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">¿Todo se ve bien?</h3>
                    <p className="text-sm text-muted-foreground">
                      Confirma tu cita para {petInfo.petName}
                    </p>
                  </div>

                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    onClick={handleConfirmBooking}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Heart className="w-4 h-4 mr-2 animate-pulse" />
                        Confirmando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirmar Cita
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    Al confirmar aceptas recibir recordatorios por email y SMS
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">
                      ¿Tienes preguntas?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      No dudes en contactarnos si tienes alguna pregunta sobre tu cita.
                    </p>
                    {business?.phone && (
                      <Button variant="outline" size="sm" className="mt-2">
                        <Phone className="w-4 h-4 mr-2" />
                        {business.phone}
                      </Button>
                    )}
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