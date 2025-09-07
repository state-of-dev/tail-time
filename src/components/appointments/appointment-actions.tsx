import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Check, 
  X, 
  Calendar, 
  Clock,
  AlertCircle,
  MessageSquare,
  RefreshCw
} from 'lucide-react'

interface Appointment {
  id: string
  business_id: string
  customer_id: string
  appointment_date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'reschedule_requested' | 'reschedule_pending'
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
}

interface AppointmentActionsProps {
  appointment: Appointment
  onUpdate: () => void
}

export function AppointmentActions({ appointment, onUpdate }: AppointmentActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')
  const [rescheduleReason, setRescheduleReason] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  const handleAccept = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', appointment.id)

      if (error) throw error

      // Send notification to customer
      await sendNotification({
        type: 'appointment_confirmed',
        title: 'Cita Confirmada',
        message: `Tu cita para ${appointment.pet_name} ha sido confirmada`,
        recipient_email: appointment.customer_email,
        appointment_id: appointment.id
      })

      onUpdate()

    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'rejected',
          notes: rejectionReason || appointment.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', appointment.id)

      if (error) throw error

      // Send notification to customer
      await sendNotification({
        type: 'appointment_rejected',
        title: 'Cita Rechazada',
        message: `Lo sentimos, tu cita para ${appointment.pet_name} ha sido rechazada. ${rejectionReason ? 'Motivo: ' + rejectionReason : ''}`,
        recipient_email: appointment.customer_email,
        appointment_id: appointment.id
      })

      onUpdate()

    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const handleReschedule = async () => {
    if (!rescheduleDate || !rescheduleTime) {
      alert('Por favor selecciona fecha y hora para reagendar')
      return
    }

    if (appointment.reschedule_count >= 1) {
      alert('Esta cita ya fue reagendada una vez. Solo se permite un reagendado por cita.')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'reschedule_pending',
          reschedule_proposed_date: rescheduleDate,
          reschedule_proposed_time: rescheduleTime,
          reschedule_reason: rescheduleReason,
          reschedule_count: appointment.reschedule_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', appointment.id)

      if (error) throw error

      // Send notification to customer
      await sendNotification({
        type: 'reschedule_proposed',
        title: 'Reagendado Propuesto',
        message: `Te proponemos reagendar tu cita para ${appointment.pet_name} al ${new Date(rescheduleDate).toLocaleDateString('es-MX')} a las ${rescheduleTime}`,
        recipient_email: appointment.customer_email,
        appointment_id: appointment.id
      })

      onUpdate()

    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const sendNotification = async (notification: {
    type: string
    title: string
    message: string
    recipient_email: string
    appointment_id: string
  }) => {
    try {
      await supabase
        .from('notifications')
        .insert({
          business_id: appointment.business_id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: {
            ...notification,
            appointment_date: appointment.appointment_date,
            start_time: appointment.start_time,
            service_name: appointment.service_name,
            pet_name: appointment.pet_name
          },
          read: false,
          created_at: new Date().toISOString()
        })
    } catch (error) {
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Confirmada</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rechazada</Badge>
      case 'reschedule_pending':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Reagendado Pendiente</Badge>
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Cancelada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-MX', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {appointment.service_name}
            </CardTitle>
            <CardDescription>
              {appointment.customer_name} • {appointment.pet_name} ({appointment.pet_breed})
            </CardDescription>
          </div>
          {getStatusBadge(appointment.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Appointment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground">FECHA Y HORA</Label>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{formatDate(appointment.appointment_date)}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{formatTime(appointment.start_time)}</span>
            </div>
          </div>
          
          <div>
            <Label className="text-xs text-muted-foreground">DETALLES</Label>
            <p className="text-sm">${appointment.total_amount} • {appointment.duration} min</p>
            <p className="text-sm text-muted-foreground">{appointment.customer_phone}</p>
          </div>
        </div>

        {appointment.notes && (
          <div>
            <Label className="text-xs text-muted-foreground">NOTAS</Label>
            <p className="text-sm mt-1">{appointment.notes}</p>
          </div>
        )}

        {/* Proposed Reschedule Info */}
        {appointment.status === 'reschedule_pending' && appointment.reschedule_proposed_date && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <Label className="text-xs text-blue-800">REAGENDADO PROPUESTO</Label>
            <p className="text-sm text-blue-700">
              Nueva fecha: {formatDate(appointment.reschedule_proposed_date)} a las {formatTime(appointment.reschedule_proposed_time!)}
            </p>
            {appointment.reschedule_reason && (
              <p className="text-xs text-blue-600 mt-1">Motivo: {appointment.reschedule_reason}</p>
            )}
            <p className="text-xs text-blue-600 mt-1">Esperando respuesta del cliente...</p>
          </div>
        )}

        {/* Actions */}
        {appointment.status === 'pending' && (
          <div className="flex flex-wrap gap-2 pt-2">
            <Button 
              size="sm" 
              onClick={handleAccept}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              Aceptar
            </Button>

            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => {
                const reason = prompt('Motivo del rechazo (opcional):')
                if (reason !== null) { // null means cancelled, empty string is valid
                  setRejectionReason(reason)
                  handleReject()
                }
              }}
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
              Rechazar
            </Button>

            {appointment.reschedule_count < 1 && (
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={() => {
                  const newDate = prompt('Nueva fecha (YYYY-MM-DD):')
                  if (!newDate) return
                  
                  const newTime = prompt('Nueva hora (HH:MM):')
                  if (!newTime) return
                  
                  const reason = prompt('Motivo del cambio (opcional):') || ''
                  
                  setRescheduleDate(newDate)
                  setRescheduleTime(newTime)
                  setRescheduleReason(reason)
                  handleReschedule()
                }}
                disabled={isLoading}
              >
                <RefreshCw className="w-4 h-4" />
                Reagendar
              </Button>
            )}
          </div>
        )}

        {appointment.reschedule_count >= 1 && appointment.status === 'pending' && (
          <div className="bg-amber-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-amber-800">
                Esta cita ya fue reagendada una vez. Solo puedes aceptar o rechazar.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}