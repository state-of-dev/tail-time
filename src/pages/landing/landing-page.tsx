import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Heart,
  Sparkles,
  Play,
  Calendar,
  Dog,
  CreditCard,
  Smartphone,
  Camera,
  Globe,
  Zap,
  Trophy,
  Clock,
  Headphones,
  Rocket,
  Phone,
  Users,
  Star
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pet-primary/5 via-transparent to-pet-accent/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <Badge variant="pet" className="mb-6 text-sm px-4 py-2 flex items-center gap-2 w-fit mx-auto">
              <Heart />
              Plataforma #1 para Groomers
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 text-foreground">
              Tu plataforma de citas para groomers
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Permite a tus clientes reservar citas online, gestiona tu agenda, 
              acepta pagos y haz crecer tu negocio con una página web profesional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="gradient" 
                size="xl" 
                className="group hover:scale-105 hover:shadow-lg transition-all duration-200"
                onClick={() => navigate('/auth/register')}
              >
                <Sparkles className="group-hover:animate-pulse" />
                Crear mi página gratis
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                className="group hover:scale-105 hover:shadow-md hover:border-primary/50 transition-all duration-200"
                onClick={() => navigate('/demo')}
              >
                <Play className="group-hover:scale-110 transition-transform" />
                Ver demo en vivo
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-pet-accent rounded-full"></span>
                Setup en 5 minutos
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-pet-secondary rounded-full"></span>
                Sin comisiones
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-pet-primary rounded-full"></span>
                Soporte 24/7
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 flex items-center gap-2 w-fit mx-auto">
              <Zap />
              Funcionalidades Premium
            </Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-foreground">
              Todo lo que necesitas para tu negocio
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Una plataforma completa diseñada específicamente para groomers y veterinarias
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Agenda Online",
                description: "Permite a tus clientes reservar citas 24/7 con disponibilidad en tiempo real",
                gradient: "from-primary/5 to-pet-primary/5"
              },
              {
                icon: Dog,
                title: "Perfiles de Mascota",
                description: "Información médica, fotos y historial completo de cada mascota",
                gradient: "from-pet-accent/5 to-success/5"
              },
              {
                icon: CreditCard,
                title: "Pagos Integrados",
                description: "Acepta pagos online de forma segura con Stripe y PayPal",
                gradient: "from-pet-secondary/5 to-warning/5"
              },
              {
                icon: Smartphone,
                title: "Notificaciones",
                description: "Recordatorios automáticos y actualizaciones en tiempo real",
                gradient: "from-accent/20 to-pet-primary/5"
              },
              {
                icon: Camera,
                title: "Portafolio",
                description: "Muestra tu trabajo con fotos antes/después para atraer más clientes",
                gradient: "from-secondary/20 to-pet-accent/5"
              },
              {
                icon: Globe,
                title: "Tu Propia Web",
                description: "Página personalizada con tu dominio: tunegocio.petapp.com",
                gradient: "from-muted/50 to-pet-secondary/5"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className={`group hover:scale-105 transition-all duration-300 bg-gradient-to-br ${feature.gradient} border hover:shadow-lg`}>
                  <CardHeader className="pb-4">
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-200 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent />
                    </div>
                    <CardTitle className="text-xl font-display group-hover:text-pet-primary transition-colors text-foreground">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pet-primary/5 via-pet-accent/5 to-pet-secondary/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="success" className="mb-6 flex items-center gap-2 w-fit mx-auto">
              <Trophy />
              Más de 500 groomers confían en nosotros
            </Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-foreground">
              ¿Listo para modernizar tu negocio?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Únete a cientos de groomers que ya están automatizando sus citas 
              y aumentando sus ingresos con Pet Appointments
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                variant="gradient" 
                size="xl" 
                className="group hover:scale-105 hover:shadow-lg transition-all duration-200"
                onClick={() => navigate('/auth/register')}
              >
                <Rocket className="group-hover:animate-bounce" />
                Comenzar ahora - Es gratis
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                className="group hover:scale-105 hover:bg-accent/50 transition-all duration-200"
                onClick={() => navigate('/auth/login')}
              >
                <Phone className="group-hover:rotate-12 transition-transform" />
                Hablar con un experto
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto pt-8 border-t border-border">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star />
                  <div className="text-2xl font-bold text-pet-primary">99%</div>
                </div>
                <div className="text-sm text-muted-foreground">Satisfacción</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock />
                  <div className="text-2xl font-bold text-pet-accent">5min</div>
                </div>
                <div className="text-sm text-muted-foreground">Setup</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Headphones />
                  <div className="text-2xl font-bold text-pet-secondary">24/7</div>
                </div>
                <div className="text-sm text-muted-foreground">Soporte</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}