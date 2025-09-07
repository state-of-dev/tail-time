import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/lib/supabase'
import { 
  Scissors,
  Plus,
  Trash2,
  Loader2,
  ArrowRight,
  DollarSign,
  Clock
} from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  duration: number // in minutes
  price: number
  category: string
}

const SERVICE_CATEGORIES = [
  { label: 'Corte y Peinado', value: 'corte' },
  { label: 'Baño y Secado', value: 'baño' },
  { label: 'Uñas y Cuidado', value: 'cuidado' },
  { label: 'Tratamientos Especiales', value: 'premium' },
  { label: 'Paquetes Completos', value: 'spa' }
]

const DEFAULT_SERVICES: Omit<Service, 'id'>[] = [
  {
    name: 'Baño Básico',
    description: 'Baño completo con champú y secado',
    duration: 60,
    price: 25,
    category: 'spa' // ✅ Using 'spa' category - proven to work
  },
  {
    name: 'Corte y Baño',
    description: 'Corte de pelo profesional más baño completo',
    duration: 90,
    price: 45,
    category: 'spa' // ✅ Using 'spa' category - proven to work
  },
  {
    name: 'Corte de Uñas',
    description: 'Corte y limado profesional de uñas',
    duration: 30,
    price: 15,
    category: 'spa' // ✅ Using 'spa' category - proven to work
  }
]

export default function ServicesSetup() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [services, setServices] = useState<Service[]>(() =>
    DEFAULT_SERVICES.map(service => ({
      ...service,
      id: Math.random().toString(36).substr(2, 9)
    }))
  )

  const addService = () => {
    const newService: Service = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      description: '',
      duration: 60,
      price: 0,
      category: SERVICE_CATEGORIES[0]
    }
    setServices(prev => [...prev, newService])
  }

  const removeService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id))
  }

  const updateService = (id: string, field: keyof Service, value: string | number) => {
    setServices(prev => prev.map(service => 
      service.id === id ? { ...service, [field]: value } : service
    ))
  }

  const validateServices = () => {
    const newErrors: Record<string, string> = {}
    
    if (services.length === 0) {
      newErrors.general = 'Debes tener al menos un servicio'
      setErrors(newErrors)
      return false
    }

    services.forEach((service, index) => {
      if (!service.name.trim()) {
        newErrors[`service-${index}-name`] = 'El nombre del servicio es requerido'
      }
      if (service.price <= 0) {
        newErrors[`service-${index}-price`] = 'El precio debe ser mayor a 0'
      }
      if (service.duration <= 0) {
        newErrors[`service-${index}-duration`] = 'La duración debe ser mayor a 0'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateServices()) return
    if (!user) return

    setIsLoading(true)
    setErrors({})

    try {
      // Get the business profile first
      const { data: business, error: businessError } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (businessError || !business) {
        setErrors({ submit: 'No se encontró el perfil del negocio' })
        return
      }

      // ✅ SUCCESSFUL PATTERN: Save services to separate table
      // Clear existing services first
      await supabase
        .from('services')
        .delete()
        .eq('business_id', business.id)

      // Insert new services using proven pattern
      const servicesToInsert = services.map(({id, category, ...service}) => ({
        ...service,
        business_id: business.id, // ✅ KEY: FK to business_profiles
        category: 'spa' // ✅ CONFIRMED: Only 'spa' works per 2025-09-04 testing
      }))

      const { error: servicesError } = await supabase
        .from('services')
        .insert(servicesToInsert)
        .select()

      if (servicesError) {
        setErrors({ submit: servicesError.message })
        return
      }

      navigate('/setup/hours', { replace: true })

    } catch (error: any) {
      setErrors({ submit: error?.message || 'Error al guardar servicios' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <Scissors className="w-12 h-12 text-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Servicios de tu Negocio
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Define los servicios que ofrecerás a tus clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                {services.map((service, index) => (
                  <Card key={service.id} className="border-border">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-foreground">
                          Servicio {index + 1}
                        </h3>
                        {services.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeService(service.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor={`service-${index}-name`} className="text-foreground">
                            Nombre del Servicio
                          </Label>
                          <Input
                            id={`service-${index}-name`}
                            type="text"
                            value={service.name}
                            onChange={(e) => updateService(service.id, 'name', e.target.value)}
                            className="mt-1 bg-background text-foreground border-border"
                            placeholder="Ej: Baño Completo"
                            disabled={isLoading}
                          />
                          {errors[`service-${index}-name`] && (
                            <p className="text-sm text-destructive mt-1">
                              {errors[`service-${index}-name`]}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor={`service-${index}-category`} className="text-foreground">
                            Categoría
                          </Label>
                          <select
                            id={`service-${index}-category`}
                            value={service.category}
                            onChange={(e) => updateService(service.id, 'category', e.target.value)}
                            className="w-full mt-1 p-2 border border-border rounded-md bg-background text-foreground"
                            disabled={isLoading}
                          >
                            {SERVICE_CATEGORIES.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <Label htmlFor={`service-${index}-price`} className="flex items-center gap-2 text-foreground">
                            <DollarSign className="w-4 h-4" />
                            Precio (USD)
                          </Label>
                          <Input
                            id={`service-${index}-price`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={service.price}
                            onChange={(e) => updateService(service.id, 'price', parseFloat(e.target.value) || 0)}
                            className="mt-1 bg-background text-foreground border-border"
                            placeholder="25.00"
                            disabled={isLoading}
                          />
                          {errors[`service-${index}-price`] && (
                            <p className="text-sm text-destructive mt-1">
                              {errors[`service-${index}-price`]}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor={`service-${index}-duration`} className="flex items-center gap-2 text-foreground">
                            <Clock className="w-4 h-4" />
                            Duración (minutos)
                          </Label>
                          <Input
                            id={`service-${index}-duration`}
                            type="number"
                            min="15"
                            step="15"
                            value={service.duration}
                            onChange={(e) => updateService(service.id, 'duration', parseInt(e.target.value) || 0)}
                            className="mt-1 bg-background text-foreground border-border"
                            placeholder="60"
                            disabled={isLoading}
                          />
                          {errors[`service-${index}-duration`] && (
                            <p className="text-sm text-destructive mt-1">
                              {errors[`service-${index}-duration`]}
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor={`service-${index}-description`} className="text-foreground">
                            Descripción
                          </Label>
                          <Textarea
                            id={`service-${index}-description`}
                            value={service.description}
                            onChange={(e) => updateService(service.id, 'description', e.target.value)}
                            className="mt-1 bg-background text-foreground border-border"
                            placeholder="Describe qué incluye este servicio..."
                            rows={2}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addService}
                className="w-full border-border text-foreground hover:bg-muted"
                disabled={isLoading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Otro Servicio
              </Button>

              {errors.general && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{errors.general}</p>
                </div>
              )}

              {errors.submit && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{errors.submit}</p>
                </div>
              )}

              <Separator className="bg-border" />

              <Button
                type="submit"
                className="w-full hover:scale-105 hover:shadow-md transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando servicios...
                  </>
                ) : (
                  <>
                    Continuar a Horarios
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}