import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'
import { supabase } from '@/lib/supabase'

export function useOnboardingRedirect() {
  const { user, profile, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const checkBusinessAndRedirect = async () => {
      if (loading) return
      if (!user || !profile) return

      if (profile.role === 'customer') {
        navigate('/customer/dashboard', { replace: true })
        return
      }

      if (profile.role === 'groomer') {
        // Check if groomer has a business
        try {
          const { data: business, error } = await supabase
            .from('businesses')
            .select('id, name, subdomain, onboarding_complete')
            .eq('groomer_id', user.id)
            .single()

          if (error && error.code !== 'PGRST116') {
            return
          }

          if (!business) {
            navigate('/setup/business', { replace: true })
            return
          }

          if (!business.onboarding_complete) {
            // TODO: Redirect to appropriate setup step based on progress
            navigate('/setup/business-hours', { replace: true })
            return
          }

          navigate(`/groomer/${business.subdomain}/dashboard`, { replace: true })

        } catch (error) {
        }
      }
    }

    checkBusinessAndRedirect()
  }, [user, profile, loading, navigate])
}