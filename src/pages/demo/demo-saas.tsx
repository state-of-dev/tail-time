import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/navigation'
import { 
  Play,
  Pause,
  Calendar,
  Users,
  CreditCard,
  Smartphone,
  BarChart,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  PawPrint,
  Scissors,
  Heart,
  Camera,
  MessageCircle,
  Bell,
  MapPin
} from 'lucide-react'

export default function DemoSaas() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6">
              <Play className="w-4 h-4 mr-2" />
              Demo Interactiva
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Experimenta TailTime en Acción
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Descubre cómo nuestra plataforma transforma la gestión de citas para groomers y veterinarias
            </p>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Video Demo Completa</h2>
            <p className="text-lg text-muted-foreground">
              Mira cómo funciona TailTime en menos de 3 minutos
            </p>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video">
            {!isVideoPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <div className="text-center">
                  <Button
                    size="lg"
                    className="mb-4 bg-white text-black hover:bg-gray-100"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <Play className="w-6 h-6 mr-2" />
                    Ver Demo
                  </Button>
                  <p className="text-white text-lg">3:24 minutos</p>
                </div>
                
                {/* Mock video thumbnail */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 opacity-80"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Dashboard del Groomer</h3>
                  <p className="text-lg opacity-90">Gestión completa de citas y clientes</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center text-white">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsVideoPlaying(false)}
                    className="mb-4"
                  >
                    <Pause className="w-6 h-6 mr-2" />
                    Pausar
                  </Button>
                  <p className="text-lg">Video demo simulado</p>
                  <p className="text-sm opacity-70 mt-2">En producción incluiría el video real de la plataforma</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Screenshots Gallery */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Capturas de Pantalla</h2>
            <p className="text-lg text-muted-foreground">
              Explora todas las funcionalidades de la plataforma
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Dashboard Screenshot */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-lg font-medium">Dashboard Principal</p>
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  Dashboard Analytics
                </CardTitle>
                <CardDescription>
                  Vista general de métricas, citas del día y rendimiento del negocio
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Calendar Screenshot */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-green-500/20 to-teal-500/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Calendar className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <p className="text-lg font-medium">Calendario Inteligente</p>
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Gestión de Citas
                </CardTitle>
                <CardDescription>
                  Calendario interactivo con drag & drop, disponibilidad automática
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Mobile App Screenshot */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Smartphone className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                    <p className="text-lg font-medium">App Móvil</p>
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Versión Móvil
                </CardTitle>
                <CardDescription>
                  Interfaz optimizada para móviles, gestión sobre la marcha
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Customer Portal */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-orange-500/20 to-red-500/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                    <p className="text-lg font-medium">Portal de Clientes</p>
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Experiencia del Cliente
                </CardTitle>
                <CardDescription>
                  Reservas online, historial de mascotas, recordatorios automáticos
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Payment System */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <CreditCard className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                    <p className="text-lg font-medium">Pagos Integrados</p>
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Sistema de Pagos
                </CardTitle>
                <CardDescription>
                  Pagos seguros con Stripe, facturación automática, reportes financieros
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Business Profile */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-indigo-500/20 to-blue-500/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Scissors className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                    <p className="text-lg font-medium">Perfil de Negocio</p>
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="w-5 h-5" />
                  Página de Negocio
                </CardTitle>
                <CardDescription>
                  Página web personalizada, portfolio, servicios, horarios
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Características Principales</h2>
            <p className="text-lg text-muted-foreground">
              Todo lo que necesitas para administrar tu negocio de grooming
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Reservas 24/7</h3>
              <p className="text-sm text-muted-foreground">Clientes pueden reservar en cualquier momento</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Recordatorios</h3>
              <p className="text-sm text-muted-foreground">Notificaciones automáticas por SMS y email</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Portfolio Digital</h3>
              <p className="text-sm text-muted-foreground">Muestra tu trabajo con fotos antes/después</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Pagos Online</h3>
              <p className="text-sm text-muted-foreground">Cobra anticipos y pagos completos</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <PawPrint className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para Transformar tu Negocio?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a cientos de groomers que ya están creciendo con TailTime
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Comenzar Prueba Gratis
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Hablar con Ventas
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}