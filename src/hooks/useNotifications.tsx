// Real-time Notifications Hook
// Manages notifications subscription and state

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context-simple'

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

export function useNotifications() {
  const { user, profile } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubscribed, setIsSubscribed] = useState(false)

  // Load initial notifications
  const loadNotifications = async () => {
    if (!user || !profile) return

    try {

      // For customers, use customer ID as recipient_id
      // For groomers, we'll need business_id later
      let recipientId = user.id
      
      // If user is customer, find customer record
      if (profile.role === 'customer') {

        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .select('id')
          .eq('email', user.email)
          .single()
        
        if (customerError) {

        } else if (customer) {
          recipientId = customer.id

        }
      }

      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', recipientId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (notificationsError) {
      } else {

        setNotifications(notificationsData)
        setUnreadCount(notificationsData.filter(n => !n.read).length)
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) {
      } else {
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId ? { ...n, read: true } : n
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    if (!user || !profile) return

    try {
      let recipientId = user.id
      
      if (profile.role === 'customer') {
        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('email', user.email)
          .single()
        
        if (customer) recipientId = customer.id
      }

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('recipient_id', recipientId)
        .eq('read', false)

      if (error) {
      } else {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
    }
  }

  // Setup real-time subscription
  useEffect(() => {
    if (!user || !profile) return

    let subscription: any

    const setupSubscription = async () => {
      try {
        let recipientId = user.id
        
        if (profile.role === 'customer') {

          const { data: customer, error: customerError } = await supabase
            .from('customers')
            .select('id')
            .eq('email', user.email)
            .single()
          
          if (customerError) {
          } else if (customer) {
            recipientId = customer.id

          }
        }

        subscription = supabase
          .channel(`notifications-${recipientId}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `recipient_id=eq.${recipientId}`
          }, (payload) => {

            if (payload.eventType === 'INSERT') {
              const newNotification = payload.new as Notification
              setNotifications(prev => [newNotification, ...prev])
              
              if (!newNotification.read) {
                setUnreadCount(prev => prev + 1)
              }
              
              // Show browser notification if permission granted
              if (Notification.permission === 'granted') {
                new Notification(newNotification.title, {
                  body: newNotification.message,
                  icon: '/favicon.ico',
                  tag: newNotification.id
                })
              }
            }
            
            if (payload.eventType === 'UPDATE') {
              const updatedNotification = payload.new as Notification
              setNotifications(prev => 
                prev.map(n => 
                  n.id === updatedNotification.id ? updatedNotification : n
                )
              )
              
              // Update unread count
              setUnreadCount(prev => {
                const currentNotification = notifications.find(n => n.id === updatedNotification.id)
                if (currentNotification && !currentNotification.read && updatedNotification.read) {
                  return Math.max(0, prev - 1)
                }
                return prev
              })
            }
          })
          .subscribe((status) => {

            setIsSubscribed(status === 'SUBSCRIBED')
          })
      } catch (error) {
      }
    }

    setupSubscription()
    
    // Load initial notifications
    loadNotifications()

    return () => {
      if (subscription) {
        subscription.unsubscribe()

      }
    }
  }, [user, profile])

  // Request browser notification permission on first load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {

      })
    }
  }, [])

  return {
    notifications,
    unreadCount,
    isLoading,
    isSubscribed,
    markAsRead,
    markAllAsRead,
    reload: loadNotifications
  }
}