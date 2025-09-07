import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { 
  Heart,
  Plus,
  Trash2,
  Loader2,
  ArrowRight,
  Dog,
  Cat,
  Fish
} from 'lucide-react'

interface PetData {
  id: string
  name: string
  breed: string
  age: number | ''
  weight: number | ''
  allergies: string
  conditions: string
  notes: string
}

const PET_TYPES = [
  { value: 'dog', label: 'Perro', icon: Dog },
  { value: 'cat', label: 'Gato', icon: Cat },
  { value: 'other', label: 'Otro', icon: Fish }
]

export default function PetRegistration() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [pets, setPets] = useState<PetData[]>([
    {
      id: '1',
      name: '',
      breed: '',
      age: '',
      weight: '',
      allergies: '',
      conditions: '',
      notes: ''
    }
  ])

  const addPet = () => {
    const newPet: PetData = {
      id: Date.now().toString(),
      name: '',
      breed: '',
      age: '',
      weight: '',
      allergies: '',
      conditions: '',
      notes: ''
    }
    setPets(prev => [...prev, newPet])
  }

  const removePet = (id: string) => {
    if (pets.length > 1) {
      setPets(prev => prev.filter(pet => pet.id !== id))
    }
  }

  const updatePet = (id: string, field: keyof PetData, value: string | number) => {
    setPets(prev => prev.map(pet => 
      pet.id === id ? { ...pet, [field]: value } : pet
    ))
  }

  const validatePets = () => {
    const newErrors: Record<string, string> = {}
    
    pets.forEach((pet, index) => {
      if (!pet.name.trim()) {
        newErrors[`pet-${index}-name`] = 'El nombre de la mascota es requerido'
      }
      if (!pet.breed.trim()) {
        newErrors[`pet-${index}-breed`] = 'La raza/tamaño es requerido'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePets()) return
    if (!user) return

    setIsLoading(true)
    setErrors({})

    try {
      // First, ensure a customer record exists for this user
      let customerId = user.id;
      
      // Try to get existing customer
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (!existingCustomer) {
        // Create new customer record
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            id: user.id, // Same ID as user_profile
            name: user.user_metadata?.full_name || 'Customer',
            email: user.email || '',
            phone: '+000000000' // Placeholder phone (required field)
          })
          .select('id')
          .single();

        if (customerError) {
          setErrors({ submit: `Error al crear perfil de cliente: ${customerError.message}` })
          return
        }
        
        customerId = newCustomer.id;

      } else {

      }
      
      // Create pet records
      const petsToInsert = pets
        .filter(pet => pet.name.trim()) // Only pets with names
        .map(pet => ({
          customer_id: customerId, // Use the customer ID (same as user.id but explicit)
          name: pet.name.trim(),
          breed: pet.breed.trim()
          // Note: Only basic fields supported in current schema
          // Additional fields (age, weight, allergies, conditions) will be added to schema later
        }))

      if (petsToInsert.length === 0) {
        setErrors({ submit: 'Debes registrar al menos una mascota' })
        return
      }

      const { error: petsError } = await supabase
        .from('pets')
        .insert(petsToInsert)

      if (petsError) {
        setErrors({ submit: `Error al registrar mascotas: ${petsError.message}` })
        return
      }

      // Success! Redirect to marketplace or dashboard
      navigate('/marketplace', { replace: true })

    } catch (error: any) {
      setErrors({ submit: error?.message || 'Error al registrar mascotas' })
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
              <Heart className="w-12 h-12 text-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Registra tus Mascotas
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Para brindarte la mejor experiencia, necesitamos conocer a tus compañeros peludos.
              Registra al menos una mascota para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                {pets.map((pet, index) => (
                  <Card key={pet.id} className="border-border">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                          <Heart className="w-5 h-5 text-primary" />
                          Mascota {index + 1}
                        </h3>
                        {pets.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePet(pet.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name - Required */}
                        <div>
                          <Label htmlFor={`pet-${index}-name`} className="text-foreground">
                            Nombre de la Mascota *
                          </Label>
                          <Input
                            id={`pet-${index}-name`}
                            type="text"
                            value={pet.name}
                            onChange={(e) => updatePet(pet.id, 'name', e.target.value)}
                            className="mt-1 bg-background text-foreground border-border"
                            placeholder="Ej: Max, Luna, Rocky..."
                            disabled={isLoading}
                          />
                          {errors[`pet-${index}-name`] && (
                            <p className="text-sm text-destructive mt-1">
                              {errors[`pet-${index}-name`]}
                            </p>
                          )}
                        </div>

                        {/* Breed/Size - Required */}
                        <div>
                          <Label htmlFor={`pet-${index}-breed`} className="text-foreground">
                            Raza/Tamaño *
                          </Label>
                          <Input
                            id={`pet-${index}-breed`}
                            type="text"
                            value={pet.breed}
                            onChange={(e) => updatePet(pet.id, 'breed', e.target.value)}
                            className="mt-1 bg-background text-foreground border-border"
                            placeholder="Ej: Golden Retriever, Gato Persa, Perro pequeño..."
                            disabled={isLoading}
                          />
                          {errors[`pet-${index}-breed`] && (
                            <p className="text-sm text-destructive mt-1">
                              {errors[`pet-${index}-breed`]}
                            </p>
                          )}
                        </div>

                        {/* Age - Optional */}
                        <div>
                          <Label htmlFor={`pet-${index}-age`} className="text-foreground">
                            Edad (años)
                          </Label>
                          <Input
                            id={`pet-${index}-age`}
                            type="number"
                            min="0"
                            max="30"
                            value={pet.age}
                            onChange={(e) => updatePet(pet.id, 'age', e.target.value ? parseInt(e.target.value) : '')}
                            className="mt-1 bg-background text-foreground border-border"
                            placeholder="3"
                            disabled={isLoading}
                          />
                        </div>

                        {/* Weight - Optional */}
                        <div>
                          <Label htmlFor={`pet-${index}-weight`} className="text-foreground">
                            Peso (kg)
                          </Label>
                          <Input
                            id={`pet-${index}-weight`}
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={pet.weight}
                            onChange={(e) => updatePet(pet.id, 'weight', e.target.value ? parseFloat(e.target.value) : '')}
                            className="mt-1 bg-background text-foreground border-border"
                            placeholder="15.5"
                            disabled={isLoading}
                          />
                        </div>

                        {/* Allergies - Optional */}
                        <div className="md:col-span-2">
                          <Label htmlFor={`pet-${index}-allergies`} className="text-foreground">
                            Alergias o Sensibilidades
                          </Label>
                          <Input
                            id={`pet-${index}-allergies`}
                            type="text"
                            value={pet.allergies}
                            onChange={(e) => updatePet(pet.id, 'allergies', e.target.value)}
                            className="mt-1 bg-background text-foreground border-border"
                            placeholder="Ej: productos con perfume, ciertos champús..."
                            disabled={isLoading}
                          />
                        </div>

                        {/* Conditions - Optional */}
                        <div className="md:col-span-2">
                          <Label htmlFor={`pet-${index}-conditions`} className="text-foreground">
                            Condiciones Médicas o Comportamiento
                          </Label>
                          <Input
                            id={`pet-${index}-conditions`}
                            type="text"
                            value={pet.conditions}
                            onChange={(e) => updatePet(pet.id, 'conditions', e.target.value)}
                            className="mt-1 bg-background text-foreground border-border"
                            placeholder="Ej: piel sensible, muy activo, tímido con extraños..."
                            disabled={isLoading}
                          />
                        </div>

                        {/* Notes - Optional */}
                        <div className="md:col-span-2">
                          <Label htmlFor={`pet-${index}-notes`} className="text-foreground">
                            Notas Adicionales
                          </Label>
                          <Textarea
                            id={`pet-${index}-notes`}
                            value={pet.notes}
                            onChange={(e) => updatePet(pet.id, 'notes', e.target.value)}
                            className="mt-1 bg-background text-foreground border-border"
                            placeholder="Cualquier información adicional que sea útil para el groomer..."
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
                onClick={addPet}
                className="w-full border-border text-foreground hover:bg-muted"
                disabled={isLoading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Otra Mascota
              </Button>

              {errors.submit && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{errors.submit}</p>
                </div>
              )}

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-primary mb-1">¿Por qué necesitamos esta información?</h4>
                    <p className="text-sm text-muted-foreground">
                      Esta información ayuda a los groomers a brindar el mejor cuidado posible para tu mascota, 
                      adaptando sus servicios a las necesidades específicas de cada animal.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full hover:scale-105 hover:shadow-md transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registrando mascotas...
                  </>
                ) : (
                  <>
                    Continuar al Marketplace
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