import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AdminRestrictedPage from "@/pages/admin/AdminRestrictedPage";

/** Server-side admin APIs are authoritative; this gate only controls UI visibility. */
export default function AdminGate() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-accent-400" />
      </div>
    );
  }

  if (!user || !isAdmin) return <AdminRestrictedPage />;

  if (user.mustChangePassword) {
    return <Navigate to="/settings" replace state={{ forcePassword: true }} />;
  }

  return <Outlet />;
}
