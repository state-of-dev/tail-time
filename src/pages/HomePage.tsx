import { useAuth } from '@/contexts/auth-context-simple'
import { AuthRedirect } from '@/components/auth/auth-redirect'
import { LandingPageNeobrutalism } from '@/pages/landing/landing-page-neobrutalism'

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 bg-chart-1 brutal-border brutal-shadow animate-pulse rounded-base flex items-center justify-center">
          <div className="w-8 h-8 bg-main-foreground rounded-base"></div>
        </div>
      </div>
    )
  }

  if (user) {
    // If user is authenticated, use AuthRedirect to send them to appropriate dashboard
    return <AuthRedirect />
  }

  // If no user, show neobrutalism landing page
  return <LandingPageNeobrutalism />
}