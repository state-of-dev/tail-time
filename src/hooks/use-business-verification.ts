import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'
import { supabase } from '@/lib/supabase'

interface BusinessVerification {
  isVerifying: boolean
  isValid: boolean
  businessId: string | null
  error: string | null
}

export function useBusinessVerification(): BusinessVerification {
  const { businessSlug } = useParams<{ businessSlug: string }>()
  const { user, profile, businessProfile } = useAuth()
  const navigate = useNavigate()
  
  const [verification, setVerification] = useState<BusinessVerification>({
    isVerifying: true,
    isValid: false,
    businessId: null,
    error: null
  })

  useEffect(() => {
    const verifyBusinessAccess = async () => {
      if (!businessSlug || !user || !profile) {
        setVerification(prev => ({ ...prev, isVerifying: false }))
        return
      }

      try {
        // If user is groomer, verify they own this business
        if (profile.role === 'groomer') {
          if (businessProfile?.slug === businessSlug) {
            setVerification({
              isVerifying: false,
              isValid: true,
              businessId: businessProfile.id,
              error: null
            })
            return
          } else {
            // Check if businessSlug belongs to this user
            const { data, error } = await supabase
              .from('business_profiles')
              .select('id, owner_id')
              .eq('slug', businessSlug)
              .eq('owner_id', user.id)
              .single()

            if (error || !data) {
              setVerification({
                isVerifying: false,
                isValid: false,
                businessId: null,
                error: 'No tienes acceso a este negocio'
              })
              navigate('/auth/login')
              return
            }

            setVerification({
              isVerifying: false,
              isValid: true,
              businessId: data.id,
              error: null
            })
          }
        } else {
          // For non-groomers (customers), just verify business exists and is active
          const { data, error } = await supabase
            .from('business_profiles')
            .select('id, is_active')
            .eq('slug', businessSlug)
            .eq('is_active', true)
            .single()

          if (error || !data) {
            setVerification({
              isVerifying: false,
              isValid: false,
              businessId: null,
              error: 'Negocio no encontrado o no disponible'
            })
            navigate('/')
            return
          }

          setVerification({
            isVerifying: false,
            isValid: true,
            businessId: data.id,
            error: null
          })
        }
      } catch (error: any) {
        setVerification({
          isVerifying: false,
          isValid: false,
          businessId: null,
          error: 'Error verificando acceso al negocio'
        })
      }
    }

    verifyBusinessAccess()
  }, [businessSlug, user, profile, businessProfile, navigate])

  return verification
}