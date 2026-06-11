import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

import Onboarding from "./pages/Onboarding";
import UserProfile from "./pages/UserProfile";
import Notifications from "./pages/Notifications";
import ProductDetail from "./pages/ProductDetail";
import TransactionDetail from "./pages/TransactionDetail";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import RecordSale from "./pages/RecordSale";
import Transactions from "./pages/Transactions";
import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";
import AddCustomer from "./pages/AddCustomer";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Onboarding />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected routes — must be logged in */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout><Outlet /></AppLayout>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/record-sale" element={<RecordSale />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/transactions/:id" element={<TransactionDetail />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/customers/new" element={<AddCustomer />} />
                <Route path="/customers/:id" element={<CustomerDetail />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/user-profile" element={<UserProfile />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}