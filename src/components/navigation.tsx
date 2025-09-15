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
import { PawPrint, User, Settings, LogOut, Home, UserCircle, Bell, CheckCircle, XCircle, Clock, CreditCard, PartyPopper, Mail } from 'lucide-react'

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
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'appointment_cancelled': 
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'appointment_reminder': 
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'payment_received': 
        return <CreditCard className="w-4 h-4 text-blue-600" />
      case 'appointment_completed': 
        return <PartyPopper className="w-4 h-4 text-purple-600" />
      default: 
        return <Mail className="w-4 h-4 text-gray-600" />
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
                  className="brutal-border brutal-shadow-sm rounded-base font-black hover:brutal-hover"
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
                  className="brutal-border brutal-shadow-sm rounded-base font-black hover:brutal-hover"
                  onClick={() => navigate('/marketplace')}
                >
                  MARKETPLACE
                </Button>
                
                {/* Groomer navigation simplified - only Dashboard and Marketplace */}
                
                {/* Notification Bell - Available for all users */}
                {/* <NotificationBellSimple /> */}
                
                {/* Notification Center - User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative flex items-center gap-2 bg-chart-3 text-main-foreground brutal-border brutal-shadow-sm rounded-base font-black hover:brutal-hover">
                      <UserCircle className={`w-5 h-5 ${unreadCount > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                      {!loading && (
                        <span className="hidden md:inline">
                          {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'}
                        </span>
                      )}
                      {unreadCount > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80 bg-white border border-gray-200 shadow-lg" align="end" forceMount>
                    {/* Header with user info and actions */}
                    <DropdownMenuLabel className="font-normal p-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={markAllAsRead}
                              className="text-xs h-6 px-2"
                            >
                              Marcar todas
                            </Button>
                          )}
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    {/* Notifications Section */}
                    <div className="max-h-80 overflow-y-auto">
                      {notificationsLoading ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                          Cargando notificaciones...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                          No tienes notificaciones
                        </div>
                      ) : (
                        <>
                          {notifications.slice(0, 5).map((notification) => (
                            <DropdownMenuItem
                              key={notification.id}
                              className="p-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                              onClick={() => {
                                if (!notification.read) {
                                  markAsRead(notification.id)
                                }
                              }}
                            >
                              <div className="flex items-start gap-3 w-full">
                                <div className="flex-shrink-0 mt-1">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium text-sm truncate flex-1">
                                      {notification.title}
                                    </p>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatTimeAgo(notification.created_at)}
                                  </p>
                                </div>
                              </div>
                            </DropdownMenuItem>
                          ))}
                          
                          {notifications.length > 5 && (
                            <DropdownMenuItem 
                              className="p-3 text-center text-sm text-primary border-t border-gray-100 cursor-pointer hover:bg-gray-50"
                              onClick={() => {
                                if (profile?.role === 'groomer' && businessProfile) {
                                  navigate(`/groomer/${businessProfile.slug}/dashboard`)
                                } else {
                                  navigate('/customer/dashboard')
                                }
                              }}
                            >
                              Y {notifications.length - 5} más...
                            </DropdownMenuItem>
                          )}
                        </>
                      )}
                    </div>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Logout Only */}
                    <div className="p-2">
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar Sesión</span>
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
                  className="brutal-border brutal-shadow-sm rounded-base font-black hover:brutal-hover"
                  onClick={() => navigate('/')}
                >
                  INICIO
                </Button>
                <Button
                  variant="pet-green"
                  size="sm"
                  className="brutal-border brutal-shadow-sm rounded-base font-black hover:brutal-hover"
                  onClick={() => navigate('/marketplace')}
                >
                  MARKETPLACE
                </Button>
                <Button
                  variant="pet-purple"
                  size="sm"
                  className="brutal-border brutal-shadow-sm rounded-base font-black hover:brutal-hover"
                  onClick={() => navigate('/demo')}
                >
                  DEMO
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-main text-foreground brutal-border brutal-shadow-sm rounded-base font-black hover:brutal-hover"
                  onClick={() => navigate('/auth/login')}
                >
                  INICIAR SESIÓN
                </Button>
                <Button
                  variant="pet-blue"
                  size="sm"
                  className="brutal-border brutal-shadow-lg rounded-base font-black hover:brutal-hover"
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