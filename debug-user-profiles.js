import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tpevasxrlkekdocosxgb.supabase.co'
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwZXZhc3hybGtla2RvY29zeGdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjUzMzg4MSwiZXhwIjoyMDcyMTA5ODgxfQ.ZL1uFwMamI0X8AOn6hlzD5iANGIkicLv0YoNx7gz0QA'

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function testUserProfiles() {
  try {
    const { data: allProfiles, error: allError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(5)
    
    if (allError) {
      console.error('❌ Basic SELECT error:', allError)
    }

    const userId = 'a1fb9041-872b-49ae-9c08-5280cd237a4d'
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (userError) {
      console.error('❌ User query error:', userError)
    }

    const { data: rls, error: rlsError } = await supabase
      .rpc('pg_policies')
      .eq('tablename', 'user_profiles')
    
    if (rlsError) {
      console.error('❌ RLS query error:', rlsError)
    }

    const { data: tableInfo, error: infoError } = await supabase
      .from('information_schema.tables')
      .select('*')
      .eq('table_name', 'user_profiles')
      .single()
    
    if (infoError) {
      console.error('❌ Table info error:', infoError)
    }

  } catch (error) {
    console.error('💥 Script error:', error)
  }
}

testUserProfiles()