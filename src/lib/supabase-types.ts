// Simple types for Supabase to fix build issues
export type BusinessProfile = {
  id: string
  owner_id: string
  business_name: string
  slug: string
  description: string | null
  phone: string | null
  email: string | null
  address: string | null
  city: string | null
  country: string
  logo_url: string | null
  cover_image_url: string | null
  website_url: string | null
  social_links: any
  business_hours: any
  services: any
  portfolio?: any
  subscription_status: 'trial' | 'active' | 'inactive' | 'cancelled'
  trial_ends_at: string | null
  is_active: boolean
  setup_completed: boolean
  created_at: string
  updated_at: string
}

export type UserProfile = {
  id: string
  full_name: string | null
  phone: string | null
  role: 'customer' | 'groomer' | 'admin'
  avatar_url: string | null
  preferences: any
  created_at: string
  updated_at: string
}

export type Appointment = {
  id: string
  business_id: string
  customer_id: string | null
  service_id: string | null
  service_name: string | null
  service_duration: number | null
  service_price: number | null
  appointment_date: string
  appointment_time: string
  duration?: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  total_amount: number | null
  notes: string | null
  customer_name: string | null
  customer_phone: string | null
  customer_email: string | null
  client_name: string | null
  client_email: string | null
  client_phone: string | null
  pet_name: string | null
  pet_breed: string | null
  pet_age: string | null
  pet_weight: string | null
  pet_size: 'pequeño' | 'mediano' | 'grande' | 'extra_grande' | null
  pet_special_notes: string | null
  special_instructions: string | null
  additional_notes: string | null
  before_images: string[] | null
  after_images: string[] | null
  created_at: string
  updated_at: string
}