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
  MapPin,
  Sparkles,
  Trophy,
  Crown,
  Zap
} from 'lucide-react'
import {
  Star1, Star6, Star7, Star8, Star9, Star10, Star13, Star19, Star20, Star21, Star22, Star23, Star24, Star25, Star26, Star27, Star28, Star37, Star39, Star40,
  StarSizes
} from '@/components/ui/neobrutalism-stars'

export default function DemoSaas() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <div className="min-h-screen bg-chart-4">
      <Navigation />

      {/* Hero Section - Neobrutalism Style */}
      <section className="py-20 bg-chart-1 relative overflow-hidden border-t-4 border-black">
        {/* Floating Stars Background */}
        <div className="absolute inset-0 pointer-events-none">
          <Star1 className="absolute top-12 left-10 star-decoration" size={StarSizes.lg} />
          <Star6 className="absolute top-32 right-20 star-decoration" size={StarSizes.md} />
          <Star7 className="absolute bottom-20 left-32 star-decoration" size={StarSizes.xl} />
          <Star8 className="absolute top-20 right-1/3 star-decoration" size={StarSizes.sm} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <Badge className="bg-chart-8 text-main-foreground brutal-shadow-lg hover:brutal-hover px-8 py-4 text-xl font-black brutal-border-thick rounded-base transform -rotate-1 mb-8">
              <Play className="icon-large mr-2 icon-float" />
              <Star9 size={StarSizes.md} className="star-decoration" />
              DEMO INTERACTIVA
              <Star10 size={StarSizes.md} className="star-decoration" />
              <Camera className="icon-large ml-2 icon-float" />
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-main-foreground uppercase mb-8">
              <Star13 size={StarSizes.lg} className="star-decoration inline-block mr-4" />
              EXPERIMENTA TAILTIME EN ACCIÓN
              <Star19 size={StarSizes.lg} className="star-decoration inline-block ml-4" />
            </h1>
            <p className="text-2xl font-bold text-main-foreground/80 uppercase max-w-4xl mx-auto mb-12">
              <Heart className="icon-large inline-block mr-2 icon-float" />
              DESCUBRE CÓMO NUESTRA PLATAFORMA TRANSFORMA LA GESTIÓN DE CITAS
              <Sparkles className="icon-large inline-block ml-2 icon-float" />
            </p>
          </div>
        </div>
      </section>

      {/* Video Demo Section - Neobrutalism Style */}
      <section className="py-20 bg-chart-3 border-t-4 border-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-chart-2 text-main-foreground brutal-shadow-xl px-8 py-4 text-xl font-black brutal-border-thick rounded-base uppercase transform -rotate-1 mb-8">
              <Play className="icon-large mr-2 icon-float" />
              <Star20 size={StarSizes.md} className="star-decoration" />
              VIDEO DEMO COMPLETA
              <Star21 size={StarSizes.md} className="star-decoration" />
              <Camera className="icon-large ml-2 icon-float" />
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black text-main-foreground uppercase mb-6">
              <Star22 size={StarSizes.lg} className="star-decoration inline-block mr-4" />
              MIRA TAILTIME EN ACCIÓN
              <Star23 size={StarSizes.lg} className="star-decoration inline-block ml-4" />
            </h2>
            <p className="text-2xl font-bold text-main-foreground/80 uppercase">
              <Clock className="icon-large inline-block mr-2 icon-float" />
              MENOS DE 3 MINUTOS DE DEMO ÉPICA
              <Sparkles className="icon-large inline-block ml-2 icon-float" />
            </p>
          </div>
          
          <div className="relative brutal-border-thick brutal-shadow-xl rounded-base overflow-hidden bg-chart-5 aspect-video">
            {!isVideoPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center bg-chart-8">
                <div className="text-center relative z-10">
                  <div className="p-6 bg-chart-6 brutal-border-thick brutal-shadow-lg rounded-base mb-6 inline-block">
                    <Play className="icon-hero text-main-foreground icon-float" />
                  </div>
                  <Button
                    className="mb-6 bg-chart-1 hover:bg-chart-2 text-main-foreground brutal-border-thick brutal-shadow-xl hover:brutal-hover font-black text-2xl py-8 px-12 uppercase"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <Play className="icon-hero mr-4 icon-float" />
                    <Star24 size={StarSizes.md} className="star-decoration mr-2" />
                    VER DEMO
                    <Crown className="icon-hero ml-4 icon-float" />
                  </Button>
                  <p className="text-main-foreground font-black text-xl uppercase">
                    <Clock className="icon-large inline-block mr-2 icon-float" />
                    3:24 MINUTOS DE PURA MAGIA
                  </p>
                </div>

                {/* Floating Stars on Video Thumbnail */}
                <div className="absolute inset-0 pointer-events-none">
                  <Star25 className="absolute top-8 left-8 star-decoration" size={StarSizes.md} />
                  <Star26 className="absolute top-12 right-12 star-decoration" size={StarSizes.sm} />
                  <Star27 className="absolute bottom-8 left-16 star-decoration" size={StarSizes.lg} />
                  <Star28 className="absolute bottom-16 right-8 star-decoration" size={StarSizes.md} />
                </div>

                <div className="absolute bottom-8 left-8 text-main-foreground">
                  <h3 className="text-3xl font-black mb-2 uppercase">
                    <PawPrint className="icon-large inline-block mr-2 icon-float" />
                    DASHBOARD DEL GROOMER
                  </h3>
                  <p className="text-xl font-bold uppercase">
                    <Trophy className="icon-standard inline-block mr-2 icon-float" />
                    GESTIÓN COMPLETA DE CITAS Y CLIENTES
                  </p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-chart-7">
                <div className="text-center text-main-foreground">
                  <div className="p-6 bg-chart-4 brutal-border-thick brutal-shadow-lg rounded-base mb-6 inline-block">
                    <Pause className="icon-hero text-main-foreground icon-float" />
                  </div>
                  <Button
                    className="mb-6 bg-chart-3 hover:bg-chart-5 text-main-foreground brutal-border-thick brutal-shadow-lg hover:brutal-hover font-black text-xl py-6 px-10 uppercase"
                    onClick={() => setIsVideoPlaying(false)}
                  >
                    <Pause className="icon-large mr-2 icon-float" />
                    PAUSAR
                  </Button>
                  <p className="text-xl font-black uppercase mb-4">VIDEO DEMO SIMULADO</p>
                  <p className="text-lg font-bold uppercase">
                    <Sparkles className="icon-standard inline-block mr-2 icon-float" />
                    EN PRODUCCIÓN INCLUIRÍA EL VIDEO REAL
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Screenshots Gallery - Neobrutalism Style */}
      <section className="py-20 bg-chart-5 border-t-4 border-black relative overflow-hidden">
        {/* More Floating Stars */}
        <div className="absolute inset-0 pointer-events-none">
          <Star37 className="absolute top-20 left-20 star-decoration" size={StarSizes.xl} />
          <Star39 className="absolute bottom-32 right-16 star-decoration" size={StarSizes.lg} />
          <Star40 className="absolute top-40 right-1/4 star-decoration" size={StarSizes.md} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-chart-7 text-main-foreground brutal-shadow-xl px-8 py-4 text-xl font-black brutal-border-thick rounded-base uppercase transform rotate-1 mb-8">
              <Camera className="icon-large mr-2 icon-float" />
              <Star37 size={StarSizes.md} className="star-decoration" />
              CAPTURAS DE PANTALLA
              <Star39 size={StarSizes.md} className="star-decoration" />
              <Crown className="icon-large ml-2 icon-float" />
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black text-main-foreground uppercase mb-6">
              <Star40 size={StarSizes.lg} className="star-decoration inline-block mr-4" />
              EXPLORA TODAS LAS FUNCIONALIDADES
              <Star1 size={StarSizes.lg} className="star-decoration inline-block ml-4" />
            </h2>
            <p className="text-2xl font-bold text-main-foreground/80 uppercase">
              <Trophy className="icon-large inline-block mr-2 icon-float" />
              CADA PANTALLA ES UNA OBRA MAESTRA
              <Sparkles className="icon-large inline-block ml-2 icon-float" />
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Dashboard Screenshot - Neobrutalism */}
            <Card className="overflow-hidden brutal-shadow-xl hover:brutal-hover transition-all duration-200 bg-chart-1 brutal-border-thick transform hover:-rotate-1">
              <div className="aspect-video bg-chart-4 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="p-4 bg-chart-2 brutal-border brutal-shadow rounded-base mb-4 inline-block">
                      <BarChart className="icon-hero text-main-foreground icon-float" />
                    </div>
                    <p className="text-xl font-black text-main-foreground uppercase">
                      <Star6 size={StarSizes.sm} className="star-decoration inline-block mr-2" />
                      DASHBOARD PRINCIPAL
                    </p>
                  </div>
                </div>
              </div>
              <CardHeader className="bg-chart-1 p-6">
                <CardTitle className="flex items-center gap-4 text-main-foreground font-black text-xl uppercase">
                  <BarChart className="icon-large icon-float" />
                  <Star7 size={StarSizes.sm} className="star-decoration" />
                  DASHBOARD ANALYTICS
                </CardTitle>
                <CardDescription className="text-main-foreground/80 font-bold text-lg">
                  VISTA GENERAL DE MÉTRICAS, CITAS DEL DÍA Y RENDIMIENTO DEL NEGOCIO
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