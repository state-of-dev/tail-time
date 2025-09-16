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
  Search,
  Sparkles,
  Crown,
  Star
} from 'lucide-react'
import {
  Star1, Star6, Star7, Star8, Star9, Star10, Star13, Star19, Star20, Star21, Star22, Star23, Star24, Star25, Star26, Star27, Star28,
  StarSizes
} from '@/components/ui/neobrutalism-stars'

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
    label: 'PENDIENTE',
    color: 'bg-chart-3 text-main-foreground brutal-border brutal-shadow font-black uppercase'
  },
  confirmed: {
    icon: CheckCircle,
    label: 'CONFIRMADA',
    color: 'bg-chart-1 text-main-foreground brutal-border brutal-shadow font-black uppercase'
  },
  in_progress: {
    icon: Clock,
    label: 'EN PROGRESO',
    color: 'bg-chart-8 text-main-foreground brutal-border brutal-shadow font-black uppercase'
  },
  completed: {
    icon: CheckCircle,
    label: 'COMPLETADA',
    color: 'bg-chart-6 text-main-foreground brutal-border brutal-shadow font-black uppercase'
  },
  cancelled: {
    icon: XCircle,
    label: 'CANCELADA',
    color: 'bg-chart-7 text-main-foreground brutal-border brutal-shadow font-black uppercase'
  },
  no_show: {
    icon: AlertCircle,
    label: 'NO SE PRESENTÓ',
    color: 'bg-chart-4 text-main-foreground brutal-border brutal-shadow font-black uppercase'
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
      <div className="min-h-screen bg-chart-4">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12 relative">
            <Star19 size={StarSizes.sm} className="absolute top-4 left-1/3 star-decoration" />
            <Star20 size={StarSizes.sm} className="absolute top-8 right-1/3 star-decoration" />
            <div className="p-8 bg-chart-8 brutal-border-thick brutal-shadow-xl rounded-base inline-block mb-6 relative">
              <Clock className="w-8 h-8 animate-spin text-main-foreground icon-float" />
              <Star21 size={StarSizes.xs} className="absolute -top-1 -right-1 star-decoration" />
            </div>
            <p className="text-main-foreground font-black uppercase text-lg">CARGANDO CITAS...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-chart-4">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - Neobrutalism Style */}
        <div className="mb-8 relative">
          <Star22 size={StarSizes.sm} className="absolute top-0 right-8 star-decoration" />
          <Star23 size={StarSizes.sm} className="absolute top-12 left-12 star-decoration" />

          <Button
            onClick={() => navigate('/customer/dashboard')}
            className="mb-6 bg-chart-6 text-main-foreground brutal-border brutal-shadow hover:brutal-hover font-black uppercase"
          >
            <ArrowLeft className="w-4 h-4 mr-2 icon-float" />
            VOLVER AL DASHBOARD
          </Button>

          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-chart-8 brutal-border-thick brutal-shadow rounded-base">
                <Calendar className="w-8 h-8 text-main-foreground icon-float" />
                <Star24 size={StarSizes.xs} className="absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-main-foreground mb-2 uppercase flex items-center gap-3">
                  TODAS MIS CITAS
                  <Crown className="w-8 h-8 icon-float" />
                </h1>
                <p className="text-main-foreground/80 font-bold uppercase text-lg">
                  HISTORIAL COMPLETO DE TUS CITAS DE GROOMING
                  <Sparkles className="inline-block w-5 h-5 ml-2 icon-float" />
                </p>
              </div>
            </div>

            <Button
              onClick={() => navigate('/marketplace')}
              className="bg-chart-1 text-main-foreground brutal-border-thick brutal-shadow-lg hover:brutal-hover font-black uppercase text-lg px-6 py-3 transform hover:scale-105 transition-all duration-200"
            >
              <Calendar className="w-5 h-5 mr-2 icon-float" />
              AGENDAR NUEVA CITA
              <Star25 className="inline-block w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Stats and Filters - Neobrutalism Style */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card
            className={`cursor-pointer transition-all duration-200 bg-chart-2 brutal-border-thick ${
              statusFilter === 'all'
                ? 'brutal-shadow-xl bg-chart-8 transform scale-105'
                : 'brutal-shadow hover:brutal-hover hover:transform hover:scale-105'
            }`}
            onClick={() => setStatusFilter('all')}
          >
            <CardContent className="p-6 text-center relative overflow-hidden">
              <Star26 size={StarSizes.xs} className="absolute top-1 right-1 star-decoration" />
              <div className="text-3xl font-black text-main-foreground mb-2">{appointments.length}</div>
              <div className="text-sm text-main-foreground/80 font-bold uppercase flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 icon-float" />
                TOTAL
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-200 bg-chart-2 brutal-border-thick ${
              statusFilter === 'confirmed'
                ? 'brutal-shadow-xl bg-chart-1 transform scale-105'
                : 'brutal-shadow hover:brutal-hover hover:transform hover:scale-105'
            }`}
            onClick={() => setStatusFilter('confirmed')}
          >
            <CardContent className="p-6 text-center relative overflow-hidden">
              <Star27 size={StarSizes.xs} className="absolute top-1 right-1 star-decoration" />
              <div className="text-3xl font-black text-main-foreground mb-2">{statusCounts.confirmed || 0}</div>
              <div className="text-sm text-main-foreground/80 font-bold uppercase flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 icon-float" />
                CONFIRMADAS
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-200 bg-chart-2 brutal-border-thick ${
              statusFilter === 'completed'
                ? 'brutal-shadow-xl bg-chart-6 transform scale-105'
                : 'brutal-shadow hover:brutal-hover hover:transform hover:scale-105'
            }`}
            onClick={() => setStatusFilter('completed')}
          >
            <CardContent className="p-6 text-center relative overflow-hidden">
              <Star28 size={StarSizes.xs} className="absolute top-1 right-1 star-decoration" />
              <div className="text-3xl font-black text-main-foreground mb-2">{statusCounts.completed || 0}</div>
              <div className="text-sm text-main-foreground/80 font-bold uppercase flex items-center justify-center gap-2">
                <Crown className="w-4 h-4 icon-float" />
                COMPLETADAS
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-200 bg-chart-2 brutal-border-thick ${
              statusFilter === 'pending'
                ? 'brutal-shadow-xl bg-chart-3 transform scale-105'
                : 'brutal-shadow hover:brutal-hover hover:transform hover:scale-105'
            }`}
            onClick={() => setStatusFilter('pending')}
          >
            <CardContent className="p-6 text-center relative overflow-hidden">
              <Star19 size={StarSizes.xs} className="absolute top-1 right-1 star-decoration" />
              <div className="text-3xl font-black text-main-foreground mb-2">{statusCounts.pending || 0}</div>
              <div className="text-sm text-main-foreground/80 font-bold uppercase flex items-center justify-center gap-2">
                <Hourglass className="w-4 h-4 icon-float" />
                PENDIENTES
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-200 bg-chart-2 brutal-border-thick ${
              statusFilter === 'cancelled'
                ? 'brutal-shadow-xl bg-chart-7 transform scale-105'
                : 'brutal-shadow hover:brutal-hover hover:transform hover:scale-105'
            }`}
            onClick={() => setStatusFilter('cancelled')}
          >
            <CardContent className="p-6 text-center relative overflow-hidden">
              <Star20 size={StarSizes.xs} className="absolute top-1 right-1 star-decoration" />
              <div className="text-3xl font-black text-main-foreground mb-2">{statusCounts.cancelled || 0}</div>
              <div className="text-sm text-main-foreground/80 font-bold uppercase flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4 icon-float" />
                CANCELADAS
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List - Neobrutalism Style */}
        <div className="space-y-6">
          {filteredAppointments.length === 0 ? (
            <Card className="bg-chart-2 brutal-border-thick brutal-shadow-xl">
              <CardContent className="text-center py-16 relative overflow-hidden">
                <Star1 size={StarSizes.sm} className="absolute top-4 left-8 star-decoration" />
                <Star6 size={StarSizes.sm} className="absolute top-8 right-8 star-decoration" />
                <Star7 size={StarSizes.sm} className="absolute bottom-6 left-12 star-decoration" />

                <div className="p-8 bg-chart-8 brutal-border-thick brutal-shadow-lg rounded-base inline-block mb-8 relative">
                  <Dog className="w-16 h-16 text-main-foreground icon-float" />
                  <Star8 size={StarSizes.xs} className="absolute -top-2 -right-2 star-decoration" />
                  <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-main-foreground icon-float" />
                </div>

                <h3 className="text-2xl font-black text-main-foreground mb-4 uppercase flex items-center justify-center gap-3">
                  <Crown className="w-6 h-6 icon-float" />
                  {statusFilter === 'all'
                    ? 'NO TIENES CITAS REGISTRADAS'
                    : `NO TIENES CITAS ${STATUS_CONFIG[statusFilter as keyof typeof STATUS_CONFIG]?.label}`}
                  <Star9 size={StarSizes.sm} className="star-decoration" />
                </h3>

                <p className="text-main-foreground/80 font-bold uppercase text-lg mb-8">
                  {statusFilter === 'all'
                    ? 'AGENDA TU PRIMERA CITA PARA DARLE A TU MASCOTA EL CUIDADO QUE SE MERECE'
                    : 'FILTRA POR OTRA CATEGORÍA O AGENDA UNA NUEVA CITA'
                  }
                </p>

                <Button
                  onClick={() => navigate('/marketplace')}
                  className="bg-chart-1 text-main-foreground brutal-border-thick brutal-shadow-lg hover:brutal-hover font-black uppercase text-lg px-8 py-4 transform hover:scale-105 transition-all duration-200"
                >
                  <Calendar className="w-5 h-5 mr-3 icon-float" />
                  AGENDAR NUEVA CITA
                  <Star10 size={StarSizes.sm} className="inline-block ml-3" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map((appointment, index) => {
              const statusConfig = STATUS_CONFIG[appointment.status]
              const StatusIcon = statusConfig.icon

              return (
                <Card
                  key={appointment.id}
                  className="bg-chart-2 brutal-border-thick brutal-shadow hover:brutal-hover transition-all duration-200 hover:transform hover:scale-[1.02] relative overflow-hidden"
                >
                  <CardContent className="p-8 relative">
                    <Star13 size={StarSizes.xs} className="absolute top-2 right-2 star-decoration" />
                    <Star21 size={StarSizes.xs} className="absolute bottom-2 left-2 star-decoration" />

                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-chart-8 brutal-border rounded-base">
                            <StatusIcon className="w-6 h-6 text-main-foreground icon-float" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-black text-main-foreground uppercase mb-2 flex items-center gap-2">
                              {appointment.service_name.toUpperCase()}
                              <Sparkles className="w-5 h-5 icon-float" />
                            </h3>
                            <Badge className={statusConfig.color}>
                              <StatusIcon className="w-4 h-4 mr-2 icon-float" />
                              {statusConfig.label}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-chart-3 brutal-border rounded-base">
                              <Calendar className="w-5 h-5 text-main-foreground icon-float" />
                              <span className="font-bold text-main-foreground uppercase">
                                {formatDate(appointment.appointment_date).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-chart-4 brutal-border rounded-base">
                              <Clock className="w-5 h-5 text-main-foreground icon-float" />
                              <span className="font-bold text-main-foreground uppercase">
                                {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-chart-6 brutal-border rounded-base">
                              <MapPin className="w-5 h-5 text-main-foreground icon-float" />
                              <span className="font-bold text-main-foreground uppercase">
                                {appointment.business_name.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-chart-7 brutal-border rounded-base">
                              <Dog className="w-5 h-5 text-main-foreground icon-float" />
                              <span className="font-bold text-main-foreground uppercase">
                                {appointment.pet_name.toUpperCase()} ({appointment.pet_breed.toUpperCase()})
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="p-4 bg-chart-1 brutal-border-thick brutal-shadow rounded-base">
                            <div className="text-3xl font-black text-main-foreground flex items-center gap-2">
                              <DollarSign className="w-8 h-8 icon-float" />
                              {appointment.total_amount}
                              <Crown className="w-6 h-6 icon-float" />
                            </div>
                          </div>

                          <Button
                            onClick={() => navigate(`/customer/appointment/${appointment.id}`)}
                            className="bg-chart-8 text-main-foreground brutal-border-thick brutal-shadow hover:brutal-hover font-black uppercase px-6 py-3 transform hover:scale-105 transition-all duration-200"
                          >
                            <Search className="w-5 h-5 mr-2 icon-float" />
                            VER DETALLES
                            <Star22 size={StarSizes.xs} className="inline-block ml-2" />
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