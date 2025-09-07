import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context-simple'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Navigation } from '@/components/navigation'
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Heart,
  Dog,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Hourglass
} from 'lucide-react'

interface AppointmentDetail {
  id: string
  appointment_date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  total_amount: number
  notes?: string
  special_instructions?: string
  created_at: string
  updated_at?: string
  completed_at?: string
  
  // Service details
  services: {
    id: string
    name: string
    description: string
    price: number
    duration: number
    category: string
  }
  
  // Business details
  business_profiles: {
    id: string
    business_name: string
    slug: string
    phone: string
    email: string
    address: string
    logo_url?: string
  }
  
  // Pet details
  pets: {
    id: string
    name: string
    breed: string
    size: string
    temperament?: string
  }
}

const STATUS_CONFIG = {
  pending: {
    icon: Hourglass,
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  confirmed: {
    icon: CheckCircle,
    label: 'Confirmada',
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  in_progress: {
    icon: Clock,
    label: 'En Progreso',
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  completed: {
    icon: CheckCircle,
    label: 'Completada',
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  cancelled: {
    icon: XCircle,
    label: 'Cancelada',
    color: 'bg-red-100 text-red-800 border-red-200'
  },
  no_show: {
    icon: AlertCircle,
    label: 'No se presentó',
    color: 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export default function CustomerAppointmentDetail() {
  const { appointmentId } = useParams<{ appointmentId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!appointmentId || !user) return
    
    loadAppointmentDetail()
  }, [appointmentId, user])

  const loadAppointmentDetail = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get customer ID first
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('email', user!.email)
        .single()

      if (customerError) {
        console.error('[APPOINTMENT-DETAIL] Customer lookup failed:', customerError)
        setError('No se pudo cargar la información del cliente')
        setIsLoading(false)
        return
      }

      // Load appointment with all related data
      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointments')
        .select(`
          *,
          services!appointments_service_id_fkey (
            id, name, description, price, duration, category
          ),
          business_profiles!appointments_business_id_fkey (
            id, business_name, slug, phone, email, address, logo_url
          ),
          pets!appointments_pet_id_fkey (
            id, name, breed, size, temperament
          )
        `)
        .eq('id', appointmentId)
        .eq('customer_id', customer.id)
        .single()

      if (appointmentError) {
        console.error('[APPOINTMENT-DETAIL] Appointment lookup failed:', appointmentError)
        setError('No se pudo cargar la información de la cita')
        setIsLoading(false)
        return
      }

      setAppointment(appointmentData)

    } catch (error) {
      console.error('[APPOINTMENT-DETAIL] Error loading appointment:', error)
      setError('Error inesperado al cargar la cita')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    return time.slice(0, 5) // Remove seconds
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/customer/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          
          <Card>
            <CardContent className="text-center py-12">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Error al cargar la cita</h3>
              <p className="text-muted-foreground mb-6">
                {error || 'No se pudo encontrar la información de la cita'}
              </p>
              <Button onClick={() => navigate('/customer/dashboard')}>
                Volver al Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[appointment.status]
  const StatusIcon = statusConfig.icon

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/customer/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Detalles de la Cita
              </h1>
              <p className="text-muted-foreground">
                Información completa de tu cita de grooming
              </p>
            </div>
            
            <Badge className={statusConfig.color}>
              <StatusIcon className="w-4 h-4 mr-2" />
              {statusConfig.label}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Detalles del Servicio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {appointment.services.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {appointment.services.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {appointment.services.duration} minutos
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-semibold">
                        ${appointment.total_amount}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Fecha y Hora</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="capitalize">
                        {formatDate(appointment.appointment_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pet Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dog className="w-5 h-5" />
                  Información de tu Mascota
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                    <p className="text-lg font-semibold">{appointment.pets.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Raza</label>
                      <p>{appointment.pets.breed}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Tamaño</label>
                      <p className="capitalize">{appointment.pets.size}</p>
                    </div>
                  </div>
                  {appointment.pets.temperament && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Temperamento</label>
                      <p className="capitalize">{appointment.pets.temperament}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notes and Instructions */}
            {(appointment.notes || appointment.special_instructions) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Notas e Instrucciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appointment.notes && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Notas</label>
                      <p className="mt-1">{appointment.notes}</p>
                    </div>
                  )}
                  {appointment.special_instructions && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Instrucciones Especiales</label>
                      <p className="mt-1">{appointment.special_instructions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Peluquería
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">
                    {appointment.business_profiles.business_name}
                  </h3>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {appointment.business_profiles.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {appointment.business_profiles.email}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                    <span className="text-sm">
                      {appointment.business_profiles.address}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Historial</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Cita creada</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(appointment.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                
                {appointment.updated_at && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Última actualización</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(appointment.updated_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                )}
                
                {appointment.completed_at && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Completada</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(appointment.completed_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}