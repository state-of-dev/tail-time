import { useState, useEffect } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Palette, Zap } from 'lucide-react'

type Theme = 'colorful' | 'light' | 'dark'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('colorful')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement

    // Remove all theme classes
    root.classList.remove('light', 'dark', 'colorful')

    // Apply new theme
    if (newTheme === 'light') {
      root.classList.add('light')
    } else if (newTheme === 'dark') {
      root.classList.add('dark')
    }
    // colorful is the default (no class needed)

    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'colorful' ? 'light' : theme === 'light' ? 'dark' : 'colorful'
    setTheme(nextTheme)
    applyTheme(nextTheme)
  }

  const getThemeInfo = () => {
    switch (theme) {
      case 'colorful':
        return {
          label: 'Colorido',
          description: 'Colores vibrantes para mascotas',
          icon: Palette,
          color: 'bg-pet-pink'
        }
      case 'light':
        return {
          label: 'Minimalista',
          description: 'Blanco y negro limpio',
          icon: Zap,
          color: 'bg-main border-2 border-border'
        }
      case 'dark':
        return {
          label: 'Oscuro',
          description: 'Colores vibrantes en fondo oscuro',
          icon: Palette,
          color: 'bg-pet-blue'
        }
    }
  }

  const themeInfo = getThemeInfo()
  const Icon = themeInfo.icon

  return (
    <div className="flex items-center gap-4 p-4 bg-main border-2 border-border rounded-base shadow-shadow">
      <div
        className={`p-2 rounded-base border-2 border-border ${themeInfo.color} transition-all duration-300`}
      >
        <Icon className="h-4 w-4 text-main-foreground" />
      </div>

      <div className="flex-1">
        <Label htmlFor="theme-toggle" className="text-sm font-heading font-semibold">
          {themeInfo.label}
        </Label>
        <p className="text-xs text-foreground/70 mt-1">
          {themeInfo.description}
        </p>
      </div>

      <button
        onClick={toggleTheme}
        className="
          px-3 py-1
          bg-secondary-background
          border-2 border-border
          rounded-base
          text-xs font-base
          hover:translate-x-1 hover:translate-y-1
          hover:shadow-none
          shadow-shadow-sm
          transition-all duration-150
          text-foreground
        "
      >
        Cambiar
      </button>
    </div>
  )
}

// Hook para usar el tema en otros componentes
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('colorful')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }

    // Listen for theme changes
    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem('theme') as Theme
      setTheme(currentTheme || 'colorful')
    }

    window.addEventListener('storage', handleThemeChange)
    return () => window.removeEventListener('storage', handleThemeChange)
  }, [])

  return theme
}