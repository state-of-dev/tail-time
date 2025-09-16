import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'
import { supabase } from '@/lib/supabase'
import { useAuthGuard, useSessionMonitor } from '@/hooks/useAuthGuard'
import { AuthWrapper } from '@/components/auth-wrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/navigation'
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
  History,
  AlertCircle,
  CheckCircle,
  PawPrint,
  Sparkles,
  Trophy,
  Crown,
  Zap
} from 'lucide-react'
import {
  Star1, Star6, Star7, Star8, Star9, Star10, Star13, Star19, Star20, Star21, Star22, Star23, Star24, Star25, Star26, Star27, Star28, Star37, Star39, Star40,
  StarSizes
} from '@/components/ui/neobrutalism-stars'
import { CustomerRescheduleResponse } from '@/components/appointments/customer-reschedule-response'

interface Appointment {
  id: string
  business_id: string
  customer_id: string
  pet_id: string
  appointment_date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected' | 'reschedule_pending'
  service_name: string
  duration: number
  total_amount: number
  notes?: string
  pet_name?: string
  pet_breed?: string
  business_name?: string
  business_slug?: string
  original_date: string
  original_time: string
  reschedule_count: number
  reschedule_proposed_date?: string
  reschedule_proposed_time?: string
  reschedule_reason?: string
}

interface Business {
  id: string
  business_name: string
  slug: string
  description?: string
  phone?: string
  email?: string
  address?: string
  logo_url?: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
}

export default function CustomerDashboardSimple() {
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()
  const { isAuthenticated } = useAuthGuard(true, '/auth/login')
  const { hasSessionIssue } = useSessionMonitor()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [favoriteBusinesses, setFavoriteBusinesses] = useState<Business[]>([])
  const [customerProfile, setCustomerProfile] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ✅ Helper functions for translation
  const getStatusInSpanish = (status: string) => {
    const translations = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmada',
      'in_progress': 'En Proceso',
      'completed': 'Completada',
      'cancelled': 'Cancelada',
      'no_show': 'No Asistió',
      'rescheduled': 'Reprogramada'
    } as const
    return translations[status as keyof typeof translations] || status
  }

  const getPaymentStatusInSpanish = (status: string) => {
    const translations = {
      'pending': 'Pendiente',
      'paid': 'Pagado',
      'refunded': 'Reembolsado',
      'failed': 'Falló'
    } as const
    return translations[status as keyof typeof translations] || status
  }

  useEffect(() => {
    if (user && profile) {
      loadCustomerData()
    }
  }, [user, profile])

  const loadCustomerData = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      // ✅ LEGACY ARCHITECTURE: Query by email (current schema)
      const { data: customerWithData, error: customerError } = await supabase
        .from('customers')
        .select(`
          id,
          business_id,
          name,
          email,
          phone,
          notes,
          is_first_time,
          created_at,
          updated_at,
          
          pets!pets_customer_id_fkey (
            id, name, breed, size, age_months, weight_kg,
            gender, is_neutered, temperament, medical_notes, grooming_notes
          ),
          
          appointments!appointments_customer_id_fkey (
            id,
            appointment_date,
            start_time,
            end_time,
            status,
            total_amount,
            deposit_amount,
            customer_notes,
            internal_notes,
            created_at,
            confirmed_at,
            completed_at,
            
            services!appointments_service_id_fkey (
              id, name, description, price, duration, category
            ),
            
            business_profiles!appointments_business_id_fkey (
              id, business_name, slug, phone, email, address,
              logo_url, is_active
            ),
            
            pets!appointments_pet_id_fkey (
              id, name, breed, size, temperament
            )
          )
        `)
        .eq('email', user.email) // ✅ LEGACY: Query by email since no user_id FK
        .single()

      if (customerError) {
        // Customer record should be created by auth-context, but let's be defensive
        if (customerError.code === 'PGRST116') {
        }
        
        setIsLoading(false)
        return
      }

      if (!customerWithData) {
        setIsLoading(false)
        return
      }
      setCustomerProfile(customerWithData)

      // ✅ Process appointments with real data (no parsing needed!)
      if (customerWithData.appointments && customerWithData.appointments.length > 0) {
        const processedAppointments = customerWithData.appointments.map(apt => {
          return {
            ...apt,
            // Real data from services table
            service_name: apt.services?.name || 'Servicio no encontrado',
            service_description: apt.services?.description || '',
            service_price: apt.services?.price || apt.total_amount,
            service_duration: apt.services?.duration || 60,
            service_category: apt.services?.category || 'otros',
            
            // Real data from business_profiles table
            business_name: apt.business_profiles?.business_name || 'Negocio',
            business_slug: apt.business_profiles?.slug || '',
            business_phone: apt.business_profiles?.phone || '',
            business_address: apt.business_profiles?.address || '',
            business_logo: apt.business_profiles?.logo_url || '',
            
            // Real data from pets table
            pet_name: apt.pets?.name || 'Mascota',
            pet_breed: apt.pets?.breed || 'Raza no especificada',
            pet_size: apt.pets?.size || 'mediano',
            pet_special_needs: apt.pets?.special_needs || '',
            
            // Status en español
            status_spanish: getStatusInSpanish(apt.status),
            
            // Payment info
            payment_status_spanish: getPaymentStatusInSpanish(apt.payment_status || 'pending'),
            is_paid: apt.payment_status === 'paid',
            amount_due: (apt.total_amount || 0) - (apt.paid_amount || 0),
            
            // Dates formatting
            appointment_datetime: new Date(`${apt.appointment_date}T${apt.start_time}`),
            is_upcoming: new Date(`${apt.appointment_date}T${apt.start_time}`) > new Date(),
            is_today: apt.appointment_date === new Date().toISOString().split('T')[0],
            
            // Actions available based on status and date
            can_cancel: ['pending', 'confirmed'].includes(apt.status) && 
                       new Date(`${apt.appointment_date}T${apt.start_time}`) > new Date(),
            can_reschedule: ['pending', 'confirmed'].includes(apt.status) &&
                           new Date(`${apt.appointment_date}T${apt.start_time}`) > new Date(),
            can_review: apt.status === 'completed' && !apt.review_left,
          }
        }).sort((a, b) => b.appointment_datetime.getTime() - a.appointment_datetime.getTime())
        
        setAppointments(processedAppointments)
      } else {
        setAppointments([])
      }

      // Load favorite businesses (for MVP, show some demo businesses)
      const { data: businessesData, error: businessesError } = await supabase
        .from('business_profiles')
        .select('id, business_name, slug, description, phone, email, address, logo_url')
        .eq('is_active', true)
        .limit(3)

      if (!businessesError && businessesData) {
        setFavoriteBusinesses(businessesData)
      }

    } catch (error) {
      console.error('Error loading customer data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-chart-4 text-main-foreground'
      case 'pending': return 'bg-chart-3 text-main-foreground'
      case 'completed': return 'bg-chart-1 text-main-foreground'
      case 'cancelled': return 'bg-chart-2 text-main-foreground'
      case 'rejected': return 'bg-chart-2 text-main-foreground'
      case 'reschedule_pending': return 'bg-chart-5 text-main-foreground'
      default: return 'bg-secondary-background text-foreground'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-chart-2 brutal-border brutal-shadow animate-pulse mx-auto mb-4 rounded-base flex items-center justify-center">
            <Heart className="w-8 h-8 text-main-foreground" />
          </div>
          <p className="text-foreground/70">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthWrapper requireAuth={true}>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Welcome Header - Neobrutalism Style */}
        <section className="py-16 bg-chart-1 relative overflow-hidden border-t-4 border-black">
          {/* Floating Stars Background */}
          <div className="absolute inset-0 pointer-events-none">
            <Star1 className="absolute top-10 left-10 star-decoration" size={StarSizes.lg} />
            <Star6 className="absolute top-20 right-20 star-decoration" size={StarSizes.md} />
            <Star7 className="absolute bottom-16 left-32 star-decoration" size={StarSizes.xl} />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-8">
              <Badge className="bg-chart-8 text-main-foreground brutal-shadow-lg hover:brutal-hover px-8 py-4 text-lg font-black brutal-border-thick rounded-base transform -rotate-1">
                <Crown className="icon-large mr-2 icon-float" />
                <Star8 size={StarSizes.md} className="star-decoration" />
                DASHBOARD CLIENTE
                <Star9 size={StarSizes.md} className="star-decoration" />
                <Trophy className="icon-large ml-2 icon-float" />
              </Badge>
            </div>
            <div className="flex items-center justify-center gap-8">
              <div className="p-6 bg-chart-2 brutal-border-thick brutal-shadow-xl rounded-base">
                <Heart className="icon-hero text-main-foreground icon-float" />
              </div>
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-black text-main-foreground uppercase mb-4">
                  <Star10 size={StarSizes.lg} className="star-decoration inline-block mr-2" />
                  ¡HOLA {(profile?.full_name || 'CLIENTE').toUpperCase()}!
                  <Star13 size={StarSizes.lg} className="star-decoration inline-block ml-2" />
                </h1>
                <p className="text-xl font-bold text-main-foreground/80 uppercase">
                  <Dog className="icon-large inline-block mr-2 icon-float" />
                  PANEL DE CLIENTE
                  <Sparkles className="icon-large inline-block mx-2 icon-float" />
                  {user?.email}
                  <Zap className="icon-large inline-block ml-2 icon-float" />
                </p>
              </div>
            </div>
          </div>
        </section>

      <section className="py-16 bg-chart-3 border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
          
          {/* Main Content - Appointments */}
          <div className="space-y-8">
            
            {/* Pending Actions - Reschedule Responses */}
            {appointments.filter(apt => apt.status === 'reschedule_pending').length > 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Badge className="bg-chart-6 text-main-foreground brutal-shadow-xl px-8 py-4 text-xl font-black brutal-border-thick rounded-base uppercase transform rotate-1">
                    <AlertCircle className="icon-large mr-2 icon-float" />
                    <Star19 size={StarSizes.md} className="star-decoration" />
                    ACCIÓN REQUERIDA
                    <Star20 size={StarSizes.md} className="star-decoration" />
                  </Badge>
                </div>
                {appointments
                  .filter(apt => apt.status === 'reschedule_pending')
                  .map((appointment) => (
                    <CustomerRescheduleResponse
                      key={appointment.id}
                      appointment={{
                        ...appointment,
                        business_name: appointment.business_name || 'Grooming Business',
                        pet_name: appointment.pet_name || 'Mascota'
                      } as any}
                      onUpdate={loadCustomerData}
                    />
                  ))}
              </div>
            )}

            {/* Today's Appointments - Highlighted */}
            {(() => {
              const today = new Date().toISOString().split('T')[0];
              const todaysAppointments = appointments.filter(apt => apt.appointment_date === today);
              
              if (todaysAppointments.length > 0) {
                return (
                  <Card className="bg-chart-1 brutal-border-thick brutal-shadow-xl hover:brutal-hover transition-all duration-200">
                    <CardHeader className="bg-chart-4 brutal-border-thick border-b-4 border-l-0 border-r-0 border-t-0">
                      <CardTitle className="flex items-center gap-4 text-main-foreground font-black text-2xl uppercase">
                        <Clock className="icon-hero icon-float" />
                        <Star21 size={StarSizes.lg} className="star-decoration" />
                        CITA DE HOY
                        <Star22 size={StarSizes.lg} className="star-decoration" />
                      </CardTitle>
                      <CardDescription className="text-main-foreground/80 font-bold text-lg uppercase">
                        <CheckCircle className="icon-large inline-block mr-2 icon-float" />
                        TIENES {todaysAppointments.length} CITA{todaysAppointments.length > 1 ? 'S' : ''} PROGRAMADA{todaysAppointments.length > 1 ? 'S' : ''} PARA HOY
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 bg-chart-1">
                      {todaysAppointments.map((appointment) => (
                        <div key={appointment.id} className="bg-main rounded-base p-6 brutal-border-thick brutal-shadow-lg hover:brutal-hover">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-4">
                                <h3 className="text-xl font-black text-main-foreground uppercase">
                                  <Star23 size={StarSizes.sm} className="star-decoration inline-block mr-2" />
                                  {appointment.service_name.toUpperCase()}
                                </h3>
                                <Badge className="bg-chart-5 text-main-foreground brutal-border brutal-shadow font-black">
                                  {appointment.status === 'confirmed' && 'CONFIRMADA'}
                                  {appointment.status === 'pending' && 'PENDIENTE'}
                                  {appointment.status === 'completed' && 'COMPLETADA'}
                                </Badge>
                              </div>
                              
                              <div className="space-y-3">
                                <p className="flex items-center gap-2 font-black text-main-foreground text-lg">
                                  <Clock className="icon-large icon-float" />
                                  {appointment.start_time} - {appointment.end_time}
                                </p>
                                <p className="flex items-center gap-2 font-bold text-main-foreground/80 uppercase">
                                  <MapPin className="icon-standard icon-float" />
                                  {appointment.business_name?.toUpperCase()}
                                </p>
                                {appointment.pet_name && (
                                  <p className="flex items-center gap-2 font-bold text-main-foreground/80 uppercase">
                                    <Dog className="icon-standard icon-float" />
                                    {appointment.pet_name.toUpperCase()} ({appointment.pet_breed?.toUpperCase()})
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-xl font-bold text-primary">
                                ${appointment.total_amount}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {appointment.duration} min
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              }
              return null;
            })()}

            {/* Recent Appointments */}
            <Card data-section="appointments" className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Mis Citas
                </CardTitle>
                <CardDescription>
                  Historial y próximas citas de grooming
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Dog className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No tienes citas registradas</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Explora nuestras peluquerías y agenda tu primera cita para darle a tu mascota el cuidado que se merece
                    </p>
                    <Button 
                      onClick={() => navigate('/marketplace')}
                      size="lg"
                      className="hover:scale-105 transition-all duration-200"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Agendar Nueva Cita
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.slice(0, 5).map((appointment) => (
                      <Card key={appointment.id} className="transition-all hover:shadow-md">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-foreground">
                                  {appointment.service_name}
                                </h3>
                                <Badge className={getStatusColor(appointment.status)}>
                                  {appointment.status === 'confirmed' && 'Confirmada'}
                                  {appointment.status === 'pending' && 'Pendiente'}
                                  {appointment.status === 'completed' && 'Completada'}
                                  {appointment.status === 'cancelled' && 'Cancelada'}
                                  {appointment.status === 'rejected' && 'Rechazada'}
                                </Badge>
                              </div>
                              
                              <div className="text-sm text-muted-foreground space-y-2 mb-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <p className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span className="font-medium">
                                      {new Date(appointment.appointment_date).toLocaleDateString('es-MX', {
                                        weekday: 'short',
                                        day: 'numeric', 
                                        month: 'short'
                                      })}
                                    </span>
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span className="font-medium">
                                      {appointment.start_time} - {appointment.end_time}
                                    </span>
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span>{appointment.business_name}</span>
                                  </p>
                                  {appointment.pet_name && (
                                    <p className="flex items-center gap-2">
                                      <Dog className="w-4 h-4 text-primary" />
                                      <span>{appointment.pet_name} ({appointment.pet_breed})</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              {/* Customer Notes Preview */}
                              {appointment.notes && (
                                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                                  <p className="text-sm text-muted-foreground">
                                    <strong>Notas:</strong> {appointment.notes.substring(0, 100)}
                                    {appointment.notes.length > 100 && '...'}
                                  </p>
                                </div>
                              )}
                              
                              {/* Action Buttons */}
                              <div className="flex flex-wrap gap-2">
                                {appointment.status === 'pending' && (
                                  <Button variant="outline" size="sm" className="text-amber-600 border-amber-300 hover:bg-amber-50">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    Esperando confirmación
                                  </Button>
                                )}
                                
                                {appointment.status === 'confirmed' && (
                                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Confirmada
                                  </Button>
                                )}
                                
                                {appointment.status === 'completed' && (
                                  <Button variant="outline" size="sm" className="text-green-600 border-green-300 hover:bg-green-50">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Completada
                                  </Button>
                                )}
                                
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    navigate(`/customer/appointment/${appointment.id}`)
                                  }}
                                >
                                  Ver detalles
                                </Button>
                              </div>
                            </div>
                            
                            <div className="text-right ml-4">
                              <p className="text-2xl font-bold text-primary mb-1">
                                ${appointment.total_amount}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.duration} min
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <div className="space-y-2">
                      {appointments.length > 5 && (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate('/customer/appointments')}
                        >
                          <History className="w-4 h-4 mr-2" />
                          Ver todas las citas ({appointments.length})
                        </Button>
                      )}
                      
                      <Button 
                        onClick={() => navigate('/marketplace')} 
                        className="w-full hover:scale-105 transition-all duration-200"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Agendar Nueva Cita
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Profile Summary */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Mi Perfil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <label className="text-sm text-muted-foreground">Nombre</label>
                  <p className="font-medium text-foreground">
                    {customerProfile?.name || profile?.full_name || 'Cliente'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="font-medium text-foreground">{user?.email}</p>
                </div>
                {customerProfile?.phone && (
                  <div>
                    <label className="text-sm text-muted-foreground">Teléfono</label>
                    <p className="font-medium text-foreground">{customerProfile.phone}</p>
                  </div>
                )}
                {customerProfile?.address && (
                  <div>
                    <label className="text-sm text-muted-foreground">Dirección</label>
                    <p className="font-medium text-foreground">{customerProfile.address}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Favorite Places */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Lugares Favoritos
                </CardTitle>
                <CardDescription>
                  Peluquerías que te gustan
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {favoriteBusinesses.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Heart className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">
                      Aún no tienes favoritos
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {favoriteBusinesses.map((business) => (
                      <div key={business.id} className="p-3 border border-border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground text-sm">
                              {business.business_name}
                            </h3>
                            {business.description && !business.description.includes('HOURS:') && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {business.description.replace(/HOURS:\{[^}]*\}/g, '').trim()}
                              </p>
                            )}
                            {business.address && (
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {business.address}
                              </p>
                            )}
                            {business.phone && (
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {business.phone}
                              </p>
                            )}
                          </div>
                          <Heart className="w-4 h-4 text-red-500 fill-current" />
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={() => navigate(`/business/${business.slug}`)}
                        >
                          Ver Perfil
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
        </div>
      </section>
      </div>
    </AuthWrapper>
  )
}