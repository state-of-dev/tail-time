import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  PawPrint,
  User,
  Phone,
  Mail,
  MessageSquare,
  Info,
  Scissors,
  Star,
  Trophy,
  Crown,
  Sparkles,
  Tag
} from 'lucide-react'
import {
  Star1, Star6, Star7, Star8, Star9, Star10, Star13, Star19, Star20, Star21, Star22, Star23, Star24, Star25, Star26, Star27, Star28, Star37, Star39, Star40,
  StarSizes
} from '@/components/ui/neobrutalism-stars'
import { Navigation } from '@/components/navigation'

interface Service {
  name: string
  description: string
  duration: number
  price: number
  category: string
}

interface BookingState {
  businessSlug: string
  service: Service
  serviceIndex: number
  step: string
  selectedDate: string
  selectedTime: string
}

interface PetInfo {
  petName: string
  petBreed: string
  petAge: string
  petWeight: string
  petSpecialNotes: string
  ownerName: string
  ownerEmail: string
  ownerPhone: string
  additionalNotes: string
}

export default function BookPetInfo() {
  const { businessSlug } = useParams<{ businessSlug: string }>()
  const navigate = useNavigate()
  const [bookingState, setBookingState] = useState<BookingState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [petInfo, setPetInfo] = useState<PetInfo>({
    petName: '',
    petBreed: '',
    petAge: '',
    petWeight: '',
    petSpecialNotes: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    additionalNotes: ''
  })
  const [errors, setErrors] = useState<Partial<PetInfo>>({})

  useEffect(() => {
    // Load booking state from localStorage
    const savedState = localStorage.getItem('booking-state')
    if (!savedState) {
      navigate(`/business/${businessSlug}/book`)
      return
    }

    try {
      const state = JSON.parse(savedState) as BookingState
      if (state.businessSlug !== businessSlug || state.step !== 'pet-info') {
        navigate(`/business/${businessSlug}/book`)
        return
      }
      setBookingState(state)
      
      // Load any existing pet info
      const savedPetInfo = localStorage.getItem('booking-pet-info')
      if (savedPetInfo) {
        setPetInfo(JSON.parse(savedPetInfo))
      }
    } catch (error) {
      navigate(`/business/${businessSlug}/book`)
      return
    }
    
    setIsLoading(false)
  }, [businessSlug, navigate])

  const handleInputChange = (field: keyof PetInfo, value: string) => {
    setPetInfo(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<PetInfo> = {}

    // Required fields
    if (!petInfo.petName.trim()) {
      newErrors.petName = 'El nombre de la mascota es requerido'
    }
    if (!petInfo.petBreed.trim()) {
      newErrors.petBreed = 'La raza es requerida'
    }
    if (!petInfo.ownerName.trim()) {
      newErrors.ownerName = 'Tu nombre es requerido'
    }
    if (!petInfo.ownerEmail.trim()) {
      newErrors.ownerEmail = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(petInfo.ownerEmail)) {
      newErrors.ownerEmail = 'Email inválido'
    }
    if (!petInfo.ownerPhone.trim()) {
      newErrors.ownerPhone = 'El teléfono es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (!validateForm() || !bookingState) return

    // Save pet info to localStorage
    localStorage.setItem('booking-pet-info', JSON.stringify(petInfo))

    // Update booking state
    const updatedState = {
      ...bookingState,
      step: 'confirmation'
    }

    localStorage.setItem('booking-state', JSON.stringify(updatedState))
    navigate(`/business/${businessSlug}/book/confirmation`)
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  if (isLoading || !bookingState) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-8 h-8 animate-pulse text-main-foreground mx-auto mb-4" />
          <p className="text-main-foreground font-black uppercase">CARGANDO FORMULARIO...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-chart-4">
      <Navigation />

      {/* Hero Section - Neobrutalism Style */}
      <section className="py-16 bg-chart-1 relative overflow-hidden border-t-4 border-black">
        {/* Floating Stars Background */}
        <div className="absolute inset-0 pointer-events-none">
          <Star1 className="absolute top-10 left-10 star-decoration" size={StarSizes.lg} />
          <Star6 className="absolute top-20 right-20 star-decoration" size={StarSizes.md} />
          <Star7 className="absolute bottom-16 left-32 star-decoration" size={StarSizes.xl} />
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          {/* Progress indicator - Neobrutalism Style */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <Button
                className="bg-chart-8 hover:bg-chart-6 text-main-foreground brutal-border-thick brutal-shadow-lg hover:brutal-hover font-black py-4 px-6 uppercase"
                onClick={() => navigate(`/business/${businessSlug}/book/datetime`)}
              >
                <ArrowLeft className="icon-large mr-2 icon-float" />
                <Star8 size={StarSizes.sm} className="star-decoration mr-2" />
                CAMBIAR FECHA
              </Button>
              <div className="bg-chart-7 text-main-foreground brutal-border brutal-shadow font-black px-6 py-3 text-lg uppercase rounded-base">
                <Trophy className="icon-standard mr-2 icon-float inline-block" />
                PASO 3 DE 4
              </div>
            </div>
            <div className="bg-chart-2 brutal-border-thick brutal-shadow-lg rounded-base p-4">
              <Progress value={75} className="w-full h-6 bg-chart-3" />
            </div>
          </div>

          {/* Header - Neobrutalism Style */}
          <div className="text-center mb-12">
            <div className="bg-chart-8 text-main-foreground brutal-shadow-lg hover:brutal-hover px-8 py-4 text-xl font-black brutal-border-thick rounded-base transform -rotate-1 mb-8 inline-block">
              <PawPrint className="icon-large mr-2 icon-float" />
              <Star9 size={StarSizes.md} className="star-decoration" />
              INFORMACIÓN DE TU MASCOTA
              <Star10 size={StarSizes.md} className="star-decoration" />
              <Heart className="icon-large ml-2 icon-float" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-main-foreground uppercase mb-6">
              <Star13 size={StarSizes.lg} className="star-decoration inline-block mr-4" />
              CUÉNTANOS SOBRE TU MASCOTA
              <Star19 size={StarSizes.lg} className="star-decoration inline-block ml-4" />
            </h1>
            <p className="text-2xl font-bold text-main-foreground/80 uppercase">
              <Sparkles className="icon-large inline-block mr-2 icon-float" />
              QUEREMOS BRINDAR EL MEJOR SERVICIO
              <Crown className="icon-large inline-block ml-2 icon-float" />
            </p>
          </div>
        </div>
      </section>

      {/* Content - Neobrutalism Style */}
      <main className="py-16 bg-chart-3 border-t-4 border-black">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form - Neobrutalism Style */}
            <div className="lg:col-span-2 space-y-8">
              {/* Pet Information */}
              <Card className="bg-chart-2 brutal-border-thick brutal-shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4 text-main-foreground font-black text-xl uppercase">
                    <PawPrint className="icon-large icon-float" />
                    <Star20 size={StarSizes.sm} className="star-decoration" />
                    INFORMACIÓN DE LA MASCOTA
                  </CardTitle>
                  <CardDescription className="text-main-foreground/80 font-bold text-lg uppercase">
                    <Star21 size={StarSizes.sm} className="star-decoration inline-block mr-2" />
                    ESTA INFORMACIÓN NOS AYUDA A BRINDAR EL MEJOR SERVICIO
                    <Star22 size={StarSizes.sm} className="star-decoration inline-block ml-2" />
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="petName" className="text-main-foreground font-black uppercase">
                        NOMBRE DE LA MASCOTA *
                      </Label>
                      <Input
                        id="petName"
                        value={petInfo.petName}
                        onChange={(e) => handleInputChange('petName', e.target.value)}
                        placeholder="Ej: Firulais"
                        className={errors.petName ? 'border-destructive' : ''}
                      />
                    {errors.petName && (
                      <p className="text-sm text-destructive">{errors.petName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="petBreed" className="text-main-foreground font-black uppercase">
                      RAZA *
                    </Label>
                    <Input
                      id="petBreed"
                      value={petInfo.petBreed}
                      onChange={(e) => handleInputChange('petBreed', e.target.value)}
                      placeholder="Ej: Golden Retriever"
                      className={errors.petBreed ? 'border-destructive' : ''}
                    />
                    {errors.petBreed && (
                      <p className="text-sm text-destructive">{errors.petBreed}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="petAge" className="text-main-foreground font-black uppercase">
                      EDAD (OPCIONAL)
                    </Label>
                    <Input
                      id="petAge"
                      value={petInfo.petAge}
                      onChange={(e) => handleInputChange('petAge', e.target.value)}
                      placeholder="Ej: 3 años"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="petWeight" className="text-main-foreground font-black uppercase">
                      PESO APROXIMADO (OPCIONAL)
                    </Label>
                    <Input
                      id="petWeight"
                      value={petInfo.petWeight}
                      onChange={(e) => handleInputChange('petWeight', e.target.value)}
                      placeholder="Ej: 25 kg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="petSpecialNotes" className="text-main-foreground font-black uppercase">
                    NOTAS ESPECIALES SOBRE LA MASCOTA
                  </Label>
                  <Textarea
                    id="petSpecialNotes"
                    value={petInfo.petSpecialNotes}
                    onChange={(e) => handleInputChange('petSpecialNotes', e.target.value)}
                    placeholder="Ej: Es tímido con extraños, tiene alergia a ciertos productos, le gusta que lo cepillen..."
                    className="min-h-20"
                  />
                </div>
              </CardContent>
            </Card>

              {/* Owner Information - Neobrutalism Style */}
              <Card className="bg-chart-3 brutal-border-thick brutal-shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4 text-main-foreground font-black text-xl uppercase">
                    <User className="icon-large icon-float" />
                    <Star24 size={StarSizes.sm} className="star-decoration" />
                    INFORMACIÓN DE CONTACTO
                  </CardTitle>
                  <CardDescription className="text-main-foreground/80 font-bold text-lg uppercase">
                    <Star25 size={StarSizes.sm} className="star-decoration inline-block mr-2" />
                    PARA CONFIRMARTE LA CITA Y ENVIARTE RECORDATORIOS
                    <Star26 size={StarSizes.sm} className="star-decoration inline-block ml-2" />
                  </CardDescription>
                </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName" className="text-main-foreground font-black uppercase">
                    TU NOMBRE *
                  </Label>
                  <Input
                    id="ownerName"
                    value={petInfo.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    placeholder="Ej: María García"
                    className={errors.ownerName ? 'border-destructive' : ''}
                  />
                  {errors.ownerName && (
                    <p className="text-sm text-destructive">{errors.ownerName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerEmail" className="text-main-foreground font-black uppercase">
                      EMAIL *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-main-foreground/60" />
                      <Input
                        id="ownerEmail"
                        type="email"
                        value={petInfo.ownerEmail}
                        onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                        placeholder="correo@ejemplo.com"
                        className={`pl-10 ${errors.ownerEmail ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.ownerEmail && (
                      <p className="text-sm text-destructive">{errors.ownerEmail}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerPhone" className="text-main-foreground font-black uppercase">
                      TELÉFONO *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-main-foreground/60" />
                      <Input
                        id="ownerPhone"
                        type="tel"
                        value={petInfo.ownerPhone}
                        onChange={(e) => handleInputChange('ownerPhone', e.target.value)}
                        placeholder="(555) 123-4567"
                        className={`pl-10 ${errors.ownerPhone ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.ownerPhone && (
                      <p className="text-sm text-destructive">{errors.ownerPhone}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes" className="text-main-foreground font-black uppercase">
                    COMENTARIOS ADICIONALES
                  </Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-main-foreground/60" />
                    <Textarea
                      id="additionalNotes"
                      value={petInfo.additionalNotes}
                      onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                      placeholder="¿Hay algo más que debemos saber? ¿Preguntas especiales?"
                      className="pl-10 min-h-20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Booking Summary */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <Card className="sticky top-6 bg-chart-8 brutal-border-thick brutal-shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-4 text-main-foreground font-black text-xl uppercase">
                  <Scissors className="icon-large icon-float" />
                  <Star27 size={StarSizes.sm} className="star-decoration" />
                  RESUMEN DE CITA
                  <Trophy className="icon-large icon-float" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Service */}
                <div className="pb-4 border-b-4 border-chart-4">
                  <div className="bg-chart-6 text-main-foreground brutal-border px-3 py-1 text-xs font-black uppercase rounded-base mb-2 inline-block">
                    SERVICIO
                  </div>
                  <h4 className="font-black text-lg text-main-foreground uppercase">
                    {bookingState.service.name.toUpperCase()}
                  </h4>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-main-foreground/80 font-bold uppercase">{bookingState.service.duration} MIN</span>
                    <span className="text-main-foreground font-black text-lg">${bookingState.service.price}</span>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="pb-4 border-b-4 border-chart-4">
                  <div className="bg-chart-6 text-main-foreground brutal-border px-3 py-1 text-xs font-black uppercase rounded-base mb-2 inline-block">
                    FECHA Y HORA
                  </div>
                  <div className="space-y-2">
                    <div className="font-black text-lg text-main-foreground uppercase">
                      {new Date(bookingState.selectedDate).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }).toUpperCase()}
                    </div>
                    <div className="text-main-foreground/80 font-bold text-lg uppercase">
                      {formatTime(bookingState.selectedTime)}
                    </div>
                  </div>
                </div>

                {/* Pet Info Preview */}
                {petInfo.petName && (
                  <div className="pb-4 border-b-4 border-chart-4">
                    <div className="bg-chart-6 text-main-foreground brutal-border px-3 py-1 text-xs font-black uppercase rounded-base mb-2 inline-block">
                      MASCOTA
                    </div>
                    <div className="font-black text-lg text-main-foreground uppercase">
                      {petInfo.petName.toUpperCase()}
                    </div>
                    {petInfo.petBreed && (
                      <div className="text-sm text-main-foreground/80 font-bold uppercase">
                        {petInfo.petBreed.toUpperCase()}
                      </div>
                    )}
                  </div>
                )}

                {/* Continue Button */}
                <div className="pt-4">
                  <Button
                    className="w-full bg-chart-2 hover:bg-chart-2/90 text-main-foreground brutal-border-thick brutal-shadow-xl hover:brutal-hover font-black py-4 text-lg uppercase"
                    onClick={handleContinue}
                  >
                    <Star28 size={StarSizes.sm} className="star-decoration mr-2" />
                    CONFIRMAR CITA
                    <ArrowRight className="icon-large ml-2 icon-float" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            </div>

            {/* Sidebar - Summary */}
            <div className="space-y-6">
              {/* Info Card */}
              <Card className="bg-chart-4 brutal-border-thick brutal-shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Info className="w-6 h-6 text-main-foreground flex-shrink-0 mt-1 icon-float" />
                    <div className="space-y-3">
                      <h4 className="font-black text-lg text-main-foreground uppercase">
                        <Star39 size={StarSizes.sm} className="star-decoration inline-block mr-2" />
                        PRIVACIDAD Y SEGURIDAD
                      </h4>
                      <p className="text-sm text-main-foreground/80 font-bold uppercase">
                        TU INFORMACIÓN PERSONAL SE MANTIENE PRIVADA Y SEGURA. SOLO LA USAMOS PARA BRINDARTE EL MEJOR SERVICIO.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}