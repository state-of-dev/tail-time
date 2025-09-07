import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'
import { supabase } from '@/lib/supabase'
import { useAuthGuard, useSessionMonitor } from '@/hooks/useAuthGuard'
import { useAppointmentsRealtime } from '@/hooks/use-appointments-realtime'
import { useNotificationStore } from '@/stores/notificationStore'
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
  Scissors,
  TrendingUp,
  Users,
  BarChart3,
  Filter,
  List,
  CalendarDays,
  Eye
} from 'lucide-react'

interface BusinessProfile {
  id: string
  slug: string
  business_name: string
  description: string
  logo_url: string
  subscription_status: string
  trial_ends_at: string
  is_active: boolean
  business_hours: any
  services: any[]
  portfolio: any[]
}

interface Appointment {
  id: string
  appointment_date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected' | 'reschedule_pending'
  service_name: string
  customer_name: string
  pet_name: string
  pet_breed: string
  total_amount: number
  customer_notes?: string
}

interface DashboardStats {
  totalAppointments: number
  pendingAppointments: number
  completedToday: number
  monthlyRevenue: number
  averageRating: number
  totalReviews: number
}

export default function GroomerDashboard() {
  const { businessSlug } = useParams<{ businessSlug: string }>()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<string>('list')
  
  useAuthGuard(true) // Require authentication
  useSessionMonitor()
  
  // 🔥 REAL-TIME: Use real-time hook for appointments
  const { 
    appointments, 
    isLoading: appointmentsLoading, 
    isConnected: realtimeConnected,
    error: appointmentsError
  } = useAppointmentsRealtime(businessProfile?.id)

  // 🔔 NOTIFICATIONS: Setup notification system
  const { 
    notifications, 
    unreadCount, 
    isSubscribed: notificationsConnected 
  } = useNotificationStore()

  useEffect(() => {
    if (!user) return
    loadDashboardData()
  }, [user, businessSlug])

  // Initialize notification system when user is authenticated
  useEffect(() => {
    const { setCurrentUser, setupRealTimeSubscription, loadNotifications } = useNotificationStore.getState()
    
    if (user) {
      setCurrentUser(user.id)
      setupRealTimeSubscription(user.id)
      loadNotifications(user.id, user.id)
    }
  }, [user])

  const loadDashboardData = async () => {
    if (!businessSlug || !user) return

    try {
      setIsLoading(true)

      // Load business profile
      const { data: business, error: businessError } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('slug', businessSlug)
        .eq('owner_id', user.id)
        .single()

      if (businessError || !business) {
        navigate('/setup/business')
        return
      }

      setBusinessProfile(business)

      // Load dashboard stats (reviews only - appointments come from real-time hook)
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('business_id', business.id)

    } catch (error) {
      console.error('[GROOMER DASHBOARD] Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate stats from real-time appointments
  useEffect(() => {
    if (!appointments.length) {
      setStats(null)
      return
    }

    const today = new Date().toISOString().split('T')[0]
    
    const dashboardStats: DashboardStats = {
      totalAppointments: appointments.length,
      pendingAppointments: appointments.filter(a => a.status === 'pending').length,
      completedToday: appointments.filter(a => 
        a.status === 'completed' && a.appointment_date === today
      ).length,
      monthlyRevenue: appointments.filter(a => 
        a.status === 'completed' && 
        new Date(a.appointment_date).getMonth() === new Date().getMonth()
      ).reduce((sum, a) => sum + parseFloat(a.total_amount?.toString() || '0'), 0),
      averageRating: 0, // Will be loaded separately
      totalReviews: 0
    }

    setStats(dashboardStats)

  }, [appointments])

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0]
    return appointments
      .filter(apt => 
        apt.appointment_date === today && ['confirmed', 'pending'].includes(apt.status)
      )
      .sort((a, b) => {
        const timeA = a.start_time
        const timeB = b.start_time
        return timeA.localeCompare(timeB)
      })
  }

  const getUpcomingAppointments = () => {
    const now = new Date()

    const filtered = appointments.filter(apt => {
      const appointmentDate = new Date(`${apt.appointment_date}T${apt.start_time}`)
      const isFuture = appointmentDate > now
      const hasValidStatus = ['confirmed', 'pending'].includes(apt.status)
      
      if (!isFuture && hasValidStatus) {

      }
      if (isFuture && !hasValidStatus) {

      }
      
      return isFuture && hasValidStatus
    })

    filtered.slice(0, 3).forEach(apt => {

    })
    
    return filtered
      .sort((a, b) => {
        const dateA = new Date(`${a.appointment_date}T${a.start_time}`)
        const dateB = new Date(`${b.appointment_date}T${b.start_time}`)
        return dateA.getTime() - dateB.getTime()
      })
      .slice(0, 3)
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
    
    // Filter only today or future appointments (no past ones)
    filtered = filtered.filter(apt => {
      const appointmentDate = apt.appointment_date
      return appointmentDate >= today
    })
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === selectedStatus)
    }
    
    // Sort by date/time - nearest first
    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.appointment_date}T${a.start_time}`)
      const dateB = new Date(`${b.appointment_date}T${b.start_time}`)
      return dateA.getTime() - dateB.getTime()
    })
  }

  const renderAppointmentCard = (apt: Appointment) => (
    <div key={apt.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          {/* Date and Time - Priority 1 */}
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
          
          {/* Service - Priority 2 */}
          <div className="text-base font-medium text-gray-800">
            {apt.service_name}
          </div>
          
          {/* Customer and Pet - Priority 3 */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {apt.customer_name}
            </span>
            <span className="flex items-center gap-1">
              <Dog className="w-4 h-4" />
              {apt.pet_name} ({apt.pet_breed})
            </span>
          </div>
        </div>
        
        {/* Price and Action */}
        <div className="flex flex-col items-end justify-start gap-3 ml-4">
          <div className="text-2xl font-bold text-primary">
            ${apt.total_amount}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/groomer/${businessSlug}/appointment/${apt.id}`)}
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
          <Scissors className="w-8 h-8 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  if (!businessProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              No se pudo cargar el perfil del negocio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/setup/business')}>
              Configurar Negocio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const upcomingAppointments = getUpcomingAppointments()
  const todayAppointments = getTodayAppointments()

  return (
    <AuthWrapper requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        {/* Business Header */}
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                <Scissors className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {businessProfile.business_name}
                </h1>
                <div className="flex items-center gap-3">
                  <p className="text-gray-600">
                    Dashboard de Groomer
                  </p>
                  {/* Real-time Connection Status */}
                  </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          {/* Trial Banner */}
          {businessProfile.subscription_status === 'trial' && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-amber-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-amber-900">
                      Período de Prueba Activo
                    </p>
                    <p className="text-sm text-amber-700">
                      Tu prueba gratuita expira el {new Date(businessProfile.trial_ends_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                    Suscribirse
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 📊 Estado del Negocio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BarChart3 className="w-6 h-6" />
                Estado del Negocio
              </CardTitle>
              <hr className="border-gray-200" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Citas Totales</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalAppointments || 0}</p>
                  {stats?.pendingAppointments ? (
                    <p className="text-xs text-amber-600">+{stats.pendingAppointments} pendientes</p>
                  ) : null}
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Completadas Hoy</p>
                  <p className="text-3xl font-bold text-green-600">{stats?.completedToday || 0}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Ingresos del Mes</p>
                  <p className="text-3xl font-bold text-blue-600">${stats?.monthlyRevenue?.toFixed(0) || 0}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Calificación</p>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <p className="text-3xl font-bold text-gray-900">
                      {stats?.averageRating ? stats.averageRating.toFixed(1) : '—'}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">({stats?.totalReviews || 0} reseñas)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Próximas Citas */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Calendar className="w-6 h-6" />
                    Próximas Citas
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/groomer/${businessSlug}/appointments`)}
                  >
                    Ver todas
                  </Button>
                </div>
                <hr className="border-gray-200" />
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAppointments.map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {formatDate(apt.appointment_date)} - {formatTime(apt.start_time)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {apt.service_name} • {apt.customer_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {apt.pet_name} ({apt.pet_breed})
                          </p>
                        </div>
                        <Badge 
                          className={apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}
                        >
                          {apt.status === 'pending' ? 'Pendiente' : 'Confirmada'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">(No hay próximas citas)</p>
                    <Button onClick={() => navigate(`/groomer/${businessSlug}/appointments/new`)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Agendar Cita
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ⚡ Acciones Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Settings className="w-6 h-6" />
                  Acciones Rápidas
                </CardTitle>
                <hr className="border-gray-200" />
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="grid grid-cols-2 gap-4 max-w-md w-full">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center gap-2"
                    onClick={() => navigate(`/groomer/${businessSlug}/appointments/new`)}
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-sm font-medium">Nueva Cita</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center gap-2"
                    onClick={() => navigate(`/groomer/${businessSlug}/services`)}
                  >
                    <Scissors className="w-6 h-6" />
                    <span className="text-sm font-medium">Servicios</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center gap-2"
                    onClick={() => navigate(`/groomer/${businessSlug}/appointments`)}
                  >
                    <List className="w-6 h-6" />
                    <span className="text-sm font-medium">Todas las Citas</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center gap-2"
                    onClick={() => navigate(`/groomer/${businessSlug}/calendar`)}
                  >
                    <CalendarDays className="w-6 h-6" />
                    <span className="text-sm font-medium">Calendario</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center gap-2"
                    onClick={() => navigate(`/business/${businessSlug}`)}
                  >
                    <Eye className="w-6 h-6" />
                    <span className="text-sm font-medium">Mi Página</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center gap-2"
                    onClick={() => navigate(`/groomer/${businessSlug}/settings`)}
                  >
                    <Settings className="w-6 h-6" />
                    <span className="text-sm font-medium">Configuración</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* 📈 Resumen Semanal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="w-6 h-6" />
                Resumen Semanal
              </CardTitle>
              <hr className="border-gray-200" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Citas completadas</p>
                  <p className="text-2xl font-bold text-green-600">{stats?.completedToday || 0}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Ingresos</p>
                  <p className="text-2xl font-bold text-blue-600">${stats?.monthlyRevenue?.toFixed(0) || 0}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Calificación promedio</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats?.averageRating ? stats.averageRating.toFixed(1) : '—'}
                  </p>
                </div>
              </div>
              
              {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">(Gráfica comparativa semanal)</p>
                <div className="mt-2 h-20 bg-gradient-to-r from-blue-100 to-green-100 rounded flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">Próximamente</span>
                </div>
              </div> */}
              
            </CardContent>
          </Card>

        </div>
      </div>
    </AuthWrapper>
  )
}
