import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { KitchenPage } from "@/pages/KitchenPage";
import { CashierPage } from "@/pages/CashierPage";
import { MenuManagementPage } from "@/pages/MenuManagementPage";
import { ToastContainer } from "@/components/common/Toast";

const RootRedirect = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const target =
    user.role === "kitchen"
      ? "/kitchen"
      : user.role === "cashier"
        ? "/cashier"
        : "/dashboard";
  return <Navigate to={target} replace />;
};

function App() {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kitchen"
            element={
              <ProtectedRoute roles={["admin", "kitchen"]}>
                <KitchenPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cashier"
            element={
              <ProtectedRoute roles={["admin", "cashier"]}>
                <CashierPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu"
            element={
              <ProtectedRoute roles={["admin"]}>
                <MenuManagementPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback - redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
