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
  Coffee,
  Crown,
  Trophy
} from 'lucide-react'
import {
  Star1, Star6, Star7, Star8, Star9, Star10, Star13, Star19, Star20, Star21, Star22, Star23, Star24, Star25, Star26, Star27, Star28, Star37, Star39, Star40,
  StarSizes
} from '@/components/ui/neobrutalism-stars'

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
    <div className="min-h-screen bg-chart-3">
      {/* Header with Neobrutalism Style */}
      <header className="bg-chart-1 brutal-border-thick border-t-0 border-x-0 relative overflow-hidden border-b-4 border-black">
        {/* Floating Stars Background */}
        <div className="absolute inset-0 pointer-events-none">
          <Star1 className="absolute top-8 left-10 star-decoration" size={StarSizes.lg} />
          <Star6 className="absolute top-16 right-20 star-decoration" size={StarSizes.md} />
          <Star7 className="absolute bottom-8 left-32 star-decoration" size={StarSizes.xl} />
          <Star8 className="absolute top-12 right-1/3 star-decoration" size={StarSizes.sm} />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          <div className="flex justify-between items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-chart-2 brutal-border-thick brutal-shadow-lg rounded-base">
                  <PawPrint className="icon-hero text-main-foreground icon-float" />
                </div>
                <Badge className="bg-chart-8 text-main-foreground brutal-shadow-lg hover:brutal-hover px-6 py-3 text-lg font-black brutal-border-thick rounded-base transform -rotate-1">
                  <Crown className="icon-large mr-2 icon-float" />
                  <Star9 size={StarSizes.md} className="star-decoration" />
                  DASHBOARD GROOMER
                  <Star10 size={StarSizes.md} className="star-decoration" />
                  <Trophy className="icon-large ml-2 icon-float" />
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-main-foreground uppercase">
                <Star13 size={StarSizes.lg} className="star-decoration inline-block mr-2" />
                ¡HOLA, {(businessProfile?.business_name || 'GROOMER').toUpperCase()}!
                <Star19 size={StarSizes.lg} className="star-decoration inline-block ml-2" />
              </h1>
              <p className="text-xl font-bold text-main-foreground/80 uppercase">
                <Scissors className="icon-large inline-block mr-2 icon-float" />
                RESUMEN DE TU NEGOCIO HOY
                <Sparkles className="icon-large inline-block ml-2 icon-float" />
              </p>
            </div>

            <div className="flex items-center gap-6">
              {/* Connection Status */}
              <Badge className={`brutal-border brutal-shadow font-black px-6 py-3 uppercase ${isConnected ? 'bg-chart-5 text-main-foreground' : 'bg-destructive text-main-foreground'}`}>
                <Star20 size={StarSizes.sm} className="star-decoration mr-2" />
                {isConnected ? "EN VIVO" : "SIN CONEXIÓN"}
                <Star21 size={StarSizes.sm} className="star-decoration ml-2" />
              </Badge>

              <Button
                className="bg-chart-3 hover:bg-chart-4 text-main-foreground brutal-border-thick brutal-shadow-lg hover:brutal-hover font-black text-lg py-6 px-8 uppercase"
                onClick={() => navigate('/setup/services')}
              >
                <Settings className="icon-large mr-2 icon-float" />
                <Star22 size={StarSizes.sm} className="star-decoration mr-2" />
                CONFIGURAR
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="py-16 bg-chart-3 border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <Badge className="bg-chart-6 text-main-foreground brutal-shadow-xl px-8 py-4 text-xl font-black brutal-border-thick rounded-base uppercase transform rotate-1">
              <BarChart3 className="icon-large mr-2 icon-float" />
              <Star23 size={StarSizes.md} className="star-decoration" />
              MÉTRICAS DE HOY
              <Star24 size={StarSizes.md} className="star-decoration" />
              <TrendingUp className="icon-large ml-2 icon-float" />
            </Badge>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Today's Appointments */}
          <Card className="brutal-shadow-lg hover:brutal-hover transition-all duration-200 bg-chart-1 brutal-border-thick transform hover:-rotate-1">
            <CardHeader className="bg-chart-4 brutal-border-thick border-b-4 border-l-0 border-r-0 border-t-0 flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-black text-main-foreground uppercase">
                <Star25 size={StarSizes.sm} className="star-decoration inline-block mr-2" />
                CITAS HOY
              </CardTitle>
              <Calendar className="icon-hero text-main-foreground icon-float" />
            </CardHeader>
            <CardContent className="bg-chart-1 p-6">
              <div className="text-4xl font-black text-main-foreground mb-2">
                {todayAppointments.length}
              </div>
              <p className="text-sm font-bold text-main-foreground/80 uppercase">
                <CheckCircle className="icon-standard inline-block mr-1 icon-float" />
                {todayAppointments.filter(apt => apt.status === 'pending').length} PENDIENTES
              </p>
            </CardContent>
          </Card>

          {/* Week Revenue */}
          <Card className="brutal-shadow-lg hover:brutal-hover transition-all duration-200 bg-chart-4 brutal-border-thick transform hover:rotate-1">
            <CardHeader className="bg-chart-5 brutal-border-thick border-b-4 border-l-0 border-r-0 border-t-0 flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-black text-main-foreground uppercase">
                <Star26 size={StarSizes.sm} className="star-decoration inline-block mr-2" />
                INGRESOS SEMANA
              </CardTitle>
              <DollarSign className="icon-hero text-main-foreground icon-float" />
            </CardHeader>
            <CardContent className="bg-chart-4 p-6">
              <div className="text-4xl font-black text-main-foreground mb-2">
                ${thisWeekRevenue.toFixed(0)}
              </div>
              <p className="text-sm font-bold text-main-foreground/80 uppercase">
                <TrendingUp className="icon-standard inline-block mr-1 icon-float" />
                +12% VS SEMANA PASADA
              </p>
            </CardContent>
          </Card>

          {/* Completed This Month */}
          <Card className="brutal-shadow-lg hover:brutal-hover transition-all duration-200 bg-chart-5 brutal-border-thick transform hover:-rotate-1">
            <CardHeader className="bg-chart-6 brutal-border-thick border-b-4 border-l-0 border-r-0 border-t-0 flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-black text-main-foreground uppercase">
                <Star27 size={StarSizes.sm} className="star-decoration inline-block mr-2" />
                COMPLETADAS (MES)
              </CardTitle>
              <CheckCircle className="icon-hero text-main-foreground icon-float" />
            </CardHeader>
            <CardContent className="bg-chart-5 p-6">
              <div className="text-4xl font-black text-main-foreground mb-2">
                {completedThisMonth}
              </div>
              <p className="text-sm font-bold text-main-foreground/80 uppercase">
                <Trophy className="icon-standard inline-block mr-1 icon-float" />
                ¡EXCELENTE TRABAJO!
              </p>
            </CardContent>
          </Card>

          {/* Total Clients */}
          <Card className="brutal-shadow-lg hover:brutal-hover transition-all duration-200 bg-chart-2 brutal-border-thick transform hover:rotate-1">
            <CardHeader className="bg-chart-7 brutal-border-thick border-b-4 border-l-0 border-r-0 border-t-0 flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-black text-main-foreground uppercase">
                <Star28 size={StarSizes.sm} className="star-decoration inline-block mr-2" />
                CLIENTES ÚNICOS
              </CardTitle>
              <Users className="icon-hero text-main-foreground icon-float" />
            </CardHeader>
            <CardContent className="bg-chart-2 p-6">
              <div className="text-4xl font-black text-main-foreground mb-2">
                {new Set(appointments.map(apt => apt.customer_name)).size}
              </div>
              <p className="text-sm font-bold text-main-foreground/80 uppercase">
                <Heart className="icon-standard inline-block mr-1 icon-float" />
                BASE DE CLIENTES CRECIENDO
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <Card className="brutal-shadow-xl bg-chart-8 brutal-border-thick">
              <CardHeader className="bg-chart-6 brutal-border-thick border-b-4 border-l-0 border-r-0 border-t-0">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-4 text-main-foreground font-black text-2xl uppercase">
                      <Clock className="icon-hero icon-float" />
                      <Star37 size={StarSizes.lg} className="star-decoration" />
                      AGENDA DE HOY
                    </CardTitle>
                    <CardDescription className="text-main-foreground/80 font-bold text-lg uppercase">
                      <CheckCircle className="icon-large inline-block mr-2 icon-float" />
                      {todayAppointments.length} CITAS PROGRAMADAS
                    </CardDescription>
                  </div>
                  <Button className="bg-chart-3 hover:bg-chart-4 text-main-foreground brutal-border-thick brutal-shadow-lg hover:brutal-hover font-black text-lg py-4 px-6 uppercase">
                    <Plus className="icon-large mr-2 icon-float" />
                    <Star39 size={StarSizes.sm} className="star-decoration mr-2" />
                    NUEVA CITA
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="bg-chart-8 p-8">
                {todayAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="p-8 bg-chart-7 brutal-border-thick brutal-shadow-lg rounded-base inline-block mb-6">
                      <Coffee className="icon-hero text-main-foreground icon-float" />
                    </div>
                    <p className="text-main-foreground font-black text-xl uppercase">
                      <Star40 size={StarSizes.md} className="star-decoration inline-block mr-2" />
                      ¡NO HAY CITAS HOY! PERFECTO PARA DESCANSAR
                      <Star40 size={StarSizes.md} className="star-decoration inline-block ml-2" />
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

        {/* Bottom Action Bar - Neobrutalism Style */}
        <div className="mt-12 p-8 bg-chart-5 brutal-border-thick brutal-shadow-xl rounded-base">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-chart-2 brutal-border-thick brutal-shadow-lg rounded-base">
                <Heart className="icon-hero text-main-foreground icon-float" />
              </div>
              <div>
                <h3 className="font-black text-2xl text-main-foreground uppercase mb-2">
                  ¡TU NEGOCIO ESTÁ CRECIENDO!
                  <Sparkles className="icon-large inline-block ml-2 icon-float" />
                </h3>
                <p className="text-lg font-bold text-main-foreground/80 uppercase">
                  <Trophy className="icon-standard inline-block mr-2 icon-float" />
                  {appointments.length} CITAS TOTALES ESTE MES
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Button className="bg-chart-4 hover:bg-chart-6 text-main-foreground brutal-border-thick brutal-shadow-lg hover:brutal-hover font-black text-lg py-6 px-8 uppercase">
                <Zap className="icon-large mr-2 icon-float" />
                MEJORAR PLAN
              </Button>
              <Button
                className="bg-chart-1 hover:bg-chart-7 text-main-foreground brutal-border-thick brutal-shadow-lg hover:brutal-hover font-black text-lg py-6 px-8 uppercase"
                onClick={() => navigate(`/business/${businessProfile?.slug}`)}
              >
                <Dog className="icon-large mr-2 icon-float" />
                VER MI PÁGINA
              </Button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}