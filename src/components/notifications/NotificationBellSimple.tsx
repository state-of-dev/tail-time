// Simplified Notification Bell Component (no external dependencies)
// Shows notification count and basic functionality

import React, { useState } from 'react'
import { Bell, CheckCircle, XCircle, Clock, CreditCard, PartyPopper, Mail } from 'lucide-react'
import { useNotificationsZustand } from '@/hooks/useNotificationsZustand'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function NotificationBellSimple() {
  const { notifications, unreadCount, isLoading, isSubscribed, markAsRead, markAllAsRead } = useNotificationsZustand()
  const [showDropdown, setShowDropdown] = useState(false)

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Ahora'
    if (diffInMinutes < 60) return `${diffInMinutes}min`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment_confirmed': 
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'appointment_cancelled': 
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'appointment_reminder': 
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'payment_received': 
        return <CreditCard className="w-4 h-4 text-blue-600" />
      case 'appointment_completed': 
        return <PartyPopper className="w-4 h-4 text-purple-600" />
      default: 
        return <Mail className="w-4 h-4 text-gray-600" />
    }
  }


  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="relative hover:bg-accent"
        disabled={isLoading}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
      
      {/* Simple dropdown without external dependencies */}
      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <span className="font-medium">Notificaciones</span>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs h-6 px-2"
                  >
                    Marcar todas
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDropdown(false)}
                  className="text-xs h-6 px-2"
                >
                  ✕
                </Button>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500 bg-white">
              Cargando notificaciones...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500 bg-white">
              No tienes notificaciones
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto bg-white">
              {notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer bg-white"
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id)
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate flex-1">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {notifications.length > 10 && (
                <div className="p-3 text-center text-sm text-gray-500 bg-white">
                  Y {notifications.length - 10} más...
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Overlay to close dropdown when clicking outside */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}