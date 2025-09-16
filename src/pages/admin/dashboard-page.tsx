import { Header } from '@/components/layout/header';
import { MainLayout, Container } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Star,
  Trophy,
  Crown,
  Sparkles,
  Heart,
  Zap,
  PawPrint
} from 'lucide-react';
import {
  Star1, Star6, Star7, Star8, Star9, Star10, Star13, Star19, Star20, Star21, Star22, Star23, Star24, Star25, Star26, Star27, Star28, Star37, Star39, Star40,
  StarSizes
} from '@/components/ui/neobrutalism-stars';

export function DashboardPage() {
  return (
    <MainLayout>
      <Header variant="dashboard" />

      {/* Hero Section - Neobrutalism Style */}
      <section className="py-16 bg-chart-1 relative overflow-hidden border-t-4 border-black">
        {/* Floating Stars Background */}
        <div className="absolute inset-0 pointer-events-none">
          <Star1 className="absolute top-10 left-10 star-decoration" size={StarSizes.lg} />
          <Star6 className="absolute top-20 right-20 star-decoration" size={StarSizes.md} />
          <Star7 className="absolute bottom-16 left-32 star-decoration" size={StarSizes.xl} />
        </div>
        <Container className="relative z-10">
          <div className="text-center mb-12">
            <Badge className="bg-chart-8 text-main-foreground brutal-shadow-lg hover:brutal-hover px-8 py-4 text-xl font-black brutal-border-thick rounded-base transform -rotate-1 mb-8">
              <Trophy className="icon-large mr-2 icon-float" />
              <Star8 size={StarSizes.md} className="star-decoration" />
              PANEL DE ADMINISTRACIÓN
              <Star9 size={StarSizes.md} className="star-decoration" />
              <Crown className="icon-large ml-2 icon-float" />
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-main-foreground uppercase mb-6">
              <Star10 size={StarSizes.lg} className="star-decoration inline-block mr-4" />
              DASHBOARD ADMIN
              <Star13 size={StarSizes.lg} className="star-decoration inline-block ml-4" />
            </h1>
            <p className="text-2xl font-bold text-main-foreground/80 uppercase">
              <Heart className="icon-large inline-block mr-2 icon-float" />
              GESTIONA TU NEGOCIO Y CITAS DESDE AQUÍ
              <Sparkles className="icon-large inline-block ml-2 icon-float" />
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-16 bg-chart-3">
        {/* Quick Stats - Neobrutalism Style */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-chart-1 brutal-border-thick brutal-shadow-lg hover:brutal-hover transition-all duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-black text-main-foreground uppercase mb-2">
                <Calendar className="icon-standard mr-2 icon-float inline-block" />
                <Star19 size={StarSizes.sm} className="star-decoration" />
                CITAS HOY
              </CardTitle>
              <div className="text-3xl font-black text-main-foreground">8</div>
            </CardHeader>
          </Card>

          <Card className="bg-chart-2 brutal-border-thick brutal-shadow-lg hover:brutal-hover transition-all duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-black text-main-foreground uppercase mb-2">
                <Users className="icon-standard mr-2 icon-float inline-block" />
                <Star20 size={StarSizes.sm} className="star-decoration" />
                ESTA SEMANA
              </CardTitle>
              <div className="text-3xl font-black text-main-foreground">24</div>
            </CardHeader>
          </Card>

          <Card className="bg-chart-6 brutal-border-thick brutal-shadow-lg hover:brutal-hover transition-all duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-black text-main-foreground uppercase mb-2">
                <DollarSign className="icon-standard mr-2 icon-float inline-block" />
                <Star21 size={StarSizes.sm} className="star-decoration" />
                INGRESOS DEL MES
              </CardTitle>
              <div className="text-3xl font-black text-main-foreground">$2,450</div>
            </CardHeader>
          </Card>

          <Card className="bg-chart-8 brutal-border-thick brutal-shadow-lg hover:brutal-hover transition-all duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-black text-main-foreground uppercase mb-2">
                <TrendingUp className="icon-standard mr-2 icon-float inline-block" />
                <Star22 size={StarSizes.sm} className="star-decoration" />
                CLIENTES NUEVOS
              </CardTitle>
              <div className="text-3xl font-black text-main-foreground">12</div>
            </CardHeader>
          </Card>
        </div>

        {/* Today's Appointments - Neobrutalism Style */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-chart-4 brutal-border-thick brutal-shadow-xl">
            <CardHeader>
              <CardTitle className="text-main-foreground font-black text-xl uppercase">
                <Calendar className="icon-large mr-2 icon-float inline-block" />
                <Star23 size={StarSizes.sm} className="star-decoration" />
                CITAS DE HOY
              </CardTitle>
              <CardDescription className="text-main-foreground/80 font-bold uppercase">
                PRÓXIMAS CITAS PROGRAMADAS PARA HOY
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-chart-6 brutal-border rounded-base">
                  <div>
                    <p className="font-black text-main-foreground uppercase">BAÑO COMPLETO - MAX (GOLDEN)</p>
                    <p className="text-sm text-main-foreground/80 font-bold uppercase">MARÍA GONZÁLEZ • 10:00 AM</p>
                  </div>
                  <Button size="sm" className="bg-chart-8 text-main-foreground brutal-border font-black uppercase">VER DETALLES</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-chart-7 brutal-border rounded-base">
                  <div>
                    <p className="font-black text-main-foreground uppercase">CORTE Y BAÑO - LUNA (POODLE)</p>
                    <p className="text-sm text-main-foreground/80 font-bold uppercase">CARLOS RUIZ • 2:30 PM</p>
                  </div>
                  <Button size="sm" className="bg-chart-8 text-main-foreground brutal-border font-black uppercase">VER DETALLES</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-chart-2 brutal-border-thick brutal-shadow-xl">
            <CardHeader>
              <CardTitle className="text-main-foreground font-black text-xl uppercase">
                <Zap className="icon-large mr-2 icon-float inline-block" />
                <Star24 size={StarSizes.sm} className="star-decoration" />
                ACCIONES RÁPIDAS
              </CardTitle>
              <CardDescription className="text-main-foreground/80 font-bold uppercase">
                TAREAS FRECUENTES DE TU NEGOCIO
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start bg-chart-1 text-main-foreground brutal-border font-black uppercase hover:brutal-hover">
                <Calendar className="icon-standard mr-2 icon-float" />
                BLOQUEAR HORARIO
              </Button>
              <Button className="w-full justify-start bg-chart-6 text-main-foreground brutal-border font-black uppercase hover:brutal-hover">
                <Star className="icon-standard mr-2 icon-float" />
                AGREGAR CITA MANUAL
              </Button>
              <Button className="w-full justify-start bg-chart-7 text-main-foreground brutal-border font-black uppercase hover:brutal-hover">
                <PawPrint className="icon-standard mr-2 icon-float" />
                VER TODOS LOS SERVICIOS
              </Button>
              <Button className="w-full justify-start bg-chart-8 text-main-foreground brutal-border font-black uppercase hover:brutal-hover">
                <Users className="icon-standard mr-2 icon-float" />
                GESTIONAR CLIENTES
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    </MainLayout>
  );
}