import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context-simple'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNotificationsZustand } from '@/hooks/useNotificationsZustand'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PawPrint, User, Settings, LogOut, Home, UserCircle, Bell, CheckCircle, XCircle, Clock, CreditCard, PartyPopper, Mail, Sparkles, Crown, Star } from 'lucide-react'
import {
  Star1, Star6, Star7, Star8, Star9, Star10, Star13, Star19, Star20, Star21, Star22, Star23, Star24, Star25, Star26, Star27, Star28,
  StarSizes
} from '@/components/ui/neobrutalism-stars'

export function Navigation() {
  const navigate = useNavigate()
  const { user, profile, businessProfile, signOut, loading } = useAuth()
  const { notifications, unreadCount, isLoading: notificationsLoading, markAsRead, markAllAsRead } = useNotificationsZustand()

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Ahora'
    if (diffInMinutes < 60) return `${diffInMinutes}min`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment_confirmed':
        return <CheckCircle className="w-5 h-5 text-main-foreground icon-float" />
      case 'appointment_cancelled':
        return <XCircle className="w-5 h-5 text-main-foreground icon-float" />
      case 'appointment_reminder':
        return <Clock className="w-5 h-5 text-main-foreground icon-float" />
      case 'payment_received':
        return <CreditCard className="w-5 h-5 text-main-foreground icon-float" />
      case 'appointment_completed':
        return <PartyPopper className="w-5 h-5 text-main-foreground icon-float" />
      default:
        return <Mail className="w-5 h-5 text-main-foreground icon-float" />
    }
  }

  const handleSignOut = async () => {
    try {

      // Clear any problematic tokens first
      localStorage.removeItem('sb-auth-token')
      
      // Sign out from Supabase
      await signOut()

      // Navigate to login
      navigate('/auth/login', { replace: true })
      
    } catch (error: any) {
      
      // Force clear everything and redirect anyway
      localStorage.removeItem('sb-auth-token')
      navigate('/auth/login', { replace: true })
    }
  }

  const handleHomeClick = () => {
    if (!user) {
      // Not logged in - go to landing page
      navigate('/')
    } else if (profile?.role === 'customer') {
      // Customer - go to their dashboard
      navigate('/customer/dashboard')
    } else if (profile?.role === 'groomer' && businessProfile?.slug) {
      // Groomer with business - go to their dashboard
      navigate(`/groomer/${businessProfile.slug}/dashboard`)
    } else if (profile?.role === 'groomer') {
      // Groomer without business - go to marketplace or setup
      navigate('/marketplace')
    } else {
      // Default fallback - marketplace
      navigate('/marketplace')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-chart-2 brutal-border-thick brutal-shadow border-b-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleHomeClick}
              className="flex items-center gap-2 text-xl font-black text-main-foreground hover:text-main-foreground/80 transition-colors bg-main brutal-border brutal-shadow-sm px-4 py-2 rounded-base hover:brutal-hover"
            >
              <PawPrint className="w-6 h-6" />
              TAILTIME
            </button>
          </div>
          
          <nav className="flex items-center space-x-2">
            {user ? (
              // Logged in navigation - All users get access to core features
              <>
                {/* Dashboard - Different for each role */}
                <Button
                  variant="pet-blue"
                  size="sm"
                  className="brutal-border brutal-shadow-sm rounded-base font-black hover:brutal-hover hover:bg-chart-2"
                  onClick={() => {
                    if (profile?.role === 'groomer' && businessProfile) {
                      navigate(`/groomer/${businessProfile.slug}/dashboard`)
                    } else {
                      navigate('/customer/dashboard')
                    }
                  }}
                >
                  DASHBOARD
                </Button>
                
                {/* Marketplace - Available for all users */}
                <Button
                  variant="pet-green"
                  size="sm"
                  className="brutal-border brutal-shadow-sm rounded-base font-black hover:brutal-hover hover:bg-chart-3"
                  onClick={() => navigate('/marketplace')}
                >
                  MARKETPLACE
                </Button>
                
                {/* Groomer navigation simplified - only Dashboard and Marketplace */}
                
                {/* Notification Bell - Available for all users */}
                {/* <NotificationBellSimple /> */}
                
                {/* Notification Center - User Dropdown - Neobrutalism Style */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative flex items-center gap-3 bg-chart-3 text-main-foreground brutal-border-thick brutal-shadow hover:brutal-hover rounded-base font-black transform hover:scale-105 transition-all duration-200">
                      <UserCircle className="w-6 h-6 icon-float" />
                      {!loading && (
                        <span className="hidden md:inline uppercase">
                          {(profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'USUARIO').toUpperCase()}
                        </span>
                      )}
                      <Star1 size={StarSizes.xs} className="star-decoration" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs bg-chart-2 text-main-foreground brutal-border font-black">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-96 bg-chart-2 brutal-border-thick brutal-shadow-xl rounded-base" align="end" forceMount>
                    {/* Header with user info and actions - Neobrutalism Style */}
                    <DropdownMenuLabel className="font-normal p-6 brutal-border-thick border-b-4 border-chart-4 bg-chart-1 relative overflow-hidden">
                      <Star6 size={StarSizes.sm} className="absolute top-2 left-2 star-decoration" />
                      <Star7 size={StarSizes.sm} className="absolute bottom-2 right-2 star-decoration" />

                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-chart-8 brutal-border rounded-base">
                            <UserCircle className="w-8 h-8 text-main-foreground icon-float" />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <p className="text-lg font-black leading-none text-main-foreground uppercase">
                              {(profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'USUARIO').toUpperCase()}
                            </p>
                            <p className="text-sm leading-none text-main-foreground/80 font-bold">
                              {user?.email?.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <Button
                              onClick={markAllAsRead}
                              className="bg-chart-6 text-main-foreground brutal-border brutal-shadow hover:brutal-hover font-black text-xs h-8 px-3 uppercase transform hover:scale-105 transition-all duration-200"
                            >
                              <CheckCircle className="w-3 h-3 mr-1 icon-float" />
                              MARCAR TODAS
                            </Button>
                          )}
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    {/* Notifications Section - Neobrutalism Style */}
                    <div className="max-h-80 overflow-y-auto">
                      {notificationsLoading ? (
                        <div className="p-8 text-center relative">
                          <Star8 size={StarSizes.sm} className="absolute top-2 left-1/3 star-decoration" />
                          <div className="p-4 bg-chart-8 brutal-border brutal-shadow rounded-base inline-block mb-4">
                            <Clock className="w-6 h-6 animate-spin text-main-foreground icon-float" />
                          </div>
                          <p className="text-main-foreground font-black uppercase">
                            CARGANDO NOTIFICACIONES...
                          </p>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-8 text-center relative">
                          <Star9 size={StarSizes.sm} className="absolute top-4 left-8 star-decoration" />
                          <Star10 size={StarSizes.sm} className="absolute bottom-4 right-8 star-decoration" />

                          <div className="p-6 bg-chart-8 brutal-border-thick brutal-shadow-lg rounded-base inline-block mb-6 relative">
                            <Bell className="w-8 h-8 text-main-foreground icon-float" />
                            <Star13 size={StarSizes.xs} className="absolute -top-1 -right-1 star-decoration" />
                          </div>

                          <h3 className="text-lg font-black text-main-foreground uppercase mb-2">
                            <Crown className="inline-block w-5 h-5 mr-2 icon-float" />
                            NO TIENES NOTIFICACIONES
                          </h3>
                          <p className="text-sm font-bold text-main-foreground/80 uppercase">
                            LAS NOTIFICACIONES APARECERÁN AQUÍ AUTOMÁTICAMENTE
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y-4 divide-chart-4">
                          {notifications.slice(0, 5).map((notification, index) => (
                            <DropdownMenuItem
                              key={notification.id}
                              className={`p-4 cursor-pointer transition-all duration-200 relative overflow-hidden ${
                                !notification.read
                                  ? 'bg-chart-8/30 brutal-border-l-4 border-chart-1 hover:bg-chart-7'
                                  : 'hover:bg-chart-3 hover:brutal-shadow-lg'
                              }`}
                              onClick={() => {
                                if (!notification.read) {
                                  markAsRead(notification.id)
                                }
                              }}
                            >
                              <Star19 size={StarSizes.xs} className="absolute top-1 right-1 star-decoration" />

                              <div className="flex items-start gap-4 w-full relative z-10">
                                <div className="flex-shrink-0 mt-1 p-2 bg-chart-6 brutal-border rounded-base">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <p className="font-black text-sm text-main-foreground line-clamp-1 flex-1 uppercase">
                                      {notification.title?.toUpperCase()}
                                    </p>
                                    <Star20 size={StarSizes.xs} className="star-decoration" />
                                    {!notification.read && (
                                      <div className="w-3 h-3 bg-chart-1 brutal-border rounded-full pulse-animation" />
                                    )}
                                  </div>
                                  <p className="text-xs text-main-foreground/80 font-bold line-clamp-2 mb-2 uppercase">
                                    {notification.message?.toUpperCase()}
                                  </p>
                                  <div className="bg-chart-3 brutal-border px-2 py-1 rounded-base inline-block">
                                    <p className="text-xs text-main-foreground font-black uppercase">
                                      {formatTimeAgo(notification.created_at)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </DropdownMenuItem>
                          ))}
                          
                          {notifications.length > 5 && (
                            <DropdownMenuItem
                              className="p-4 text-center brutal-border-t-4 border-chart-4 cursor-pointer bg-chart-1 hover:bg-chart-8 transition-all duration-200 relative"
                              onClick={() => {
                                if (profile?.role === 'groomer' && businessProfile) {
                                  navigate(`/groomer/${businessProfile.slug}/dashboard`)
                                } else {
                                  navigate('/customer/dashboard')
                                }
                              }}
                            >
                              <Star21 size={StarSizes.xs} className="absolute top-1 left-1/3 star-decoration" />
                              <p className="text-main-foreground font-black uppercase flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4 icon-float" />
                                Y {notifications.length - 5} MÁS...
                                <Crown className="w-4 h-4 icon-float" />
                              </p>
                            </DropdownMenuItem>
                          )}
                        </div>
                      )}
                    </div>

                    <DropdownMenuSeparator className="brutal-border-thick border-chart-4" />

                    {/* Logout Only - Neobrutalism Style */}
                    <div className="p-4 bg-chart-3">
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="bg-chart-8 text-main-foreground brutal-border-thick brutal-shadow hover:brutal-hover font-black uppercase p-4 rounded-base cursor-pointer transform hover:scale-105 transition-all duration-200"
                      >
                        <LogOut className="mr-3 h-5 w-5 icon-float" />
                        <span>CERRAR SESIÓN</span>
                        <Star22 size={StarSizes.xs} className="inline-block ml-3 star-decoration" />
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

              </>
            ) : (
              // Public navigation
              <>
                <Button
                  variant="pet-yellow"
                  size="sm"
                  className="brutal-border brutal-shadow-sm rounded-base font-black hover:brutal-hover hover:bg-chart-5"
                  onClick={() => navigate('/')}
                >
                  INICIO
                </Button>
                <Button
                  variant="pet-green"
                  size="sm"
                  className="brutal-border brutal-shadow-sm rounded-base font-black hover:brutal-hover hover:bg-chart-1"
                  onClick={() => navigate('/marketplace')}
                >
                  MARKETPLACE
                </Button>
                <Button
                  variant="pet-purple"
                  size="sm"
                  className="brutal-border brutal-shadow-sm rounded-base font-black hover:brutal-hover hover:bg-chart-6"
                  onClick={() => navigate('/demo')}
                >
                  DEMO
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-main text-foreground brutal-border brutal-shadow-sm rounded-base font-black hover:brutal-hover hover:bg-chart-8"
                  onClick={() => navigate('/auth/login')}
                >
                  INICIAR SESIÓN
                </Button>
                <Button
                  variant="pet-blue"
                  size="sm"
                  className="brutal-border brutal-shadow-lg rounded-base font-black hover:brutal-hover hover:bg-chart-7"
                  onClick={() => navigate('/auth/register')}
                >
                  CREAR MI PÁGINA
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}