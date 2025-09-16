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
          <Heart className="w-8 h-8 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando formulario...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/business/${businessSlug}/book/datetime`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cambiar Fecha
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Información de tu Mascota
              </h1>
              <p className="text-sm text-muted-foreground">
                Paso 3 de 4: Cuéntanos sobre tu mascota
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Servicio</span>
              <span>Fecha y Hora</span>
              <span className="text-primary font-medium">Información</span>
              <span>Confirmación</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pet Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PawPrint className="w-5 h-5" />
                  Información de la Mascota
                </CardTitle>
                <CardDescription>
                  Esta información nos ayuda a brindar el mejor servicio a tu mascota
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="petName">
                      Nombre de la mascota *
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
                    <Label htmlFor="petBreed">
                      Raza *
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
                    <Label htmlFor="petAge">
                      Edad (opcional)
                    </Label>
                    <Input
                      id="petAge"
                      value={petInfo.petAge}
                      onChange={(e) => handleInputChange('petAge', e.target.value)}
                      placeholder="Ej: 3 años"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="petWeight">
                      Peso aproximado (opcional)
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
                  <Label htmlFor="petSpecialNotes">
                    Notas especiales sobre la mascota
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

            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información de Contacto
                </CardTitle>
                <CardDescription>
                  Para confirmarte la cita y enviarte recordatorios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">
                    Tu nombre *
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
                    <Label htmlFor="ownerEmail">
                      Email *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                    <Label htmlFor="ownerPhone">
                      Teléfono *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                  <Label htmlFor="additionalNotes">
                    Comentarios adicionales
                  </Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="w-5 h-5" />
                  Resumen de Cita
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Service */}
                <div className="pb-4 border-b border-border">
                  <Label className="text-xs text-muted-foreground">SERVICIO</Label>
                  <h4 className="font-semibold text-foreground">
                    {bookingState.service.name}
                  </h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{bookingState.service.duration} min</span>
                    <span className="text-primary font-semibold">${bookingState.service.price}</span>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="pb-4 border-b border-border">
                  <Label className="text-xs text-muted-foreground">FECHA Y HORA</Label>
                  <div className="space-y-1">
                    <div className="font-semibold text-foreground">
                      {new Date(bookingState.selectedDate).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatTime(bookingState.selectedTime)}
                    </div>
                  </div>
                </div>

                {/* Pet Info Preview */}
                {petInfo.petName && (
                  <div className="pb-4 border-b border-border">
                    <Label className="text-xs text-muted-foreground">MASCOTA</Label>
                    <div className="font-semibold text-foreground">
                      {petInfo.petName}
                    </div>
                    {petInfo.petBreed && (
                      <div className="text-sm text-muted-foreground">
                        {petInfo.petBreed}
                      </div>
                    )}
                  </div>
                )}

                {/* Continue Button */}
                <div className="pt-4">
                  <Button 
                    className="w-full"
                    onClick={handleContinue}
                  >
                    Confirmar Cita
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">
                      Privacidad y Seguridad
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Tu información personal se mantiene privada y segura. Solo la usamos para brindarte el mejor servicio a ti y tu mascota.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}