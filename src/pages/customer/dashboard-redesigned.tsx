import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'
import { supabase } from '@/lib/supabase'
import { useAuthGuard, useSessionMonitor } from '@/hooks/useAuthGuard'
import { AuthWrapper } from '@/components/auth-wrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Navigation } from '@/components/navigation'
import { cn } from '@/lib/utils'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Heart, 
  DollarSign, 
  User,
  Star,
  Dog,
  AlertCircle,
  CheckCircle,
  Plus,
  Edit,
  Bell,
  Settings,
  PawPrint,
  Camera,
  Filter,
  List,
  CalendarDays
} from 'lucide-react'

interface Pet {
  id: string
  name: string
  breed: string
  size: string
  age?: number
  temperament?: string
  photo_url?: string
  customer_id: string
  created_at: string
}

interface Appointment {
  id: string
  appointment_date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected' | 'reschedule_pending'
  service_name: string
  business_name: string
  pet_name: string
  pet_breed: string
  total_amount: number
  notes?: string
}

interface CustomerProfile {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  created_at: string
}

export default function CustomerDashboardRedesigned() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPet, setSelectedPet] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<string>('list')
  
  useAuthGuard(true) // Require authentication
  useSessionMonitor()

  useEffect(() => {
    if (!user) return
    loadDashboardData()
  }, [user])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      // Get customer profile
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('email', user!.email)
        .single()

      if (customerError) {
        console.error('[DASHBOARD] Customer lookup failed:', customerError)
        setIsLoading(false)
        return
      }

      setCustomerProfile(customer)

      // Load appointments with complete data
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          *,
          services!appointments_service_id_fkey (name, price),
          pets!appointments_pet_id_fkey (name, breed),
          business_profiles!appointments_business_id_fkey (business_name, slug)
        `)
        .eq('customer_id', customer.id)
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true })

      if (!appointmentsError && appointmentsData) {
        const processedAppointments = appointmentsData.map(apt => ({
          ...apt,
          service_name: apt.services?.name || 'Servicio no especificado',
          business_name: apt.business_profiles?.business_name || 'Negocio no especificado',
          pet_name: apt.pets?.name || 'Mascota no especificada',
          pet_breed: apt.pets?.breed || 'Raza no especificada',
        }))
        setAppointments(processedAppointments)
      }

      // Load pets
      const { data: petsData, error: petsError } = await supabase
        .from('pets')
        .select('*')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false })

      if (!petsError && petsData) {
        setPets(petsData)
      }

    } catch (error) {
      console.error('[DASHBOARD] Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getUpcomingAppointments = () => {
    const now = new Date()
    return appointments
      .filter(apt => {
        const appointmentDate = new Date(`${apt.appointment_date}T${apt.start_time}`)
        return appointmentDate > now && ['confirmed', 'pending'].includes(apt.status)
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.appointment_date}T${a.start_time}`)
        const dateB = new Date(`${b.appointment_date}T${b.start_time}`)
        return dateA.getTime() - dateB.getTime() // Más próxima primero
      })
      .slice(0, 3)
  }

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0]
    return appointments
      .filter(apt => 
        apt.appointment_date === today && ['confirmed', 'pending'].includes(apt.status)
      )
      .sort((a, b) => {
        const timeA = a.start_time
        const timeB = b.start_time
        return timeA.localeCompare(timeB) // Ordenar por hora (más temprano primero)
      })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    })
  }

  const formatTime = (time: string) => {
    return time.slice(0, 5)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getFilteredAppointments = () => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    
    let filtered = [...appointments]
    
    // Filtrar solo citas de hoy o futuras (no pasadas)
    filtered = filtered.filter(apt => {
      const appointmentDate = apt.appointment_date
      return appointmentDate >= today // Solo hoy o futuras
    })
    
    if (selectedPet !== 'all') {
      filtered = filtered.filter(apt => apt.pet_name === selectedPet)
    }
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === selectedStatus)
    }
    
    // Ordenar por fecha/hora - más próxima primero
    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.appointment_date}T${a.start_time}`)
      const dateB = new Date(`${b.appointment_date}T${b.start_time}`)
      return dateA.getTime() - dateB.getTime()
    })
  }

  // Funciones del calendario
  const getCurrentMonth = () => {
    const now = new Date()
    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      firstDay: new Date(now.getFullYear(), now.getMonth(), 1),
      lastDay: new Date(now.getFullYear(), now.getMonth() + 1, 0)
    }
  }

  const getDaysInMonth = () => {
    const { firstDay, lastDay } = getCurrentMonth()
    const days = []
    const firstDayOfWeek = firstDay.getDay()
    
    // Días del mes anterior para completar la primera semana
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(firstDay)
      date.setDate(date.getDate() - i - 1)
      days.push({
        date,
        isCurrentMonth: false,
        appointments: []
      })
    }
    
    // Días del mes actual
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(firstDay.getFullYear(), firstDay.getMonth(), day)
      const dayAppointments = getFilteredAppointments().filter(apt => 
        apt.appointment_date === date.toISOString().split('T')[0]
      )
      
      days.push({
        date,
        isCurrentMonth: true,
        appointments: dayAppointments
      })
    }
    
    // Días del próximo mes para completar la última semana
    const remainingDays = 42 - days.length // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(lastDay.getFullYear(), lastDay.getMonth() + 1, day)
      days.push({
        date,
        isCurrentMonth: false,
        appointments: []
      })
    }
    
    return days
  }

  const getAppointmentBadge = (appointments: Appointment[]) => {
    if (appointments.length === 0) return null
    
    const confirmed = appointments.filter(apt => apt.status === 'confirmed').length
    const pending = appointments.filter(apt => apt.status === 'pending').length
    const completed = appointments.filter(apt => apt.status === 'completed').length
    
    if (confirmed > 0) return { count: confirmed, color: 'bg-green-500', text: 'white' }
    if (pending > 0) return { count: pending, color: 'bg-yellow-500', text: 'white' }
    if (completed > 0) return { count: completed, color: 'bg-blue-500', text: 'white' }
    
    return { count: appointments.length, color: 'bg-gray-500', text: 'white' }
  }

  const renderAppointmentCard = (apt: Appointment) => (
    <div key={apt.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Jerarquía visual mejorada */}
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          {/* Fecha y Hora - Prioridad 1 */}
          <div className="flex items-center gap-3">
            <div className="text-lg font-bold text-gray-900">
              {formatDate(apt.appointment_date)}
            </div>
            <div className="text-lg font-semibold text-primary">
              {formatTime(apt.start_time)}
            </div>
            <Badge className={getStatusColor(apt.status)}>
              {apt.status === 'confirmed' && 'Confirmada'}
              {apt.status === 'pending' && 'Pendiente'}
              {apt.status === 'completed' && 'Completada'}
              {apt.status === 'cancelled' && 'Cancelada'}
            </Badge>
          </div>
          
          {/* Servicio - Prioridad 2 */}
          <div className="text-base font-medium text-gray-800">
            {apt.service_name}
          </div>
          
          {/* Mascota y Lugar - Prioridad 3 */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Dog className="w-4 h-4" />
              {apt.pet_name} ({apt.pet_breed})
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {apt.business_name}
            </span>
          </div>
        </div>
        
        {/* Precio y Acción */}
        <div className="flex flex-col items-end justify-start gap-3 ml-4">
          <div className="text-2xl font-bold text-primary">
            ${apt.total_amount}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/customer/appointment/${apt.id}`)}
            className="min-w-[100px]"
          >
            Ver detalles
          </Button>
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <PawPrint className="w-8 h-8 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  const upcomingAppointments = getUpcomingAppointments()
  const todayAppointments = getTodayAppointments()

  return (
    <AuthWrapper requireAuth={true}>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Welcome Header */}
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 py-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  ¡Bienvenido {customerProfile?.name || 'Cliente'}!
                </h1>
                <p className="text-muted-foreground">
                  Gestiona tus mascotas y citas de grooming
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <PawPrint className="h-8 w-8 text-primary" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Mis Mascotas</p>
                    <p className="text-2xl font-semibold text-gray-900">{pets.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Próximas Citas</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {getFilteredAppointments().filter(apt => apt.appointment_date > new Date().toISOString().split('T')[0]).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Citas Completadas</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {appointments.filter(apt => apt.status === 'completed').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Hoy</p>
                    <p className="text-2xl font-semibold text-gray-900">{todayAppointments.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Resumen rápido */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Resumen Rápido
                  </CardTitle>
                  <CardDescription>
                    Próximas citas, alertas y notificaciones importantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {todayAppointments.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-900">Citas de Hoy</span>
                      </div>
                      <div className="space-y-2">
                        {todayAppointments.map((apt) => (
                          <div key={apt.id} className="flex items-center justify-between">
                            <span className="text-sm text-blue-800">
                              {apt.service_name} - {apt.pet_name}
                            </span>
                            <span className="text-sm font-medium text-blue-900">
                              {formatTime(apt.start_time)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="font-medium">Próximas Citas</h4>
                      {upcomingAppointments.map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Dog className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{apt.service_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {apt.pet_name} • {apt.business_name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {formatDate(apt.appointment_date)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatTime(apt.start_time)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">No tienes citas próximas</p>
                      <Button onClick={() => navigate('/marketplace')} className="mt-4">
                        Agendar Nueva Cita
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Agenda / Mis Citas */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Agenda / Mis Citas
                      </CardTitle>
                      <CardDescription>
                        Calendario o lista de citas agendadas
                      </CardDescription>
                    </div>
                    {getFilteredAppointments().length > 5 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/customer/appointments')}
                        className="text-xs"
                      >
                        Ver todas ({appointments.length})
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    {/* Tabs Header con filtros */}
                    <div className="flex items-center justify-between mb-4">
                      <TabsList className="grid w-64 grid-cols-2">
                        <TabsTrigger value="list" className="flex items-center gap-2">
                          <List className="w-4 h-4" />
                          Vista Detalle
                        </TabsTrigger>
                        <TabsTrigger value="calendar" className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4" />
                          Vista Calendario
                        </TabsTrigger>
                      </TabsList>
                      
                      {/* Filtros */}
                      <div className="flex items-center gap-3">
                        <Select value={selectedPet} onValueChange={setSelectedPet}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filtrar por mascota" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas las mascotas</SelectItem>
                            {pets.map((pet) => (
                              <SelectItem key={pet.id} value={pet.name}>
                                {pet.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos los estados</SelectItem>
                            <SelectItem value="confirmed">Confirmada</SelectItem>
                            <SelectItem value="pending">Pendiente</SelectItem>
                            <SelectItem value="completed">Completada</SelectItem>
                            <SelectItem value="cancelled">Cancelada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Vista Lista Detallada */}
                    <TabsContent value="list" className="space-y-4">
                      {appointments.length > 0 ? (
                        <div className="space-y-3">
                          {getFilteredAppointments().slice(0, 5).map(renderAppointmentCard)}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                          <h3 className="text-xl font-semibold mb-2">No tienes citas registradas</h3>
                          <p className="text-muted-foreground mb-6">
                            Agenda tu primera cita para darle a tu mascota el cuidado que merece
                          </p>
                          <Button onClick={() => navigate('/marketplace')}>
                            <Plus className="w-4 h-4 mr-2" />
                            Agendar Nueva Cita
                          </Button>
                        </div>
                      )}
                    </TabsContent>

                    {/* Vista Calendario */}
                    <TabsContent value="calendar" className="space-y-4">
                      {/* Header del calendario */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          {getCurrentMonth().firstDay.toLocaleDateString('es-ES', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>Confirmada</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span>Pendiente</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span>Completada</span>
                          </div>
                        </div>
                      </div>

                      {/* Días de la semana */}
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      {/* Grid del calendario */}
                      <div className="grid grid-cols-7 gap-2">
                        {getDaysInMonth().map((day, index) => {
                          const badge = getAppointmentBadge(day.appointments)
                          const isToday = day.date.toDateString() === new Date().toDateString()
                          
                          return (
                            <div
                              key={index}
                              className={cn(
                                "relative min-h-[60px] p-2 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors",
                                day.isCurrentMonth 
                                  ? "bg-white border-gray-200" 
                                  : "bg-gray-50 border-gray-100 text-muted-foreground",
                                isToday && "ring-2 ring-primary ring-opacity-50"
                              )}
                              onClick={() => {
                                if (day.appointments.length > 0) {
                                  // TODO: Mostrar modal o expandir citas del día
                                }
                              }}
                            >
                              {/* Número del día */}
                              <div className={cn(
                                "text-sm font-medium",
                                isToday && "font-bold text-primary"
                              )}>
                                {day.date.getDate()}
                              </div>
                              
                              {/* Badge de citas */}
                              {badge && (
                                <div className="mt-1">
                                  <span className={cn(
                                    "inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full",
                                    badge.color,
                                    `text-${badge.text}`
                                  )}>
                                    {badge.count}
                                  </span>
                                </div>
                              )}
                              
                              {/* Preview de citas (solo para días con pocas citas) */}
                              {day.appointments.length > 0 && day.appointments.length <= 2 && (
                                <div className="mt-1 space-y-1">
                                  {day.appointments.slice(0, 2).map((apt) => (
                                    <div
                                      key={apt.id}
                                      className="text-xs truncate p-1 rounded text-white"
                                      style={{ 
                                        backgroundColor: apt.status === 'confirmed' ? '#10b981' : 
                                                        apt.status === 'pending' ? '#f59e0b' :
                                                        apt.status === 'completed' ? '#3b82f6' : '#6b7280'
                                      }}
                                    >
                                      {formatTime(apt.start_time)} {apt.service_name}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                      
                      {/* Leyenda adicional */}
                      <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                        💡 <strong>Tip:</strong> Haz clic en cualquier día con citas para ver los detalles completos.
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              {/* Perfil del Cliente */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Perfil del Cliente
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/customer/profile')}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    Datos personales editables y configuración básica
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Nombre</label>
                    <p className="font-medium">{customerProfile?.name || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <p className="font-medium">{customerProfile?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Teléfono</label>
                    <p className="font-medium">{customerProfile?.phone || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Dirección</label>
                    <p className="font-medium">{customerProfile?.address || 'No especificada'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Mis Mascotas */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <PawPrint className="w-5 h-5" />
                        Mis Mascotas
                      </CardTitle>
                      <CardDescription>
                        Mini-resumen: {pets.length} mascota{pets.length !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/customer/pets')}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {pets.length > 0 ? (
                    <div className="space-y-3">
                      {pets.slice(0, 3).map((pet) => (
                        <div key={pet.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            {pet.photo_url ? (
                              <img 
                                src={pet.photo_url} 
                                alt={pet.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <Dog className="w-6 h-6 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{pet.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {pet.breed} • {pet.size}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {pets.length > 3 && (
                        <div className="pt-2">
                          <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/customer/pets')}>
                            Ver todas las mascotas ({pets.length})
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Dog className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground mb-4">No tienes mascotas registradas</p>
                      <Button onClick={() => navigate('/customer/pets/new')} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Primera Mascota
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  )
}