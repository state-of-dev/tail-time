import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context-simple';

export function useAuthGuard(requireAuth: boolean = true, redirectTo: string = '/auth/login') {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {

        navigate(redirectTo, { replace: true });
      } else if (!requireAuth && user) {

      }
    }
  }, [user, loading, requireAuth, redirectTo, navigate]);

  return { user, loading, isAuthenticated: !!user };
}

export function useSessionMonitor() {
  const { user, session, clearCorruptedSession } = useAuth();

  useEffect(() => {
    // Detect session inconsistencies
    const hasInconsistency = (user && !session) || (!user && session);

    if (hasInconsistency) {
      console.warn('Session inconsistency detected:', { user: !!user, session: !!session });

      // Auto-clear corrupted sessions after a short delay
      const clearTimer = setTimeout(() => {
        console.log('Auto-clearing corrupted session...');
        clearCorruptedSession();
      }, 2000);

      return () => clearTimeout(clearTimer);
    }
  }, [user, session, clearCorruptedSession]);

  // Debug info for the console
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.debugAuth = () => {
        console.log('Auth Debug Info:', {
          user: !!user,
          session: !!session,
          userId: user?.id,
          sessionExpiry: session?.expires_at,
          tokenCount: Object.keys(localStorage).filter(k => k.includes('supabase') || k.startsWith('sb-')).length
        });
      };

      window.clearAuth = () => {
        console.log('Manually clearing auth...');
        clearCorruptedSession();
      };
    }
  }, [user, session, clearCorruptedSession]);

  return {
    hasSessionIssue: (user && !session) || (!user && session),
    clearCorruptedSession
  };
}