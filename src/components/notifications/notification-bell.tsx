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
  RefreshCw,
  Star,
  Sparkles,
  Crown,
  Heart,
  Zap
} from 'lucide-react'
import {
  Star1, Star6, Star7, Star8, Star9, Star10, Star13, Star19, Star20, Star21, Star22, Star23, Star24, Star25, Star26, Star27, Star28,
  StarSizes
} from '@/components/ui/neobrutalism-stars'

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
      {/* Bell Button - Enhanced Neobrutalism */}
      <div className="relative">
        <Button
          size="sm"
          className="relative bg-chart-8 hover:bg-chart-6 text-main-foreground brutal-border brutal-shadow hover:brutal-hover font-black p-3"
          onClick={() => setIsOpen(!isOpen)}
        >
          {unreadCount > 0 ? (
            <BellDot className="w-5 h-5 icon-float" />
          ) : (
            <Bell className="w-5 h-5 icon-float" />
          )}

          {/* Floating star decoration */}
          <Star8 size={StarSizes.sm} className="absolute -top-1 -left-1 star-decoration" />
        </Button>

        {unreadCount > 0 && (
          <Badge
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-chart-2 text-main-foreground brutal-border font-black text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}

        {/* Enhanced connection indicator */}
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full brutal-border ${
          isConnected ? 'bg-chart-1' : 'bg-chart-7'
        }`} />
      </div>

      {/* Notifications Dropdown - Neobrutalism Style */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-chart-2 brutal-border-thick brutal-shadow-xl rounded-base z-50 max-h-96 overflow-hidden">
          {/* Header - Enhanced Neobrutalism Style */}
          <div className="flex items-center justify-between p-4 border-b-4 border-chart-4 bg-chart-1 relative overflow-hidden">
            {/* Floating stars in header */}
            <Star24 size={StarSizes.sm} className="absolute top-1 left-2 star-decoration" />
            <Star25 size={StarSizes.sm} className="absolute bottom-1 right-2 star-decoration" />

            <div className="flex items-center gap-3 relative z-10">
              <div className="p-2 bg-chart-8 brutal-border-thick rounded-base">
                <Bell className="w-5 h-5 text-main-foreground icon-float" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-main-foreground uppercase text-lg">NOTIFICACIONES</h3>
                <Star26 size={StarSizes.sm} className="star-decoration" />
              </div>
              {unreadCount > 0 && (
                <Badge className="bg-chart-8 text-main-foreground brutal-border-thick brutal-shadow font-black text-xs uppercase px-3 py-1">
                  <Sparkles className="w-3 h-3 mr-1 icon-float" />
                  {unreadCount} NUEVAS
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 relative z-10">
              {notifications.length > 0 && (
                <>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsOpen(false)
                    }}
                    className="bg-chart-4 text-main-foreground brutal-border-thick brutal-shadow font-black text-xs h-8 px-3 uppercase hover:brutal-hover transform hover:scale-105 transition-all duration-200"
                  >
                    <Check className="w-3 h-3 mr-1 icon-float" />
                    MARCAR
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsOpen(false)
                    }}
                    className="bg-chart-6 text-main-foreground brutal-border-thick brutal-shadow font-black text-xs h-8 px-3 uppercase hover:brutal-hover transform hover:scale-105 transition-all duration-200"
                  >
                    <X className="w-3 h-3 mr-1 icon-float" />
                    LIMPIAR
                  </Button>
                </>
              )}
              <Button
                size="sm"
                onClick={() => setIsOpen(false)}
                className="bg-chart-8 text-main-foreground brutal-border-thick brutal-shadow-lg font-black h-8 w-8 p-0 hover:brutal-hover transform hover:scale-110 transition-all duration-200"
              >
                <X className="w-4 h-4 icon-float" />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center relative">
                {/* Floating stars background */}
                <Star19 size={StarSizes.sm} className="absolute top-4 left-4 star-decoration" />
                <Star20 size={StarSizes.sm} className="absolute top-6 right-6 star-decoration" />
                <Star21 size={StarSizes.sm} className="absolute bottom-4 left-6 star-decoration" />

                <div className="p-6 bg-chart-8 brutal-border-thick brutal-shadow-lg rounded-base inline-block mb-6 relative">
                  <Bell className="w-8 h-8 text-main-foreground icon-float" />
                  <Star22 size={StarSizes.xs} className="absolute -top-1 -right-1 star-decoration" />
                  <Sparkles className="absolute -bottom-1 -left-1 w-4 h-4 text-main-foreground icon-float" />
                </div>

                <h3 className="text-lg font-black text-main-foreground uppercase mb-2">
                  <Crown className="inline-block w-5 h-5 mr-2 icon-float" />
                  NO HAY NOTIFICACIONES
                  <Heart className="inline-block w-5 h-5 ml-2 icon-float" />
                </h3>

                <p className="text-sm font-bold text-main-foreground/80 uppercase mb-4">
                  LAS NOTIFICACIONES APARECERÁN AQUÍ AUTOMÁTICAMENTE
                </p>

                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4 text-main-foreground icon-float" />
                  <span className="text-xs font-bold text-main-foreground/60 uppercase">TIEMPO REAL</span>
                  <Star23 size={StarSizes.xs} className="star-decoration" />
                </div>
              </div>
            ) : (
              <div className="divide-y-4 divide-chart-4">
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-chart-7 transition-all duration-200 cursor-pointer relative overflow-hidden ${
                      !notification.read ? 'bg-chart-8/30 brutal-border-l-4 border-chart-1' : 'hover:brutal-shadow-lg'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    {/* Floating star decoration for each notification */}
                    <Star27 size={StarSizes.xs} className="absolute top-1 right-1 star-decoration" />

                    <div className="flex items-start gap-4 relative z-10">
                      <div className="flex-shrink-0 mt-1 p-2 bg-chart-6 brutal-border rounded-base">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-main-foreground line-clamp-1 uppercase">
                              {notification.title?.toUpperCase()}
                            </h4>
                            <Star28 size={StarSizes.xs} className="star-decoration" />
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            <div className="bg-chart-3 brutal-border px-2 py-1 rounded-base">
                              <span className="text-xs text-main-foreground font-black uppercase">
                                {formatTime(notification.created_at)}
                              </span>
                            </div>
                            {!notification.read && (
                              <div className="w-3 h-3 bg-chart-1 brutal-border rounded-full pulse-animation" />
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