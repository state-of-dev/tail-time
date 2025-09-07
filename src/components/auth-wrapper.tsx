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
    // Check for session inconsistencies
    if (!loading) {
      const hasUser = !!user;
      const hasSession = !!session;
      
      if (requireAuth && hasUser && !hasSession) {
        setSessionError(true);
      } else {
        setSessionError(false);
      }
    }
  }, [user, session, loading, requireAuth]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Session error state
  if (sessionError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-2" />
            <CardTitle>Sesión Expirada</CardTitle>
            <CardDescription>
              Tu sesión ha expirado o hay un problema de autenticación.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              Para continuar, necesitas cerrar sesión e iniciar sesión nuevamente.
            </div>
            <div className="space-y-2">
              <Button 
                onClick={async () => {
                  await signOut();
                  // Clear any problematic tokens
                  localStorage.removeItem('sb-auth-token');
                  window.location.href = '/auth/login';
                }} 
                className="w-full"
              >
                Cerrar Sesión e Intentar de Nuevo
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  window.location.reload();
                }} 
                className="w-full"
              >
                Recargar Página
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  // All good, render children
  return <>{children}</>;
}