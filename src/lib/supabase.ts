import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing Supabase Anon Key')
}

// Cliente principal para uso en frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'sb-auth-token', // Use explicit storage key
    storage: window.localStorage // Use localStorage explicitly
  }
})

// Helper para operaciones admin (crea cliente temporal cuando se necesite)
export const withAdminClient = async <T>(operation: (client: any) => Promise<T>): Promise<T> => {
  if (!supabaseServiceRoleKey) {
    throw new Error('Service role key not configured for admin operations')
  }

  // Crear cliente temporal solo para esta operación con configuración que minimiza conflictos
  const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
      storageKey: 'admin-client-temp', // Use different storage key to avoid conflicts
      flowType: 'implicit'
    },
    global: {
      fetch: fetch // Use native fetch to avoid conflicts
    }
  })

  try {
    return await operation(adminClient)
  } finally {
    // El cliente se destruye automáticamente al salir del scope
  }
}

// Para tests básicos, seguimos usando el cliente normal
export const supabaseAdmin = null // Deprecado, usar withAdminClient

// Helper para verificar conexión
export const testConnection = async () => {
  try {
    // Test basic connectivity with auth session check - this always works if Supabase is accessible
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      throw error
    }
    
    // If we get here, connection is working (session can be null, that's normal)
    return { 
      success: true, 
      message: 'Conexión exitosa a Supabase',
      hasSession: !!session,
      connectionTest: 'Auth endpoint accessible'
    }
  } catch (error: any) {
    return { 
      success: false, 
      message: `Error de conexión: ${error?.message || 'Error desconocido'}`,
      details: error
    }
  }
}