import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { 
  Check, 
  X, 
  Calendar, 
  Clock,
  AlertTriangle,
  ArrowRight
} from 'lucide-react'

interface RescheduleAppointment {
  id: string
  business_id: string
  appointment_date: string
  start_time: string
  status: string
  service_name: string
  duration: number
  total_amount: number
  pet_name: string
  pet_breed: string
  original_date: string
  original_time: string
  reschedule_proposed_date: string
  reschedule_proposed_time: string
  reschedule_reason?: string
  business_name?: string
}

interface CustomerRescheduleResponseProps {
  appointment: RescheduleAppointment
  onUpdate: () => void
}

export function CustomerRescheduleResponse({ appointment, onUpdate }: CustomerRescheduleResponseProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAcceptReschedule = async () => {
    setIsLoading(true)
    try {
      // Update appointment with new date/time and confirm
      const { error } = await supabase
        .from('appointments')
        .update({ 
          appointment_date: appointment.reschedule_proposed_date,
          start_time: appointment.reschedule_proposed_time,
          end_time: calculateEndTime(appointment.reschedule_proposed_time, appointment.duration),
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', appointment.id)

      if (error) throw error

      // Send notification to business
      await sendNotification({
        type: 'reschedule_accepted',
        title: 'Reagendado Aceptado',
        message: `${appointment.pet_name} aceptó el reagendado para ${new Date(appointment.reschedule_proposed_date).toLocaleDateString('es-MX')}`,
        appointment_id: appointment.id
      })

      onUpdate()

    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectReschedule = async () => {
    setIsLoading(true)
    try {
      // Cancel appointment (no more reschedule opportunities)
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'cancelled',
          notes: `Cliente rechazó reagendado propuesto. ${(appointment as any).notes || ''}`.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', appointment.id)

      if (error) throw error

      // Send notification to business
      await sendNotification({
        type: 'reschedule_rejected',
        title: 'Reagendado Rechazado',
        message: `${appointment.pet_name} rechazó el reagendado. La cita ha sido cancelada.`,
        appointment_id: appointment.id
      })

      onUpdate()

    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const startDateTime = new Date()
    startDateTime.setHours(hours, minutes, 0, 0)
    
    const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000)
    return `${endDateTime.getHours().toString().padStart(2, '0')}:${endDateTime.getMinutes().toString().padStart(2, '0')}`
  }

  const sendNotification = async (notification: {
    type: string
    title: string
    message: string
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
            service_name: appointment.service_name,
            pet_name: appointment.pet_name,
            new_date: appointment.reschedule_proposed_date,
            new_time: appointment.reschedule_proposed_time
          },
          read: false,
          created_at: new Date().toISOString()
        })
    } catch (error) {
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
    <Card className="w-full border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <div>
            <CardTitle className="text-blue-800">Reagendado Propuesto</CardTitle>
            <CardDescription className="text-blue-600">
              {appointment.business_name} propone una nueva fecha para tu cita
            </CardDescription>
          </div>
          <Badge className="bg-blue-100 text-blue-800 ml-auto">Acción Requerida</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Service Info */}
        <div className="bg-white p-3 rounded-lg">
          <h3 className="font-semibold">{appointment.service_name}</h3>
          <p className="text-sm text-muted-foreground">
            Para {appointment.pet_name} ({appointment.pet_breed}) • ${appointment.total_amount} • {appointment.duration} min
          </p>
        </div>

        {/* Date Comparison */}
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg">
            <div>
              <Label className="text-xs text-red-800">FECHA ORIGINAL (CANCELADA)</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-700">{formatDate(appointment.original_date)}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-700">{formatTime(appointment.original_time)}</span>
              </div>
            </div>
            <X className="w-5 h-5 text-red-500" />
          </div>

          <ArrowRight className="w-5 h-5 text-muted-foreground mx-auto" />

          <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
            <div>
              <Label className="text-xs text-green-800">NUEVA FECHA PROPUESTA</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-700">{formatDate(appointment.reschedule_proposed_date)}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-700">{formatTime(appointment.reschedule_proposed_time)}</span>
              </div>
            </div>
            <Check className="w-5 h-5 text-green-500" />
          </div>
        </div>

        {appointment.reschedule_reason && (
          <div className="bg-white p-3 rounded-lg">
            <Label className="text-xs text-muted-foreground">MOTIVO DEL CAMBIO</Label>
            <p className="text-sm mt-1">{appointment.reschedule_reason}</p>
          </div>
        )}

        {/* Warning */}
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-amber-800 font-medium">¡Importante!</span>
          </div>
          <p className="text-sm text-amber-700 mt-1">
            Esta es tu única oportunidad de reagendado. Si rechazas esta propuesta, la cita será cancelada automáticamente.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button 
            className="flex-1"
            onClick={handleAcceptReschedule}
            disabled={isLoading}
          >
            <Check className="w-4 h-4 mr-2" />
            {isLoading ? 'Procesando...' : 'Aceptar Nueva Fecha'}
          </Button>

          <Button 
            variant="destructive" 
            className="flex-1"
            onClick={() => {
              if (confirm('¿Estás seguro? Si rechazas esta propuesta, la cita será cancelada automáticamente y no habrá más oportunidades de reagendado.')) {
                handleRejectReschedule()
              }
            }}
            disabled={isLoading}
          >
            <X className="w-4 h-4 mr-2" />
            {isLoading ? 'Procesando...' : 'Rechazar y Cancelar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}