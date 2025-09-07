// Zustand Store for Real-time Notifications
// Provides reactive state management for notifications across components

import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export interface Notification {
  id: string
  recipient_id: string
  business_id: string | null
  type: string
  title: string
  message: string
  read: boolean
  metadata: Record<string, any>
  created_at: string
}

interface NotificationStore {
  // State
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  isSubscribed: boolean
  currentUserId: string | null
  
  // Actions
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  updateNotification: (notificationId: string, updates: Partial<Notification>) => void
  setLoading: (loading: boolean) => void
  setSubscribed: (subscribed: boolean) => void
  setCurrentUser: (userId: string | null) => void
  
  // Computed
  getUnreadCount: () => number
  
  // Methods
  loadNotifications: (userId: string, recipientId: string) => Promise<void>
  setupRealTimeSubscription: (recipientId: string) => void
  cleanup: () => void
}

let subscription: any = null

export const useNotificationStore = create<NotificationStore>((set, get) => ({
    // Initial state
    notifications: [],
    unreadCount: 0,
    isLoading: true,
    isSubscribed: false,
    currentUserId: null,

    // Actions
    setNotifications: (notifications) => {
      const unreadCount = notifications.filter(n => !n.read).length
      set({ 
        notifications, 
        unreadCount,
        isLoading: false 
      })
    },

    addNotification: (notification) => {

      const { notifications } = get()
      const updatedNotifications = [notification, ...notifications]
      const unreadCount = updatedNotifications.filter(n => !n.read).length

      set({ 
        notifications: updatedNotifications, 
        unreadCount 
      })

      // Show browser notification if permission granted
      if (Notification.permission === 'granted' && !notification.read) {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.id
        })
      }
    },

    markAsRead: async (notificationId) => {
      const { notifications } = get()
      
      // Optimistic update
      const updatedNotifications = notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
      const unreadCount = updatedNotifications.filter(n => !n.read).length
      
      set({ 
        notifications: updatedNotifications, 
        unreadCount 
      })
      
      // Update in database
      try {
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', notificationId)

        if (error) {
          // Revert optimistic update on error
          set({ notifications })
        } else {

        }
      } catch (error) {
        set({ notifications })
      }
    },

    markAllAsRead: async () => {
      const { notifications, currentUserId } = get()
      
      if (!currentUserId) return
      
      // Optimistic update
      const updatedNotifications = notifications.map(n => ({ ...n, read: true }))
      set({ 
        notifications: updatedNotifications, 
        unreadCount: 0 
      })
      
      // Update in database
      try {
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('recipient_id', currentUserId)
          .eq('read', false)

        if (error) {
          set({ notifications })
        } else {

        }
      } catch (error) {
        set({ notifications })
      }
    },

    updateNotification: (notificationId, updates) => {
      const { notifications } = get()
      const updatedNotifications = notifications.map(n => 
        n.id === notificationId ? { ...n, ...updates } : n
      )
      const unreadCount = updatedNotifications.filter(n => !n.read).length
      
      set({ 
        notifications: updatedNotifications, 
        unreadCount 
      })
    },

    setLoading: (loading) => set({ isLoading: loading }),
    setSubscribed: (subscribed) => set({ isSubscribed: subscribed }),
    setCurrentUser: (userId) => set({ currentUserId: userId }),

    // Computed
    getUnreadCount: () => {
      const { notifications } = get()
      return notifications.filter(n => !n.read).length
    },

    // Methods
    loadNotifications: async (userId, recipientId) => {
      try {
        set({ isLoading: true })

        const { data: notificationsData, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('recipient_id', recipientId)
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) {
        } else {

          get().setNotifications(notificationsData)
        }
      } catch (error) {
      } finally {
        set({ isLoading: false })
      }
    },

    setupRealTimeSubscription: (recipientId) => {
      // Clean up existing subscription
      if (subscription) {
        subscription.unsubscribe()

      }

      subscription = supabase
        .channel(`notifications-store-${recipientId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${recipientId}`
        }, (payload) => {

          if (payload.eventType === 'INSERT') {
            const newNotification = payload.new as Notification

            get().addNotification(newNotification)
          }
          
          if (payload.eventType === 'UPDATE') {
            const updatedNotification = payload.new as Notification

            get().updateNotification(updatedNotification.id, updatedNotification)
          }
        })
        .subscribe((status) => {

          set({ isSubscribed: status === 'SUBSCRIBED' })
        })
    },

    cleanup: () => {
      if (subscription) {
        subscription.unsubscribe()
        subscription = null

      }
      set({ isSubscribed: false })
    }
  }))

// Browser notification permission helper
export const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission()

    return permission
  }
  return Notification.permission
}