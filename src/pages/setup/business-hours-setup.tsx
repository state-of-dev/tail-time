import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// import { Switch } from '@/components/ui/switch' // Not available
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/lib/supabase'
import { 
  Clock,
  ArrowRight,
  Loader2,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface DayHours {
  open: boolean
  start: string
  end: string
}

interface BusinessHours {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
}

const DAYS = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' }
] as const

const DEFAULT_HOURS: BusinessHours = {
  monday: { open: true, start: '09:00', end: '18:00' },
  tuesday: { open: true, start: '09:00', end: '18:00' },
  wednesday: { open: true, start: '09:00', end: '18:00' },
  thursday: { open: true, start: '09:00', end: '18:00' },
  friday: { open: true, start: '09:00', end: '19:00' },
  saturday: { open: true, start: '08:00', end: '16:00' },
  sunday: { open: false, start: '09:00', end: '17:00' }
}

export default function BusinessHoursSetup() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [businessHours, setBusinessHours] = useState<BusinessHours>(DEFAULT_HOURS)
  const [businessName, setBusinessName] = useState('')

  useEffect(() => {
    if (user) {
      loadBusinessData()
    }
  }, [user])

  // Helper functions for working with hours in description
  const extractBusinessHours = (description: string): BusinessHours | null => {
    try {
      const hoursMatch = description.match(/HOURS:(.+)$/)
      return hoursMatch ? JSON.parse(hoursMatch[1]) : null
    } catch {
      return null
    }
  }

  const updateBusinessDescription = (originalDesc: string, newHours: BusinessHours): string => {
    const baseDesc = originalDesc.split('\nHOURS:')[0]
    return `${baseDesc}\nHOURS:${JSON.stringify(newHours)}`
  }

  const loadBusinessData = async () => {
    try {
      const { data: business, error } = await supabase
        .from('business_profiles')
        .select('business_name, description')
        .eq('owner_id', user.id)
        .single()

      if (error) {
        setErrors({ load: 'No se encontró el perfil del negocio' })
        return
      }

      setBusinessName(business.business_name || '')

      // Extract existing hours from description
      if (business.description) {
        const existingHours = extractBusinessHours(business.description)
        if (existingHours) {
          setBusinessHours(existingHours)
        }
      }
    } catch (error: any) {
      setErrors({ load: 'Error al cargar datos del negocio' })
    } finally {
      setIsLoadingData(false)
    }
  }

  const updateDayHours = (day: keyof BusinessHours, field: keyof DayHours, value: boolean | string) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }))
  }

  const copyHoursToAll = () => {
    const mondayHours = businessHours.monday
    const newHours = { ...businessHours }
    
    Object.keys(newHours).forEach(day => {
      if (day !== 'sunday') { // Keep Sunday separate
        newHours[day as keyof BusinessHours] = { ...mondayHours }
      }
    })
    
    setBusinessHours(newHours)
  }

  const validateHours = () => {
    const newErrors: Record<string, string> = {}
    
    // Check if at least one day is open
    const hasOpenDays = Object.values(businessHours).some(day => day.open)
    if (!hasOpenDays) {
      newErrors.general = 'Debes estar abierto al menos un día'
      setErrors(newErrors)
      return false
    }

    // Validate each open day has valid times
    Object.entries(businessHours).forEach(([dayKey, day]) => {
      if (day.open) {
        if (!day.start || !day.end) {
          newErrors[dayKey] = 'Horarios requeridos para días abiertos'
        } else {
          const startTime = new Date(`2000-01-01T${day.start}:00`)
          const endTime = new Date(`2000-01-01T${day.end}:00`)
          
          if (startTime >= endTime) {
            newErrors[dayKey] = 'La hora de cierre debe ser después de la apertura'
          }
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateHours()) return
    if (!user) return

    setIsLoading(true)
    setErrors({})

    try {
      // Get current business profile
      const { data: business, error: getError } = await supabase
        .from('business_profiles')
        .select('description')
        .eq('owner_id', user.id)
        .single()

      if (getError) {
        setErrors({ submit: 'Error al obtener perfil del negocio' })
        return
      }

      // Update description with new hours
      const updatedDescription = updateBusinessDescription(
        business.description || 'Professional grooming services', 
        businessHours
      )

      const { error: updateError } = await supabase
        .from('business_profiles')
        .update({ description: updatedDescription })
        .eq('owner_id', user.id)

      if (updateError) {
        setErrors({ submit: updateError.message })
        return
      }

      // Success! Navigate to completion or dashboard
      navigate('/groomer/dashboard', { replace: true })

    } catch (error: any) {
      setErrors({ submit: error?.message || 'Error al guardar horarios' })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-8 h-8 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando datos del negocio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <Clock className="w-12 h-12 text-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Horarios de Atención
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Define los horarios en que {businessName} estará disponible para recibir citas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errors.load && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 mb-6">
                <p className="text-sm text-destructive">{errors.load}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Quick Actions */}
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-foreground">Configuración Rápida</h3>
                  <p className="text-sm text-muted-foreground">
                    Aplica los horarios de lunes a todos los días laborales
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={copyHoursToAll}
                  disabled={isLoading}
                >
                  Copiar a Todos
                </Button>
              </div>

              {/* Days Configuration */}
              <div className="space-y-4">
                {DAYS.map(({ key, label }) => {
                  const dayHours = businessHours[key]
                  return (
                    <Card key={key} className="border-border">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Label htmlFor={`${key}-open`} className="text-base font-semibold">
                              {label}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant={dayHours.open ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateDayHours(key, 'open', !dayHours.open)}
                              disabled={isLoading}
                              className={dayHours.open ? "bg-green-600 hover:bg-green-700" : ""}
                            >
                              {dayHours.open ? 'Abierto' : 'Cerrado'}
                            </Button>
                          </div>
                        </div>

                        {dayHours.open && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`${key}-start`} className="text-sm text-muted-foreground">
                                Hora de Apertura
                              </Label>
                              <Input
                                id={`${key}-start`}
                                type="time"
                                value={dayHours.start}
                                onChange={(e) => updateDayHours(key, 'start', e.target.value)}
                                className="mt-1"
                                disabled={isLoading}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`${key}-end`} className="text-sm text-muted-foreground">
                                Hora de Cierre
                              </Label>
                              <Input
                                id={`${key}-end`}
                                type="time"
                                value={dayHours.end}
                                onChange={(e) => updateDayHours(key, 'end', e.target.value)}
                                className="mt-1"
                                disabled={isLoading}
                              />
                            </div>
                          </div>
                        )}

                        {errors[key] && (
                          <p className="text-sm text-destructive mt-2">{errors[key]}</p>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

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

              {/* Info Box */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-primary mb-1">¡Casi terminamos!</h4>
                    <p className="text-sm text-muted-foreground">
                      Una vez configurados tus horarios, los clientes podrán agendar citas solamente 
                      durante estas horas. Podrás modificar los horarios cuando quieras desde tu panel.
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-border" />

              <Button
                type="submit"
                className="w-full hover:scale-105 hover:shadow-md transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando horarios...
                  </>
                ) : (
                  <>
                    Completar Configuración
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