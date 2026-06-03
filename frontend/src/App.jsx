import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

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


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Onboarding />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes — must be logged in */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/record-sale" element={<RecordSale />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/transactions/:id" element={<TransactionDetail />} />
            <Route path="/customers/new" element={<AddCustomer />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}