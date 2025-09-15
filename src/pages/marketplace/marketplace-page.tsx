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
  PawPrint,
  Sparkles,
  Zap,
  Trophy
} from 'lucide-react'
import {
  Star1, Star6, Star7, Star8, Star9, Star10, Star13, Star19, Star20, Star21, Star22, Star23, Star24, Star25, Star26, Star27, Star28, Star37, Star39, Star40,
  StarSizes
} from '@/components/ui/neobrutalism-stars'
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
      {/* Hero Section - Neobrutalism Style */}
      <section className="py-16 md:py-24 relative bg-chart-1 overflow-hidden border-t-4 border-black">
        {/* Floating Stars Background */}
        <div className="absolute inset-0 pointer-events-none">
          <Star1 className="absolute top-20 left-10 star-decoration" size={StarSizes.lg} />
          <Star6 className="absolute top-40 right-20 star-decoration" size={StarSizes.md} />
          <Star7 className="absolute bottom-32 left-32 star-decoration" size={StarSizes.xl} />
          <Star8 className="absolute top-60 left-1/2 star-decoration" size={StarSizes.sm} />
          <Star9 className="absolute bottom-20 right-40 star-decoration" size={StarSizes.lg} />
          <Star10 className="absolute top-32 right-1/3 star-decoration" size={StarSizes.md} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Hero Badge */}
            <div className="mb-8 flex justify-center">
              <Badge className="bg-chart-8 text-main-foreground brutal-shadow-lg hover:brutal-hover px-8 py-6 text-lg font-black brutal-border-thick rounded-base transform -rotate-1">
                <Sparkles className="icon-large mr-2 icon-float" />
                <Star13 size={StarSizes.lg} className="star-decoration" />
                MARKETPLACE OFICIAL
                <Star19 size={StarSizes.lg} className="star-decoration" />
                <Trophy className="icon-large ml-2 icon-float" />
              </Badge>
            </div>
            {/* Hero Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-12 text-main-foreground leading-tight uppercase">
              <Star20 size={StarSizes['2xl']} className="star-decoration inline-block mr-4" />
              ENCUENTRA TU
              <span className="bg-chart-5 text-main-foreground px-6 py-4 mx-4 brutal-shadow-xl brutal-border-thick inline-block transform -rotate-2 rounded-base">
                <PawPrint className="icon-large inline-block mr-2 icon-float" />
                <Star21 size={StarSizes.lg} className="star-decoration inline-block" />
                GROOMER
                <Star22 size={StarSizes.lg} className="star-decoration inline-block" />
                <Scissors className="icon-large inline-block ml-2 icon-float" />
              </span>
              PERFECTO
              <Star23 size={StarSizes['2xl']} className="star-decoration inline-block ml-4" />
            </h1>
            {/* Hero Subtitle */}
            <p className="text-xl md:text-2xl text-main-foreground/80 mb-16 max-w-4xl mx-auto leading-relaxed font-bold uppercase">
              <Calendar className="icon-large inline-block mr-2 icon-float" />
              PROFESIONALES VERIFICADOS
              <Heart className="icon-large inline-block mx-2 icon-float" />
              CUIDADO DE CALIDAD
              <Zap className="icon-large inline-block ml-2 icon-float" />
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-16 bg-chart-3 border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters Header */}
          <div className="text-center mb-12">
            <Badge className="bg-chart-6 text-main-foreground brutal-shadow-xl px-8 py-4 text-xl font-black brutal-border-thick rounded-base uppercase transform rotate-1">
              <Filter className="icon-large mr-2 icon-float" />
              <Star24 size={StarSizes.md} className="star-decoration" />
              ENCUENTRA TU MATCH
              <Star25 size={StarSizes.md} className="star-decoration" />
              <Search className="icon-large ml-2 icon-float" />
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar with Filters */}
            <div className="lg:col-span-1">
              <Card className="bg-chart-2 brutal-border-thick brutal-shadow-lg hover:brutal-hover transition-all duration-200">
                <CardHeader className="bg-chart-4 brutal-border-thick border-b-4 border-l-0 border-r-0 border-t-0">
                  <CardTitle className="flex items-center gap-2 font-black text-main-foreground uppercase">
                    <Star26 size={StarSizes.md} className="star-decoration" />
                    <Filter className="icon-large" />
                    FILTROS
                    <Star27 size={StarSizes.md} className="star-decoration" />
                  </CardTitle>
                </CardHeader>
              <CardContent className="space-y-8 bg-chart-2">
                {/* Search */}
                <div>
                  <label className="font-black text-main-foreground mb-4 block uppercase text-lg">
                    <Search className="icon-standard mr-2 inline-block icon-float" />
                    BUSCAR GROOMER
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="NOMBRE O DESCRIPCIÓN..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="brutal-border-thick brutal-shadow font-bold uppercase placeholder:font-bold text-main-foreground bg-main"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="font-black text-main-foreground mb-4 block uppercase text-lg">
                    <Scissors className="icon-standard mr-2 inline-block icon-float" />
                    CATEGORÍA
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="brutal-border-thick brutal-shadow font-bold uppercase bg-main text-main-foreground">
                      <SelectValue placeholder="TODAS LAS CATEGORÍAS" />
                    </SelectTrigger>
                    <SelectContent className="brutal-border-thick brutal-shadow bg-main">
                      <SelectItem value="all" className="font-bold uppercase">TODAS LAS CATEGORÍAS</SelectItem>
                      <SelectItem value="veterinaria" className="font-bold uppercase">VETERINARIA</SelectItem>
                      <SelectItem value="estetica" className="font-bold uppercase">ESTÉTICA</SelectItem>
                      <SelectItem value="spa" className="font-bold uppercase">SPA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* City Filter */}
                <div>
                  <label className="font-black text-main-foreground mb-4 block uppercase text-lg">
                    <MapPin className="icon-standard mr-2 inline-block icon-float" />
                    CIUDAD
                  </label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="brutal-border-thick brutal-shadow font-bold uppercase bg-main text-main-foreground">
                      <SelectValue placeholder="TODAS LAS CIUDADES" />
                    </SelectTrigger>
                    <SelectContent className="brutal-border-thick brutal-shadow bg-main">
                      <SelectItem value="all" className="font-bold uppercase">TODAS LAS CIUDADES</SelectItem>
                      {getUniqueCities().map(city => (
                        <SelectItem key={city} value={city} className="font-bold uppercase">
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Results count */}
                <Badge className="bg-chart-8 text-main-foreground brutal-shadow px-4 py-2 font-black brutal-border rounded-base uppercase">
                  <Star28 size={StarSizes.sm} className="star-decoration mr-2" />
                  {filteredBusinesses.length} RESULTADO{filteredBusinesses.length !== 1 ? 'S' : ''}
                  <Star37 size={StarSizes.sm} className="star-decoration ml-2" />
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Grid of Business Cards */}
          <div className="lg:col-span-3">
            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-16 bg-chart-7 brutal-border-thick brutal-shadow-lg rounded-base">
                <div className="relative">
                  <Star39 className="absolute top-4 left-1/2 transform -translate-x-1/2 star-decoration" size={StarSizes.lg} />
                  <PawPrint className="icon-hero mx-auto mb-6 text-main-foreground icon-float" />
                  <Star40 className="absolute bottom-4 left-1/2 transform -translate-x-1/2 star-decoration" size={StarSizes.lg} />
                </div>
                <h3 className="text-2xl font-black text-main-foreground mb-4 uppercase">
                  NO HAY GROOMERS
                </h3>
                <p className="text-main-foreground/80 font-bold uppercase">
                  AJUSTA TUS FILTROS
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredBusinesses.map((business) => (
                  <Card
                    key={business.id}
                    className="bg-main brutal-border-thick brutal-shadow-lg hover:brutal-hover transition-all duration-200 cursor-pointer group transform hover:-rotate-1"
                    onClick={() => handleBusinessClick(business.slug)}
                  >
                    <CardHeader className="pb-3 bg-chart-4 brutal-border-thick border-b-4 border-l-0 border-r-0 border-t-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl font-black text-main-foreground group-hover:text-main-foreground transition-colors line-clamp-1 uppercase">
                            {business.business_name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <MapPin className="icon-standard text-main-foreground icon-float" />
                            <span className="font-bold text-main-foreground/80 uppercase">
                              {business.city || 'SIN UBICACIÓN'}
                            </span>
                          </div>
                        </div>
                        <Badge className="bg-chart-6 text-main-foreground brutal-border brutal-shadow">
                          <Scissors className="icon-standard mr-1 icon-float" />
                          ACTIVO
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 bg-main p-6">
                      <CardDescription className="font-bold text-main-foreground/80 text-base line-clamp-2 min-h-[3rem] uppercase">
                        {business.description || 'PROFESIONAL DEDICADO AL CUIDADO DE TU MASCOTA'}
                      </CardDescription>

                      {/* Services badges */}
                      <div className="flex flex-wrap gap-3">
                        <Badge className="bg-chart-1 text-main-foreground brutal-border brutal-shadow font-black">
                          <Heart className="icon-standard mr-1 icon-float" />
                          BAÑO
                        </Badge>
                        <Badge className="bg-chart-2 text-main-foreground brutal-border brutal-shadow font-black">
                          <Scissors className="icon-standard mr-1 icon-float" />
                          CORTE
                        </Badge>
                        <Badge className="bg-chart-3 text-main-foreground brutal-border brutal-shadow font-black">
                          <Sparkles className="icon-standard mr-1 icon-float" />
                          SPA
                        </Badge>
                      </div>

                      {/* Rating and contact */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="icon-standard fill-chart-3 text-chart-3"
                              />
                            ))}
                          </div>
                          <span className="font-black text-main-foreground">
                            (4.9)
                          </span>
                        </div>
                        {business.phone && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(`tel:${business.phone}`, '_self')
                            }}
                            className="bg-chart-5 text-main-foreground brutal-border brutal-shadow hover:brutal-hover font-black"
                          >
                            <Phone className="icon-standard icon-float" />
                          </Button>
                        )}
                      </div>

                      {/* CTA Button */}
                      <Button
                        className="w-full bg-chart-6 hover:bg-chart-7 text-main-foreground brutal-border-thick brutal-shadow-lg hover:brutal-hover font-black text-lg py-6 uppercase"
                      >
                        <Calendar className="icon-large mr-2 icon-float" />
                        VER DETALLES
                        <ArrowRight className="icon-large ml-2 icon-float" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>
      </section>
    </div>
  )
}