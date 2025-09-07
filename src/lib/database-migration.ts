import { supabase } from './supabase'

export const addMissingColumns = async () => {
  try {
    // Test if business_hours column exists
    const { error: testError } = await supabase
      .from('business_profiles')
      .select('business_hours')
      .limit(1)

    if (testError && testError.message.includes('column "business_hours" does not exist')) {
      // Column doesn't exist, we need to show migration instructions
      return {
        success: false,
        needsMigration: true,
        message: 'Database schema needs to be updated',
        sql: `
-- Copy and paste this SQL in your Supabase SQL Editor:
ALTER TABLE business_profiles 
ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS portfolio JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS setup_completed BOOLEAN DEFAULT false;

UPDATE business_profiles 
SET business_hours = '{
  "monday": {"isOpen": true, "openTime": "09:00", "closeTime": "17:00"},
  "tuesday": {"isOpen": true, "openTime": "09:00", "closeTime": "17:00"},
  "wednesday": {"isOpen": true, "openTime": "09:00", "closeTime": "17:00"},
  "thursday": {"isOpen": true, "openTime": "09:00", "closeTime": "17:00"},
  "friday": {"isOpen": true, "openTime": "09:00", "closeTime": "17:00"},
  "saturday": {"isOpen": true, "openTime": "09:00", "closeTime": "14:00"},
  "sunday": {"isOpen": false, "openTime": "09:00", "closeTime": "17:00"}
}'
WHERE business_hours = '{}' OR business_hours IS NULL;

-- Create storage bucket for portfolio images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true) ON CONFLICT DO NOTHING;

-- Allow authenticated users to upload images to their business folder
CREATE POLICY "Authenticated users can upload portfolio images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view portfolio images" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio');

CREATE POLICY "Users can update their own portfolio images" ON storage.objects
FOR UPDATE USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own portfolio images" ON storage.objects
FOR DELETE USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');
        `
      }
    }

    return {
      success: true,
      needsMigration: false,
      message: 'Database schema is up to date'
    }

  } catch (error: any) {
    return {
      success: false,
      needsMigration: false,
      message: error.message,
      error
    }
  }
}