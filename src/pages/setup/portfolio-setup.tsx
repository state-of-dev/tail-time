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
  Camera,
  X,
  Plus,
  Loader2,
  ArrowRight,
  Image as ImageIcon,
  CheckCircle
} from 'lucide-react'

interface PortfolioItem {
  id: string
  title: string
  description: string
  beforeImage: File | null
  afterImage: File | null
  beforeImageUrl?: string
  afterImageUrl?: string
}

const SAMPLE_PORTFOLIO_ITEMS: Omit<PortfolioItem, 'id' | 'beforeImage' | 'afterImage'>[] = [
  {
    title: 'Transformación Golden Retriever',
    description: 'Baño completo y corte de pelo para Golden Retriever. Incluye limpieza de orejas y corte de uñas.',
    beforeImageUrl: '/api/placeholder/300/200',
    afterImageUrl: '/api/placeholder/300/200'
  },
  {
    title: 'Poodle Estilo Clásico',
    description: 'Corte tradicional poodle con acabado profesional. Cliente muy satisfecho con el resultado.',
    beforeImageUrl: '/api/placeholder/300/200',
    afterImageUrl: '/api/placeholder/300/200'
  }
]

export default function PortfolioSetup() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() =>
    SAMPLE_PORTFOLIO_ITEMS.map(item => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      beforeImage: null,
      afterImage: null
    }))
  )

  const [skipPortfolio, setSkipPortfolio] = useState(false)

  const addPortfolioItem = () => {
    const newItem: PortfolioItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      description: '',
      beforeImage: null,
      afterImage: null
    }
    setPortfolioItems(prev => [...prev, newItem])
  }

  const removePortfolioItem = (id: string) => {
    setPortfolioItems(prev => prev.filter(item => item.id !== id))
  }

  const updatePortfolioItem = (id: string, field: keyof PortfolioItem, value: any) => {
    setPortfolioItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const handleFileUpload = (id: string, field: 'beforeImage' | 'afterImage', file: File | null) => {
    if (file && !file.type.startsWith('image/')) {
      setErrors({ [`${id}-${field}`]: 'Por favor selecciona una imagen válida' })
      return
    }
    
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[`${id}-${field}`]
      return newErrors
    })

    updatePortfolioItem(id, field, file)
  }

  const validatePortfolio = () => {
    const newErrors: Record<string, string> = {}
    
    if (skipPortfolio) {
      return true
    }

    portfolioItems.forEach((item, index) => {
      if (!item.title.trim()) {
        newErrors[`item-${index}-title`] = 'El título es requerido'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const uploadImage = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('portfolio')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      console.error('Error uploading image:', error)
      return null
    }

    const { data: urlData } = supabase.storage
      .from('portfolio')
      .getPublicUrl(data.path)

    return urlData.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePortfolio()) return
    if (!user) return

    setIsLoading(true)
    setErrors({})

    try {
      // Get the business profile
      const { data: business, error: businessError } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (businessError || !business) {
        setErrors({ submit: 'No se encontró el perfil del negocio' })
        return
      }

      if (!skipPortfolio && portfolioItems.length > 0) {
        // Upload images and save portfolio items
        const portfolioData = []

        for (const item of portfolioItems) {
          if (!item.title.trim()) continue

          const portfolioItem: any = {
            title: item.title,
            description: item.description || ''
          }

          // Upload before image if exists
          if (item.beforeImage) {
            const beforePath = `${business.id}/before-${item.id}-${Date.now()}.jpg`
            portfolioItem.beforeImageUrl = await uploadImage(item.beforeImage, beforePath)
          } else if (item.beforeImageUrl) {
            portfolioItem.beforeImageUrl = item.beforeImageUrl
          }

          // Upload after image if exists
          if (item.afterImage) {
            const afterPath = `${business.id}/after-${item.id}-${Date.now()}.jpg`
            portfolioItem.afterImageUrl = await uploadImage(item.afterImage, afterPath)
          } else if (item.afterImageUrl) {
            portfolioItem.afterImageUrl = item.afterImageUrl
          }

          portfolioData.push(portfolioItem)
        }

        // Save portfolio as JSON in business_profiles for now
        const { error: portfolioError } = await supabase
          .from('business_profiles')
          .update({ 
            portfolio: portfolioData,
            updated_at: new Date().toISOString()
          })
          .eq('id', business.id)

        if (portfolioError) {
          setErrors({ submit: portfolioError.message })
          return
        }
      }

      navigate('/setup/launch-confirmation', { replace: true })

    } catch (error: any) {
      setErrors({ submit: error?.message || 'Error al guardar portfolio' })
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
              <Camera className="w-12 h-12 text-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Portfolio de Trabajos
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Muestra tus mejores trabajos con fotos antes y después
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Skip Portfolio Option */}
              <Card className="border-border bg-muted/20">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setSkipPortfolio(!skipPortfolio)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        skipPortfolio
                          ? 'bg-foreground border-foreground'
                          : 'border-border'
                      }`}
                    >
                      {skipPortfolio && (
                        <CheckCircle className="w-3 h-3 text-background" />
                      )}
                    </button>
                    <Label className="text-foreground">
                      Saltear portfolio por ahora (puedes añadirlo después)
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {!skipPortfolio && (
                <>
                  <div className="space-y-6">
                    {portfolioItems.map((item, index) => (
                      <Card key={item.id} className="border-border">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-foreground">
                              Trabajo {index + 1}
                            </h3>
                            {portfolioItems.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removePortfolioItem(item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="space-y-4">
                            {/* Title and Description */}
                            <div>
                              <Label htmlFor={`item-${index}-title`} className="text-foreground">
                                Título del Trabajo
                              </Label>
                              <Input
                                id={`item-${index}-title`}
                                type="text"
                                value={item.title}
                                onChange={(e) => updatePortfolioItem(item.id, 'title', e.target.value)}
                                className="mt-1 bg-background text-foreground border-border"
                                placeholder="Ej: Transformación Golden Retriever"
                                disabled={isLoading}
                              />
                              {errors[`item-${index}-title`] && (
                                <p className="text-sm text-destructive mt-1">
                                  {errors[`item-${index}-title`]}
                                </p>
                              )}
                            </div>

                            <div>
                              <Label htmlFor={`item-${index}-description`} className="text-foreground">
                                Descripción
                              </Label>
                              <Textarea
                                id={`item-${index}-description`}
                                value={item.description}
                                onChange={(e) => updatePortfolioItem(item.id, 'description', e.target.value)}
                                className="mt-1 bg-background text-foreground border-border"
                                placeholder="Describe el trabajo realizado..."
                                rows={2}
                                disabled={isLoading}
                              />
                            </div>

                            {/* Image Uploads */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Before Image */}
                              <div>
                                <Label className="text-foreground mb-2 block">
                                  Foto Antes
                                </Label>
                                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                                  {item.beforeImage || item.beforeImageUrl ? (
                                    <div className="relative">
                                      <img
                                        src={item.beforeImage ? URL.createObjectURL(item.beforeImage) : item.beforeImageUrl}
                                        alt="Antes"
                                        className="w-full h-32 object-cover rounded"
                                      />
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => handleFileUpload(item.id, 'beforeImage', null)}
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground" />
                                      <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(item.id, 'beforeImage', e.target.files?.[0] || null)}
                                        className="hidden"
                                        id={`before-${item.id}`}
                                        disabled={isLoading}
                                      />
                                      <Label
                                        htmlFor={`before-${item.id}`}
                                        className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                                      >
                                        Subir foto antes
                                      </Label>
                                    </div>
                                  )}
                                </div>
                                {errors[`${item.id}-beforeImage`] && (
                                  <p className="text-sm text-destructive mt-1">
                                    {errors[`${item.id}-beforeImage`]}
                                  </p>
                                )}
                              </div>

                              {/* After Image */}
                              <div>
                                <Label className="text-foreground mb-2 block">
                                  Foto Después
                                </Label>
                                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                                  {item.afterImage || item.afterImageUrl ? (
                                    <div className="relative">
                                      <img
                                        src={item.afterImage ? URL.createObjectURL(item.afterImage) : item.afterImageUrl}
                                        alt="Después"
                                        className="w-full h-32 object-cover rounded"
                                      />
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => handleFileUpload(item.id, 'afterImage', null)}
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground" />
                                      <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(item.id, 'afterImage', e.target.files?.[0] || null)}
                                        className="hidden"
                                        id={`after-${item.id}`}
                                        disabled={isLoading}
                                      />
                                      <Label
                                        htmlFor={`after-${item.id}`}
                                        className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                                      >
                                        Subir foto después
                                      </Label>
                                    </div>
                                  )}
                                </div>
                                {errors[`${item.id}-afterImage`] && (
                                  <p className="text-sm text-destructive mt-1">
                                    {errors[`${item.id}-afterImage`]}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPortfolioItem}
                    className="w-full border-border text-foreground hover:bg-muted"
                    disabled={isLoading}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Otro Trabajo
                  </Button>
                </>
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
                    Guardando portfolio...
                  </>
                ) : (
                  <>
                    Finalizar Configuración
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