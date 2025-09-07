import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context-simple'
import { useNotifications } from './notification-provider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  BellDot,
  X,
  Check,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react'

export function NotificationBell() {
  const { user, businessProfile, profile } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  
  // Debug: Always show the bell for testing
  
  // Temporarily always show the bell to debug visibility
  // if (!user || !profile) {
  //   return null
  // }

  // For groomers with business profile, use real notifications
  // For customers, show empty state
  const hasFullNotifications = profile?.role === 'groomer' && businessProfile
  
  let notifications: any[] = []
  let unreadCount = 0
  let isConnected = true
  
  // Temporarily disabled for debugging
  // if (hasFullNotifications) {
  //   try {
  //     const notificationData = useNotifications()
  //     notifications = notificationData.notifications || []
  //     unreadCount = notificationData.unreadCount || 0
  //     isConnected = notificationData.isConnected || true
  //   } catch (error) {
  //   }
  // }
  
  const markAsRead = (id: string) => {
  }
  
  const markAllAsRead = () => {
  }
  
  const clearAll = () => {
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_appointment':
        return <Calendar className="w-4 h-4 text-blue-500" />
      case 'appointment_confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'appointment_rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'reschedule_proposed':
      case 'reschedule_accepted':
      case 'reschedule_rejected':
        return <RefreshCw className="w-4 h-4 text-orange-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const formatTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now.getTime() - time.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    return `${diffDays}d`
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        {unreadCount > 0 ? (
          <BellDot className="w-5 h-5" />
        ) : (
          <Bell className="w-5 h-5" />
        )}
        
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
        
        {/* Connection indicator */}
        <div className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-gray-400'
        }`} />
      </Button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">Notificaciones</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} nuevas
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsOpen(false)
                    }}
                    className="text-xs h-8 px-2"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Marcar todas
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsOpen(false)
                    }}
                    className="text-xs h-8 px-2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Limpiar
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No hay notificaciones</p>
                <p className="text-xs mt-1">
                  Las notificaciones aparecerán aquí automáticamente
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-foreground line-clamp-1">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2 ml-2">
                            <span className="text-xs text-muted-foreground">
                              {formatTime(notification.created_at)}
                            </span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        {/* Additional data for appointment notifications */}
                        {notification.data?.appointment_date && (
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(notification.data.appointment_date).toLocaleDateString('es-MX')}
                            </span>
                            {notification.data.start_time && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {notification.data.start_time}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {isConnected ? '🟢 Conectado' : '🔴 Desconectado'} - Tiempo real
              </span>
              <span>
                {notifications.length} total
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}