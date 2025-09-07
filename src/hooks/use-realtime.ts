import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useNotifications } from '@/components/notifications/notification-provider'

export interface RealtimeEvent {
  table: string
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  record: any
  old_record?: any
}

interface UseRealtimeOptions {
  table?: string
  filter?: string
  enabled?: boolean
}

export function useRealtime(options: UseRealtimeOptions = {}) {
  const { table, filter, enabled = true } = options
  const { addNotification } = useNotifications()
  const [isConnected, setIsConnected] = useState(false)
  const [events, setEvents] = useState<RealtimeEvent[]>([])
  const channelRef = useRef<any>(null)

  useEffect(() => {
    if (!enabled || !table) {
      return
    }


    // Crear canal de Supabase Realtime
    const channelName = `realtime-${table}-${Date.now()}`
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: filter
        },
        (payload) => {
          
          const event: RealtimeEvent = {
            table: table,
            type: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
            record: payload.new,
            old_record: payload.old
          }

          setEvents(prev => {
            const newEvents = [event, ...prev.slice(0, 99)]
            return newEvents
          })

          // Generar notificaciones basadas en el evento
          handleRealtimeEvent(event)
        }
      )
      .subscribe((status) => {
        const connected = status === 'SUBSCRIBED'
        setIsConnected(connected)
        
        if (connected) {
        } else if (status === 'CHANNEL_ERROR') {
        } else if (status === 'TIMED_OUT') {
        } else if (status === 'CLOSED') {
        }
      })

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [table, filter, enabled])

  const handleRealtimeEvent = (event: RealtimeEvent) => {
    // Generar notificaciones según el tipo de evento
    switch (event.table) {
      case 'appointments':
        handleAppointmentEvent(event)
        break
      case 'payments':
        handlePaymentEvent(event)
        break
      case 'reviews':
        handleReviewEvent(event)
        break
      case 'messages':
        handleMessageEvent(event)
        break
      default:
        break
    }
  }

  const handleAppointmentEvent = (event: RealtimeEvent) => {
    switch (event.type) {
      case 'INSERT':
        addNotification({
          type: 'appointment',
          title: 'Nueva cita reservada',
          message: `Se reservó una nueva cita para ${event.record.pet_name || 'una mascota'}`,
          read: false,
          priority: 'high',
          metadata: {
            appointmentId: event.record.id
          }
        })
        break

      case 'UPDATE':
        if (event.record.status !== event.old_record?.status) {
          const statusMessages = {
            confirmed: 'Cita confirmada',
            cancelled: 'Cita cancelada',
            completed: 'Cita completada',
            in_progress: 'Cita en proceso'
          }

          addNotification({
            type: 'appointment',
            title: 'Cambio en cita',
            message: `${statusMessages[event.record.status as keyof typeof statusMessages] || 'Estado actualizado'} para ${event.record.pet_name || 'mascota'}`,
            read: false,
            priority: event.record.status === 'cancelled' ? 'high' : 'medium',
            metadata: {
              appointmentId: event.record.id
            }
          })
        }
        break

      case 'DELETE':
        addNotification({
          type: 'appointment',
          title: 'Cita eliminada',
          message: 'Una cita fue eliminada del sistema',
          read: false,
          priority: 'medium'
        })
        break
    }
  }

  const handlePaymentEvent = (event: RealtimeEvent) => {
    switch (event.type) {
      case 'INSERT':
        addNotification({
          type: 'payment',
          title: 'Pago recibido',
          message: `Se recibió un pago de $${event.record.amount}`,
          read: false,
          priority: 'medium',
          metadata: {
            amount: event.record.amount,
            appointmentId: event.record.appointment_id
          }
        })
        break

      case 'UPDATE':
        if (event.record.status === 'failed' && event.old_record?.status !== 'failed') {
          addNotification({
            type: 'payment',
            title: 'Pago falló',
            message: `El pago de $${event.record.amount} no pudo ser procesado`,
            read: false,
            priority: 'high',
            metadata: {
              amount: event.record.amount,
              appointmentId: event.record.appointment_id
            }
          })
        }
        break
    }
  }

  const handleReviewEvent = (event: RealtimeEvent) => {
    if (event.type === 'INSERT') {
      addNotification({
        type: 'review',
        title: 'Nueva reseña',
        message: `Recibiste una reseña de ${event.record.rating} estrella${event.record.rating !== 1 ? 's' : ''}`,
        read: false,
        priority: 'medium',
        metadata: {
          rating: event.record.rating,
          customerId: event.record.customer_id
        }
      })
    }
  }

  const handleMessageEvent = (event: RealtimeEvent) => {
    if (event.type === 'INSERT') {
      addNotification({
        type: 'message',
        title: 'Nuevo mensaje',
        message: event.record.message?.substring(0, 100) + (event.record.message?.length > 100 ? '...' : ''),
        read: false,
        priority: 'low',
        metadata: {
          customerId: event.record.sender_id
        }
      })
    }
  }

  return {
    isConnected,
    events,
    clearEvents: () => setEvents([])
  }
}

// Hook específico para citas
export function useAppointmentRealtime(businessId?: string) {
  const filter = businessId ? `business_id=eq.${businessId}` : undefined
  
  return useRealtime({
    table: 'appointments',
    filter,
    enabled: !!businessId
  })
}

// Hook específico para pagos
export function usePaymentRealtime(businessId?: string) {
  const filter = businessId ? `business_id=eq.${businessId}` : undefined
  
  return useRealtime({
    table: 'payments',
    filter,
    enabled: !!businessId
  })
}

// Hook específico para mensajes
export function useMessageRealtime(businessId?: string) {
  const filter = businessId ? `receiver_id=eq.${businessId}` : undefined
  
  return useRealtime({
    table: 'messages',
    filter,
    enabled: !!businessId
  })
}

// Hook para múltiples tablas
export function useMultiTableRealtime(businessId?: string) {
  const appointmentRealtime = useAppointmentRealtime(businessId)
  const paymentRealtime = usePaymentRealtime(businessId)
  const messageRealtime = useMessageRealtime(businessId)

  return {
    isConnected: appointmentRealtime.isConnected || paymentRealtime.isConnected || messageRealtime.isConnected,
    appointmentEvents: appointmentRealtime.events,
    paymentEvents: paymentRealtime.events,
    messageEvents: messageRealtime.events,
    clearAllEvents: () => {
      appointmentRealtime.clearEvents()
      paymentRealtime.clearEvents()
      messageRealtime.clearEvents()
    }
  }
}