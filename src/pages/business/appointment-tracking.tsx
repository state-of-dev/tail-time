import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Clock, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Heart,
  CheckCircle2,
  Timer,
  MessageCircle,
  Star,
  CreditCard,
  Download,
  Share2
} from 'lucide-react'

interface AppointmentStatus {
  id: string
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  timestamp: string
  message: string
  estimated_completion?: string
}

interface Appointment {
  id: string
  pet_name: string
  pet_photo?: string
  service: string
  groomer_name: string
  groomer_photo?: string
  date: string
  time: string
  duration: number
  price: number
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  business_name: string
  business_address: string
  business_phone: string
  progress_percentage: number
  estimated_completion?: string
  special_instructions?: string
  status_history: AppointmentStatus[]
  can_rate?: boolean
  rating?: number
  review?: string
}

const mockAppointment: Appointment = {
  id: 'apt_001',
  pet_name: 'Luna',
  pet_photo: undefined,
  service: 'Baño Completo + Corte de Uñas',
  groomer_name: 'María González',
  groomer_photo: undefined,
  date: '2024-01-15',
  time: '10:00',
  duration: 90,
  price: 450,
  status: 'in_progress',
  business_name: 'Pet Spa Luna',
  business_address: 'Av. Reforma 123, Col. Centro',
  business_phone: '+52 55 1234 5678',
  progress_percentage: 65,
  estimated_completion: '11:15',
  special_instructions: 'Luna es muy nerviosa, usar técnica de relajación',
  status_history: [
    {
      id: 'status_1',
      status: 'confirmed',
      timestamp: '2024-01-14T15:30:00Z',
      message: 'Cita confirmada. Te esperamos mañana a las 10:00 AM'
    },
    {
      id: 'status_2',
      status: 'in_progress',
      timestamp: '2024-01-15T16:00:00Z',
      message: 'Luna ha llegado y comenzamos con el servicio',
      estimated_completion: '11:15'
    }
  ],
  can_rate: false
}

export default function AppointmentTracking() {
  const { businessSlug, appointmentId } = useParams<{ businessSlug: string; appointmentId: string }>()
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAppointment = async () => {
      // Simular carga de datos
      setTimeout(() => {
        setAppointment(mockAppointment)
        setIsLoading(false)
      }, 1000)
    }

    loadAppointment()
  }, [appointmentId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-500'
      case 'in_progress': return 'bg-yellow-500'
      case 'completed': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada'
      case 'in_progress': return 'En Proceso'
      case 'completed': return 'Completada'
      case 'cancelled': return 'Cancelada'
      default: return 'Desconocido'
    }
  }

  const handleCall = () => {
    if (appointment?.business_phone) {
      window.open(`tel:${appointment.business_phone}`)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi Cita - Pet Grooming',
          text: `Seguimiento de mi cita para ${appointment?.pet_name}`,
          url: window.location.href
        })
      } catch (error) {
        // Sharing not supported or failed
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-8 h-8 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando información de tu cita...</p>
        </div>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold mb-2">Cita no encontrada</h2>
              <p className="text-muted-foreground mb-4">
                No pudimos encontrar la información de esta cita
              </p>
              <Button variant="outline" onClick={() => window.history.back()}>
                Volver
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Mi Cita</h1>
              <p className="text-muted-foreground">Seguimiento en tiempo real</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          <Badge variant="outline" className="mb-2">
            #{appointment.id}
          </Badge>
        </div>

        {/* Estado Actual */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(appointment.status)}`} />
                  {getStatusText(appointment.status)}
                </CardTitle>
                <CardDescription>
                  {appointment.status === 'in_progress' && appointment.estimated_completion && (
                    <>Tiempo estimado de finalización: {appointment.estimated_completion}</>
                  )}
                </CardDescription>
              </div>
              {appointment.status === 'in_progress' && (
                <Timer className="w-5 h-5 text-primary" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {appointment.status === 'in_progress' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso del servicio</span>
                  <span>{appointment.progress_percentage}%</span>
                </div>
                <Progress value={appointment.progress_percentage} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información de la Cita */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Información de la Cita
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={appointment.pet_photo} />
                <AvatarFallback>
                  <Heart className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{appointment.pet_name}</h3>
                <p className="text-sm text-muted-foreground">{appointment.service}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{new Date(appointment.date).toLocaleDateString('es-MX', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{appointment.time} ({appointment.duration} min)</span>
              </div>
            </div>

            {appointment.special_instructions && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Instrucciones especiales:</span>
                  <br />
                  {appointment.special_instructions}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información del Groomer */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Tu Groomer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={appointment.groomer_photo} />
                  <AvatarFallback>
                    {appointment.groomer_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{appointment.groomer_name}</h3>
                  <p className="text-sm text-muted-foreground">Especialista en mascotas</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Mensaje
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Información del Negocio */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {appointment.business_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
              <p className="text-sm">{appointment.business_address}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{appointment.business_phone}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleCall}>
                Llamar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Historial de Estados */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Historial de la Cita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointment.status_history.map((status, index) => (
                <div key={status.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(status.status)}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{getStatusText(status.status)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(status.timestamp).toLocaleString('es-MX')}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{status.message}</p>
                    {status.estimated_completion && (
                      <p className="text-xs text-primary mt-1">
                        Tiempo estimado: {status.estimated_completion}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Información de Pago */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Información de Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total: ${appointment.price}</span>
              <Badge variant="outline" className="text-green-600">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Pagado
              </Badge>
            </div>
            <Button variant="outline" size="sm" className="mt-3">
              <Download className="w-4 h-4 mr-2" />
              Descargar Recibo
            </Button>
          </CardContent>
        </Card>

        {/* Rating y Review (solo si está completado) */}
        {appointment.status === 'completed' && appointment.can_rate && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Califica tu experiencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className="w-8 h-8 text-gray-300 hover:text-yellow-400" />
                    </button>
                  ))}
                </div>
                <Button className="w-full">
                  Enviar Calificación
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mostrar rating existente */}
        {appointment.rating && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Tu Calificación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-5 h-5 ${star <= appointment.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-2 font-semibold">{appointment.rating}/5</span>
              </div>
              {appointment.review && (
                <p className="text-sm text-muted-foreground mt-2">"{appointment.review}"</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}