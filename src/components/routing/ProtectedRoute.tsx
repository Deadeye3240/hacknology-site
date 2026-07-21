import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { paths } from "@/routes/paths";
import type { Role } from "@/types/auth";

const ROLE_RANK: Record<Role, number> = { user: 1, moderator: 2, admin: 3 };

function RouteSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-accent-400" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

interface ProtectedRouteProps {
  children: ReactNode;
  /** Minimum role required to view the route (defaults to any authenticated user). */
  minRole?: Role;
}

/**
 * Client-side gate that redirects unauthenticated users to login and enforces a
 * minimum role for display. NOTE: this only controls what UI is shown — every
 * privileged action is independently authorized on the server.
 */
export function ProtectedRoute({ children, minRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <RouteSpinner />;

  if (!user) {
    return (
      <Navigate to={paths.login} replace state={{ from: location.pathname }} />
    );
  }

  // Force a password change before allowing access to anything but settings.
  if (user.mustChangePassword && location.pathname !== paths.settings) {
    return <Navigate to={paths.settings} replace state={{ forcePassword: true }} />;
  }

  if (minRole && ROLE_RANK[user.role] < ROLE_RANK[minRole]) {
    return <Navigate to={paths.dashboard} replace />;
  }

  return <>{children}</>;
}
