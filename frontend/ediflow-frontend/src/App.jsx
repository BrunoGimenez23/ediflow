import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";

// Layouts
import Layout from "./layout/Layout";
import PublicLayout from "./layout/PublicLayout";

// Auth
import { useAuth } from "./contexts/AuthContext";
import RegisterSelector from "./pages/auth/RegisterSelector";
import Register from "./pages/auth/Register";
import RegisterProviderForm from "./components/auth/RegisterProviderForm";
import Login from "./pages/auth/Login";

// Public
import Home from "./pages/home/Home";
import PrivacyPolicy from "./pages/public/PrivacyPolicy";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import Buildings from "./pages/admin/Buildings";
import Residents from "./pages/admin/Residents";
import Apartments from "./pages/admin/Apartments";
import Payments from "./pages/admin/Payments";
import CommonAreasPage from "./pages/admin/CommonAreasPage";
import AdminReservationsPanel from "./components/admin/AdminReservationsPanel";
import UserManagement from "./components/admin/UserManagement";
import AssignPlanPage from "./pages/admin/AssignPlanPage";
import PricingPlans from "./components/landing/PricingPlans";
import UpgradePlansContainer from "./components/common/UpgradePlansContainer";
import PlanConfirmationPage from "./pages/admin/PlanConfirmationPage";
import MyLogEntries from "./components/porteria/MyLogEntries";
import LogHistory from "./components/porteria/LogHistory";
import PaymentReport from "./pages/admin/PaymentReport";
import TicketDashboard from "./components/resident/TicketDashboard";

// Resident
import ResidentDashboard from "./pages/resident/ResidentDashboard";
import MyPayments from "./pages/resident/MyPayments";
import MyReservations from "./pages/resident/MyReservations";

// Porter
import PorterDashboard from "./pages/porter/PorterDashboard";

// Marketplace
import MarketplaceLayout from "./pages/marketplace/MarketplaceLayout";
import ProvidersPage from "./pages/marketplace/ProvidersPage";
import OrdersPage from "./pages/marketplace/OrdersPage";
import QuotesPage from "./pages/marketplace/QuotesPage";

// Provider
import MarketplaceDashboard from "./pages/marketplace/MarketplaceDashboard";
import ProviderDashboard from "./pages/marketplace/ProviderDashboard";

function App() {
  const { user } = useAuth();
  
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      {/* Auth routes */}
      <Route element={<PublicLayout />}>
        <Route path="/auth/register" element={<RegisterSelector />} />
        <Route path="/auth/register-admin" element={<Register />} />
        <Route path="/auth/register-provider" element={<RegisterProviderForm />} />
        <Route path="/auth/login" element={<Login />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<Layout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="buildings" element={<Buildings />} />
        <Route path="residents" element={<Residents />} />
        <Route path="apartment" element={<Apartments />} />
        <Route path="payment/all" element={<Payments />} />
        <Route path="reservas" element={<AdminReservationsPanel />} />
        <Route path="payment/report" element={<PaymentReport />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="assign-plan" element={<AssignPlanPage />} />
        <Route path="planes" element={<PricingPlans />} />
        <Route path="avisos" element={<TicketDashboard />} />
        <Route path="upgrade-plan" element={<UpgradePlansContainer />} />
        <Route path="common-areas/all" element={<CommonAreasPage />} />
        <Route path="historial" element={<LogHistory userRole="ADMIN" />} />
        <Route path="plan-confirmation/:planName" element={<PlanConfirmationPage />} />

        {/* Marketplace sub-routes */}
        <Route path="marketplace" element={<MarketplaceLayout />}>
          <Route index element={<ProvidersPage />} /> {/* default */}
          <Route path="providers" element={<ProvidersPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="quotes" element={<QuotesPage />} />
        </Route>

      </Route>

      {/* Resident routes */}
      <Route path="/resident" element={<ResidentDashboard />} />
      <Route path="/mis-pagos" element={<MyPayments />} />
      <Route path="/mis-reservas" element={<MyReservations />} />
      <Route path="/mis-registros" element={<MyLogEntries residentId={user?.residentId} />} />
      <Route path="/mis-tickets" element={<TicketDashboard />} />

      {/* Porter routes */}
      <Route path="/porter/*" element={user?.role === "PORTER" ? <PorterDashboard /> : <Navigate to="/" />} />

      {/* Provider dashboard */}
      <Route path="/provider" element={user?.role === "PROVIDER" ? <ProviderDashboard /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;
