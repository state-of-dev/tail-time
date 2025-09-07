import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'
import { supabase } from '@/lib/supabase'
import { useAppointmentsRealtime } from '@/hooks/use-appointments-realtime'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AppointmentActions } from '@/components/appointments/appointment-actions'
import { 
  ArrowLeft,
  Calendar,
  Clock,
  Heart,
  AlertCircle,
  CheckCircle,
  Users,
  TrendingUp
} from 'lucide-react'
import { Navigation } from '@/components/navigation'

interface Appointment {
  id: string
  business_id: string
  customer_id: string
  appointment_date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'reschedule_requested' | 'reschedule_pending' | 'completed'
  service_name: string
  duration: number
  total_amount: number
  customer_name: string
  customer_email: string
  customer_phone: string
  pet_name: string
  pet_breed: string
  notes?: string
  original_date: string
  original_time: string
  reschedule_count: number
  reschedule_proposed_date?: string
  reschedule_proposed_time?: string
  reschedule_reason?: string
  created_at: string
  updated_at?: string
}

export default function AppointmentsManagement() {
  const { businessSlug } = useParams<{ businessSlug: string }>()
  const navigate = useNavigate()
  const { user, businessProfile } = useAuth()
  
  // 🔥 REAL-TIME: Use real-time hook for appointments
  const { 
    appointments, 
    isLoading, 
    error,
    isConnected: realtimeConnected 
  } = useAppointmentsRealtime(businessProfile?.id)

  useEffect(() => {
    if (!user || !businessProfile) {
      navigate('/auth/login')
      return
    }
    // Real-time hook handles appointment loading automatically

  }, [user, businessProfile])

  // Dummy function for AppointmentActions compatibility
  // Real-time hook will automatically update appointments
  const handleAppointmentUpdate = () => {

  }

  const getStatusCount = (status: string) => {
    return appointments.filter(apt => apt.status === status).length
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendientes'
      case 'confirmed': return 'Confirmadas'
      case 'reschedule_pending': return 'Reagendado Pendiente'
      case 'rejected': return 'Rechazadas'
      case 'cancelled': return 'Canceladas'
      case 'completed': return 'Completadas'
      default: return status
    }
  }

  const filterAppointments = (status: string) => {
    return appointments.filter(apt => apt.status === status)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-MX', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-8 h-8 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando citas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(`/groomer/${businessSlug}/dashboard`)}>
              Volver al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Page Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">
                  Gestión de Citas
                </h1>
                {/* Real-time Connection Status */}
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${realtimeConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={realtimeConnected ? 'text-green-600' : 'text-red-600'}>
                    {realtimeConnected ? 'Tiempo real activo' : 'Desconectado'}
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground">
                Administra y responde a las solicitudes de citas - {appointments.length} citas cargadas
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{getStatusCount('pending')}</p>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{getStatusCount('confirmed')}</p>
                  <p className="text-sm text-muted-foreground">Confirmadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{getStatusCount('reschedule_pending')}</p>
                  <p className="text-sm text-muted-foreground">Reagendado</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{appointments.length}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Sections */}
        <div className="space-y-8">
          {/* Pending Appointments - Priority */}
          {getStatusCount('pending') > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-semibold">
                  Citas Pendientes ({getStatusCount('pending')})
                </h2>
                <Badge className="bg-yellow-100 text-yellow-800">¡Requiere Acción!</Badge>
              </div>
              
              <div className="space-y-4">
                {filterAppointments('pending').map((appointment) => (
                  <AppointmentActions
                    key={appointment.id}
                    appointment={appointment}
                    onUpdate={handleAppointmentUpdate}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Reschedule Pending */}
          {getStatusCount('reschedule_pending') > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-semibold">
                  Reagendados Pendientes ({getStatusCount('reschedule_pending')})
                </h2>
              </div>
              
              <div className="space-y-4">
                {filterAppointments('reschedule_pending').map((appointment) => (
                  <AppointmentActions
                    key={appointment.id}
                    appointment={appointment}
                    onUpdate={handleAppointmentUpdate}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Confirmed Appointments */}
          {getStatusCount('confirmed') > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-semibold">
                  Citas Confirmadas ({getStatusCount('confirmed')})
                </h2>
              </div>
              
              <div className="space-y-4">
                {filterAppointments('confirmed').map((appointment) => (
                  <AppointmentActions
                    key={appointment.id}
                    appointment={appointment}
                    onUpdate={handleAppointmentUpdate}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Show message if no appointments */}
          {appointments.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No hay citas</h3>
                  <p className="text-sm">
                    Las nuevas solicitudes de citas aparecerán aquí automáticamente
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions for Today */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Citas de Hoy
            </CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('es-MX', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {appointments
              .filter(apt => 
                apt.appointment_date === new Date().toISOString().split('T')[0] &&
                ['confirmed', 'pending'].includes(apt.status)
              )
              .length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No hay citas confirmadas para hoy</p>
              </div>
            ) : (
              <div className="space-y-2">
                {appointments
                  .filter(apt => 
                    apt.appointment_date === new Date().toISOString().split('T')[0] &&
                    ['confirmed', 'pending'].includes(apt.status)
                  )
                  .sort((a, b) => a.start_time.localeCompare(b.start_time))
                  .map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className={
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }>
                          {appointment.start_time}
                        </Badge>
                        <div>
                          <p className="font-semibold">{appointment.customer_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.pet_name} • {appointment.service_name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${appointment.total_amount}</p>
                        <p className="text-sm text-muted-foreground">{appointment.duration} min</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}