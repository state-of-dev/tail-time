import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Container } from '@/components/layout/main-layout';

export function ComponentsDemo() {
  return (
    <div className="py-20">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="pet" className="mb-4">
              🧪 Componentes Demo
            </Badge>
            <h1 className="text-4xl font-display font-bold mb-4">
              shadcn/ui Components Demo
            </h1>
            <p className="text-xl text-muted-foreground">
              Prueba de todos los componentes de shadcn/ui integrados
            </p>
          </div>

          <div className="space-y-12">
            {/* Buttons Section */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>Variantes de Botones</CardTitle>
                  <CardDescription>
                    Diferentes estilos de botones disponibles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <Button variant="default">Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-wrap gap-4">
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="warning">Warning</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-wrap gap-4">
                    <Button variant="pet">Pet Primary</Button>
                    <Button variant="pet-secondary">Pet Secondary</Button>
                    <Button variant="gradient">Gradient</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-wrap gap-4 items-end">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="xl">Extra Large</Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Cards Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Cards</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Card Simple</CardTitle>
                    <CardDescription>Una card básica con contenido</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Este es el contenido de la card.</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-pet-primary/5 to-pet-accent/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      🐕 Card con Gradiente
                    </CardTitle>
                    <CardDescription>Card con fondo degradado</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="pet">Pet Badge</Badge>
                  </CardContent>
                </Card>
                
                <Card className="border-pet-primary/20 shadow-lg">
                  <CardHeader>
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="" />
                      <AvatarFallback>🐾</AvatarFallback>
                    </Avatar>
                    <CardTitle>Card con Avatar</CardTitle>
                    <CardDescription>Incluye un avatar en el header</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </section>

            {/* Forms Section */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>Elementos de Formulario</CardTitle>
                  <CardDescription>
                    Inputs y elementos de formulario
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input id="name" placeholder="Ingresa tu nombre" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="tu@email.com" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Descripción</Label>
                    <Input id="bio" placeholder="Cuéntanos sobre ti..." />
                  </div>
                  
                  <div className="flex gap-4">
                    <Button variant="pet">Guardar</Button>
                    <Button variant="outline">Cancelar</Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Data Elements Section */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>Elementos de Datos</CardTitle>
                  <CardDescription>
                    Badges, avatars y separadores
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Badges</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default">Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                      <Badge variant="success">Success</Badge>
                      <Badge variant="warning">Warning</Badge>
                      <Badge variant="pet">Pet</Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-4">Avatars</h3>
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <Avatar>
                        <AvatarFallback className="bg-pet-primary text-white">🐕</AvatarFallback>
                      </Avatar>
                      <Avatar>
                        <AvatarFallback className="bg-pet-secondary text-white">🐱</AvatarFallback>
                      </Avatar>
                      <Avatar>
                        <AvatarFallback className="bg-pet-accent text-white">🐾</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}