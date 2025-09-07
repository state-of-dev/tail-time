// Base Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'groomer' | 'admin' | 'customer';
  createdAt: Date;
  updatedAt: Date;
}

// Groomer & Business Types
export interface Groomer extends User {
  role: 'groomer';
  business: Business;
  isActive: boolean;
  onboardingComplete: boolean;
}

export interface Business {
  id: string;
  groomerId: string;
  name: string;
  subdomain: string;
  address: string;
  phone: string;
  email: string;
  description?: string;
  type: 'salon' | 'veterinary' | 'mobile';
  profileImage?: string;
  isActive: boolean;
  businessHours: BusinessHours[];
  settings: BusinessSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessHours {
  id: string;
  businessId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  isOpen: boolean;
  openTime: string; // "09:00"
  closeTime: string; // "18:00"
  breakStart?: string;
  breakEnd?: string;
}

export interface BusinessSettings {
  timeBetweenAppointments: number; // minutes
  maxAppointmentsPerDay: number;
  allowOnlinePayments: boolean;
  requirePaymentUpfront: boolean;
  cancellationPolicy: string;
  sendReminders: boolean;
  reminderHours: number;
}

// Service Types
export interface Service {
  id: string;
  businessId: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  category: 'bath' | 'grooming' | 'spa' | 'medical' | 'other';
  isActive: boolean;
  requiresPetInfo: boolean;
  requiresPhotos: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Customer & Pet Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  pets: Pet[];
  isFirstTime: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pet {
  id: string;
  customerId: string;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed?: string;
  age?: number;
  weight?: number;
  profilePhoto?: string;
  medicalInfo: PetMedicalInfo;
  preferences: PetPreferences;
  notes: PetNote[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PetMedicalInfo {
  allergies: string[];
  medications: string[];
  conditions: string[];
  veterinarian?: string;
  lastVetVisit?: Date;
  vaccinationsUpToDate: boolean;
}

export interface PetPreferences {
  groomingStyle?: string;
  sensitivities: string[];
  favoriteProducts: string[];
  behaviorNotes: string;
}

export interface PetNote {
  id: string;
  petId: string;
  groomerId: string;
  content: string;
  isPrivate: boolean;
  createdAt: Date;
}

// Appointment Types
export interface Appointment {
  id: string;
  businessId: string;
  customerId: string;
  petId: string;
  serviceId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  notes: string;
  specialRequests: string;
  payment: PaymentInfo;
  photos: AppointmentPhoto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentInfo {
  amount: number;
  status: 'pending' | 'paid' | 'refunded' | 'failed';
  method?: 'card' | 'cash' | 'paypal';
  paymentIntentId?: string;
  paidAt?: Date;
}

export interface AppointmentPhoto {
  id: string;
  appointmentId: string;
  url: string;
  type: 'before' | 'after' | 'during';
  caption?: string;
  uploadedAt: Date;
}

// Portfolio Types
export interface PortfolioItem {
  id: string;
  businessId: string;
  title?: string;
  description?: string;
  serviceId?: string;
  beforePhoto?: string;
  afterPhoto?: string;
  category: 'before_after' | 'showcase' | 'process';
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  recipientId: string;
  type: 'appointment_created' | 'appointment_confirmed' | 'appointment_rescheduled' | 'appointment_cancelled' | 'reminder';
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface BookingFormData {
  serviceId: string;
  date: string;
  time: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  petInfo: {
    name: string;
    type: Pet['type'];
    breed?: string;
    age?: number;
    weight?: number;
    medicalInfo: Partial<PetMedicalInfo>;
    preferences: Partial<PetPreferences>;
    profilePhoto?: File;
  };
  specialRequests?: string;
  isFirstTime: boolean;
}

export interface OnboardingData {
  business: Omit<Business, 'id' | 'groomerId' | 'createdAt' | 'updatedAt'>;
  services: Omit<Service, 'id' | 'businessId' | 'createdAt' | 'updatedAt'>[];
  portfolio: Omit<PortfolioItem, 'id' | 'businessId' | 'createdAt'>[];
}

// Utility Types
export type SubdomainInfo = {
  subdomain: string;
  isValid: boolean;
  business?: Business;
}

export type AppointmentAvailability = {
  date: string;
  timeSlots: {
    time: string;
    available: boolean;
    reason?: string;
  }[];
}