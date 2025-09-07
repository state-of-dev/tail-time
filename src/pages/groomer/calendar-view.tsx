import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  User,
  Phone,
  Mail,
  MapPin,
  Filter,
  Search,
  ArrowLeft,
  Heart,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { Navigation } from '@/components/navigation'

interface Appointment {
  id: string
  appointment_date: string
  appointment_time: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  customer_name: string
  customer_phone: string
  customer_email: string
  pet_name: string
  pet_breed: string
  service_name: string
  duration: number
  total_amount: number
  notes: string
}

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  in_progress: 'bg-purple-100 text-purple-800 border-purple-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  no_show: 'bg-gray-100 text-gray-800 border-gray-200'
}

const STATUS_ICONS = {
  pending: AlertCircle,
  confirmed: CheckCircle,
  in_progress: Clock,
  completed: CheckCircle,
  cancelled: XCircle,
  no_show: XCircle
}

const STATUS_LABELS = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  in_progress: 'En Proceso',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No se presentó'
}

export default function CalendarView() {
  const { businessSlug } = useParams<{ businessSlug: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    if (!user || !businessSlug) {
      navigate('/auth/login')
      return
    }
    loadAppointments()
  }, [user, businessSlug, selectedDate, viewMode])

  const loadAppointments = async () => {
    if (!user) return

    try {
      // Get the business profile first
      const { data: business, error: businessError } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('slug', businessSlug)
        .eq('owner_id', user.id)
        .single()

      if (businessError || !business) {
        navigate('/setup/business')
        return
      }

      // Calculate date range based on view mode
      let startDate = new Date(selectedDate)
      let endDate = new Date(selectedDate)

      if (viewMode === 'day') {
        // Same day
      } else if (viewMode === 'week') {
        const dayOfWeek = startDate.getDay()
        startDate.setDate(startDate.getDate() - dayOfWeek)
        endDate.setDate(startDate.getDate() + 6)
      } else if (viewMode === 'month') {
        startDate.setDate(1)
        endDate.setMonth(endDate.getMonth() + 1, 0)
      }

      // Load appointments with related data for the date range
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          *,
          services!appointments_service_id_fkey (name, price, duration),
          pets!appointments_pet_id_fkey (name, breed),
          customers!appointments_customer_id_fkey (name, email, phone)
        `)
        .eq('business_id', business.id)
        .gte('appointment_date', startDate.toISOString().split('T')[0])
        .lte('appointment_date', endDate.toISOString().split('T')[0])
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true })

      if (appointmentsError) {
        console.error('Error loading appointments:', appointmentsError)
        return
      }
      
      // Transform to calendar format with proper data extraction
      const calendarAppointments = (appointments || []).map(apt => ({
        id: apt.id,
        appointment_date: apt.appointment_date,
        appointment_time: apt.start_time,
        status: apt.status as any,
        customer_name: apt.customers?.name || 'Cliente no especificado',
        customer_phone: apt.customers?.phone || 'Sin teléfono',
        customer_email: apt.customers?.email || 'Sin email',
        pet_name: apt.pets?.name || 'Mascota no especificada',
        pet_breed: apt.pets?.breed || 'Raza no especificada',
        service_name: apt.services?.name || 'Servicio no especificado',
        duration: apt.services?.duration || 60,
        total_amount: apt.total_amount || 0,
        notes: apt.customer_notes || ''
      }))

      setAppointments(calendarAppointments)
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    }
    setSelectedDate(newDate)
  }

  const filteredAppointments = appointments.filter(appointment => {
    if (filterStatus === 'all') return true
    return appointment.status === filterStatus
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-8 h-8 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando calendario...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Page Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/groomer/${businessSlug}/dashboard`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Calendario
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gestiona tus citas y horarios
                </p>
              </div>
            </div>
            
            <Button onClick={() => navigate(`/groomer/${businessSlug}/appointments/new`)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cita
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* Date Navigation */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-lg font-semibold text-foreground">
              {formatDate(selectedDate)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date())}
            >
              Hoy
            </Button>
          </div>

          {/* View Mode & Filters */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Vista:</span>
              <div className="flex border border-border rounded-md">
                {(['day', 'week', 'month'] as const).map((mode) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? "default" : "ghost"}
                    size="sm"
                    className="rounded-none first:rounded-l-md last:rounded-r-md"
                    onClick={() => setViewMode(mode)}
                  >
                    {mode === 'day' ? 'Día' : mode === 'week' ? 'Semana' : 'Mes'}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border border-border rounded-md px-3 py-1 bg-background"
              >
                <option value="all">Todas</option>
                <option value="pending">Pendientes</option>
                <option value="confirmed">Confirmadas</option>
                <option value="in_progress">En Proceso</option>
                <option value="completed">Completadas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Calendar Views */}
        {viewMode === 'day' && (
          <DayView 
            appointments={filteredAppointments.filter(apt => 
              apt.appointment_date === selectedDate.toISOString().split('T')[0]
            )}
            businessSlug={businessSlug}
            navigate={navigate}
          />
        )}
        
        {viewMode === 'week' && (
          <WeekView 
            appointments={filteredAppointments}
            selectedDate={selectedDate}
            businessSlug={businessSlug}
            navigate={navigate}
          />
        )}
        
        {viewMode === 'month' && (
          <MonthView 
            appointments={filteredAppointments}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            businessSlug={businessSlug}
            navigate={navigate}
          />
        )}
      </div>
    </div>
  )
}

// Day View Component
function DayView({ appointments, businessSlug, navigate }: {
  appointments: Appointment[]
  businessSlug: string
  navigate: (path: string) => void
}) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 8 PM

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="grid grid-cols-2 gap-0">
        {/* Time slots */}
        <div className="border-r border-gray-200">
          <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-4 font-medium text-center">
            Horarios
          </div>
          {hours.map(hour => (
            <div key={hour} className="border-b border-gray-100 p-4 text-sm text-gray-600">
              {hour}:00 - {hour + 1}:00
            </div>
          ))}
        </div>

        {/* Appointments */}
        <div>
          <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-4 font-medium text-center">
            Citas
          </div>
          {hours.map(hour => {
            const hourAppointments = appointments.filter(apt => {
              const aptHour = parseInt(apt.appointment_time.split(':')[0])
              return aptHour === hour
            })
            
            return (
              <div key={hour} className="border-b border-gray-100 p-2 min-h-[60px]">
                {hourAppointments.map(apt => {
                  const StatusIcon = STATUS_ICONS[apt.status]
                  return (
                    <div key={apt.id} className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{apt.service_name}</div>
                          <div className="text-gray-600">{apt.customer_name} • {apt.pet_name}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={STATUS_COLORS[apt.status]}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {STATUS_LABELS[apt.status]}
                          </Badge>
                          <Button size="sm" variant="outline" onClick={() => navigate(`/groomer/${businessSlug}/appointment/${apt.id}`)}>
                            Ver
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Week View Component  
function WeekView({ appointments, selectedDate, businessSlug, navigate }: {
  appointments: Appointment[]
  selectedDate: Date
  businessSlug: string
  navigate: (path: string) => void
}) {
  const startOfWeek = new Date(selectedDate)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    return date
  })

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="grid grid-cols-8 gap-0">
        {/* Time column header */}
        <div className="border-r border-gray-200 p-4 bg-gray-50 font-medium text-center">
          Hora
        </div>
        
        {/* Day headers */}
        {weekDays.map(date => (
          <div key={date.toISOString()} className="border-r border-gray-200 p-4 bg-gray-50 text-center">
            <div className="font-medium">
              {date.toLocaleDateString('es-ES', { weekday: 'short' })}
            </div>
            <div className="text-sm text-gray-600">
              {date.getDate()}
            </div>
          </div>
        ))}

        {/* Time rows */}
        {Array.from({ length: 12 }, (_, i) => i + 8).map(hour => (
          <>
            {/* Hour label */}
            <div key={`hour-${hour}`} className="border-r border-b border-gray-200 p-2 text-sm text-gray-600 bg-gray-50">
              {hour}:00
            </div>
            
            {/* Day cells */}
            {weekDays.map(date => {
              const dayAppointments = appointments.filter(apt => {
                const aptDate = apt.appointment_date
                const aptHour = parseInt(apt.appointment_time.split(':')[0])
                return aptDate === date.toISOString().split('T')[0] && aptHour === hour
              })
              
              return (
                <div key={`${date.toISOString()}-${hour}`} className="border-r border-b border-gray-100 p-1 min-h-[50px]">
                  {dayAppointments.map(apt => (
                    <div key={apt.id} className="text-xs p-1 mb-1 bg-blue-100 rounded cursor-pointer hover:bg-blue-200 transition-colors"
                         onClick={() => navigate(`/groomer/${businessSlug}/appointment/${apt.id}`)}>
                      <div className="font-medium truncate">{apt.service_name}</div>
                      <div className="text-gray-600 truncate">{apt.customer_name}</div>
                    </div>
                  ))}
                </div>
              )
            })}
          </>
        ))}
      </div>
    </div>
  )
}

// Month View Component
function MonthView({ appointments, selectedDate, onDateSelect, businessSlug, navigate }: {
  appointments: Appointment[]
  selectedDate: Date
  onDateSelect: (date: Date) => void
  businessSlug: string
  navigate: (path: string) => void
}) {
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  const lastDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  
  const days = []
  
  // Previous month days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(firstDayOfMonth)
    date.setDate(date.getDate() - i - 1)
    days.push({ date, isCurrentMonth: false })
  }
  
  // Current month days
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day)
    days.push({ date, isCurrentMonth: true })
  }
  
  // Next month days to fill the grid
  const remainingDays = 42 - days.length
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, day)
    days.push({ date, isCurrentMonth: false })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-0 border-b border-gray-200 bg-gray-50">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="p-4 text-center font-medium text-gray-700">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0">
        {days.map(({ date, isCurrentMonth }, index) => {
          const dateStr = date.toISOString().split('T')[0]
          const dayAppointments = appointments.filter(apt => apt.appointment_date === dateStr)
          const isToday = dateStr === new Date().toISOString().split('T')[0]
          
          return (
            <div
              key={index}
              className={`border-b border-r border-gray-100 p-2 min-h-[100px] cursor-pointer hover:bg-gray-50 ${
                !isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''
              } ${isToday ? 'bg-blue-50' : ''}`}
              onClick={() => onDateSelect(date)}
            >
              <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                {date.getDate()}
              </div>
              
              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map(apt => (
                  <div
                    key={apt.id}
                    className="text-xs p-1 bg-blue-100 rounded cursor-pointer hover:bg-blue-200 transition-colors truncate"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/groomer/${businessSlug}/appointment/${apt.id}`)
                    }}
                  >
                    {apt.appointment_time} {apt.customer_name}
                  </div>
                ))}
                {dayAppointments.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{dayAppointments.length - 3} más
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}