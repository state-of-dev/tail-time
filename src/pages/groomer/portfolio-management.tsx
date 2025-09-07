import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context-simple';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ArrowLeft,
  Camera,
  Upload,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Grid3x3,
  List,
  Search,
  Filter,
  Download,
  Share,
  Star,
  Heart,
  Tag,
  Calendar,
  Clock,
  User,
  Scissors,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ExternalLink,
  Copy
} from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  serviceType: string;
  petName: string;
  petType: string;
  isPublic: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
  appointmentId?: string;
  views: number;
  likes: number;
}

const serviceTypes = [
  'Baño Básico',
  'Corte y Baño',
  'Corte de Uñas',
  'Tratamiento Spa',
  'Corte Estilizado',
  'Limpieza Dental',
  'Otro'
];

const petTypes = [
  'Perro',
  'Gato',
  'Conejo',
  'Hurón',
  'Otro'
];

const commonTags = [
  'antes-despues',
  'transformación',
  'corte-verano',
  'corte-invierno',
  'pelo-largo',
  'pelo-corto',
  'rizado',
  'liso',
  'primera-vez',
  'rescate',
  'senior',
  'cachorro'
];

export default function PortfolioManagement() {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState<string>('all');
  const [filterVisibility, setFilterVisibility] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; type: 'before' | 'after' } | null>(null);
  
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    serviceType: serviceTypes[0],
    petName: '',
    petType: petTypes[0],
    isPublic: true,
    isFeatured: false,
    tags: [] as string[],
    beforeImage: null as File | null,
    afterImage: null as File | null
  });
  
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!user || !businessSlug) return;
    loadPortfolio();
  }, [user, businessSlug]);

  const loadPortfolio = async () => {
    // Mock data for now
    const mockPortfolioItems: PortfolioItem[] = [
      {
        id: '1',
        title: 'Transformación Golden Retriever',
        description: 'Corte de verano para Max, un golden retriever de 3 años. Cliente muy cooperativo.',
        beforeImageUrl: '/api/placeholder/400/300',
        afterImageUrl: '/api/placeholder/400/300',
        serviceType: 'Corte y Baño',
        petName: 'Max',
        petType: 'Perro',
        isPublic: true,
        isFeatured: true,
        tags: ['antes-despues', 'transformación', 'corte-verano', 'pelo-largo'],
        createdAt: '2024-08-15',
        appointmentId: 'apt-123',
        views: 156,
        likes: 23
      },
      {
        id: '2',
        title: 'Baño Relajante para Gato Persa',
        description: 'Primera visita de Luna, una gata persa muy elegante. Tratamiento spa completo.',
        beforeImageUrl: '/api/placeholder/400/300',
        afterImageUrl: '/api/placeholder/400/300',
        serviceType: 'Tratamiento Spa',
        petName: 'Luna',
        petType: 'Gato',
        isPublic: true,
        isFeatured: false,
        tags: ['spa', 'gato-persa', 'primera-vez', 'pelo-largo'],
        createdAt: '2024-08-20',
        views: 89,
        likes: 12
      },
      {
        id: '3',
        title: 'Corte Estilizado Poodle',
        description: 'Corte león para Rocky, un poodle muy activo. Estilo moderno y funcional.',
        beforeImageUrl: '/api/placeholder/400/300',
        afterImageUrl: '/api/placeholder/400/300',
        serviceType: 'Corte Estilizado',
        petName: 'Rocky',
        petType: 'Perro',
        isPublic: false,
        isFeatured: false,
        tags: ['poodle', 'corte-leon', 'estilizado'],
        createdAt: '2024-08-22',
        views: 34,
        likes: 7
      }
    ];

    setPortfolioItems(mockPortfolioItems);
    setIsLoading(false);
  };

  const filteredItems = portfolioItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesService = filterService === 'all' || item.serviceType === filterService;
    
    const matchesVisibility = filterVisibility === 'all' || 
                             (filterVisibility === 'public' && item.isPublic) ||
                             (filterVisibility === 'private' && !item.isPublic) ||
                             (filterVisibility === 'featured' && item.isFeatured);
    
    return matchesSearch && matchesService && matchesVisibility;
  });

  const handleFileSelect = (files: FileList | null, type: 'before' | 'after') => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('El archivo es muy grande. El tamaño máximo es 5MB.');
      return;
    }
    
    if (type === 'before') {
      setUploadData(prev => ({ ...prev, beforeImage: file }));
    } else {
      setUploadData(prev => ({ ...prev, afterImage: file }));
    }
  };

  const handleUpload = async () => {
    if (!uploadData.beforeImage || !uploadData.afterImage || !uploadData.title.trim()) {
      alert('Por favor completa todos los campos requeridos y selecciona ambas imágenes.');
      return;
    }

    setIsUploading(true);
    try {
      // TODO: Upload to Supabase Storage
      // For now, create mock URLs
      const newItem: PortfolioItem = {
        id: Date.now().toString(),
        title: uploadData.title,
        description: uploadData.description,
        beforeImageUrl: URL.createObjectURL(uploadData.beforeImage),
        afterImageUrl: URL.createObjectURL(uploadData.afterImage),
        serviceType: uploadData.serviceType,
        petName: uploadData.petName,
        petType: uploadData.petType,
        isPublic: uploadData.isPublic,
        isFeatured: uploadData.isFeatured,
        tags: uploadData.tags,
        createdAt: new Date().toISOString().split('T')[0],
        views: 0,
        likes: 0
      };

      setPortfolioItems(prev => [newItem, ...prev]);
      setShowUploadModal(false);
      resetUploadData();
    } catch (error) {
      console.error('Error uploading portfolio item:', error);
      alert('Error al subir las imágenes. Inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetUploadData = () => {
    setUploadData({
      title: '',
      description: '',
      serviceType: serviceTypes[0],
      petName: '',
      petType: petTypes[0],
      isPublic: true,
      isFeatured: false,
      tags: [],
      beforeImage: null,
      afterImage: null
    });
  };

  const handleDelete = async (itemId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta publicación del portafolio?')) {
      setPortfolioItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const handleToggleVisibility = async (itemId: string) => {
    setPortfolioItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, isPublic: !item.isPublic } : item
    ));
  };

  const handleToggleFeatured = async (itemId: string) => {
    setPortfolioItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, isFeatured: !item.isFeatured } : item
    ));
  };

  const addTag = (tag: string) => {
    if (!uploadData.tags.includes(tag)) {
      setUploadData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setUploadData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const totalStats = {
    totalItems: portfolioItems.length,
    publicItems: portfolioItems.filter(item => item.isPublic).length,
    featuredItems: portfolioItems.filter(item => item.isFeatured).length,
    totalViews: portfolioItems.reduce((sum, item) => sum + item.views, 0),
    totalLikes: portfolioItems.reduce((sum, item) => sum + item.likes, 0)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Camera className="w-8 h-8 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando portafolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/groomer/${businessSlug}`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Portafolio
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gestiona tu galería de trabajos
                </p>
              </div>
            </div>

            <Button onClick={() => setShowUploadModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Trabajo
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-foreground">{totalStats.totalItems}</p>
                </div>
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Público</p>
                  <p className="text-2xl font-bold text-foreground">{totalStats.publicItems}</p>
                </div>
                <Eye className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Destacados</p>
                  <p className="text-2xl font-bold text-foreground">{totalStats.featuredItems}</p>
                </div>
                <Star className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Visualizaciones</p>
                  <p className="text-2xl font-bold text-foreground">{totalStats.totalViews}</p>
                </div>
                <Eye className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Me Gusta</p>
                  <p className="text-2xl font-bold text-foreground">{totalStats.totalLikes}</p>
                </div>
                <Heart className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar trabajos, mascotas, tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterService} onValueChange={setFilterService}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tipo de servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los servicios</SelectItem>
                    {serviceTypes.map(service => (
                      <SelectItem key={service} value={service}>{service}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterVisibility} onValueChange={setFilterVisibility}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Visibilidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="public">Públicos</SelectItem>
                    <SelectItem value="private">Privados</SelectItem>
                    <SelectItem value="featured">Destacados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Grid/List */}
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12 text-muted-foreground">
                <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                  <Camera className="w-12 h-12 opacity-50" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {portfolioItems.length === 0 
                    ? 'Tu portafolio está vacío'
                    : 'No se encontraron trabajos'
                  }
                </h3>
                <p className="text-sm mb-6">
                  {portfolioItems.length === 0
                    ? 'Empieza subiendo fotos de tus trabajos para mostrar a tus clientes'
                    : 'Intenta ajustar los filtros de búsqueda'
                  }
                </p>
                <Button onClick={() => setShowUploadModal(true)} size="lg">
                  <Upload className="w-4 h-4 mr-2" />
                  {portfolioItems.length === 0 ? 'Subir Primer Trabajo' : 'Agregar Trabajo'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
          }>
            {filteredItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                {viewMode === 'grid' ? (
                  <div>
                    {/* Before/After Images */}
                    <div className="relative">
                      <div className="grid grid-cols-2 gap-1">
                        <div 
                          className="relative aspect-square bg-muted cursor-pointer overflow-hidden"
                          onClick={() => setSelectedImage({ url: item.beforeImageUrl, type: 'before' })}
                        >
                          <img 
                            src={item.beforeImageUrl} 
                            alt={`${item.title} - Antes`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge variant="secondary" className="text-xs">Antes</Badge>
                          </div>
                        </div>
                        <div 
                          className="relative aspect-square bg-muted cursor-pointer overflow-hidden"
                          onClick={() => setSelectedImage({ url: item.afterImageUrl, type: 'after' })}
                        >
                          <img 
                            src={item.afterImageUrl} 
                            alt={`${item.title} - Después`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge className="text-xs">Después</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Status badges */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {item.isFeatured && (
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">
                            <Star className="w-3 h-3 mr-1" />
                            Destacado
                          </Badge>
                        )}
                        <Badge variant={item.isPublic ? 'default' : 'secondary'} className="text-xs">
                          {item.isPublic ? (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Público
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Privado
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {item.petName}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Scissors className="w-3 h-3" />
                            {item.serviceType}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {item.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {item.likes}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleVisibility(item.id)}
                            >
                              {item.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleFeatured(item.id)}
                              className={item.isFeatured ? 'text-yellow-600' : ''}
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(item);
                                setShowEditModal(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                            {item.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{item.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </div>
                ) : (
                  // List view layout
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex gap-2">
                        <img 
                          src={item.beforeImageUrl} 
                          alt={`${item.title} - Antes`}
                          className="w-20 h-20 object-cover rounded cursor-pointer"
                          onClick={() => setSelectedImage({ url: item.beforeImageUrl, type: 'before' })}
                        />
                        <img 
                          src={item.afterImageUrl} 
                          alt={`${item.title} - Después`}
                          className="w-20 h-20 object-cover rounded cursor-pointer"
                          onClick={() => setSelectedImage({ url: item.afterImageUrl, type: 'after' })}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {item.isFeatured && <Star className="w-4 h-4 text-yellow-500" />}
                            {item.isPublic ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span>{item.petName} ({item.petType})</span>
                          <span>•</span>
                          <span>{item.serviceType}</span>
                          <span>•</span>
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{item.views} vistas</span>
                          <span>•</span>
                          <span>{item.likes} likes</span>
                        </div>

                        <div className="flex items-center justify-between">
                          {item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.tags.slice(0, 5).map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleVisibility(item.id)}
                            >
                              {item.isPublic ? 'Ocultar' : 'Publicar'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(item);
                                setShowEditModal(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Agregar Nuevo Trabajo
            </DialogTitle>
            <DialogDescription>
              Sube fotos antes y después de tu trabajo para mostrar tu talento
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Image Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">Foto Antes *</Label>
                <div 
                  className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadData.beforeImage ? (
                    <div className="space-y-2">
                      <img 
                        src={URL.createObjectURL(uploadData.beforeImage)}
                        alt="Antes"
                        className="w-full h-40 object-cover rounded"
                      />
                      <p className="text-xs text-muted-foreground">{uploadData.beforeImage.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click para seleccionar foto ANTES</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files, 'before')}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Foto Después *</Label>
                <div 
                  className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => handleFileSelect((e.target as HTMLInputElement).files, 'after');
                    input.click();
                  }}
                >
                  {uploadData.afterImage ? (
                    <div className="space-y-2">
                      <img 
                        src={URL.createObjectURL(uploadData.afterImage)}
                        alt="Después"
                        className="w-full h-40 object-cover rounded"
                      />
                      <p className="text-xs text-muted-foreground">{uploadData.afterImage.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click para seleccionar foto DESPUÉS</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Título del Trabajo *</Label>
                <Input
                  id="title"
                  value={uploadData.title}
                  onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="ej. Transformación Golden Retriever"
                />
              </div>

              <div>
                <Label htmlFor="serviceType">Tipo de Servicio</Label>
                <Select
                  value={uploadData.serviceType}
                  onValueChange={(value) => setUploadData(prev => ({ ...prev, serviceType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="petName">Nombre de la Mascota</Label>
                <Input
                  id="petName"
                  value={uploadData.petName}
                  onChange={(e) => setUploadData(prev => ({ ...prev, petName: e.target.value }))}
                  placeholder="ej. Max"
                />
              </div>

              <div>
                <Label htmlFor="petType">Tipo de Mascota</Label>
                <Select
                  value={uploadData.petType}
                  onValueChange={(value) => setUploadData(prev => ({ ...prev, petType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {petTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={uploadData.description}
                onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe el trabajo realizado, técnicas utilizadas, comportamiento de la mascota, etc."
                rows={3}
              />
            </div>

            {/* Tags */}
            <div>
              <Label className="text-sm font-medium">Tags</Label>
              <div className="mt-2 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {commonTags.map(tag => (
                    <Button
                      key={tag}
                      type="button"
                      variant={uploadData.tags.includes(tag) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => uploadData.tags.includes(tag) ? removeTag(tag) : addTag(tag)}
                    >
                      #{tag}
                    </Button>
                  ))}
                </div>
                {uploadData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <span className="text-sm text-muted-foreground">Seleccionados:</span>
                    {uploadData.tags.map(tag => (
                      <Badge key={tag} variant="default" className="text-xs">
                        #{tag}
                        <button 
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:bg-white/20 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm">Configuración de Publicación</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Visible al público</Label>
                  <p className="text-xs text-muted-foreground">Los clientes podrán ver este trabajo</p>
                </div>
                <Switch
                  checked={uploadData.isPublic}
                  onCheckedChange={(checked) => setUploadData(prev => ({ ...prev, isPublic: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Trabajo destacado</Label>
                  <p className="text-xs text-muted-foreground">Aparecerá primero en tu portafolio</p>
                </div>
                <Switch
                  checked={uploadData.isFeatured}
                  onCheckedChange={(checked) => setUploadData(prev => ({ ...prev, isFeatured: checked }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowUploadModal(false);
              resetUploadData();
            }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={isUploading || !uploadData.beforeImage || !uploadData.afterImage || !uploadData.title.trim()}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Subir Trabajo
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedImage?.type === 'before' ? 'Foto Antes' : 'Foto Después'}
            </DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="flex justify-center">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.type === 'before' ? 'Antes' : 'Después'}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}