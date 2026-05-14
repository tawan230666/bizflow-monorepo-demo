import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { AdminQRPage } from "@/pages/AdminQRPage";
import { TableEntry } from "@/pages/TableEntry";
import { MenuPage } from "@/pages/MenuPage";
import { MenuDetail } from "@/pages/MenuDetail";
import { CartPage } from "@/pages/CartPage";
import { OrderStatus } from "@/pages/OrderStatus";
import { OrderHistoryPage } from "@/pages/OrderHistoryPage";
import { PaymentPage } from "@/pages/PaymentPage";
import { ToastContainer } from "@/components/common/Toast";

const AppShell = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div
      className={
        isAdmin
          ? "min-h-screen bg-stone-50"
          : "max-w-md mx-auto bg-stone-50 min-h-screen"
      }
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/qr-codes" element={<AdminQRPage />} />

        <Route path="/table/:tableId" element={<TableEntry />} />
        <Route path="/table/:tableId/menu" element={<MenuPage />} />
        <Route path="/table/:tableId/menu/:itemId" element={<MenuDetail />} />
        <Route path="/table/:tableId/cart" element={<CartPage />} />
        <Route path="/table/:tableId/orders" element={<OrderHistoryPage />} />
        <Route path="/table/:tableId/order/:orderId" element={<OrderStatus />} />
        <Route path="/table/:tableId/payment/:orderId" element={<PaymentPage />} />
      </Routes>
      <ToastContainer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
