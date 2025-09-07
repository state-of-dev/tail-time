// Hook for Zustand-based Reactive Notifications
// Connects auth context with notification store for seamless real-time updates

import { useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context-simple'
import { useNotificationStore, requestNotificationPermission } from '@/stores/notificationStore'
import { supabase } from '@/lib/supabase'

export function useNotificationsZustand() {
  const { user, profile } = useAuth()
  const {
    notifications,
    unreadCount,
    isLoading,
    isSubscribed,
    loadNotifications,
    setupRealTimeSubscription,
    cleanup,
    markAsRead,
    markAllAsRead,
    setCurrentUser
  } = useNotificationStore()

  // Initialize notifications when auth changes
  useEffect(() => {
    if (!user || !profile) {
      cleanup()
      return
    }

    const initializeNotifications = async () => {
      try {

        // Determine recipient ID based on role
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
        } else if (profile.role === 'groomer') {
          // For groomers, use auth user ID directly

        }

        // Set current user in store
        setCurrentUser(recipientId)
        
        // Load initial notifications
        await loadNotifications(user.id, recipientId)
        
        // Setup real-time subscription
        setupRealTimeSubscription(recipientId)

      } catch (error) {
      }
    }

    initializeNotifications()
    
    // Cleanup on unmount or user change
    return () => {
      cleanup()
    }
  }, [user, profile, loadNotifications, setupRealTimeSubscription, cleanup, setCurrentUser])

  // Request browser notification permission on first load
  useEffect(() => {
    requestNotificationPermission()
  }, [])

  // Debug logging when state changes
  useEffect(() => {

  }, [notifications.length, unreadCount, isLoading, isSubscribed])

  return {
    notifications,
    unreadCount,
    isLoading,
    isSubscribed,
    markAsRead,
    markAllAsRead,
    reload: () => {
      if (user && profile) {
        // Re-initialize to reload notifications
        const recipientId = profile.role === 'customer' ? 'customer-lookup-needed' : user.id
        loadNotifications(user.id, recipientId)
      }
    }
  }
}