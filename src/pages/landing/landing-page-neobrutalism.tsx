import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Star1, Star7, Star8, Star9, Star10, Star12, Star14, Star19, Star23, Star28, Star36, Star39,
  StarSizes
} from '@/components/ui/neobrutalism-stars';
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
  Star,
  CheckCircle,
  ArrowRight,
  PawPrint,
  Scissors,
  Eye,
  Crown,
  Shield,
  Target,
  ThumbsUp,
  Flame,
  Award,
  Diamond,
  Stars,
  Gem,
  Gift,
  Medal,
  Sparkle
} from 'lucide-react';
export function LandingPageNeobrutalism() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-chart-4">
      <Navigation />
      {/* Hero Section - Neobrutalism Style */}
      <section className="py-16 md:py-24 relative bg-chart-6 overflow-hidden">
        {/* Floating Stars Background */}
        <div className="absolute inset-0 pointer-events-none">
          <Star9 className="absolute top-20 left-10 star-decoration" size={StarSizes.lg} />
          <Star10 className="absolute top-40 right-20 star-decoration" size={StarSizes.md} />
          <Star23 className="absolute bottom-32 left-32 star-decoration" size={StarSizes.xl} />
          <Star36 className="absolute top-60 left-1/2 star-decoration" size={StarSizes.sm} />
          <Star39 className="absolute bottom-20 right-40 star-decoration" size={StarSizes.lg} />
          <Star1 className="absolute top-32 right-1/3 star-decoration" size={StarSizes.md} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Hero Badge */}
            <div className="mb-8 flex justify-center">
              <Badge className="bg-chart-8 text-main-foreground brutal-shadow-lg hover:brutal-hover px-8 py-6 text-lg font-bold brutal-border-thick rounded-base transform -rotate-1">
                <Crown className="icon-hero mr-2 icon-float" />
                <Star39 size={StarSizes.lg} className="star-decoration" />
                #1 PLATAFORMA PARA GROOMERS
                <Star1 size={StarSizes.lg} className="star-decoration" />
                <Trophy className="icon-hero ml-2 icon-float" />
              </Badge>
            </div>
            {/* Hero Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-12 text-foreground leading-tight">
              <Star28 size={StarSizes['2xl']} className="star-decoration inline-block mr-4" />
              REVOLUCIONA TU
              <span className="bg-chart-5 text-main-foreground px-6 py-4 mx-4 brutal-shadow-xl brutal-border-thick inline-block transform -rotate-2 rounded-base">
                <Rocket className="icon-large inline-block mr-2 icon-float" />
                <Star7 size={StarSizes.lg} className="star-decoration inline-block" />
                NEGOCIO
                <Star14 size={StarSizes.lg} className="star-decoration inline-block" />
                <Sparkle className="icon-large inline-block ml-2 icon-float" />
              </span>
              DE GROOMING
              <Star36 size={StarSizes['2xl']} className="star-decoration inline-block ml-4" />
            </h1>
            {/* Hero Subtitle */}
            <p className="text-xl md:text-2xl text-foreground/80 mb-16 max-w-4xl mx-auto leading-relaxed font-bold">
              <Calendar className="icon-large inline-block mr-2 icon-float" />
              CITAS ONLINE
              <CreditCard className="icon-large inline-block mr-2 icon-float" />
              PAGOS AUTOMÁTICOS
              <Globe className="icon-large inline-block mr-2 icon-float" />
              TU PÁGINA WEB
            </p>
            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16">
              <Button
                size="lg"
                className="bg-chart-1 hover:bg-chart-2 text-main-foreground brutal-shadow-xl hover:brutal-hover font-black text-lg px-8 py-4 brutal-border-thick rounded-base"
                onClick={() => navigate('/auth/register')}
              >
                <Sparkles className="icon-large mr-2 icon-float" />
                <Star8 size={StarSizes.md} className="star-decoration" />
                CREAR MI PÁGINA GRATIS
                <Star19 size={StarSizes.md} className="star-decoration" />
                <ArrowRight className="icon-large ml-2 icon-float" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-main hover:bg-chart-3 brutal-shadow-lg hover:brutal-hover font-black text-lg px-8 py-4 brutal-border-thick rounded-base text-foreground"
                onClick={() => navigate('/marketplace')}
              >
                <Play className="icon-large mr-2 icon-float" />
                <Eye className="icon-large mr-2 icon-float" />
                VER EJEMPLOS
              </Button>
            </div>
            {/* Hero Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-chart-3 text-main-foreground p-6 brutal-shadow-lg brutal-border-thick rounded-base flex items-center justify-center gap-3 transform rotate-1">
                <Zap className="icon-xl icon-float" />
                <div className="font-black text-xl uppercase">SETUP 5 MIN</div>
                <Sparkle className="icon-large icon-float" />
              </div>
              <div className="bg-chart-2 text-main-foreground p-6 brutal-shadow-lg brutal-border-thick rounded-base flex items-center justify-center gap-3">
                <CreditCard className="icon-xl icon-float" />
                <div className="font-black text-xl uppercase">SIN COMISIONES</div>
                <Shield className="icon-large icon-float" />
              </div>
              <div className="bg-chart-7 text-main-foreground p-6 brutal-shadow-lg brutal-border-thick rounded-base flex items-center justify-center gap-3 transform -rotate-1">
                <Headphones className="icon-xl icon-float" />
                <div className="font-black text-xl uppercase">SOPORTE 24/7</div>
                <Heart className="icon-large icon-float" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-24 bg-chart-7 border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <Badge className="bg-chart-6 text-main-foreground brutal-shadow-xl mb-8 px-8 py-4 text-xl font-black brutal-border-thick rounded-base uppercase transform rotate-1">
              <Zap className="icon-large mr-2 icon-float" />
              <Star23 size={StarSizes.md} className="star-decoration" />
              TODO INCLUIDO
              <Star12 size={StarSizes.md} className="star-decoration" />
              <Gem className="icon-large ml-2 icon-float" />
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-foreground uppercase leading-tight">
              HERRAMIENTAS QUE
              <span className="bg-chart-8 text-main-foreground px-6 py-4 mx-4 brutal-shadow-xl brutal-border-thick rounded-base inline-block transform rotate-1">
                FUNCIONAN
                <Trophy className="icon-large inline-block ml-2 icon-float" />
              </span>
            </h2>
          </div>
          {/* Features Grid */}
          <div className="brutal-grid">
            {/* Feature 1 */}
            <Card className="bg-chart-1 text-main-foreground brutal-shadow-lg hover:brutal-hover transition-all duration-100 brutal-border-thick rounded-base">
              <CardHeader className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <Calendar className="icon-hero icon-float" />
                </div>
                <CardTitle className="font-black text-2xl uppercase mb-4 flex items-center justify-center gap-2">
                  <Clock className="icon-large icon-float" />
                  RESERVAS ONLINE
                  <Target className="icon-large icon-float" />
                </CardTitle>
                <CardDescription className="text-main-foreground/90 text-lg font-bold text-center">
                  TUS CLIENTES RESERVAN 24/7 SIN LLAMADAS
                </CardDescription>
              </CardHeader>
            </Card>
            {/* Feature 2 */}
            <Card className="bg-chart-4 text-main-foreground brutal-shadow-lg hover:brutal-hover transition-all duration-100 brutal-border-thick rounded-base">
              <CardHeader className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <CreditCard className="icon-hero icon-float" />
                </div>
                <CardTitle className="font-black text-2xl uppercase mb-4 flex items-center justify-center gap-2">
                  <Shield className="icon-large icon-float" />
                  PAGOS AUTOMÁTICOS
                  <Gem className="icon-large icon-float" />
                </CardTitle>
                <CardDescription className="text-main-foreground/90 text-lg font-bold text-center">
                  COBRA AUTOMÁTICAMENTE, SIN PERSEGUIR CLIENTES
                </CardDescription>
              </CardHeader>
            </Card>
            {/* Feature 3 */}
            <Card className="bg-chart-2 text-main-foreground brutal-shadow-lg hover:brutal-hover transition-all duration-100 brutal-border-thick rounded-base">
              <CardHeader className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <Globe className="icon-hero icon-float" />
                </div>
                <CardTitle className="font-black text-2xl uppercase mb-4 flex items-center justify-center gap-2">
                  <Rocket className="icon-large icon-float" />
                  TU PÁGINA WEB
                  <Sparkle className="icon-large icon-float" />
                </CardTitle>
                <CardDescription className="text-main-foreground/90 text-lg font-bold text-center">
                  PÁGINA PROFESIONAL LISTA EN 5 MINUTOS
                </CardDescription>
              </CardHeader>
            </Card>
            {/* Feature 4 */}
            <Card className="bg-chart-5 text-main-foreground brutal-shadow-lg hover:brutal-hover transition-all duration-100 brutal-border-thick rounded-base">
              <CardHeader className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <Smartphone className="icon-hero icon-float" />
                </div>
                <CardTitle className="font-black text-2xl uppercase mb-4 flex items-center justify-center gap-2">
                  <Zap className="icon-large icon-float" />
                  APP MÓVIL
                  <Phone className="icon-large icon-float" />
                </CardTitle>
                <CardDescription className="text-main-foreground/90 text-lg font-bold text-center">
                  GESTIONA TODO DESDE TU TELÉFONO
                </CardDescription>
              </CardHeader>
            </Card>
            {/* Feature 5 */}
            <Card className="bg-chart-3 text-main-foreground brutal-shadow-lg hover:brutal-hover transition-all duration-100 brutal-border-thick rounded-base">
              <CardHeader className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <Users className="icon-hero icon-float" />
                </div>
                <CardTitle className="font-black text-2xl uppercase mb-4 flex items-center justify-center gap-2">
                  <Heart className="icon-large icon-float" />
                  BASE DE CLIENTES
                  <PawPrint className="icon-large icon-float" />
                </CardTitle>
                <CardDescription className="text-main-foreground/90 text-lg font-bold text-center">
                  HISTORIAL COMPLETO DE MASCOTAS Y DUEÑOS
                </CardDescription>
              </CardHeader>
            </Card>
            {/* Feature 6 */}
            <Card className="bg-chart-1 text-main-foreground brutal-shadow-lg hover:brutal-hover transition-all duration-100 brutal-border-thick rounded-base">
              <CardHeader className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <Camera className="icon-hero icon-float" />
                </div>
                <CardTitle className="font-black text-2xl uppercase mb-4 flex items-center justify-center gap-2">
                  <Award className="icon-large icon-float" />
                  PORTFOLIO DIGITAL
                  <Trophy className="icon-large icon-float" />
                </CardTitle>
                <CardDescription className="text-main-foreground/90 text-lg font-bold text-center">
                  MUESTRA TU TRABAJO Y ATRAE MÁS CLIENTES
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-20 bg-chart-8 border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="bg-chart-2 text-main-foreground brutal-shadow brutal-border rounded-base text-center p-8 transform rotate-1">
              <div className="flex items-center justify-center mb-2">
                <div className="text-4xl font-black">500+</div>
                <Crown className="icon-large ml-2 icon-float" />
              </div>
              <div className="text-main-foreground/80 font-bold flex items-center justify-center gap-2">
                <Users className="icon-standard icon-float" />
                GROOMERS ACTIVOS
                <ThumbsUp className="icon-standard icon-float" />
              </div>
            </Card>
            <Card className="bg-chart-4 text-main-foreground brutal-shadow brutal-border rounded-base text-center p-8">
              <div className="flex items-center justify-center mb-2">
                <div className="text-4xl font-black">15K+</div>
                <Trophy className="icon-large ml-2 icon-float" />
              </div>
              <div className="text-main-foreground/80 font-bold flex items-center justify-center gap-2">
                <Calendar className="icon-standard icon-float" />
                CITAS COMPLETADAS
                <CheckCircle className="icon-standard icon-float" />
              </div>
            </Card>
            <Card className="bg-chart-1 text-main-foreground brutal-shadow brutal-border rounded-base text-center p-8 transform -rotate-1">
              <div className="flex items-center justify-center mb-2">
                <div className="text-4xl font-black">98%</div>
                <Heart className="icon-large ml-2 icon-float" />
              </div>
              <div className="text-main-foreground/80 font-bold flex items-center justify-center gap-2">
                <Sparkles className="icon-standard icon-float" />
                SATISFACCIÓN
                <Award className="icon-standard icon-float" />
              </div>
            </Card>
            <Card className="bg-chart-5 text-main-foreground brutal-shadow brutal-border rounded-base text-center p-8">
              <div className="flex items-center justify-center mb-2">
                <div className="text-4xl font-black">24/7</div>
                <Shield className="icon-large ml-2 icon-float" />
              </div>
              <div className="text-main-foreground/80 font-bold flex items-center justify-center gap-2">
                <Clock className="icon-standard icon-float" />
                DISPONIBILIDAD
                <Headphones className="icon-standard icon-float" />
              </div>
            </Card>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-chart-1 border-t-4 border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Star28 className="star-decoration icon-hero" />
            <PawPrint className="icon-hero text-main-foreground icon-float" />
            <Star12 className="star-decoration icon-hero" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6 text-main-foreground uppercase flex items-center justify-center gap-4">
            <Crown className="icon-xl icon-float" />
            ¿LISTO PARA CRECER?
            <Trophy className="icon-xl icon-float" />
          </h2>
          <p className="text-xl text-main-foreground/80 mb-8 font-bold flex items-center justify-center gap-2">
            ÚNETE A CIENTOS DE GROOMERS QUE YA TRANSFORMARON SU NEGOCIO
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              size="lg"
              className="bg-main text-foreground hover:bg-chart-4 brutal-shadow hover:brutal-hover font-black text-xl px-12 py-6 brutal-border rounded-base"
              onClick={() => navigate('/auth/register')}
            >
              <Rocket className="icon-large mr-2 icon-float" />
              EMPEZAR AHORA
              <ArrowRight className="icon-large ml-2 icon-float" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-secondary-background hover:bg-chart-5 brutal-shadow hover:brutal-hover font-black text-xl px-12 py-6 brutal-border rounded-base text-foreground"
              onClick={() => navigate('/marketplace')}
            >
              <Eye className="icon-large mr-2 icon-float" />
              VER EJEMPLOS
            </Button>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-12 bg-chart-5 text-main-foreground border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star7 className="star-decoration icon-large" />
            <PawPrint className="icon-xl icon-float" />
            <span className="font-black text-2xl">TAILTIME</span>
            <Star14 className="star-decoration icon-large" />
          </div>
          <p className="text-main-foreground/80 flex items-center justify-center gap-2 font-bold">
            <span>© 2024 TAILTIME. HECHO CON</span>
            <Heart className="icon-standard icon-float" />
            <span>PARA GROOMERS.</span>
          </p>
        </div>
      </footer>
    </div>
  )
}