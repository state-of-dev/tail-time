import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context-simple';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
}

export function AuthWrapper({ children, requireAuth = true, fallback }: AuthWrapperProps) {
  const { user, loading, session, signOut } = useAuth();
  const [sessionError, setSessionError] = useState(false);

  useEffect(() => {
    // Check for session inconsistencies with more tolerance
    if (!loading) {
      const hasUser = !!user;
      const hasSession = !!session;

      // Only flag as error if we have a user but no session for an extended period
      if (requireAuth && hasUser && !hasSession) {
        // Much longer delay to allow for natural token refresh and loading
        const errorTimer = setTimeout(() => {
          // Re-check after delay and ensure it's still a problem
          if (!!user && !session && !loading) {
            console.warn('AuthWrapper: Session error detected after 10s delay');
            setSessionError(true);
          }
        }, 10000); // Increased to 10 seconds

        return () => clearTimeout(errorTimer);
      } else {
        setSessionError(false);
      }
    }
  }, [user, session, loading, requireAuth]);

  // Loading state with neobrutalism styling
  if (loading) {
    return (
      <div className="min-h-screen bg-chart-4 flex items-center justify-center">
        <div className="text-center">
          <div className="p-8 bg-chart-8 brutal-border-thick brutal-shadow-xl rounded-base inline-block mb-6">
            <RefreshCw className="w-8 h-8 animate-spin text-main-foreground" />
          </div>
          <p className="text-main-foreground font-black uppercase text-lg">VERIFICANDO SESIÓN...</p>
        </div>
      </div>
    );
  }

  // Session error state with neobrutalism styling
  if (sessionError) {
    return (
      <div className="min-h-screen bg-chart-4 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-chart-2 brutal-border-thick brutal-shadow-xl">
          <CardHeader className="text-center">
            <div className="p-4 bg-chart-8 brutal-border rounded-base inline-block mb-4">
              <AlertTriangle className="w-12 h-12 text-main-foreground" />
            </div>
            <CardTitle className="text-main-foreground font-black uppercase text-xl">SESIÓN EXPIRADA</CardTitle>
            <CardDescription className="text-main-foreground/80 font-bold uppercase">
              TU SESIÓN HA EXPIRADO O HAY UN PROBLEMA DE AUTENTICACIÓN.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-main-foreground/80 font-bold text-center uppercase">
              PARA CONTINUAR, NECESITAS CERRAR SESIÓN E INICIAR SESIÓN NUEVAMENTE.
            </div>
            <div className="space-y-2">
              <Button
                onClick={async () => {
                  await signOut();
                  // Clear any problematic tokens
                  localStorage.removeItem('sb-auth-token');
                  window.location.href = '/auth/login';
                }}
                className="w-full bg-chart-8 text-main-foreground brutal-border font-black uppercase hover:brutal-hover"
              >
                CERRAR SESIÓN E INTENTAR DE NUEVO
              </Button>
              <Button
                onClick={() => {
                  window.location.reload();
                }}
                className="w-full bg-chart-6 text-main-foreground brutal-border font-black uppercase hover:brutal-hover"
              >
                RECARGAR PÁGINA
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Auth required but no user
  if (requireAuth && !user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Redirect will be handled by useAuthGuard in the consuming components
    return (
      <div className="min-h-screen bg-chart-4 flex items-center justify-center">
        <div className="text-center">
          <div className="p-8 bg-chart-8 brutal-border-thick brutal-shadow-xl rounded-base inline-block mb-6">
            <RefreshCw className="w-8 h-8 animate-spin text-main-foreground" />
          </div>
          <p className="text-main-foreground font-black uppercase text-lg">REDIRIGIENDO AL LOGIN...</p>
        </div>
      </div>
    );
  }

  // All good, render children
  return <>{children}</>;
}