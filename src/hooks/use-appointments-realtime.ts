import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRealtime } from './use-realtime'

export interface AppointmentWithDetails {
  id: string
  appointment_date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected' | 'reschedule_pending'
  service_name: string
  customer_name: string
  pet_name: string
  pet_breed: string
  total_amount: number
  customer_notes?: string
  business_id: string
  service_id: string
  customer_id: string
  pet_id: string
}

export function useAppointmentsRealtime(businessId?: string) {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Setup real-time subscription

  const { isConnected, events } = useRealtime({
    table: 'appointments',
    filter: businessId ? `business_id=eq.${businessId}` : undefined,
    enabled: !!businessId
  })

  // Load initial appointments
  useEffect(() => {
    if (!businessId) return

    const loadInitialAppointments = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select(`
            *,
            services!appointments_service_id_fkey (name, price),
            pets!appointments_pet_id_fkey (name, breed),
            customers!appointments_customer_id_fkey (name, email, phone)
          `)
          .eq('business_id', businessId)
          .order('appointment_date', { ascending: true })
          .order('start_time', { ascending: true })

        if (appointmentsError) {
          throw appointmentsError
        }

        const processedAppointments = (appointmentsData || []).map(apt => ({
          ...apt,
          service_name: apt.services?.name || 'Servicio no especificado',
          customer_name: apt.customers?.name || 'Cliente no especificado',
          pet_name: apt.pets?.name || 'Mascota no especificada',
          pet_breed: apt.pets?.breed || 'Raza no especificada',
        }))

        setAppointments(processedAppointments)

      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialAppointments()
  }, [businessId])

  // Handle real-time events
  useEffect(() => {
    if (events.length === 0 || !businessId) return

    const latestEvent = events[0] // Most recent event

    switch (latestEvent.type) {
      case 'INSERT':
        // Load the full appointment data with FK relationships
        loadSingleAppointment(latestEvent.record.id)
        break

      case 'UPDATE':
        // Update existing appointment or load full data if not exists
        setAppointments(prev => {
          const existingIndex = prev.findIndex(apt => apt.id === latestEvent.record.id)
          
          if (existingIndex >= 0) {
            // Update existing appointment
            const updated = prev.map(apt => 
              apt.id === latestEvent.record.id 
                ? { 
                    ...apt, 
                    ...latestEvent.record,
                    // Preserve the FK data we already have
                    service_name: apt.service_name,
                    customer_name: apt.customer_name,
                    pet_name: apt.pet_name,
                    pet_breed: apt.pet_breed
                  }
                : apt
            )

            return updated
          } else {
            // Appointment doesn't exist locally, load it with full data

            loadSingleAppointment(latestEvent.record.id)
            return prev
          }
        })
        break

      case 'DELETE':
        // Remove deleted appointment
        setAppointments(prev => prev.filter(apt => apt.id !== latestEvent.old_record?.id))

        break
    }
  }, [events, businessId])

  // Function to load a single appointment with full FK data
  const loadSingleAppointment = async (appointmentId: string) => {

    try {
      const { data: appointmentData, error } = await supabase
        .from('appointments')
        .select(`
          *,
          services!appointments_service_id_fkey (name, price),
          pets!appointments_pet_id_fkey (name, breed),
          customers!appointments_customer_id_fkey (name, email, phone)
        `)
        .eq('id', appointmentId)
        .single()

      if (error) {
        return
      }

      const processedAppointment = {
        ...appointmentData,
        service_name: appointmentData.services?.name || 'Servicio no especificado',
        customer_name: appointmentData.customers?.name || 'Cliente no especificado',
        pet_name: appointmentData.pets?.name || 'Mascota no especificada',
        pet_breed: appointmentData.pets?.breed || 'Raza no especificada',
      }

      setAppointments(prev => {
        // Check if appointment already exists
        const exists = prev.some(a => a.id === appointmentId)

        if (exists) {
          // Update existing with full data

          return prev.map(a => a.id === appointmentId ? processedAppointment : a)
        } else {
          // Add new appointment with full data

          const sortedAppointments = [...prev, processedAppointment].sort((a, b) => {
            const dateA = new Date(`${a.appointment_date}T${a.start_time}`)
            const dateB = new Date(`${b.appointment_date}T${b.start_time}`)
            return dateA.getTime() - dateB.getTime()
          })

          return sortedAppointments
        }
      })
    } catch (error) {
    }
  }

  return {
    appointments,
    isLoading,
    error,
    isConnected,
    refresh: () => {
      // Force reload by clearing and re-triggering the effect
      if (businessId) {
        setIsLoading(true)
      }
    }
  }
}