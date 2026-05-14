import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import type { AdminRole } from "@/types";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  roles?: AdminRole[];
}

export const ProtectedRoute = ({ children, roles }: Props) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect to role-appropriate page
    const fallback =
      user.role === "kitchen"
        ? "/kitchen"
        : user.role === "cashier"
          ? "/cashier"
          : "/dashboard";
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};
