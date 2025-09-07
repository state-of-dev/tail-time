import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context-simple'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/navigation'
import { 
  ArrowLeft,
  Calendar,
  Clock,
  Dog,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Hourglass,
  Filter,
  Search
} from 'lucide-react'

interface Appointment {
  id: string
  appointment_date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  total_amount: number
  notes?: string
  created_at: string
  
  // Related data
  service_name: string
  business_name: string
  business_slug?: string
  pet_name: string
  pet_breed: string
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

export default function AllAppointments() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    if (!user) return
    loadAllAppointments()
  }, [user])

  const loadAllAppointments = async () => {
    try {
      setIsLoading(true)

      // Get customer ID first
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('email', user!.email)
        .single()

      if (customerError) {
        console.error('[ALL-APPOINTMENTS] Customer lookup failed:', customerError)
        setIsLoading(false)
        return
      }

      // Load all appointments with complete related data
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          *,
          services!appointments_service_id_fkey (name, price),
          pets!appointments_pet_id_fkey (name, breed),
          business_profiles!appointments_business_id_fkey (business_name, slug)
        `)
        .eq('customer_id', customer.id)
        .order('appointment_date', { ascending: false })

      if (appointmentsError) {
        console.error('[ALL-APPOINTMENTS] Appointments lookup failed:', appointmentsError)
        setIsLoading(false)
        return
      }

      // Process appointments
      const processedAppointments = appointmentsData.map(apt => ({
        ...apt,
        service_name: apt.services?.name || 'Servicio no especificado',
        business_name: apt.business_profiles?.business_name || 'Negocio no especificado',
        business_slug: apt.business_profiles?.slug,
        pet_name: apt.pets?.name || 'Mascota no especificada',
        pet_breed: apt.pets?.breed || 'Raza no especificada',
      }))

      setAppointments(processedAppointments)

    } catch (error) {
      console.error('[ALL-APPOINTMENTS] Error:', error)
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

  const filteredAppointments = appointments.filter(apt => {
    if (statusFilter === 'all') return true
    return apt.status === statusFilter
  })

  const statusCounts = appointments.reduce((acc, apt) => {
    acc[apt.status] = (acc[apt.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                Todas mis Citas
              </h1>
              <p className="text-muted-foreground">
                Historial completo de tus citas de grooming
              </p>
            </div>
            
            <Button onClick={() => navigate('/marketplace')}>
              <Calendar className="w-4 h-4 mr-2" />
              Agendar Nueva Cita
            </Button>
          </div>
        </div>

        {/* Stats and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card 
            className={`cursor-pointer transition-all ${statusFilter === 'all' ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
            onClick={() => setStatusFilter('all')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{appointments.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all ${statusFilter === 'confirmed' ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
            onClick={() => setStatusFilter('confirmed')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.confirmed || 0}</div>
              <div className="text-sm text-muted-foreground">Confirmadas</div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all ${statusFilter === 'completed' ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
            onClick={() => setStatusFilter('completed')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.completed || 0}</div>
              <div className="text-sm text-muted-foreground">Completadas</div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all ${statusFilter === 'pending' ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
            onClick={() => setStatusFilter('pending')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending || 0}</div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all ${statusFilter === 'cancelled' ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
            onClick={() => setStatusFilter('cancelled')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{statusCounts.cancelled || 0}</div>
              <div className="text-sm text-muted-foreground">Canceladas</div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Dog className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">
                  {statusFilter === 'all' ? 'No tienes citas registradas' : `No tienes citas ${STATUS_CONFIG[statusFilter as keyof typeof STATUS_CONFIG]?.label.toLowerCase()}`}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {statusFilter === 'all' 
                    ? 'Agenda tu primera cita para darle a tu mascota el cuidado que se merece'
                    : 'Filtra por otra categoría o agenda una nueva cita'
                  }
                </p>
                <Button onClick={() => navigate('/marketplace')}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Nueva Cita
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => {
              const statusConfig = STATUS_CONFIG[appointment.status]
              const StatusIcon = statusConfig.icon
              
              return (
                <Card key={appointment.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {appointment.service_name}
                          </h3>
                          <Badge className={statusConfig.color}>
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                          <div className="space-y-2">
                            <p className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span className="capitalize">{formatDate(appointment.appointment_date)}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-primary" />
                              <span>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</span>
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span>{appointment.business_name}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Dog className="w-4 h-4 text-primary" />
                              <span>{appointment.pet_name} ({appointment.pet_breed})</span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-primary">
                            ${appointment.total_amount}
                          </div>
                          
                          <Button 
                            variant="outline"
                            onClick={() => navigate(`/customer/appointment/${appointment.id}`)}
                          >
                            Ver detalles
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}