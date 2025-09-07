import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tpevasxrlkekdocosxgb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwZXZhc3hybGtla2RvY29zeGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MzM4ODEsImV4cCI6MjA3MjEwOTg4MX0.RXGoQqEjcIYfbYrDpE329SLpl6n1Re220dbuyE-Spyo'

const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey)

async function testRLSWithAnon() {
  try {
    const { data: anonData, error: anonError } = await supabaseAnon
      .from('user_profiles')
      .select('*')
      .eq('id', 'a1fb9041-872b-49ae-9c08-5280cd237a4d')
      .single()
    
    if (anonError) {
      console.error('❌ ANON query error:', anonError)
    }

    // Authenticate as the user
    const { data: authData, error: authError } = await supabaseAnon.auth.signInWithPassword({
      email: 'groomer1@demo.com',
      password: 'demo123'
    })
    
    if (authError) {
      console.error('❌ Auth error:', authError)
      return
    }
    
    // Try the same query after auth
    const { data: authedData, error: authedError } = await supabaseAnon
      .from('user_profiles')
      .select('*')
      .eq('id', 'a1fb9041-872b-49ae-9c08-5280cd237a4d')
      .single()
    
    if (authedError) {
      console.error('❌ Authenticated query error:', authedError)
    }

  } catch (error) {
    console.error('💥 Script error:', error)
  }
}

testRLSWithAnon()