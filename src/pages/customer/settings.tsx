import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Navigation } from '@/components/navigation'
import { ArrowLeft, Settings, Bell, Lock, Smartphone, Mail } from 'lucide-react'

export default function CustomerSettings() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/customer/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Settings className="w-8 h-8" />
            Configuración
          </h1>
          <p className="text-muted-foreground">
            Gestiona tus preferencias y configuración de cuenta
          </p>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Notificaciones por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir confirmaciones y recordatorios de citas
                  </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Notificaciones Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificaciones en tiempo real en el navegador
                  </p>
                </div>
                <Switch id="push-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-notifications">Notificaciones SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Recordatorios por mensaje de texto
                  </p>
                </div>
                <Switch id="sms-notifications" />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Privacidad y Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Lock className="w-4 h-4 mr-2" />
                Cambiar Contraseña
              </Button>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="profile-visibility">Perfil Público</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir que las peluquerías vean tu perfil
                  </p>
                </div>
                <Switch id="profile-visibility" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Preferencias de la App
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-confirm">Auto-confirmar Citas</Label>
                  <p className="text-sm text-muted-foreground">
                    Confirmar automáticamente citas pendientes
                  </p>
                </div>
                <Switch id="auto-confirm" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-emails">Emails Promocionales</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir ofertas y promociones especiales
                  </p>
                </div>
                <Switch id="marketing-emails" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones de Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Exportar mis Datos
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                Eliminar mi Cuenta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}