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

      {/* Notifications Dropdown - Neobrutalism Style */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-chart-2 brutal-border-thick brutal-shadow-xl rounded-base z-50 max-h-96 overflow-hidden">
          {/* Header - Neobrutalism Style */}
          <div className="flex items-center justify-between p-4 border-b-4 border-chart-4">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-main-foreground uppercase">NOTIFICACIONES</h3>
              {unreadCount > 0 && (
                <Badge className="bg-chart-8 text-main-foreground brutal-border font-black text-xs uppercase">
                  {unreadCount} NUEVAS
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsOpen(false)
                    }}
                    className="bg-chart-1 text-main-foreground brutal-border font-black text-xs h-8 px-2 uppercase hover:brutal-hover"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    MARCAR TODAS
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsOpen(false)
                    }}
                    className="bg-chart-2 text-main-foreground brutal-border font-black text-xs h-8 px-2 uppercase hover:brutal-hover"
                  >
                    <X className="w-3 h-3 mr-1" />
                    LIMPIAR
                  </Button>
                </>
              )}
              <Button
                size="sm"
                onClick={() => setIsOpen(false)}
                className="bg-chart-8 text-main-foreground brutal-border font-black h-8 w-8 p-0 hover:brutal-hover"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 mx-auto mb-3 text-main-foreground/50" />
                <p className="text-sm font-black text-main-foreground uppercase">NO HAY NOTIFICACIONES</p>
                <p className="text-xs mt-1 font-bold text-main-foreground/80 uppercase">
                  LAS NOTIFICACIONES APARECERÁN AQUÍ AUTOMÁTICAMENTE
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-chart-1/20 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-chart-8/20' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-black text-main-foreground line-clamp-1 uppercase">
                            {notification.title?.toUpperCase()}
                          </h4>
                          <div className="flex items-center gap-2 ml-2">
                            <span className="text-xs text-main-foreground/80 font-bold">
                              {formatTime(notification.created_at)}
                            </span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-chart-8 rounded-full" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-main-foreground/80 font-bold mt-1 line-clamp-2 uppercase">
                          {notification.message?.toUpperCase()}
                        </p>
                        
                        {/* Additional data for appointment notifications */}
                        {notification.data?.appointment_date && (
                          <div className="flex items-center gap-4 mt-2 text-xs text-main-foreground/80 font-bold">
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

          {/* Footer - Neobrutalism Style */}
          <div className="p-3 border-t-4 border-chart-4 bg-chart-3">
            <div className="flex items-center justify-between text-xs text-main-foreground font-bold uppercase">
              <span>
                {isConnected ? '🟢 CONECTADO' : '🔴 DESCONECTADO'} - TIEMPO REAL
              </span>
              <span>
                {notifications.length} TOTAL
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