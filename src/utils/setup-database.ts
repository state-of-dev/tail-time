import { withAdminClient } from '@/lib/supabase'

export const createUserProfilesTable = async () => {
  try {
    // For now, we'll create a simple table without complex SQL
    const result = await withAdminClient(async (adminClient) => {
      // Try to create the table through direct table creation
      const { data, error } = await adminClient
        .from('user_profiles')
        .select('count')
        .limit(1)
      
      // If table doesn't exist, return instructions
      if (error && (error.code === 'PGRST116' || error.message.includes('does not exist'))) {
        return {
          error: null,
          message: 'Table creation needs to be done in Supabase SQL Editor',
          instructions: `
Go to Supabase Dashboard > SQL Editor and run:

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('groomer', 'customer', 'admin')) DEFAULT 'groomer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
          `
        }
      }
      
      return { data, error }
    })

    return result
  } catch (error) {
    return { error }
  }
}

export const testTableAccess = async () => {
  try {
    const result = await withAdminClient(async (adminClient) => {
      const { data, error } = await adminClient
        .from('user_profiles')
        .select('count')
        .limit(1)
      
      return { data, error }
    })

    return result
  } catch (error) {
    return { error }
  }
}