import { Routes, Route } from "react-router-dom";
import DashboardRoutes from "@/features/dashboard/dashboardRoute";

import Homepage from "@/pages/homepage/Homepage";
import NotFound from "@/pages/NotFound";
import Checkout from "@/pages/checkout/Checkout";
import VerifyEmail from "@/auth/component/VerifyEmail";
import Login from "@/auth/component/Login";
import Register from "@/auth/component/Register";
import { CheckoutProvider } from "@/pages/checkout/context/CheckoutContext";
import { AuthProvider } from "@/auth/api/AuthProvider";

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/checkout"
          element={
            <CheckoutProvider>
              <Checkout />
            </CheckoutProvider>
          }
        />
        <Route
          path="/checkout-register"
          element={
            <CheckoutProvider>
              <Checkout />
            </CheckoutProvider>
          }
        />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/dashboard/*" element={<DashboardRoutes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
