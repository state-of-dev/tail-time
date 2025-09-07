// Notification Utilities
// Helper functions for creating and managing notifications

import { supabase } from '@/lib/supabase'

export type NotificationType = 
  | 'appointment_confirmed'
  | 'appointment_cancelled'
  | 'appointment_completed'
  | 'appointment_reminder'
  | 'payment_received'
  | 'service_updated'
  | 'business_message'
  | 'system_message'

export interface NotificationData {
  recipientId: string
  type: NotificationType
  title: string
  message: string
  metadata?: Record<string, any>
}

export async function createNotification(data: NotificationData) {
  try {

    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        recipient_id: data.recipientId,
        type: data.type,
        title: data.title,
        message: data.message,
        metadata: data.metadata || {}
      })
      .select()
      .single()

    if (error) {
      return null
    }

    return notification
  } catch (error) {
    return null
  }
}

// Predefined notification templates
export const NotificationTemplates = {
  appointmentConfirmed: (customerName: string, businessName: string, date: string, time: string) => ({
    type: 'appointment_confirmed' as NotificationType,
    title: 'Cita Confirmada',
    message: `¡Hola ${customerName}! Tu cita en ${businessName} ha sido confirmada para ${date} a las ${time}.`
  }),

  appointmentCancelled: (customerName: string, businessName: string, date: string, time: string) => ({
    type: 'appointment_cancelled' as NotificationType,
    title: 'Cita Cancelada',
    message: `${customerName}, tu cita en ${businessName} programada para ${date} a las ${time} ha sido cancelada.`
  }),

  appointmentCompleted: (customerName: string, businessName: string) => ({
    type: 'appointment_completed' as NotificationType,
    title: 'Cita Completada',
    message: `Tu cita en ${businessName} ha sido completada. ¡Esperamos que hayas disfrutado el servicio!`
  }),

  appointmentReminder: (customerName: string, businessName: string, date: string, time: string) => ({
    type: 'appointment_reminder' as NotificationType,
    title: 'Recordatorio de Cita',
    message: `¡Hola ${customerName}! Recuerda que tienes una cita en ${businessName} mañana ${date} a las ${time}.`
  }),

  paymentReceived: (customerName: string, amount: number, serviceName: string) => ({
    type: 'payment_received' as NotificationType,
    title: 'Pago Recibido',
    message: `Hemos recibido tu pago de $${amount} por ${serviceName}. ¡Gracias ${customerName}!`
  }),

  // For business owners
  newAppointment: (customerName: string, serviceName: string, date: string, time: string) => ({
    type: 'appointment_confirmed' as NotificationType,
    title: 'Nueva Cita Recibida',
    message: `${customerName} agendó una cita para ${serviceName} el ${date} a las ${time}.`
  }),

  appointmentCompletedForBusiness: (customerName: string, serviceName: string) => ({
    type: 'appointment_completed' as NotificationType,
    title: 'Cita Completada',
    message: `La cita con ${customerName} para ${serviceName} ha sido completada exitosamente.`
  })
}

// Helper functions for common notification scenarios
export async function notifyAppointmentConfirmed(
  customerId: string,
  customerName: string,
  businessName: string,
  appointmentDate: string,
  startTime: string,
  appointmentId: string
) {
  const template = NotificationTemplates.appointmentConfirmed(customerName, businessName, appointmentDate, startTime)
  
  return createNotification({
    recipientId: customerId,
    ...template,
    metadata: {
      appointment_id: appointmentId,
      business_name: businessName,
      appointment_date: appointmentDate,
      start_time: startTime
    }
  })
}

export async function notifyBusinessOwner(
  ownerId: string,
  template: ReturnType<typeof NotificationTemplates[keyof typeof NotificationTemplates]>,
  metadata: Record<string, any> = {}
) {
  return createNotification({
    recipientId: ownerId,
    ...template,
    metadata
  })
}

export async function notifyAppointmentStatusChange(
  customerId: string,
  customerName: string,
  businessName: string,
  status: string,
  appointmentId: string,
  appointmentDate?: string,
  startTime?: string
) {
  let template: ReturnType<typeof NotificationTemplates[keyof typeof NotificationTemplates]>
  
  switch (status) {
    case 'confirmed':
      if (!appointmentDate || !startTime) return null
      template = NotificationTemplates.appointmentConfirmed(customerName, businessName, appointmentDate, startTime)
      break
    case 'cancelled':
      if (!appointmentDate || !startTime) return null
      template = NotificationTemplates.appointmentCancelled(customerName, businessName, appointmentDate, startTime)
      break
    case 'completed':
      template = NotificationTemplates.appointmentCompleted(customerName, businessName)
      break
    default:
      return null
  }
  
  return createNotification({
    recipientId: customerId,
    ...template,
    metadata: {
      appointment_id: appointmentId,
      business_name: businessName,
      new_status: status,
      ...(appointmentDate && { appointment_date: appointmentDate }),
      ...(startTime && { start_time: startTime })
    }
  })
}