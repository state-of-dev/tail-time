import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Scissors,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Save,
  X,
  Clock,
  DollarSign,
  Tag,
  MoreVertical,
  Eye,
  EyeOff,
  Heart
} from 'lucide-react'
import { Navigation } from '@/components/navigation'

interface Service {
  id: string
  business_id?: string
  name: string
  description: string
  duration: number
  price: number
  category: string
  is_active?: boolean
  requires_pet_info?: boolean
  requires_photos?: boolean
  sort_order?: number
  created_at?: string
  updated_at?: string
}

const SERVICE_CATEGORIES = [
  'spa'
]

export default function ServicesManagement() {
  const { businessSlug } = useParams<{ businessSlug: string }>()
  const navigate = useNavigate()
  const { user, businessProfile } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!user || !businessSlug) {
      navigate('/auth/login')
      return
    }
    if (!businessProfile) {
      navigate(`/groomer/${businessSlug}/dashboard`)
      return
    }
    loadServices()
  }, [user, businessSlug, businessProfile])

  const loadServices = async () => {
    if (!user || !businessProfile) return

    try {
      setIsLoading(true)
      
      // Load services from database table
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', businessProfile.id)
        .order('created_at', { ascending: true })

      if (servicesError) {
        console.error('Error loading services:', servicesError)
        setErrors({ submit: 'Error al cargar servicios' })
        setServices([])
        return
      }

      setServices(servicesData || [])
      setErrors({})
      
    } catch (error: any) {
      console.error('Error loading services:', error)
      setErrors({ submit: error?.message || 'Error al cargar servicios' })
      setServices([])
    } finally {
      setIsLoading(false)
    }
  }

  const createService = async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user || !businessProfile) return false

    try {
      const { data, error } = await supabase
        .from('services')
        .insert({
          ...service,
          business_id: businessProfile.id
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating service:', error)
        setErrors({ submit: error.message })
        return false
      }

      await loadServices() // Reload services
      return true
      
    } catch (error: any) {
      console.error('Error creating service:', error)
      setErrors({ submit: error?.message || 'Error al crear servicio' })
      return false
    }
  }

  const updateService = async (serviceId: string, updates: Partial<Service>) => {
    if (!user || !businessProfile) return false

    try {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', serviceId)
        .eq('business_id', businessProfile.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating service:', error)
        setErrors({ submit: error.message })
        return false
      }

      await loadServices() // Reload services
      return true
      
    } catch (error: any) {
      console.error('Error updating service:', error)
      setErrors({ submit: error?.message || 'Error al actualizar servicio' })
      return false
    }
  }

  const deleteServiceFromDB = async (serviceId: string) => {
    if (!user || !businessProfile) return false

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)
        .eq('business_id', businessProfile.id)

      if (error) {
        console.error('Error deleting service:', error)
        setErrors({ submit: error.message })
        return false
      }

      await loadServices() // Reload services
      return true
      
    } catch (error: any) {
      console.error('Error deleting service:', error)
      setErrors({ submit: error?.message || 'Error al eliminar servicio' })
      return false
    }
  }

  const handleCreateService = () => {
    const newService: Service = {
      id: '', // Will be generated by database
      name: '',
      description: '',
      duration: 60,
      price: 0,
      category: SERVICE_CATEGORIES[0],
      is_active: true
    }
    setEditingService(newService)
    setIsCreating(true)
  }

  const handleEditService = (service: Service) => {
    setEditingService({ ...service })
    setIsCreating(false)
  }

  const handleSaveService = async () => {
    if (!editingService) return

    // Validation
    const newErrors: Record<string, string> = {}
    if (!editingService.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }
    if (editingService.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0'
    }
    if (editingService.duration <= 0) {
      newErrors.duration = 'La duración debe ser mayor a 0'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    let success = false
    
    if (isCreating) {
      // Create new service
      const { id, ...serviceData } = editingService
      success = await createService(serviceData)
    } else {
      // Update existing service
      success = await updateService(editingService.id, editingService)
    }

    if (success) {
      setEditingService(null)
      setIsCreating(false)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este servicio? Esta acción no se puede deshacer.')) return

    await deleteServiceFromDB(serviceId)
  }

  const handleToggleActive = async (serviceId: string) => {
    const service = services.find(s => s.id === serviceId)
    if (!service) return

    await updateService(serviceId, { is_active: !service.is_active })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-8 h-8 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando servicios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Page Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/groomer/${businessSlug}/dashboard`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Scissors className="w-5 h-5" />
                  Gestión de Servicios
                </h1>
                <p className="text-sm text-muted-foreground">
                  Administra los servicios que ofreces
                </p>
              </div>
            </div>
            
            <Button onClick={handleCreateService}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Servicio
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {errors.submit && (
          <div className="mb-6 p-3 rounded-md bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{errors.submit}</p>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid gap-6">
          {editingService && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {isCreating ? 'Crear Nuevo Servicio' : 'Editar Servicio'}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingService(null)
                      setIsCreating(false)
                      setErrors({})
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name" className="text-foreground">
                      Nombre del Servicio
                    </Label>
                    <Input
                      id="edit-name"
                      value={editingService.name}
                      onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                      placeholder="Ej: Baño Completo"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="edit-category" className="text-foreground">
                      Categoría
                    </Label>
                    <select
                      id="edit-category"
                      value={editingService.category}
                      onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                      className="w-full mt-1 p-2 border border-border rounded-md bg-background text-foreground"
                    >
                      {SERVICE_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="edit-price" className="text-foreground flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Precio (MXN)
                    </Label>
                    <Input
                      id="edit-price"
                      type="number"
                      min="0"
                      step="1"
                      value={editingService.price}
                      onChange={(e) => setEditingService({ ...editingService, price: parseInt(e.target.value) || 0 })}
                      placeholder="450"
                    />
                    {errors.price && (
                      <p className="text-sm text-destructive mt-1">{errors.price}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="edit-duration" className="text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Duración (minutos)
                    </Label>
                    <Input
                      id="edit-duration"
                      type="number"
                      min="15"
                      step="15"
                      value={editingService.duration}
                      onChange={(e) => setEditingService({ ...editingService, duration: parseInt(e.target.value) || 0 })}
                      placeholder="60"
                    />
                    {errors.duration && (
                      <p className="text-sm text-destructive mt-1">{errors.duration}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-description" className="text-foreground">
                    Descripción
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={editingService.description}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    placeholder="Describe qué incluye este servicio..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveService}>
                    <Save className="w-4 h-4 mr-2" />
                    {isCreating ? 'Crear Servicio' : 'Guardar Cambios'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditingService(null)
                      setIsCreating(false)
                      setErrors({})
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {services.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <Scissors className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No hay servicios configurados</p>
                  <p className="text-sm mb-4">
                    Crea tu primer servicio para comenzar a recibir citas
                  </p>
                  <Button onClick={handleCreateService}>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primer Servicio
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {services.map((service) => (
                <Card key={service.id} className={`${service.is_active ? '' : 'opacity-60'}`}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {service.name}
                          </h3>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {service.category}
                          </Badge>
                          {!service.is_active && (
                            <Badge variant="secondary" className="text-xs">
                              Inactivo
                            </Badge>
                          )}
                        </div>

                        {service.description && (
                          <p className="text-sm text-muted-foreground">
                            {service.description}
                          </p>
                        )}

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {service.duration} min
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            ${service.price}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(service.id)}
                          className="flex items-center gap-1"
                        >
                          {service.is_active ? (
                            <>
                              <EyeOff className="w-4 h-4" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              Activar
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditService(service)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteService(service.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}