import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft,
  Search,
  Clock,
  DollarSign,
  Filter,
  Calendar,
  Scissors,
  Heart,
  Star,
  CheckCircle,
  Tag
} from 'lucide-react'

interface Service {
  name: string
  description: string
  duration: number
  price: number
  category: string
}

interface BusinessProfile {
  id: string
  business_name: string
  slug: string
  services: Service[]
  is_active: boolean
}

export default function ServicesCatalog() {
  const { businessSlug } = useParams<{ businessSlug: string }>()
  const navigate = useNavigate()
  const [business, setBusiness] = useState<BusinessProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    if (!businessSlug) {
      setError('Negocio no encontrado')
      setIsLoading(false)
      return
    }
    loadBusiness()
  }, [businessSlug])

  const loadBusiness = async () => {
    try {
      const { data: businessData, error: businessError } = await supabase
        .from('business_profiles')
        .select('id, business_name, slug, services, is_active')
        .eq('slug', businessSlug)
        .eq('is_active', true)
        .single()

      if (businessError || !businessData) {
        setError('Negocio no encontrado o inactivo')
        return
      }

      setBusiness(businessData)
    } catch (error: any) {
      setError('Error al cargar los servicios')
      console.error('Error loading business:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCategories = () => {
    if (!business?.services) return []
    
    const categories = Array.from(new Set(business.services.map(s => s.category)))
    return categories.sort()
  }

  const filteredServices = business?.services?.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    
    return matchesSearch && matchesCategory
  }) || []

  const servicesByCategory = filteredServices.reduce((acc: Record<string, Service[]>, service) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {})

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

  if (error || !business) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(`/business/${businessSlug}`)}>
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const categories = getCategories()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/business/${businessSlug}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Scissors className="w-6 h-6" />
                Servicios - {business.business_name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Elige el servicio que más te guste
              </p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar servicios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            {categories.length > 1 && (
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-border rounded-md px-3 py-2 bg-background text-foreground"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <Scissors className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No se encontraron servicios
            </h2>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 
                `No hay servicios que coincidan con "${searchQuery}"` : 
                'No hay servicios disponibles'
              }
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Limpiar búsqueda
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Services by Category */}
            {Object.entries(servicesByCategory).map(([category, services]) => (
              <section key={category}>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold text-foreground">{category}</h2>
                  <Badge variant="outline" className="text-xs">
                    {services.length} servicio{services.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                <div className="grid gap-4">
                  {services.map((service, index) => (
                    <Card key={`${category}-${index}`} className="hover:shadow-md transition-all duration-200">
                      <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-4">
                          {/* Service Info */}
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <h3 className="text-lg font-semibold text-foreground">
                                  {service.name}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {service.category}
                                </Badge>
                              </div>
                            </div>

                            {service.description && (
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {service.description}
                              </p>
                            )}

                            {/* Service Details */}
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{service.duration} minutos</span>
                              </div>
                              <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                                <DollarSign className="w-5 h-5" />
                                <span>${service.price}</span>
                              </div>
                            </div>

                            {/* Features/Benefits */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                Profesional certificado
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                Productos de calidad
                              </div>
                            </div>
                          </div>

                          {/* CTA */}
                          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-40">
                            <Button 
                              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                              onClick={() => navigate(`/business/${businessSlug}/book?service=${category}-${index}`)}
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Agendar Cita
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                // Show more details or open modal
                              }}
                            >
                              Ver Detalles
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}

            {/* CTA Section */}
            <div className="mt-12 pt-8 border-t border-border">
              <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="pt-6 text-center">
                  <Heart className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    ¿No encuentras lo que buscas?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Contáctanos directamente y te ayudamos a encontrar el servicio perfecto para tu mascota
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      variant="outline"
                      onClick={() => navigate(`/business/${businessSlug}`)}
                    >
                      Ver Contacto
                    </Button>
                    <Button onClick={() => navigate(`/business/${businessSlug}/book`)}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Agendar Consulta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}