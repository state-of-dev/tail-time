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
  const { user, session } = useAuth();

  useEffect(() => {
    if (user && !session) {
    }
    
    if (!user && session) {
    }
  }, [user, session]);

  // Debug info for the console
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.debugAuth = () => {

      };
    }
  }, [user, session]);

  return { hasSessionIssue: (user && !session) || (!user && session) };
}