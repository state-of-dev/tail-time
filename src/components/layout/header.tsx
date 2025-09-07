import { Button } from '@/components/ui/button';
import { Container } from './main-layout';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  variant?: 'landing' | 'dashboard' | 'subdomain';
  businessName?: string;
}

export function Header({ variant = 'landing', businessName }: HeaderProps) {
  const navigate = useNavigate()
  
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pet-primary to-pet-accent rounded-lg flex items-center justify-center">
                <Heart />
              </div>
              <h1 className="text-xl font-display font-bold text-foreground">
                {variant === 'subdomain' && businessName 
                  ? businessName 
                  : 'Pet Appointments'
                }
              </h1>
            </div>
          </div>
          
          <nav className="flex items-center space-x-2">
            {variant === 'landing' && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/')}
                >
                  Inicio
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/marketplace')}
                >
                  Marketplace
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/demo')}
                >
                  Demo
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/auth/login')}
                >
                  Iniciar Sesión
                </Button>
                <Button 
                  variant="pet" 
                  size="sm"
                  onClick={() => navigate('/auth/register')}
                >
                  Crear mi página
                </Button>
              </>
            )}
            
            {variant === 'dashboard' && (
              <>
                <Button variant="ghost" size="sm">Dashboard</Button>
                <Button variant="ghost" size="sm">Calendario</Button>
                <Button variant="ghost" size="sm">Servicios</Button>
                <Button variant="outline" size="sm">Ver mi página</Button>
              </>
            )}
            
            {variant === 'subdomain' && (
              <>
                <Button variant="ghost" size="sm">Servicios</Button>
                <Button variant="ghost" size="sm">Portafolio</Button>
                <Button variant="pet" size="sm">
                  Reservar Cita
                </Button>
              </>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}