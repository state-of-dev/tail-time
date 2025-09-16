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
  const { user, session, loading, clearCorruptedSession } = useAuth();

  useEffect(() => {
    // Only check for inconsistencies after loading is complete
    if (loading) return;

    // Be much more conservative about what we consider an inconsistency
    // Only flag as inconsistent if we have a user but no session AND it's been stable for a while
    const hasSerousInconsistency = user && !session;

    if (hasSerousInconsistency) {
      console.warn('Potential session inconsistency detected:', { user: !!user, session: !!session });

      // Much longer delay and more conservative approach
      const clearTimer = setTimeout(() => {
        // Triple-check the inconsistency still exists and is serious
        const stillHasSeriousIssue = user && !session && !loading;
        if (stillHasSeriousIssue) {
          console.log('Serious session inconsistency persisted for 15s, clearing...');
          clearCorruptedSession();
        } else {
          console.log('Session inconsistency resolved naturally');
        }
      }, 15000); // Much longer delay - 15 seconds

      return () => clearTimeout(clearTimer);
    }
  }, [user, session, loading, clearCorruptedSession]);

  // Enhanced debug info for the console
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.debugAuth = () => {
        console.log('Auth Debug Info:', {
          user: !!user,
          session: !!session,
          loading,
          userId: user?.id,
          sessionExpiry: session?.expires_at,
          timeToExpiry: session?.expires_at ? new Date(session.expires_at * 1000).getTime() - Date.now() : null,
          tokenCount: Object.keys(localStorage).filter(k => k.includes('supabase') || k.startsWith('sb-')).length,
          storageKeys: Object.keys(localStorage).filter(k => k.includes('supabase') || k.startsWith('sb-'))
        });
      };

      window.clearAuth = () => {
        console.log('Manually clearing auth...');
        clearCorruptedSession();
      };
    }
  }, [user, session, loading, clearCorruptedSession]);

  return {
    hasSessionIssue: !loading && ((user && !session) || (!user && session)),
    clearCorruptedSession
  };
}