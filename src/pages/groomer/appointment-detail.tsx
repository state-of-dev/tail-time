import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { notifyAppointmentStatusChange } from '@/lib/notifications'
import { useAuth } from '@/contexts/auth-context-simple'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft,
  Clock,
  User,
  Phone,
  Mail,
  Heart,
  Calendar,
  DollarSign,
  Edit,
  Save,
  X,
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
  XCircle,
  MessageSquare,
  Star,
  ImageIcon
} from 'lucide-react'

interface AppointmentDetail {
  id: string
  appointment_date: string
  appointment_time: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  customer_name: string
  customer_phone: string
  customer_email: string
  pet_name: string
  pet_breed: string
  pet_size: string
  service_name: string
  duration: number
  total_amount: number
  notes: string
  special_instructions: string
  groomer_notes: string
  before_images: string[]
  after_images: string[]
  created_at: string
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

export default function AppointmentDetail() {
  const { businessSlug, appointmentId } = useParams<{ businessSlug: string; appointmentId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedNotes, setEditedNotes] = useState('')
  const [newStatus, setNewStatus] = useState<string>('')

  useEffect(() => {
    if (!user || !businessSlug || !appointmentId) {
      navigate('/auth/login')
      return
    }
    loadAppointment()
  }, [user, businessSlug, appointmentId])

  const loadAppointment = async () => {
    if (!appointmentId) {
      console.error('[APPOINTMENT-DETAIL] No appointment ID provided')
      setIsLoading(false)
      return
    }

    try {

      // Load appointment with related data
      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointments')
        .select(`
          *,
          business_profiles!appointments_business_id_fkey (business_name),
          customers!appointments_customer_id_fkey (name, email, phone)
        `)
        .eq('id', appointmentId)
        .single()

      if (appointmentError || !appointmentData) {
        console.error('[APPOINTMENT-DETAIL] Error loading appointment:', appointmentError?.message)
        setIsLoading(false)
        return
      }

      // Extract customer info from customer_notes or customer relation
      const customerName = appointmentData.customers?.name || 'Cliente'
      const customerPhone = appointmentData.customers?.phone || 'No especificado'
      const customerEmail = appointmentData.customers?.email || 'No especificado'

      // Parse customer notes to extract pet info
      const customerNotes = appointmentData.customer_notes || ''
      const petNameMatch = customerNotes.match(/Mascota: ([^(]+)/)
      const petBreedMatch = customerNotes.match(/\(([^)]+)\)/)
      
      const appointmentDetail: AppointmentDetail = {
        id: appointmentData.id,
        appointment_date: appointmentData.appointment_date,
        appointment_time: appointmentData.start_time,
        status: appointmentData.status,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        pet_name: petNameMatch ? petNameMatch[1].trim() : 'Mascota',
        pet_breed: petBreedMatch ? petBreedMatch[1] : 'No especificado',
        pet_size: 'mediano', // Default since we don't have this field
        service_name: appointmentData.internal_notes?.replace('Servicio: ', '').split(' (')[0] || 'Servicio',
        duration: parseInt(appointmentData.internal_notes?.match(/\((\d+) min\)/)?.[1] || '60'),
        total_amount: appointmentData.total_amount,
        notes: customerNotes,
        special_instructions: '', // We don't have this field yet
        groomer_notes: appointmentData.internal_notes || '',
        before_images: [],
        after_images: [],
        created_at: appointmentData.created_at
      }

      setAppointment(appointmentDetail)
      setEditedNotes(appointmentDetail.groomer_notes)
      setNewStatus(appointmentDetail.status)

    } catch (error: any) {
      console.error('[APPOINTMENT-DETAIL] Exception loading appointment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNotes = async () => {
    if (!appointment) return
    
    try {

      const { error } = await supabase
        .from('appointments')
        .update({ 
          internal_notes: editedNotes 
        })
        .eq('id', appointment.id)
      
      if (error) {
        console.error('[APPOINTMENT-DETAIL] Error saving notes:', error.message)
        return
      }
      
      setAppointment({ ...appointment, groomer_notes: editedNotes })
      setIsEditing(false)

    } catch (error: any) {
      console.error('[APPOINTMENT-DETAIL] Exception saving notes:', error)
    }
  }

  const handleStatusChange = async (status: string) => {
    if (!appointment) return
    
    try {

      const updateData: any = { status }
      
      // Add completion timestamp for completed status
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString()
      }
      // Add confirmation timestamp for confirmed status
      if (status === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString()
      }
      
      const { error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', appointment.id)
      
      if (error) {
        console.error('[APPOINTMENT-DETAIL] Error updating status:', error.message)
        return
      }
      
      setAppointment({ ...appointment, status: status as any })
      setNewStatus(status)

      // 🔔 Send notification to customer about status change
      if (appointment.customers && appointment.customers.name) {
        const customerName = appointment.customers.name
        const businessName = appointment.business_profiles?.business_name || 'Tu negocio de grooming'
        
        await notifyAppointmentStatusChange(
          appointment.customer_id,
          customerName,
          businessName,
          status,
          appointment.id,
          appointment.appointment_date,
          appointment.start_time
        )

      }
      
    } catch (error: any) {
      console.error('[APPOINTMENT-DETAIL] Exception updating status:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return date.toLocaleTimeString('es-MX', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-8 h-8 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando cita...</p>
        </div>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Cita no encontrada</CardTitle>
            <CardDescription>
              No se pudo cargar la información de la cita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(`/groomer/${businessSlug}/calendar`)}>
              Volver al Calendario
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const StatusIcon = STATUS_ICONS[appointment.status]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/groomer/${businessSlug}/calendar`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Calendario
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Detalle de Cita
                </h1>
                <p className="text-sm text-muted-foreground">
                  {formatDate(appointment.appointment_date)} • {formatTime(appointment.appointment_time)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={STATUS_COLORS[appointment.status]}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {STATUS_LABELS[appointment.status]}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service & Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Información del Servicio
                  <div className="flex gap-2">
                    {appointment.status === 'pending' && (
                      <Button size="sm" onClick={() => handleStatusChange('confirmed')}>
                        Confirmar
                      </Button>
                    )}
                    {appointment.status === 'confirmed' && (
                      <Button size="sm" onClick={() => handleStatusChange('in_progress')}>
                        Iniciar
                      </Button>
                    )}
                    {appointment.status === 'in_progress' && (
                      <Button size="sm" onClick={() => handleStatusChange('completed')}>
                        Completar
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Servicio</p>
                    <p className="text-foreground">{appointment.service_name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Duración</p>
                    <p className="text-foreground flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {appointment.duration} minutos
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Total</p>
                    <p className="text-foreground flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ${appointment.total_amount}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Estado</p>
                    <select
                      value={newStatus}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="text-sm border border-border rounded-md px-3 py-1 bg-background"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmada</option>
                      <option value="in_progress">En Proceso</option>
                      <option value="completed">Completada</option>
                      <option value="cancelled">Cancelada</option>
                      <option value="no_show">No se presentó</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer & Pet Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Cliente y Mascota</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer */}
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Cliente
                    </h4>
                    <div className="space-y-2 pl-6">
                      <p className="text-foreground font-medium">{appointment.customer_name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${appointment.customer_phone}`} className="hover:text-foreground">
                          {appointment.customer_phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${appointment.customer_email}`} className="hover:text-foreground">
                          {appointment.customer_email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Pet */}
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Mascota
                    </h4>
                    <div className="space-y-2 pl-6">
                      <p className="text-foreground font-medium">{appointment.pet_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.pet_breed} • Tamaño {appointment.pet_size}
                      </p>
                    </div>
                  </div>
                </div>

                {appointment.special_instructions && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h4 className="font-medium mb-2">Instrucciones Especiales</h4>
                      <p className="text-sm text-muted-foreground bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                        {appointment.special_instructions}
                      </p>
                    </div>
                  </>
                )}

                {appointment.notes && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h4 className="font-medium mb-2">Notas del Cliente</h4>
                      <p className="text-sm text-muted-foreground">
                        {appointment.notes}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Groomer Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Notas del Groomer
                  </span>
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <Textarea
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      placeholder="Añadir notas sobre el servicio, comportamiento de la mascota, etc..."
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveNotes}>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        setIsEditing(false)
                        setEditedNotes(appointment.groomer_notes)
                      }}>
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="min-h-[80px] flex items-center">
                    {appointment.groomer_notes ? (
                      <p className="text-foreground">{appointment.groomer_notes}</p>
                    ) : (
                      <p className="text-muted-foreground italic">
                        Sin notas aún. Haz clic en editar para añadir notas.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Photo Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Fotos del Servicio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Before Photos */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Fotos Antes</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Subir fotos antes del servicio</p>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Seleccionar
                    </Button>
                  </div>
                </div>

                {/* After Photos */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Fotos Después</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Subir fotos después del servicio</p>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Seleccionar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Llamar Cliente
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Enviar Mensaje
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Reagendar
                </Button>
                <Separator className="my-2" />
                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancelar Cita
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}