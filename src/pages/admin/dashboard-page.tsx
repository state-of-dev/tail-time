import { Header } from '@/components/layout/header';
import { MainLayout, Container } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function DashboardPage() {
  return (
    <MainLayout>
      <Header variant="dashboard" />
      
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Gestiona tu negocio y citas desde aquí
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Citas Hoy
              </CardTitle>
              <div className="text-2xl font-bold">8</div>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Esta Semana
              </CardTitle>
              <div className="text-2xl font-bold">24</div>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ingresos del Mes
              </CardTitle>
              <div className="text-2xl font-bold">$2,450</div>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Clientes Nuevos
              </CardTitle>
              <div className="text-2xl font-bold">12</div>
            </CardHeader>
          </Card>
        </div>

        {/* Today's Appointments */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Citas de Hoy</CardTitle>
              <CardDescription>
                Próximas citas programadas para hoy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Baño completo - Max (Golden)</p>
                    <p className="text-sm text-muted-foreground">María González • 10:00 AM</p>
                  </div>
                  <Button size="sm" variant="outline">Ver detalles</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Corte y baño - Luna (Poodle)</p>
                    <p className="text-sm text-muted-foreground">Carlos Ruiz • 2:30 PM</p>
                  </div>
                  <Button size="sm" variant="outline">Ver detalles</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>
                Tareas frecuentes de tu negocio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start">
                📅 Bloquear horario
              </Button>
              <Button className="w-full justify-start" variant="outline">
                ➕ Agregar cita manual
              </Button>
              <Button className="w-full justify-start" variant="outline">
                📋 Ver todos los servicios
              </Button>
              <Button className="w-full justify-start" variant="outline">
                👥 Gestionar clientes
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    </MainLayout>
  );
}