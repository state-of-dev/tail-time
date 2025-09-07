import { Header } from '@/components/layout/header';
import { MainLayout, Container } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SubdomainHomeProps {
  businessName?: string;
}

export function SubdomainHome({ businessName = "Salon Fluffy" }: SubdomainHomeProps) {
  return (
    <MainLayout>
      <Header variant="subdomain" businessName={businessName} />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Bienvenido a {businessName}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Especialistas en el cuidado y estética de tu mascota. 
                Con más de 10 años de experiencia, brindamos servicios 
                profesionales con amor y dedicación.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg">
                  Reservar Cita
                </Button>
                <Button variant="outline" size="lg">
                  Ver Portafolio
                </Button>
              </div>
            </div>
            
            <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
              <p className="text-muted-foreground">Foto del negocio</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-muted/50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nuestros Servicios</h2>
            <p className="text-lg text-muted-foreground">
              Servicios profesionales para el bienestar de tu mascota
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Baño Completo</CardTitle>
                <CardDescription>
                  Baño con productos premium, secado y cepillado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">45 min</p>
                    <p className="text-2xl font-bold">$25</p>
                  </div>
                  <Button>Reservar</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Corte y Peinado</CardTitle>
                <CardDescription>
                  Corte profesional según raza y preferencias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">60 min</p>
                    <p className="text-2xl font-bold">$40</p>
                  </div>
                  <Button>Reservar</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Spa Relajante</CardTitle>
                <CardDescription>
                  Tratamiento completo con aromaterapia y masaje
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">90 min</p>
                    <p className="text-2xl font-bold">$65</p>
                  </div>
                  <Button>Reservar</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Portfolio Preview */}
      <section className="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nuestro Trabajo</h2>
            <p className="text-lg text-muted-foreground">
              Algunos de nuestros trabajos recientes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-muted rounded-lg aspect-square flex items-center justify-center">
                <p className="text-muted-foreground">Foto {item}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline">Ver todo el portafolio</Button>
          </div>
        </Container>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-muted/50">
        <Container>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Contáctanos</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="font-semibold mb-2">Dirección</h3>
              <p className="text-muted-foreground">
                Av. Principal 123<br />
                Centro, Ciudad
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Teléfono</h3>
              <p className="text-muted-foreground">
                +1 (555) 123-4567
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Horarios</h3>
              <p className="text-muted-foreground">
                Lun - Sáb: 9:00 AM - 6:00 PM<br />
                Dom: Cerrado
              </p>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}