import { useAuth } from '@/contexts/auth-context-simple'
import { AuthRedirect } from '@/components/auth/auth-redirect'
import { LandingPage } from '@/pages/landing/landing-page'

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    // If user is authenticated, use AuthRedirect to send them to appropriate dashboard
    return <AuthRedirect />
  }

  // If no user, show landing page
  return <LandingPage />
}