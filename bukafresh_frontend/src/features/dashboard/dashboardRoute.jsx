import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./component/DashboardLayout";
import ProtectedRoute from "@/auth/component/ProtectedRoute";
import Overview from "./component/Overview";
import DashboardPayment from "@/features/payment/component/DashboardPayment";
import DashboardSubscription from "../subscription/DashboardSubscription";

export default function DashboardRoutes() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Routes>
          <Route index element={<Overview />} />
          <Route
            path="subscription"
            element={<DashboardSubscription />}
          />
          <Route path="deliveries" element={<div>Deliveries</div>} />
          <Route path="orders" element={<div>Order History</div>} />
          <Route path="shop" element={<div>Shop Add-ons</div>} />
          <Route path="payment" element={<DashboardPayment />} />
          <Route path="settings" element={<div>Settings</div>} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
