import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth-context-simple';
import NotificationProvider from '@/components/notifications/notification-provider';
// import { Toaster } from 'sonner';
import HomePage from '@/pages/HomePage';
import { DashboardPage } from '@/pages/admin/dashboard-page';
import { SubdomainHome } from '@/pages/subdomain/subdomain-home';
import DemoSaas from '@/pages/demo/demo-saas';
import LoginFinal from '@/pages/auth/login-final';
import RegisterPage from '@/pages/auth/register';
import BusinessSetupPage from '@/pages/setup/business-setup';
import BusinessHours from '@/pages/setup/business-hours';
import ServicesSetup from '@/pages/setup/services-setup';
import PortfolioSetup from '@/pages/setup/portfolio-setup';
import LaunchConfirmation from '@/pages/setup/launch-confirmation';
import DatabaseSetupPage from '@/pages/admin/database-setup';
import GroomerDashboard from '@/pages/groomer/dashboard-neobrutalism';
import ServicesManagement from '@/pages/groomer/services-management';
import CalendarView from '@/pages/groomer/calendar-view';
import AppointmentDetail from '@/pages/groomer/appointment-detail';
import AppointmentsManagement from '@/pages/groomer/appointments-management';
import BusinessSimple from '@/pages/business/business-simple';
import ServicesCatalog from '@/pages/business/services-catalog';
import BookService from '@/pages/business/book-service';
import BookDatetime from '@/pages/business/book-datetime';
import BookPetInfo from '@/pages/business/book-pet-info';
import BookConfirmation from '@/pages/business/book-confirmation';
import CustomerDashboardSimple from '@/pages/customer/dashboard-simple';
import CustomerAppointmentDetail from '@/pages/customer/appointment-detail';
import AllAppointments from '@/pages/customer/all-appointments';
import CustomerProfile from '@/pages/customer/profile';
import CustomerPets from '@/pages/customer/pets';
import CustomerSettings from '@/pages/customer/settings';
import PetRegistration from '@/pages/onboarding/pet-registration';
import BusinessHoursSetup from '@/pages/setup/business-hours-setup';
import MarketplacePage from '@/pages/marketplace/marketplace-page';

function App() {
  // In a real implementation, this would check the hostname/subdomain
  // For development, we'll use URL paths to simulate different environments
  const currentPath = window.location.pathname;
  const isSubdomain = currentPath.startsWith('/subdomain');
  const isAdmin = currentPath.startsWith('/admin');
  
  if (isSubdomain) {
    // Subdomain routing - this would be the business pages
    return (
      <Router>
        <Routes>
          <Route path="/subdomain/:businessSlug" element={<SubdomainHome />} />
          <Route path="/subdomain/:businessSlug/services" element={<div>Services Page</div>} />
          <Route path="/subdomain/:businessSlug/book" element={<div>Booking Page</div>} />
          <Route path="/subdomain/:businessSlug/portfolio" element={<div>Portfolio Page</div>} />
          <Route path="*" element={<SubdomainHome />} />
        </Routes>
      </Router>
    );
  }
  
  if (isAdmin) {
    // Admin panel routing
    return (
      <Router>
        <Routes>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/database-setup" element={<DatabaseSetupPage />} />
          <Route path="/admin/calendar" element={<div>Calendar Page</div>} />
          <Route path="/admin/services" element={<div>Services Page</div>} />
          <Route path="/admin/clients" element={<div>Clients Page</div>} />
          <Route path="/admin/portfolio" element={<div>Portfolio Management</div>} />
          <Route path="/admin/settings" element={<div>Settings Page</div>} />
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </Router>
    );
  }
  
  // Main platform routing
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/demo" element={<DemoSaas />} />
        <Route path="/auth/login" element={<LoginFinal />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/onboarding/pet" element={<PetRegistration />} />
        <Route path="/setup/business" element={<BusinessSetupPage />} />
        <Route path="/setup/business-hours" element={<BusinessHours />} />
        <Route path="/setup/services" element={<ServicesSetup />} />
        <Route path="/setup/hours" element={<BusinessHoursSetup />} />
        <Route path="/setup/portfolio" element={<PortfolioSetup />} />
        <Route path="/setup/launch-confirmation" element={<LaunchConfirmation />} />
        <Route path="/groomer/:businessSlug/dashboard" element={<GroomerDashboard />} />
        <Route path="/groomer/:businessSlug/services" element={<ServicesManagement />} />
        <Route path="/groomer/:businessSlug/appointments" element={<AppointmentsManagement />} />
        <Route path="/groomer/:businessSlug/calendar" element={<CalendarView />} />
        <Route path="/groomer/:businessSlug/appointments/:appointmentId" element={<AppointmentDetail />} />
        <Route path="/business/:businessSlug" element={<BusinessSimple />} />
        <Route path="/business/:businessSlug/services" element={<ServicesCatalog />} />
        <Route path="/business/:businessSlug/book" element={<BookService />} />
        <Route path="/business/:businessSlug/book/datetime" element={<BookDatetime />} />
        <Route path="/business/:businessSlug/book/pet-info" element={<BookPetInfo />} />
        <Route path="/business/:businessSlug/book/confirmation" element={<BookConfirmation />} />
        <Route path="/customer/dashboard" element={<CustomerDashboardSimple />} />
        <Route path="/customer/appointments" element={<AllAppointments />} />
        <Route path="/customer/appointment/:appointmentId" element={<CustomerAppointmentDetail />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
        <Route path="/customer/pets" element={<CustomerPets />} />
        <Route path="/customer/settings" element={<CustomerSettings />} />
        <Route path="/database-setup" element={<DatabaseSetupPage />} />
        {/* Fallback routes for development */}
        <Route path="/admin/*" element={<DashboardPage />} />
        <Route path="/subdomain/*" element={<SubdomainHome />} />
        <Route path="*" element={<HomePage />} />
        </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
