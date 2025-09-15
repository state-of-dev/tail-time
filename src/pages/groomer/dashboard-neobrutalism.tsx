import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'
import { useAppointmentsRealtime } from '@/hooks/use-appointments-realtime'
import { ThemeToggle } from '@/components/theme-toggle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Calendar,
  Clock,
  DollarSign,
  User,
  Star,
  Dog,
  CheckCircle,
  Plus,
  Bell,
  Settings,
  PawPrint,
  Scissors,
  TrendingUp,
  Users,
  BarChart3,
  Sparkles,
  Heart,
  Zap,
  Coffee
} from 'lucide-react'

interface Appointment {
  id: string
  appointment_date: string
  appointment_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  service_name: string
  customer_name: string
  pet_name: string
  total_amount: number
}

export default function DashboardNeobrutalism() {
  const { user, profile, businessProfile } = useAuth()
  const { appointments, isLoading, isConnected } = useAppointmentsRealtime(businessProfile?.id)
  const navigate = useNavigate()

  // Redirect if not groomer
  useEffect(() => {
    if (user && profile?.role !== 'groomer') {
      navigate('/customer/dashboard')
    }
  }, [user, profile, navigate])

  // Calculate metrics
  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0]
    return apt.appointment_date === today
  })

  const thisWeekRevenue = appointments
    .filter(apt => {
      const date = new Date(apt.appointment_date)
      const today = new Date()
      const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay())
      return date >= weekStart && apt.status === 'completed'
    })
    .reduce((sum, apt) => sum + (apt.total_amount || 0), 0)

  const completedThisMonth = appointments
    .filter(apt => {
      const date = new Date(apt.appointment_date)
      const today = new Date()
      return date.getMonth() === today.getMonth() && apt.status === 'completed'
    }).length

  const upcomingAppointments = appointments
    .filter(apt => {
      const date = new Date(apt.appointment_date)
      const today = new Date()
      return date >= today && apt.status !== 'cancelled'
    })
    .slice(0, 5)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-border border-t-pet-blue mx-auto"></div>
          <p className="text-foreground font-base">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Neobrutalism Style */}
      <header className="bg-main brutal-border-thick border-t-0 border-x-0">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Hola, {businessProfile?.business_name || 'Groomer'}!
              </h1>
              <p className="text-foreground/70 text-lg">
                Aquí tienes un resumen de tu negocio hoy
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <Badge variant={isConnected ? "pet-green" : "destructive"} className="text-sm px-4 py-2">
                {isConnected ? "En vivo" : "Sin conexión"}
              </Badge>

              <Button variant="pet-blue" size="lg" onClick={() => navigate('/setup/services')}>
                <Settings className="w-5 h-5 mr-2" />
                Configurar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Appointments */}
          <Card className="brutal-shadow hover:brutal-hover transition-all duration-200 bg-chart-1 brutal-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-main-foreground">
                Citas Hoy
              </CardTitle>
              <Calendar className="h-6 w-6 text-main-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-main-foreground">
                {todayAppointments.length}
              </div>
              <p className="text-xs text-main-foreground/80 mt-1">
                {todayAppointments.filter(apt => apt.status === 'pending').length} pendientes
              </p>
            </CardContent>
          </Card>

          {/* Week Revenue */}
          <Card className="brutal-shadow hover:brutal-hover transition-all duration-200 bg-chart-4 brutal-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-main-foreground">
                Ingresos Semana
              </CardTitle>
              <DollarSign className="h-6 w-6 text-main-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-main-foreground">
                ${thisWeekRevenue.toFixed(0)}
              </div>
              <p className="text-xs text-main-foreground/80 mt-1">
                +12% vs semana pasada
              </p>
            </CardContent>
          </Card>

          {/* Completed This Month */}
          <Card className="brutal-shadow hover:brutal-hover transition-all duration-200 bg-chart-5 brutal-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-main-foreground">
                Completadas (Mes)
              </CardTitle>
              <CheckCircle className="h-6 w-6 text-main-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-main-foreground">
                {completedThisMonth}
              </div>
              <p className="text-xs text-main-foreground/80 mt-1">
                Excelente trabajo!
              </p>
            </CardContent>
          </Card>

          {/* Total Clients */}
          <Card className="brutal-shadow hover:brutal-hover transition-all duration-200 bg-chart-2 brutal-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-main-foreground">
                Clientes Únicos
              </CardTitle>
              <Users className="h-6 w-6 text-main-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-main-foreground">
                {new Set(appointments.map(apt => apt.customer_name)).size}
              </div>
              <p className="text-xs text-main-foreground/80 mt-1">
                Base de clientes creciendo
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <Card className="brutal-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-foreground font-heading">
                      <Clock className="w-5 h-5" />
                      Agenda de Hoy
                    </CardTitle>
                    <CardDescription className="font-base">
                      {todayAppointments.length} citas programadas
                    </CardDescription>
                  </div>
                  <Button variant="pet-pink" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Nueva Cita
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {todayAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Coffee className="w-12 h-12 text-pet-blue mx-auto mb-4" />
                    <p className="text-foreground font-base">
                      ¡No hay citas hoy! Perfecto para descansar 😴
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-4 rounded-base border-2 border-border bg-secondary-background hover:bg-pet-yellow/20 transition-all duration-200 brutal-hover"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-pet-blue rounded-base border-2 border-border">
                              <Scissors className="w-4 h-4 text-main-foreground" />
                            </div>
                            <div>
                              <p className="font-heading font-semibold text-foreground">
                                {apt.appointment_time} - {apt.service_name}
                              </p>
                              <p className="text-sm text-foreground/70 font-base">
                                {apt.customer_name} con {apt.pet_name}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                apt.status === 'confirmed' ? 'pet-green' :
                                apt.status === 'pending' ? 'pet-yellow' :
                                apt.status === 'completed' ? 'pet-blue' : 'destructive'
                              }
                            >
                              {apt.status === 'pending' && 'Pendiente'}
                              {apt.status === 'confirmed' && 'Confirmada'}
                              {apt.status === 'completed' && 'Completada'}
                              {apt.status === 'cancelled' && 'Cancelada'}
                            </Badge>
                            <p className="font-base font-semibold text-foreground">
                              ${apt.total_amount}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="brutal-shadow bg-pet-yellow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-main-foreground font-heading">
                  <Sparkles className="w-5 h-5" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="default" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Cita Manual
                </Button>
                <Button variant="neutral" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Reportes
                </Button>
                <Button variant="neutral" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Notificar Clientes
                </Button>
                <Button variant="neutral" className="w-full justify-start">
                  <PawPrint className="w-4 h-4 mr-2" />
                  Gestionar Servicios
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card className="brutal-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground font-heading">
                  <TrendingUp className="w-5 h-5" />
                  Próximas Citas
                </CardTitle>
                <CardDescription className="font-base">
                  Los próximos 5 días
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length === 0 ? (
                  <p className="text-center text-foreground/70 font-base py-4">
                    No hay citas próximas
                  </p>
                ) : (
                  <div className="space-y-3">
                    {upcomingAppointments.map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between p-3 rounded-base border border-border bg-secondary-background">
                        <div>
                          <p className="text-sm font-heading font-semibold text-foreground">
                            {new Date(apt.appointment_date).toLocaleDateString('es')}
                          </p>
                          <p className="text-xs text-foreground/70 font-base">
                            {apt.customer_name} - {apt.pet_name}
                          </p>
                        </div>
                        <Badge variant="pet-blue" className="text-xs">
                          ${apt.total_amount}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business Status */}
            <Card className="brutal-shadow bg-pet-pink">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-main-foreground font-heading">
                  <Star className="w-5 h-5" />
                  Estado del Negocio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-base text-main-foreground/80">Plan:</span>
                  <Badge variant="default">
                    {businessProfile?.subscription_status || 'Prueba'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-base text-main-foreground/80">Perfil:</span>
                  <Badge variant={businessProfile?.setup_completed ? 'pet-green' : 'warning'}>
                    {businessProfile?.setup_completed ? 'Completo' : 'Incompleto'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-base text-main-foreground/80">Rating:</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-main-foreground" />
                    <span className="font-base text-main-foreground">4.9</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-8 p-6 bg-main border-2 border-border rounded-base brutal-shadow">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-pet-pink" />
              <div>
                <h3 className="font-heading font-semibold text-foreground">
                  ¡Tu negocio está creciendo! 🚀
                </h3>
                <p className="text-sm text-foreground/70 font-base">
                  {appointments.length} citas totales este mes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="pet-green">
                <Zap className="w-4 h-4 mr-2" />
                Mejorar Plan
              </Button>
              <Button variant="pet-blue" onClick={() => navigate(`/business/${businessProfile?.slug}`)}>
                <Dog className="w-4 h-4 mr-2" />
                Ver Mi Página
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}