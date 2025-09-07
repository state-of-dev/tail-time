import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context-simple'
// import { toast } from 'sonner'
import { 
  Bell, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  RefreshCw
} from 'lucide-react'

interface Notification {
  id: string
  business_id: string
  type: string
  title: string
  message: string
  data: any
  read: boolean
  created_at: string
  timestamp?: string
  priority?: 'low' | 'medium' | 'high'
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  deleteNotification: (notificationId: string) => void
  clearAll: () => void
  isConnected: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export default function NotificationProvider({ children }: NotificationProviderProps) {
  const { user, businessProfile } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isConnected, setIsConnected] = useState(false)

  // Real-time notifications with Supabase
  useEffect(() => {
    if (!user || !businessProfile) return

    // Load existing notifications
    loadNotifications()

    // Set up real-time subscription for new notifications
    const channel = supabase
      .channel(`notifications:${businessProfile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `business_id=eq.${businessProfile.id}`
        },
        (payload) => {

          const newNotification = payload.new as Notification
          
          // Add to notifications list
          setNotifications(prev => [newNotification, ...prev])
          
          // Show toast notification
          showToastNotification(newNotification)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments',
          filter: `business_id=eq.${businessProfile.id}`
        },
        (payload) => {

          const appointment = payload.new as any
          
          // Create notification for appointment status changes
          if (payload.old && payload.old.status !== appointment.status) {
            const statusNotification: Notification = {
              id: `apt-${appointment.id}-${Date.now()}`,
              business_id: businessProfile.id,
              type: 'appointment_status_change',
              title: getAppointmentStatusTitle(appointment.status),
              message: `Cita de ${appointment.customer_name} para ${appointment.pet_name} ${getAppointmentStatusMessage(appointment.status)}`,
              data: { appointment },
              read: false,
              created_at: new Date().toISOString(),
              priority: 'high'
            }
            
            setNotifications(prev => [statusNotification, ...prev])
            showToastNotification(statusNotification)
          }
        }
      )
      .subscribe((status) => {

        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {

      channel.unsubscribe()
      setIsConnected(false)
    }
  }, [user, businessProfile])

  const loadNotifications = async () => {
    if (!businessProfile) return

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('business_id', businessProfile.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      setNotifications(data || [])
    } catch (error) {
      console.error('[NOTIFICATIONS] Error loading notifications:', error)
    }
  }

  const showToastNotification = (notification: Notification) => {

    // Simple browser notification for now
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      })
    }
    
    // Show alert for immediate testing
    if (notification.type === 'new_appointment') {
      setTimeout(() => {
        alert(`🔔 ${notification.title}\n\n${notification.message}`)
      }, 1000)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_appointment':
        return <Calendar className="w-4 h-4" />
      case 'appointment_confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'appointment_rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'reschedule_proposed':
      case 'reschedule_accepted':
      case 'reschedule_rejected':
        return <RefreshCw className="w-4 h-4 text-blue-500" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getAppointmentStatusTitle = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Cita Confirmada'
      case 'rejected': return 'Cita Rechazada'
      case 'cancelled': return 'Cita Cancelada'
      case 'reschedule_pending': return 'Reagendado Propuesto'
      case 'completed': return 'Cita Completada'
      default: return 'Actualización de Cita'
    }
  }

  const getAppointmentStatusMessage = (status: string) => {
    switch (status) {
      case 'confirmed': return 'ha sido confirmada'
      case 'rejected': return 'ha sido rechazada'
      case 'cancelled': return 'ha sido cancelada'
      case 'reschedule_pending': return 'tiene reagendado pendiente'
      case 'completed': return 'ha sido completada'
      default: return 'ha sido actualizada'
    }
  }

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    }

    setNotifications(prev => [newNotification, ...prev])

    // Opcional: Mostrar notificación del navegador
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/favicon.ico',
        tag: newNotification.id
      })
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) throw error

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
    } catch (error) {
      console.error('[NOTIFICATIONS] Error marking as read:', error)
    }
  }

  const markAllAsRead = async () => {
    if (!businessProfile) return

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('business_id', businessProfile.id)
        .eq('read', false)

      if (error) throw error

      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      )
    } catch (error) {
      console.error('[NOTIFICATIONS] Error marking all as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error

      setNotifications(prev => 
        prev.filter(n => n.id !== notificationId)
      )
    } catch (error) {
      console.error('[NOTIFICATIONS] Error deleting notification:', error)
    }
  }

  const clearAll = async () => {
    if (!businessProfile) return

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('business_id', businessProfile.id)

      if (error) throw error

      setNotifications([])
    } catch (error) {
      console.error('[NOTIFICATIONS] Error clearing notifications:', error)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  // Solicitar permiso para notificaciones del navegador
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    isConnected
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}