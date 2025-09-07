import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Bell, 
  X, 
  Check, 
  Clock, 
  Calendar, 
  Heart,
  User,
  Star,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Info,
  MessageCircle,
  Settings
} from 'lucide-react'

export interface Notification {
  id: string
  type: 'appointment' | 'payment' | 'review' | 'system' | 'message'
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high'
  avatar?: string
  actionUrl?: string
  metadata?: {
    appointmentId?: string
    customerId?: string
    amount?: number
    rating?: number
  }
}

const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    type: 'appointment',
    title: 'Nueva cita reservada',
    message: 'María García reservó una cita para Luna el 15 de Enero a las 10:00 AM',
    timestamp: '2024-01-14T15:30:00Z',
    read: false,
    priority: 'high',
    metadata: {
      appointmentId: 'apt_001',
      customerId: 'cust_001'
    }
  },
  {
    id: 'notif_002',
    type: 'payment',
    title: 'Pago recibido',
    message: 'Se recibió un pago de $450 por el servicio de Baño Completo',
    timestamp: '2024-01-14T14:15:00Z',
    read: false,
    priority: 'medium',
    metadata: {
      amount: 450,
      appointmentId: 'apt_001'
    }
  },
  {
    id: 'notif_003',
    type: 'review',
    title: 'Nueva reseña',
    message: 'Ana López dejó una reseña de 5 estrellas para tu servicio',
    timestamp: '2024-01-14T12:00:00Z',
    read: true,
    priority: 'medium',
    metadata: {
      rating: 5,
      customerId: 'cust_002'
    }
  },
  {
    id: 'notif_004',
    type: 'message',
    title: 'Nuevo mensaje',
    message: 'Carlos Mendoza te envió un mensaje sobre la cita de Max',
    timestamp: '2024-01-14T11:30:00Z',
    read: true,
    priority: 'low',
    metadata: {
      customerId: 'cust_003'
    }
  },
  {
    id: 'notif_005',
    type: 'system',
    title: 'Recordatorio de cita',
    message: 'Tienes una cita en 1 hora con Bella - Corte y peinado',
    timestamp: '2024-01-14T09:00:00Z',
    read: true,
    priority: 'high',
    metadata: {
      appointmentId: 'apt_002'
    }
  },
  {
    id: 'notif_006',
    type: 'appointment',
    title: 'Cita cancelada',
    message: 'La cita del 16 de Enero con Rocky fue cancelada por el cliente',
    timestamp: '2024-01-13T16:45:00Z',
    read: true,
    priority: 'medium',
    metadata: {
      appointmentId: 'apt_003'
    }
  }
]

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notifications.filter(n => !n.read).length

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read
    return true
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-4 h-4" />
      case 'payment': return <CreditCard className="w-4 h-4" />
      case 'review': return <Star className="w-4 h-4" />
      case 'message': return <MessageCircle className="w-4 h-4" />
      case 'system': return <Info className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') return 'text-red-500'
    
    switch (type) {
      case 'appointment': return 'text-blue-500'
      case 'payment': return 'text-green-500'
      case 'review': return 'text-yellow-500'
      case 'message': return 'text-purple-500'
      case 'system': return 'text-gray-500'
      default: return 'text-gray-500'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const now = new Date()
    const notifTime = new Date(timestamp)
    const diffInMs = now.getTime() - notifTime.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      return `Hace ${diffInMinutes} min`
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours}h`
    } else if (diffInDays === 1) {
      return 'Ayer'
    } else {
      return `Hace ${diffInDays} días`
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
      <div className="fixed right-4 top-16 w-96 max-h-[80vh] bg-background border border-border rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <h2 className="font-semibold">Notificaciones</h2>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              No leídas ({unreadCount})
            </Button>
          </div>
          
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Marcar todo
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">
                {filter === 'unread' ? 'No hay notificaciones sin leer' : 'No hay notificaciones'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 cursor-pointer ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`${getNotificationColor(notification.type, notification.priority)} mt-1`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                        
                        {notification.priority === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Urgente
                          </Badge>
                        )}
                        
                        {notification.metadata?.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs">{notification.metadata.rating}</span>
                          </div>
                        )}
                        
                        {notification.metadata?.amount && (
                          <span className="text-xs font-medium text-green-600">
                            ${notification.metadata.amount}
                          </span>
                        )}
                      </div>
                      
                      {notification.actionUrl && (
                        <Button variant="outline" size="sm" className="mt-2 h-6 text-xs">
                          Ver detalles
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configurar Notificaciones
          </Button>
        </div>
      </div>
    </div>
  )
}