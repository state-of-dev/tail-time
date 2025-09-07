import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context-simple';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft,
  Settings,
  Building,
  Clock,
  Globe,
  Bell,
  CreditCard,
  Shield,
  Download,
  Upload,
  Save,
  Camera,
  Link,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  User,
  Key,
  Trash2,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

interface BusinessSettings {
  // Basic Info
  businessName: string;
  slug: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  logoUrl?: string;
  coverImageUrl?: string;
  
  // Social Media
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  
  // Business Hours (from A4)
  businessHours: any;
  
  // Notifications
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  reminderTiming: number; // hours before
  newAppointmentAlert: boolean;
  
  // Payment Settings
  stripeConnected: boolean;
  paypalConnected: boolean;
  acceptCashPayments: boolean;
  requireDepositForBooking: boolean;
  depositPercentage: number;
  
  // Booking Settings
  allowOnlineBooking: boolean;
  requireApprovalForBookings: boolean;
  advanceBookingDays: number;
  maxDailyAppointments: number;
  bufferTimeBetweenAppointments: number;
  
  // Privacy & Security
  profilePublic: boolean;
  showPhonePublicly: boolean;
  showEmailPublicly: boolean;
  allowReviews: boolean;
  moderateReviews: boolean;
}

const timeZones = [
  'America/Mexico_City',
  'America/Tijuana',
  'America/Mazatlan',
  'America/Cancun'
];

const reminderOptions = [
  { value: 2, label: '2 horas antes' },
  { value: 4, label: '4 horas antes' },
  { value: 24, label: '1 día antes' },
  { value: 48, label: '2 días antes' }
];

const advanceBookingOptions = [
  { value: 1, label: '1 día' },
  { value: 3, label: '3 días' },
  { value: 7, label: '1 semana' },
  { value: 14, label: '2 semanas' },
  { value: 30, label: '1 mes' }
];

export default function Settings() {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const [settings, setSettings] = useState<BusinessSettings>({
    businessName: '',
    slug: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    reminderTiming: 24,
    newAppointmentAlert: true,
    stripeConnected: false,
    paypalConnected: false,
    acceptCashPayments: true,
    requireDepositForBooking: false,
    depositPercentage: 20,
    allowOnlineBooking: true,
    requireApprovalForBookings: false,
    advanceBookingDays: 14,
    maxDailyAppointments: 10,
    bufferTimeBetweenAppointments: 15,
    profilePublic: true,
    showPhonePublicly: true,
    showEmailPublicly: false,
    allowReviews: true,
    moderateReviews: true,
    businessHours: null
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<'logo' | 'cover' | null>(null);

  useEffect(() => {
    if (!user || !businessSlug) return;
    loadSettings();
  }, [user, businessSlug]);

  const loadSettings = async () => {
    try {
      // Mock data for now
      const mockSettings: BusinessSettings = {
        businessName: 'Salon Fluffy',
        slug: businessSlug || '',
        description: 'El mejor salon para mascotas en la ciudad. Especialistas en cuidado y estética canina.',
        phone: '+52 555 1234 5678',
        email: 'salon@fluffy.com',
        address: 'Av. Insurgentes Sur 123, Col. Roma Norte, CDMX',
        logoUrl: '/api/placeholder/150/150',
        coverImageUrl: '/api/placeholder/800/400',
        instagramUrl: '@salonfluffy',
        facebookUrl: 'SalonFluffyMX',
        websiteUrl: 'https://salonfluffy.com',
        businessHours: {
          monday: { isOpen: true, hours: { start: '09:00', end: '18:00' } },
          tuesday: { isOpen: true, hours: { start: '09:00', end: '18:00' } },
          wednesday: { isOpen: true, hours: { start: '09:00', end: '18:00' } },
          thursday: { isOpen: true, hours: { start: '09:00', end: '18:00' } },
          friday: { isOpen: true, hours: { start: '09:00', end: '18:00' } },
          saturday: { isOpen: true, hours: { start: '09:00', end: '16:00' } },
          sunday: { isOpen: false, hours: { start: '09:00', end: '16:00' } }
        },
        emailNotifications: true,
        smsNotifications: true,
        appointmentReminders: true,
        reminderTiming: 24,
        newAppointmentAlert: true,
        stripeConnected: true,
        paypalConnected: false,
        acceptCashPayments: true,
        requireDepositForBooking: false,
        depositPercentage: 20,
        allowOnlineBooking: true,
        requireApprovalForBookings: false,
        advanceBookingDays: 14,
        maxDailyAppointments: 10,
        bufferTimeBetweenAppointments: 15,
        profilePublic: true,
        showPhonePublicly: true,
        showEmailPublicly: false,
        allowReviews: true,
        moderateReviews: true
      };

      setSettings(mockSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (section?: string) => {
    setIsSaving(true);
    try {
      // TODO: Save to Supabase
      setSaveMessage(`${section || 'Configuración'} guardada correctamente`);
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Error al guardar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'logo' | 'cover') => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    setUploadingImage(type);
    try {
      // TODO: Upload to Supabase Storage
      const imageUrl = URL.createObjectURL(file);
      
      if (type === 'logo') {
        setSettings(prev => ({ ...prev, logoUrl: imageUrl }));
      } else {
        setSettings(prev => ({ ...prev, coverImageUrl: imageUrl }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('¿Estás seguro? Esta acción no se puede deshacer.')) {
      try {
        // TODO: Delete account logic
        await signOut();
        navigate('/');
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  const copyPublicUrl = () => {
    const url = `${window.location.origin}/business/${settings.slug}`;
    navigator.clipboard.writeText(url);
    setSaveMessage('URL copiada al portapapeles');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-8 h-8 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/groomer/${businessSlug}`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuración
                </h1>
                <p className="text-sm text-muted-foreground">
                  Administra la configuración de tu negocio
                </p>
              </div>
            </div>

            {saveMessage && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">{saveMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="business" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Negocio
            </TabsTrigger>
            <TabsTrigger value="hours" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Horarios
            </TabsTrigger>
            <TabsTrigger value="booking" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Reservas
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Pagos
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Seguridad
            </TabsTrigger>
          </TabsList>

          {/* Business Info Tab */}
          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Negocio</CardTitle>
                <CardDescription>
                  Administra la información básica y apariencia de tu perfil público
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium">Logo del Negocio</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        {settings.logoUrl ? (
                          <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="logo-upload"
                          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logo')}
                        />
                        <label htmlFor="logo-upload">
                          <Button variant="outline" size="sm" asChild disabled={uploadingImage === 'logo'}>
                            <span>
                              {uploadingImage === 'logo' ? (
                                <>Subiendo...</>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Cambiar Logo
                                </>
                              )}
                            </span>
                          </Button>
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Recomendado: 200x200px, máximo 2MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Imagen de Portada</Label>
                    <div className="mt-2">
                      <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        {settings.coverImageUrl ? (
                          <img src={settings.coverImageUrl} alt="Portada" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="mt-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="cover-upload"
                          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'cover')}
                        />
                        <label htmlFor="cover-upload">
                          <Button variant="outline" size="sm" asChild disabled={uploadingImage === 'cover'}>
                            <span>
                              {uploadingImage === 'cover' ? (
                                <>Subiendo...</>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Cambiar Portada
                                </>
                              )}
                            </span>
                          </Button>
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Recomendado: 1200x400px, máximo 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Nombre del Negocio</Label>
                    <Input
                      id="businessName"
                      value={settings.businessName}
                      onChange={(e) => setSettings(prev => ({ ...prev, businessName: e.target.value }))}
                      placeholder="Mi Salon de Mascotas"
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">URL Pública</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm">
                        {window.location.host}/business/
                      </span>
                      <Input
                        id="slug"
                        value={settings.slug}
                        onChange={(e) => setSettings(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                        className="rounded-l-none"
                        placeholder="mi-salon"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-l-none border-l-0"
                        onClick={copyPublicUrl}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+52 555 123 4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email de Contacto</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="contacto@misalon.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={settings.address}
                    onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Calle Principal 123, Colonia Centro"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción del Negocio</Label>
                  <Textarea
                    id="description"
                    value={settings.description}
                    onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe tu negocio, servicios y lo que te hace especial..."
                    rows={4}
                  />
                </div>

                <Separator />

                {/* Social Media */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Redes Sociales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="instagram" className="flex items-center gap-2">
                        <Instagram className="w-4 h-4" />
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        value={settings.instagramUrl || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, instagramUrl: e.target.value }))}
                        placeholder="@misalon o https://instagram.com/misalon"
                      />
                    </div>

                    <div>
                      <Label htmlFor="facebook" className="flex items-center gap-2">
                        <Facebook className="w-4 h-4" />
                        Facebook
                      </Label>
                      <Input
                        id="facebook"
                        value={settings.facebookUrl || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, facebookUrl: e.target.value }))}
                        placeholder="MiSalon o https://facebook.com/misalon"
                      />
                    </div>

                    <div>
                      <Label htmlFor="website" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Sitio Web
                      </Label>
                      <Input
                        id="website"
                        value={settings.websiteUrl || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, websiteUrl: e.target.value }))}
                        placeholder="https://misalon.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave('Información del negocio')} disabled={isSaving}>
                    {isSaving ? (
                      <>Guardando...</>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Hours Tab */}
          <TabsContent value="hours" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Horarios de Atención</CardTitle>
                <CardDescription>
                  Configura cuándo está abierto tu negocio para recibir citas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Clock className="w-4 h-4" />
                    <AlertDescription>
                      Los horarios se configuraron durante el proceso inicial. 
                      <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/setup/business-hours')}>
                        Modificar horarios
                      </Button>
                    </AlertDescription>
                  </Alert>

                  {/* Display current hours */}
                  {settings.businessHours && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                      {Object.entries(settings.businessHours).map(([day, schedule]: [string, any]) => (
                        <Card key={day} className={schedule.isOpen ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}>
                          <CardContent className="p-4 text-center">
                            <h4 className="font-medium capitalize">{day}</h4>
                            {schedule.isOpen ? (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-green-600">
                                  {schedule.hours.start} - {schedule.hours.end}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground mt-2">Cerrado</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Booking Settings Tab */}
          <TabsContent value="booking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Reservas</CardTitle>
                <CardDescription>
                  Administra cómo los clientes pueden hacer reservas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Permitir reservas online</Label>
                      <p className="text-sm text-muted-foreground">Los clientes pueden reservar directamente desde tu página</p>
                    </div>
                    <Switch
                      checked={settings.allowOnlineBooking}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowOnlineBooking: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Requerir aprobación</Label>
                      <p className="text-sm text-muted-foreground">Las reservas necesitan tu confirmación antes de ser confirmadas</p>
                    </div>
                    <Switch
                      checked={settings.requireApprovalForBookings}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireApprovalForBookings: checked }))}
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Reservas con anticipación</Label>
                      <Select
                        value={settings.advanceBookingDays.toString()}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, advanceBookingDays: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {advanceBookingOptions.map(option => (
                            <SelectItem key={option.value} value={option.value.toString()}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Máximo tiempo de anticipación para reservar
                      </p>
                    </div>

                    <div>
                      <Label>Máximo citas por día</Label>
                      <Input
                        type="number"
                        min="1"
                        max="50"
                        value={settings.maxDailyAppointments}
                        onChange={(e) => setSettings(prev => ({ ...prev, maxDailyAppointments: parseInt(e.target.value) || 1 }))}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Límite de citas que aceptas por día
                      </p>
                    </div>

                    <div>
                      <Label>Tiempo entre citas (min)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="120"
                        step="15"
                        value={settings.bufferTimeBetweenAppointments}
                        onChange={(e) => setSettings(prev => ({ ...prev, bufferTimeBetweenAppointments: parseInt(e.target.value) || 0 }))}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Tiempo de limpieza/preparación entre citas
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave('Configuración de reservas')} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Notificaciones</CardTitle>
                <CardDescription>
                  Administra cómo y cuándo recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Notificaciones por email</Label>
                      <p className="text-sm text-muted-foreground">Recibir emails sobre nuevas citas y actualizaciones</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Notificaciones por SMS</Label>
                      <p className="text-sm text-muted-foreground">Recibir mensajes de texto sobre citas importantes</p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Alerta de nueva cita</Label>
                      <p className="text-sm text-muted-foreground">Notificación inmediata cuando un cliente agenda una cita</p>
                    </div>
                    <Switch
                      checked={settings.newAppointmentAlert}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, newAppointmentAlert: checked }))}
                    />
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium">Recordatorios de citas</Label>
                    <p className="text-sm text-muted-foreground mb-3">Enviar recordatorios automáticos a los clientes</p>
                    
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={settings.appointmentReminders}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, appointmentReminders: checked }))}
                      />
                      
                      {settings.appointmentReminders && (
                        <Select
                          value={settings.reminderTiming.toString()}
                          onValueChange={(value) => setSettings(prev => ({ ...prev, reminderTiming: parseInt(value) }))}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {reminderOptions.map(option => (
                              <SelectItem key={option.value} value={option.value.toString()}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave('Notificaciones')} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Pagos</CardTitle>
                <CardDescription>
                  Administra los métodos de pago que aceptas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  {/* Payment Methods */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Métodos de Pago</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Stripe</h4>
                            <p className="text-sm text-muted-foreground">
                              {settings.stripeConnected ? 'Cuenta conectada y activa' : 'Acepta tarjetas de crédito y débito'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {settings.stripeConnected ? (
                            <Badge className="bg-green-100 text-green-800">Conectado</Badge>
                          ) : (
                            <Button variant="outline" size="sm">
                              <Link className="w-4 h-4 mr-2" />
                              Conectar
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">PayPal</h4>
                            <p className="text-sm text-muted-foreground">
                              {settings.paypalConnected ? 'Cuenta conectada y activa' : 'Acepta pagos de PayPal'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {settings.paypalConnected ? (
                            <Badge className="bg-green-100 text-green-800">Conectado</Badge>
                          ) : (
                            <Button variant="outline" size="sm">
                              <Link className="w-4 h-4 mr-2" />
                              Conectar
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Pago en Efectivo</h4>
                            <p className="text-sm text-muted-foreground">Los clientes pueden pagar al llegar</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.acceptCashPayments}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, acceptCashPayments: checked }))}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Deposit Settings */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Configuración de Depósitos</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Requerir depósito para reservar</Label>
                          <p className="text-sm text-muted-foreground">Los clientes deben pagar un depósito al reservar</p>
                        </div>
                        <Switch
                          checked={settings.requireDepositForBooking}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireDepositForBooking: checked }))}
                        />
                      </div>

                      {settings.requireDepositForBooking && (
                        <div>
                          <Label>Porcentaje de depósito (%)</Label>
                          <Input
                            type="number"
                            min="10"
                            max="100"
                            value={settings.depositPercentage}
                            onChange={(e) => setSettings(prev => ({ ...prev, depositPercentage: parseInt(e.target.value) || 20 }))}
                            className="w-32"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Porcentaje del total del servicio que se debe pagar como depósito
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave('Configuración de pagos')} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security & Privacy Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacidad y Seguridad</CardTitle>
                <CardDescription>
                  Controla la visibilidad de tu perfil y configuración de seguridad
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  {/* Privacy Settings */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Configuración de Privacidad</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Perfil público</Label>
                          <p className="text-sm text-muted-foreground">Tu negocio aparece en búsquedas y directorios</p>
                        </div>
                        <Switch
                          checked={settings.profilePublic}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, profilePublic: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Mostrar teléfono públicamente</Label>
                          <p className="text-sm text-muted-foreground">Los clientes pueden ver tu número de teléfono</p>
                        </div>
                        <Switch
                          checked={settings.showPhonePublicly}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showPhonePublicly: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Mostrar email públicamente</Label>
                          <p className="text-sm text-muted-foreground">Los clientes pueden ver tu email de contacto</p>
                        </div>
                        <Switch
                          checked={settings.showEmailPublicly}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showEmailPublicly: checked }))}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Reviews Settings */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Configuración de Reseñas</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Permitir reseñas</Label>
                          <p className="text-sm text-muted-foreground">Los clientes pueden escribir reseñas de tu servicio</p>
                        </div>
                        <Switch
                          checked={settings.allowReviews}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowReviews: checked }))}
                        />
                      </div>

                      {settings.allowReviews && (
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Moderar reseñas</Label>
                            <p className="text-sm text-muted-foreground">Las reseñas necesitan tu aprobación antes de publicarse</p>
                          </div>
                          <Switch
                            checked={settings.moderateReviews}
                            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, moderateReviews: checked }))}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Account Actions */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Gestión de Cuenta</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Cambiar contraseña</h4>
                          <p className="text-sm text-muted-foreground">Actualiza tu contraseña de acceso</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Key className="w-4 h-4 mr-2" />
                          Cambiar
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Exportar datos</h4>
                          <p className="text-sm text-muted-foreground">Descarga una copia de toda tu información</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Exportar
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                        <div>
                          <h4 className="font-medium text-red-900">Eliminar cuenta</h4>
                          <p className="text-sm text-red-700">Esta acción no se puede deshacer</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setShowDeleteConfirm(true)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave('Configuración de privacidad')} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Account Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Eliminar Cuenta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción eliminará permanentemente:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 mb-6 list-disc list-inside">
                <li>Tu perfil de negocio</li>
                <li>Todas las citas programadas</li>
                <li>Historial de clientes</li>
                <li>Portafolio de trabajos</li>
                <li>Configuración personalizada</li>
              </ul>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteAccount}
                  className="flex-1"
                >
                  Sí, Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}