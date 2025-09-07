// Tipos generados desde el schema de database-schema-mvp.sql
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          role: 'customer' | 'groomer' | 'admin'
          avatar_url: string | null
          preferences: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'groomer' | 'admin'
          avatar_url?: string | null
          preferences?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'groomer' | 'admin'
          avatar_url?: string | null
          preferences?: any
          created_at?: string
          updated_at?: string
        }
      }
      business_profiles: {
        Row: {
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
          subscription_status: 'trial' | 'active' | 'inactive' | 'cancelled'
          trial_ends_at: string | null
          is_active: boolean
          setup_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          business_name: string
          slug: string
          description?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          city?: string | null
          country?: string
          logo_url?: string | null
          cover_image_url?: string | null
          website_url?: string | null
          social_links?: any
          business_hours?: any
          services?: any
          subscription_status?: 'trial' | 'active' | 'inactive' | 'cancelled'
          trial_ends_at?: string | null
          is_active?: boolean
          setup_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          business_name?: string
          slug?: string
          description?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          city?: string | null
          country?: string
          logo_url?: string | null
          cover_image_url?: string | null
          website_url?: string | null
          social_links?: any
          business_hours?: any
          services?: any
          subscription_status?: 'trial' | 'active' | 'inactive' | 'cancelled'
          trial_ends_at?: string | null
          is_active?: boolean
          setup_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          business_id: string
          name: string
          description: string | null
          duration: number
          price: number
          category: string
          is_active: boolean
          display_order: number
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          description?: string | null
          duration: number
          price: number
          category: string
          is_active?: boolean
          display_order?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          description?: string | null
          duration?: number
          price?: number
          category?: string
          is_active?: boolean
          display_order?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          business_id: string
          customer_id: string | null
          service_id: string | null
          service_name: string | null
          service_duration: number | null
          service_price: number | null
          appointment_date: string
          appointment_time: string
          duration: number
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
        Insert: {
          id?: string
          business_id: string
          customer_id?: string | null
          service_id?: string | null
          service_name?: string | null
          service_duration?: number | null
          service_price?: number | null
          appointment_date: string
          appointment_time: string
          duration?: number
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          total_amount?: number | null
          notes?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          customer_email?: string | null
          client_name?: string | null
          client_email?: string | null
          client_phone?: string | null
          pet_name?: string | null
          pet_breed?: string | null
          pet_age?: string | null
          pet_weight?: string | null
          pet_size?: 'pequeño' | 'mediano' | 'grande' | 'extra_grande' | null
          pet_special_notes?: string | null
          special_instructions?: string | null
          additional_notes?: string | null
          before_images?: string[] | null
          after_images?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          customer_id?: string | null
          service_id?: string | null
          service_name?: string | null
          service_duration?: number | null
          service_price?: number | null
          appointment_date?: string
          appointment_time?: string
          duration?: number
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          total_amount?: number | null
          notes?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          customer_email?: string | null
          client_name?: string | null
          client_email?: string | null
          client_phone?: string | null
          pet_name?: string | null
          pet_breed?: string | null
          pet_age?: string | null
          pet_weight?: string | null
          pet_size?: 'pequeño' | 'mediano' | 'grande' | 'extra_grande' | null
          pet_special_notes?: string | null
          special_instructions?: string | null
          additional_notes?: string | null
          before_images?: string[] | null
          after_images?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          business_id: string
          appointment_id: string
          customer_id: string | null
          rating: number
          comment: string | null
          images: string[] | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          appointment_id: string
          customer_id?: string | null
          rating: number
          comment?: string | null
          images?: string[] | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          appointment_id?: string
          customer_id?: string | null
          rating?: number
          comment?: string | null
          images?: string[] | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      portfolio_images: {
        Row: {
          id: string
          business_id: string
          appointment_id: string | null
          service_id: string | null
          title: string | null
          description: string | null
          before_image_url: string | null
          after_image_url: string | null
          is_featured: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          appointment_id?: string | null
          service_id?: string | null
          title?: string | null
          description?: string | null
          before_image_url?: string | null
          after_image_url?: string | null
          is_featured?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          appointment_id?: string | null
          service_id?: string | null
          title?: string | null
          description?: string | null
          before_image_url?: string | null
          after_image_url?: string | null
          is_featured?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'appointment' | 'reminder' | 'promotion' | 'system'
          is_read: boolean
          data: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'appointment' | 'reminder' | 'promotion' | 'system'
          is_read?: boolean
          data?: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'appointment' | 'reminder' | 'promotion' | 'system'
          is_read?: boolean
          data?: any
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}