import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Star,
  Clock,
  MapPin,
  Phone,
  Search,
  Filter,
  Scissors,
  Heart,
  Calendar,
  ArrowRight,
  PawPrint
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Navigation } from '@/components/navigation'

interface BusinessProfile {
  id: string
  business_name: string
  slug: string
  description: string
  phone: string
  email: string
  address: string
  city: string
  logo_url: string
  cover_image_url: string
  is_active: boolean
}

export default function MarketplacePage() {
  const navigate = useNavigate()
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<BusinessProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCity, setSelectedCity] = useState('all')

  useEffect(() => {
    loadBusinesses()
  }, [])

  useEffect(() => {
    filterBusinesses()
  }, [businesses, searchTerm, selectedCategory, selectedCity])

  const loadBusinesses = async () => {
    try {

      // Load active businesses from Supabase
      const { data: businesses, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('is_active', true)
        .order('business_name')

      if (error) {
        console.error('[MARKETPLACE] Error loading businesses:', error)
        return
      }

      setBusinesses(businesses || [])
      setFilteredBusinesses(businesses || [])
    } catch (error) {
      console.error('Error loading businesses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterBusinesses = () => {
    let filtered = businesses

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(business =>
        business.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.city?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // City filter
    if (selectedCity !== 'all') {
      filtered = filtered.filter(business =>
        business.city?.toLowerCase() === selectedCity.toLowerCase()
      )
    }

    setFilteredBusinesses(filtered)
  }

  const getUniqueCities = () => {
    const cities = businesses
      .map(business => business.city)
      .filter(Boolean)
      .filter((city, index, self) => self.indexOf(city) === index)
    return cities.sort()
  }

  const handleBusinessClick = (slug: string) => {
    navigate(`/business/${slug}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-chart-1 brutal-border brutal-shadow animate-pulse mx-auto mb-4 rounded-base flex items-center justify-center">
            <PawPrint className="w-8 h-8 text-main-foreground" />
          </div>
          <p className="text-foreground/70">Cargando marketplace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <div className="bg-chart-1 brutal-border-thick border-t-0 border-x-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-main brutal-border brutal-shadow-lg mx-auto mb-6 rounded-base flex items-center justify-center">
              <PawPrint className="w-12 h-12 text-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-main-foreground mb-4">
              Encuentra la Veterinaria o Estética Perfecta
            </h1>
            <p className="text-xl text-main-foreground/80 max-w-2xl mx-auto">
              Descubre profesionales de confianza para el cuidado de tu mascota
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with Filters */}
          <div className="lg:col-span-1">
            <Card className="brutal-shadow hover:brutal-hover transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Nombre o descripción..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Categoría
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      <SelectItem value="veterinaria">Veterinaria</SelectItem>
                      <SelectItem value="estetica">Estética</SelectItem>
                      <SelectItem value="spa">Spa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* City Filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Ciudad
                  </label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las ciudades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las ciudades</SelectItem>
                      {getUniqueCities().map(city => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Results count */}
                <div className="text-sm text-muted-foreground">
                  {filteredBusinesses.length} establecimiento{filteredBusinesses.length !== 1 ? 's' : ''} encontrado{filteredBusinesses.length !== 1 ? 's' : ''}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Grid of Business Cards */}
          <div className="lg:col-span-3">
            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-12">
                <PawPrint className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No se encontraron establecimientos
                </h3>
                <p className="text-muted-foreground">
                  Intenta ajustar tus filtros o busqueda
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBusinesses.map((business) => (
                  <Card 
                    key={business.id} 
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                    onClick={() => handleBusinessClick(business.slug)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
                            {business.business_name}
                          </CardTitle>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {business.city || 'No especificada'}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          <Scissors className="w-3 h-3 mr-1" />
                          Activo
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                        {business.description || 'Profesional dedicado al cuidado de tu mascota'}
                      </CardDescription>
                      
                      {/* Services badges */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Heart className="w-3 h-3 mr-1" />
                          Baño
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Scissors className="w-3 h-3 mr-1" />
                          Corte
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Spa
                        </Badge>
                      </div>

                      {/* Rating and contact */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground ml-1">
                            (4.9)
                          </span>
                        </div>
                        {business.phone && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(`tel:${business.phone}`, '_self')
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      {/* CTA Button */}
                      <Button 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        variant="outline"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Ver Detalles
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}