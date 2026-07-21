import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { paths } from "@/routes/paths";

// Lazy-load routed pages so each route is code-split — keeps the initial
// bundle lean and gives future feature pages room to grow.
const HomePage = lazy(() => import("@/pages/HomePage"));
const LessonsPage = lazy(() => import("@/pages/LessonsPage"));
const LabsPage = lazy(() => import("@/pages/LabsPage"));
const LabDetailPage = lazy(() => import("@/pages/LabDetailPage"));
const ToolsPage = lazy(() => import("@/pages/ToolsPage"));
const ScanPage = lazy(() => import("@/pages/ScanPage"));
const ResourcesPage = lazy(() => import("@/pages/ResourcesPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

// Auth, account, forum, and admin pages.
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const SetupPage = lazy(() => import("@/pages/SetupPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const ForumPage = lazy(() => import("@/pages/ForumPage"));
const ForumNewPage = lazy(() => import("@/pages/ForumNewPage"));
const DiscussionPage = lazy(() => import("@/pages/DiscussionPage"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-accent-400" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path={paths.home} element={<HomePage />} />
          <Route path={paths.lessons} element={<LessonsPage />} />
          <Route path={paths.labs} element={<LabsPage />} />
          <Route path={`${paths.labs}/:labId`} element={<LabDetailPage />} />
          <Route path={paths.tools} element={<ToolsPage />} />
          <Route path={paths.scan} element={<ScanPage />} />
          <Route path={paths.resources} element={<ResourcesPage />} />
          <Route path={paths.about} element={<AboutPage />} />

          {/* Public auth pages */}
          <Route path={paths.login} element={<LoginPage />} />
          <Route path={paths.register} element={<RegisterPage />} />
          <Route path="/setup" element={<SetupPage />} />

          {/* Forum: browsing is public; posting is gated server-side and in the UI */}
          <Route path={paths.forum} element={<ForumPage />} />
          <Route
            path={paths.forumNew}
            element={
              <ProtectedRoute>
                <ForumNewPage />
              </ProtectedRoute>
            }
          />
          <Route path={`${paths.forum}/:postId`} element={<DiscussionPage />} />

          {/* Authenticated account pages */}
          <Route
            path={paths.dashboard}
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={paths.profile}
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={paths.settings}
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin / moderation (also enforced server-side) */}
          <Route
            path={paths.admin}
            element={
              <ProtectedRoute minRole="moderator">
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
