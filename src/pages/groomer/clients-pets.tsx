import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/auth-context-simple';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ArrowLeft,
  Users,
  Search,
  Filter,
  Plus,
  User,
  Dog,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  Heart,
  Edit,
  Eye,
  FileText,
  Clock,
  AlertTriangle,
  Pill,
  Stethoscope,
  TrendingUp,
  BarChart3,
  CalendarDays,
  Scissors,
  Gift
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  totalSpent: number;
  totalAppointments: number;
  lastAppointment: string;
  averageFrequency: number; // days between visits
  favoriteService: string;
  isVip: boolean;
  pets: Pet[];
  notes: string;
}

interface Pet {
  id: string;
  customerId: string;
  name: string;
  type: 'Perro' | 'Gato' | 'Conejo' | 'Hurón' | 'Otro';
  breed: string;
  age: number;
  weight: number;
  color: string;
  gender: 'Macho' | 'Hembra';
  photoUrl?: string;
  // Medical info
  allergies: string[];
  medications: string[];
  conditions: string[];
  lastVetVisit: string;
  vaccinationsCurrent: boolean;
  vetContact: string;
  // Behavior & preferences
  behaviorNotes: string;
  groomingPreferences: string;
  specialInstructions: string;
  // History
  appointmentHistory: PetAppointment[];
  totalVisits: number;
  lastVisit: string;
  nextAppointment?: string;
}

interface PetAppointment {
  id: string;
  date: string;
  service: string;
  duration: number;
  amount: number;
  status: string;
  groomerNotes: string;
  beforePhoto?: string;
  afterPhoto?: string;
}

const petTypes = ['Perro', 'Gato', 'Conejo', 'Hurón', 'Otro'];
const genders = ['Macho', 'Hembra'];

export default function ClientsPets() {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'lastVisit' | 'totalSpent' | 'frequency'>('name');
  const [filterBy, setFilterBy] = useState<'all' | 'new' | 'frequent' | 'inactive' | 'vip'>('all');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  useEffect(() => {
    if (!user || !businessSlug) return;
    loadCustomers();
  }, [user, businessSlug]);

  const loadCustomers = async () => {
    // Mock data for now
    const mockCustomers: Customer[] = [
      {
        id: '1',
        name: 'María González',
        email: 'maria.gonzalez@email.com',
        phone: '+52 555 1234 5678',
        address: 'Av. Reforma 123, Col. Centro, CDMX',
        registrationDate: '2024-01-15',
        totalSpent: 2850,
        totalAppointments: 8,
        lastAppointment: '2024-08-25',
        averageFrequency: 21, // every 3 weeks
        favoriteService: 'Corte y Baño',
        isVip: true,
        notes: 'Cliente muy puntual y cuidadosa con sus mascotas. Prefiere citas temprano.',
        pets: [
          {
            id: 'pet-1',
            customerId: '1',
            name: 'Max',
            type: 'Perro',
            breed: 'Golden Retriever',
            age: 3,
            weight: 28.5,
            color: 'Dorado',
            gender: 'Macho',
            photoUrl: '/api/placeholder/150/150',
            allergies: ['Polen', 'Champú con sulfatos'],
            medications: ['Antihistamínico ocasional'],
            conditions: ['Dermatitis leve en temporada de polen'],
            lastVetVisit: '2024-06-15',
            vaccinationsCurrent: true,
            vetContact: 'Dr. Rodriguez - Veterinaria San Angel - (555) 9876-5432',
            behaviorNotes: 'Muy sociable y tranquilo. Le gusta el agua tibia.',
            groomingPreferences: 'Corte medio, no muy corto en invierno',
            specialInstructions: 'Sensible en las patas traseras, ser gentil',
            appointmentHistory: [
              {
                id: 'apt-1',
                date: '2024-08-25',
                service: 'Baño Completo',
                duration: 60,
                amount: 450,
                status: 'completed',
                groomerNotes: 'Muy cooperativo, excelente comportamiento',
                beforePhoto: '/api/placeholder/200/200',
                afterPhoto: '/api/placeholder/200/200'
              }
            ],
            totalVisits: 6,
            lastVisit: '2024-08-25',
            nextAppointment: '2024-09-15'
          }
        ]
      },
      {
        id: '2',
        name: 'Carlos Ruiz',
        email: 'carlos.ruiz@email.com',
        phone: '+52 555 8765 4321',
        address: 'Calle Luna 456, Col. Roma Norte, CDMX',
        registrationDate: '2024-02-20',
        totalSpent: 1200,
        totalAppointments: 3,
        lastAppointment: '2024-08-10',
        averageFrequency: 45,
        favoriteService: 'Corte Estilizado',
        isVip: false,
        notes: '',
        pets: [
          {
            id: 'pet-2',
            customerId: '2',
            name: 'Luna',
            type: 'Gato',
            breed: 'Persa',
            age: 2,
            weight: 4.2,
            color: 'Blanco',
            gender: 'Hembra',
            allergies: [],
            medications: [],
            conditions: ['Pelo largo que requiere cepillado frecuente'],
            lastVetVisit: '2024-05-10',
            vaccinationsCurrent: true,
            vetContact: 'Dra. Martínez - Clínica Felina - (555) 1111-2222',
            behaviorNotes: 'Un poco nerviosa al principio, pero se calma con paciencia',
            groomingPreferences: 'Cepillado suave, corte higiénico',
            specialInstructions: 'Usar secadora en temperatura baja',
            appointmentHistory: [],
            totalVisits: 3,
            lastVisit: '2024-08-10'
          }
        ]
      },
      {
        id: '3',
        name: 'Ana Martín',
        email: 'ana.martin@email.com',
        phone: '+52 555 9999 1111',
        address: 'Insurgentes Sur 789, Col. Del Valle, CDMX',
        registrationDate: '2024-07-01',
        totalSpent: 380,
        totalAppointments: 1,
        lastAppointment: '2024-07-15',
        averageFrequency: 0, // new customer
        favoriteService: 'Baño Básico',
        isVip: false,
        notes: 'Cliente nueva, muy interesada en servicios premium.',
        pets: [
          {
            id: 'pet-3',
            customerId: '3',
            name: 'Rocky',
            type: 'Perro',
            breed: 'French Poodle',
            age: 1,
            weight: 8.5,
            color: 'Negro',
            gender: 'Macho',
            allergies: [],
            medications: [],
            conditions: [],
            lastVetVisit: '2024-06-01',
            vaccinationsCurrent: true,
            vetContact: 'Dr. López - Veterinaria Central - (555) 3333-4444',
            behaviorNotes: 'Cachorro muy energético, necesita paciencia',
            groomingPreferences: 'Corte cachorro, mantener forma natural',
            specialInstructions: 'Primera experiencia de grooming',
            appointmentHistory: [],
            totalVisits: 1,
            lastVisit: '2024-07-15'
          }
        ]
      }
    ];

    setCustomers(mockCustomers);
    setIsLoading(false);
  };

  const filteredAndSortedCustomers = customers
    .filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.pets.some(pet => pet.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFilter = (() => {
        switch (filterBy) {
          case 'new':
            return customer.totalAppointments <= 2;
          case 'frequent':
            return customer.averageFrequency > 0 && customer.averageFrequency <= 30;
          case 'inactive':
            const daysSinceLastVisit = Math.floor((new Date().getTime() - new Date(customer.lastAppointment).getTime()) / (1000 * 3600 * 24));
            return daysSinceLastVisit > 60;
          case 'vip':
            return customer.isVip;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'lastVisit':
          return new Date(b.lastAppointment).getTime() - new Date(a.lastAppointment).getTime();
        case 'totalSpent':
          return b.totalSpent - a.totalSpent;
        case 'frequency':
          return a.averageFrequency - b.averageFrequency;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const customerStats = {
    total: customers.length,
    new: customers.filter(c => c.totalAppointments <= 2).length,
    frequent: customers.filter(c => c.averageFrequency > 0 && c.averageFrequency <= 30).length,
    vip: customers.filter(c => c.isVip).length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    avgSpentPerCustomer: customers.length > 0 ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length : 0
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysSince = (dateStr: string) => {
    return Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 3600 * 24));
  };

  const handleScheduleAppointment = (customerId: string, petId?: string) => {
    // TODO: Navigate to appointment scheduling with pre-filled customer/pet data
    navigate(`/groomer/${businessSlug}/appointments/new?customer=${customerId}&pet=${petId || ''}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Users className="w-8 h-8 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando clientes...</p>
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
                  <Users className="w-5 h-5" />
                  Clientes y Mascotas
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gestiona tu base de clientes y sus mascotas
                </p>
              </div>
            </div>

            <Button onClick={() => setShowCustomerModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Cliente
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Clientes</p>
                  <p className="text-2xl font-bold text-foreground">{customerStats.total}</p>
                </div>
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nuevos</p>
                  <p className="text-2xl font-bold text-foreground">{customerStats.new}</p>
                </div>
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Frecuentes</p>
                  <p className="text-2xl font-bold text-foreground">{customerStats.frequent}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">VIP</p>
                  <p className="text-2xl font-bold text-foreground">{customerStats.vip}</p>
                </div>
                <Star className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ingresos</p>
                  <p className="text-xl font-bold text-foreground">{formatCurrency(customerStats.totalRevenue)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Promedio</p>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(customerStats.avgSpentPerCustomer)}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar clientes, mascotas, teléfono, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterBy} onValueChange={(value) => setFilterBy(value as any)}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="new">Nuevos</SelectItem>
                  <SelectItem value="frequent">Frecuentes</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="lastVisit">Última visita</SelectItem>
                  <SelectItem value="totalSpent">Total gastado</SelectItem>
                  <SelectItem value="frequency">Frecuencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Customers List */}
        <div className="space-y-6">
          {filteredAndSortedCustomers.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12 text-muted-foreground">
                  <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                    <Users className="w-12 h-12 opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    {customers.length === 0 
                      ? 'No tienes clientes aún'
                      : 'No se encontraron clientes'
                    }
                  </h3>
                  <p className="text-sm mb-6">
                    {customers.length === 0
                      ? 'Los clientes se crearán automáticamente cuando hagan su primera reserva'
                      : 'Intenta ajustar los filtros de búsqueda'
                    }
                  </p>
                  <Button onClick={() => setShowCustomerModal(true)} size="lg">
                    <Plus className="w-4 h-4 mr-2" />
                    {customers.length === 0 ? 'Agregar Primer Cliente' : 'Agregar Cliente'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredAndSortedCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="text-lg font-semibold">
                          {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground truncate">
                            {customer.name}
                          </h3>
                          {customer.isVip && (
                            <Badge className="bg-yellow-500 hover:bg-yellow-600">
                              <Star className="w-3 h-3 mr-1" />
                              VIP
                            </Badge>
                          )}
                          {customer.totalAppointments <= 2 && (
                            <Badge variant="secondary">Nuevo</Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{customer.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Última: {formatDate(customer.lastAppointment)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-medium text-green-600">
                              {formatCurrency(customer.totalSpent)}
                            </span>
                          </div>
                        </div>

                        {/* Customer Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground mb-4">
                          <div>
                            <span className="block">Total citas:</span>
                            <span className="font-medium text-foreground">{customer.totalAppointments}</span>
                          </div>
                          <div>
                            <span className="block">Frecuencia:</span>
                            <span className="font-medium text-foreground">
                              {customer.averageFrequency > 0 
                                ? `Cada ${customer.averageFrequency} días`
                                : 'Nueva'
                              }
                            </span>
                          </div>
                          <div>
                            <span className="block">Servicio favorito:</span>
                            <span className="font-medium text-foreground">{customer.favoriteService}</span>
                          </div>
                          <div>
                            <span className="block">Días desde última visita:</span>
                            <span className="font-medium text-foreground">
                              {getDaysSince(customer.lastAppointment)}
                            </span>
                          </div>
                        </div>

                        {/* Pets */}
                        <div className="mb-4">
                          <Label className="text-sm font-medium text-foreground mb-2 block">
                            Mascotas ({customer.pets.length})
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {customer.pets.map(pet => (
                              <div 
                                key={pet.id} 
                                className="flex items-center gap-2 bg-muted rounded-lg p-2 cursor-pointer hover:bg-muted/80 transition-colors"
                                onClick={() => {
                                  setSelectedPet(pet);
                                  setSelectedCustomer(customer);
                                }}
                              >
                                {pet.photoUrl ? (
                                  <img 
                                    src={pet.photoUrl} 
                                    alt={pet.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Dog className="w-4 h-4 text-primary" />
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium">{pet.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {pet.breed} • {pet.age} años
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {customer.notes && (
                          <div className="mb-4">
                            <p className="text-sm bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800">
                              <FileText className="w-4 h-4 inline mr-2" />
                              {customer.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleScheduleAppointment(customer.id)}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Agendar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setEditingCustomer(customer);
                          setShowCustomerModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`tel:${customer.phone}`)}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Customer Detail Modal */}
      <Dialog open={showCustomerModal} onOpenChange={setShowCustomerModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {editingCustomer ? editingCustomer.name : 'Nuevo Cliente'}
            </DialogTitle>
            <DialogDescription>
              {editingCustomer 
                ? 'Información detallada del cliente y sus mascotas'
                : 'Agregar un nuevo cliente al sistema'
              }
            </DialogDescription>
          </DialogHeader>

          {editingCustomer && (
            <Tabs defaultValue="info" className="mt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="pets">Mascotas ({editingCustomer.pets.length})</TabsTrigger>
                <TabsTrigger value="history">Historial</TabsTrigger>
                <TabsTrigger value="stats">Estadísticas</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre Completo</Label>
                    <Input value={editingCustomer.name} readOnly />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input value={editingCustomer.phone} readOnly />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={editingCustomer.email} readOnly />
                  </div>
                  <div>
                    <Label>Fecha de Registro</Label>
                    <Input value={formatDate(editingCustomer.registrationDate)} readOnly />
                  </div>
                </div>

                <div>
                  <Label>Dirección</Label>
                  <Input value={editingCustomer.address} readOnly />
                </div>

                <div>
                  <Label>Notas del Cliente</Label>
                  <Textarea 
                    value={editingCustomer.notes} 
                    placeholder="Agregar notas sobre el cliente..."
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="pets" className="space-y-6 mt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Mascotas del Cliente</h3>
                  <Button onClick={() => setShowPetModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Mascota
                  </Button>
                </div>

                <div className="grid gap-6">
                  {editingCustomer.pets.map(pet => (
                    <Card key={pet.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-20 h-20">
                            {pet.photoUrl ? (
                              <AvatarImage src={pet.photoUrl} alt={pet.name} />
                            ) : (
                              <AvatarFallback>
                                <Dog className="w-8 h-8" />
                              </AvatarFallback>
                            )}
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="text-lg font-semibold">{pet.name}</h4>
                                <p className="text-muted-foreground">
                                  {pet.breed} • {pet.age} años • {pet.weight} kg
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleScheduleAppointment(editingCustomer.id, pet.id)}
                              >
                                <Scissors className="w-4 h-4 mr-2" />
                                Agendar
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Total visitas:</span>
                                <span className="ml-2 font-medium">{pet.totalVisits}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Última visita:</span>
                                <span className="ml-2 font-medium">
                                  {pet.lastVisit ? formatDate(pet.lastVisit) : 'Nunca'}
                                </span>
                              </div>
                              {pet.nextAppointment && (
                                <div>
                                  <span className="text-muted-foreground">Próxima cita:</span>
                                  <span className="ml-2 font-medium text-green-600">
                                    {formatDate(pet.nextAppointment)}
                                  </span>
                                </div>
                              )}
                            </div>

                            {pet.allergies.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-red-600 mb-1">Alergias:</p>
                                <div className="flex flex-wrap gap-1">
                                  {pet.allergies.map((allergy, index) => (
                                    <Badge key={index} variant="destructive" className="text-xs">
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      {allergy}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {pet.behaviorNotes && (
                              <div className="mt-3">
                                <p className="text-sm bg-blue-50 border border-blue-200 rounded p-3 text-blue-800">
                                  <Heart className="w-4 h-4 inline mr-2" />
                                  {pet.behaviorNotes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-6 mt-6">
                <h3 className="text-lg font-semibold">Historial de Citas</h3>
                <div className="space-y-4">
                  {editingCustomer.pets.flatMap(pet => pet.appointmentHistory).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No hay historial de citas</p>
                    </div>
                  ) : (
                    editingCustomer.pets.flatMap(pet => 
                      pet.appointmentHistory.map(appointment => (
                        <Card key={appointment.id}>
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{appointment.service}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(appointment.date)} • {pet.name} • {appointment.duration} min
                                </p>
                                {appointment.groomerNotes && (
                                  <p className="text-sm mt-2 text-muted-foreground">
                                    {appointment.groomerNotes}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-green-600">
                                  {formatCurrency(appointment.amount)}
                                </p>
                                <Badge variant="outline">{appointment.status}</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )
                  )}
                </div>
              </TabsContent>

              <TabsContent value="stats" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <DollarSign className="w-8 h-8 mx-auto text-green-600 mb-2" />
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(editingCustomer.totalSpent)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total gastado</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Calendar className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                        <p className="text-2xl font-bold text-blue-600">
                          {editingCustomer.totalAppointments}
                        </p>
                        <p className="text-sm text-muted-foreground">Total citas</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Clock className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                        <p className="text-2xl font-bold text-purple-600">
                          {editingCustomer.averageFrequency > 0 
                            ? `${editingCustomer.averageFrequency}d`
                            : '—'
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">Frecuencia promedio</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCustomerModal(false);
              setEditingCustomer(null);
            }}>
              Cerrar
            </Button>
            {editingCustomer && (
              <Button onClick={() => handleScheduleAppointment(editingCustomer.id)}>
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Cita
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}