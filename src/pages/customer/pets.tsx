import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import { ArrowLeft, PawPrint, Plus, Edit, Trash2, Dog, Calendar } from 'lucide-react'

interface Pet {
  id: string
  name: string
  breed: string
  size: string
  age?: number
  temperament?: string
  photo_url?: string
  customer_id: string
  created_at: string
}

export default function CustomerPets() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    loadPets()
  }, [user])

  const loadPets = async () => {
    try {
      setIsLoading(true)
      
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('email', user!.email)
        .single()

      if (customerError) return

      const { data: petsData, error: petsError } = await supabase
        .from('pets')
        .select('*')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false })

      if (!petsError && petsData) {
        setPets(petsData)
      }
    } catch (error) {
      console.error('Error loading pets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePet = async (petId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta mascota?')) return

    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId)

      if (!error) {
        setPets(pets.filter(pet => pet.id !== petId))
      }
    } catch (error) {
      console.error('Error deleting pet:', error)
    }
  }

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return 'Pequeño'
      case 'medium': return 'Mediano'
      case 'large': return 'Grande'
      default: return size
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/customer/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <PawPrint className="w-8 h-8" />
              Mis Mascotas
            </h1>
            <p className="text-muted-foreground">
              Gestiona la información de tus mascotas
            </p>
          </div>
          <Button onClick={() => navigate('/customer/pets/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Mascota
          </Button>
        </div>

        {pets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Card key={pet.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  {/* Pet Photo */}
                  <div className="flex justify-center mb-4">
                    {pet.photo_url ? (
                      <img
                        src={pet.photo_url}
                        alt={pet.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                        <Dog className="w-12 h-12 text-primary" />
                      </div>
                    )}
                  </div>

                  {/* Pet Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold mb-2">{pet.name}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong>Raza:</strong> {pet.breed}</p>
                      <p><strong>Tamaño:</strong> {getSizeLabel(pet.size)}</p>
                      {pet.age && (
                        <p><strong>Edad:</strong> {pet.age} años</p>
                      )}
                      {pet.temperament && (
                        <p><strong>Temperamento:</strong> {pet.temperament}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/customer/pets/${pet.id}/edit`)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/customer/pets/${pet.id}/appointments`)}
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Citas
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeletePet(pet.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Dog className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No tienes mascotas registradas</h3>
              <p className="text-muted-foreground mb-6">
                Agrega información sobre tus mascotas para poder agendar citas más fácilmente
              </p>
              <Button onClick={() => navigate('/customer/pets/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primera Mascota
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}