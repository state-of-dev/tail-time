import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/lib/supabase'
import { addMissingColumns } from '@/lib/database-migration'
import { 
  Clock,
  Loader2,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const DAYS = [
  { key: 'monday', name: 'Lunes' },
  { key: 'tuesday', name: 'Martes' },
  { key: 'wednesday', name: 'Miércoles' },
  { key: 'thursday', name: 'Jueves' },
  { key: 'friday', name: 'Viernes' },
  { key: 'saturday', name: 'Sábado' },
  { key: 'sunday', name: 'Domingo' }
]

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
]

export default function BusinessHours() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [migrationSql, setMigrationSql] = useState<string | null>(null)
  
  const [businessHours, setBusinessHours] = useState(() => {
    // Default hours: Monday-Friday 9:00-17:00, Saturday 9:00-14:00, Sunday closed
    const defaultHours: Record<string, { isOpen: boolean; openTime: string; closeTime: string }> = {}
    DAYS.forEach((day, index) => {
      if (index < 5) { // Monday-Friday
        defaultHours[day.key] = { isOpen: true, openTime: '09:00', closeTime: '17:00' }
      } else if (index === 5) { // Saturday
        defaultHours[day.key] = { isOpen: true, openTime: '09:00', closeTime: '14:00' }
      } else { // Sunday
        defaultHours[day.key] = { isOpen: false, openTime: '09:00', closeTime: '17:00' }
      }
    })
    return defaultHours
  })

  const handleDayToggle = (dayKey: string) => {
    setBusinessHours(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        isOpen: !prev[dayKey].isOpen
      }
    }))
  }

  const handleTimeChange = (dayKey: string, type: 'openTime' | 'closeTime', value: string) => {
    setBusinessHours(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [type]: value
      }
    }))
  }

  const validateHours = () => {
    const newErrors: Record<string, string> = {}
    
    Object.entries(businessHours).forEach(([dayKey, hours]) => {
      if (hours.isOpen) {
        if (hours.openTime >= hours.closeTime) {
          newErrors[dayKey] = 'La hora de apertura debe ser anterior a la de cierre'
        }
      }
    })

    // Check if at least one day is open
    const hasOpenDays = Object.values(businessHours).some(hours => hours.isOpen)
    if (!hasOpenDays) {
      newErrors.general = 'Debes tener al menos un día abierto'
    }

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

      // Check if database schema needs migration
      const migrationCheck = await addMissingColumns()
      if (!migrationCheck.success && migrationCheck.needsMigration) {
        setMigrationSql(migrationCheck.sql || '')
        setErrors({ submit: 'La base de datos necesita ser actualizada. Ve las instrucciones abajo.' })
        return
      }

      // Save business hours as JSON in business_profiles
      const { error: hoursError } = await supabase
        .from('business_profiles')
        .update({ 
          business_hours: businessHours,
          updated_at: new Date().toISOString()
        })
        .eq('id', business.id)

      if (hoursError) {
        setErrors({ submit: hoursError.message })
        return
      }

      navigate('/setup/services', { replace: true })

    } catch (error: any) {
      setErrors({ submit: error?.message || 'Error al guardar horarios' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <Card className="border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <Clock className="w-12 h-12 text-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Horarios de Atención
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Define cuándo estará abierto tu negocio para recibir clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {DAYS.map((day) => (
                  <div key={day.key} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => handleDayToggle(day.key)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            businessHours[day.key].isOpen
                              ? 'bg-foreground border-foreground'
                              : 'border-border'
                          }`}
                        >
                          {businessHours[day.key].isOpen && (
                            <CheckCircle className="w-3 h-3 text-background" />
                          )}
                        </button>
                        <Label className="text-lg font-medium text-foreground">
                          {day.name}
                        </Label>
                      </div>
                      
                      {!businessHours[day.key].isOpen && (
                        <span className="text-sm text-muted-foreground">Cerrado</span>
                      )}
                    </div>

                    {businessHours[day.key].isOpen && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-foreground mb-2 block">
                            Hora de Apertura
                          </Label>
                          <select
                            value={businessHours[day.key].openTime}
                            onChange={(e) => handleTimeChange(day.key, 'openTime', e.target.value)}
                            className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                            disabled={isLoading}
                          >
                            {TIME_SLOTS.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-foreground mb-2 block">
                            Hora de Cierre
                          </Label>
                          <select
                            value={businessHours[day.key].closeTime}
                            onChange={(e) => handleTimeChange(day.key, 'closeTime', e.target.value)}
                            className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                            disabled={isLoading}
                          >
                            {TIME_SLOTS.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {errors[day.key] && (
                      <p className="text-sm text-destructive mt-2">{errors[day.key]}</p>
                    )}
                  </div>
                ))}
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

              {migrationSql && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardHeader>
                    <CardTitle className="text-amber-900 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Migración de Base de Datos Requerida
                    </CardTitle>
                    <CardDescription className="text-amber-700">
                      Copia y pega este SQL en el Editor SQL de tu Supabase Dashboard
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-white p-4 rounded border text-xs overflow-x-auto text-gray-800">
                      {migrationSql}
                    </pre>
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(migrationSql)}
                        className="text-amber-700 border-amber-300 hover:bg-amber-100"
                      >
                        Copiar SQL
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('https://app.supabase.io', '_blank')}
                        className="text-amber-700 border-amber-300 hover:bg-amber-100"
                      >
                        Abrir Supabase
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
                    Guardando horarios...
                  </>
                ) : (
                  <>
                    Continuar a Servicios
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