import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { paths } from "@/routes/paths";

// Lazy-load routed pages so each route is code-split — keeps the initial
// bundle lean and gives future feature pages room to grow.
const HomePage = lazy(() => import("@/pages/HomePage"));
const LessonsPage = lazy(() => import("@/pages/LessonsPage"));
const LessonPathPage = lazy(() => import("@/pages/LessonPathPage"));
const LessonDetailPage = lazy(() => import("@/pages/LessonDetailPage"));
const LabsPage = lazy(() => import("@/pages/LabsPage"));
const LabDetailPage = lazy(() => import("@/pages/LabDetailPage"));
const ToolsPage = lazy(() => import("@/pages/ToolsPage"));
const ResourcesPage = lazy(() => import("@/pages/ResourcesPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const GamePage = lazy(() => import("@/pages/GamePage"));
const GamesHubPage = lazy(() => import("@/pages/GamesHubPage"));
const CyberTriviaPage = lazy(() => import("@/pages/games/CyberTriviaPage"));
const CryptoPuzzlePage = lazy(() => import("@/pages/games/CryptoPuzzlePage"));
const TerminalChallengePage = lazy(() => import("@/pages/games/TerminalChallengePage"));
const PasswordStrengthPage = lazy(() => import("@/pages/games/PasswordStrengthPage"));
const PhishingDetectorPage = lazy(() => import("@/pages/games/PhishingDetectorPage"));
const LogHuntPage = lazy(() => import("@/pages/games/LogHuntPage"));
const SecureOrVulnerablePage = lazy(() => import("@/pages/games/SecureOrVulnerablePage"));
const VulnerableLabPage = lazy(() => import("@/pages/VulnerableLabPage"));
const VulnerableLabChallengePage = lazy(() => import("@/pages/VulnerableLabChallengePage"));
const ScanMePage = lazy(() => import("@/pages/ScanMePage"));
const ScanMeMissionPage = lazy(() => import("@/pages/ScanMeMissionPage"));
const PathAssessmentPage = lazy(() => import("@/pages/PathAssessmentPage"));
const CmsPage = lazy(() => import("@/pages/CmsPage"));
const DynamicSlugPage = lazy(() => import("@/pages/DynamicSlugPage"));
const TermsPage = lazy(() => import("@/pages/legal/TermsPage"));
const PrivacyPage = lazy(() => import("@/pages/legal/PrivacyPage"));
const AcceptableUsePage = lazy(() => import("@/pages/legal/AcceptableUsePage"));
const LegalHubPage = lazy(() => import("@/pages/legal/LegalHubPage"));
const SupportPage = lazy(() => import("@/pages/SupportPage"));
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

const AdminGate = lazy(() => import("@/pages/admin/AdminGate"));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboardPage"));
const AdminPagesPage = lazy(() => import("@/pages/admin/AdminPagesPage"));
const AdminPageEditorPage = lazy(() => import("@/pages/admin/AdminPageEditorPage"));
const AdminLessonsPage = lazy(() => import("@/pages/admin/AdminLessonsPage"));
const AdminPathsPage = lazy(() => import("@/pages/admin/AdminPathsPage"));
const AdminAssessmentsPage = lazy(() => import("@/pages/admin/AdminAssessmentsPage"));
const AdminLabsPage = lazy(() => import("@/pages/admin/AdminLabsPage"));
const AdminResourcesPage = lazy(() => import("@/pages/admin/AdminResourcesPage"));
const AdminMediaPage = lazy(() => import("@/pages/admin/AdminMediaPage"));
const AdminNavigationPage = lazy(() => import("@/pages/admin/AdminNavigationPage"));
const AdminHomepagePage = lazy(() => import("@/pages/admin/AdminHomepagePage"));
const AdminAppearancePage = lazy(() => import("@/pages/admin/AdminAppearancePage"));
const AdminSettingsPage = lazy(() => import("@/pages/admin/AdminSettingsPage"));
const AdminDiscordPage = lazy(() => import("@/pages/admin/AdminDiscordPage"));
const AdminSupportPage = lazy(() => import("@/pages/admin/AdminSupportPage"));
const AdminUsersPage = lazy(() => import("@/pages/admin/AdminUsersPage"));
const AdminReportsPage = lazy(() => import("@/pages/admin/AdminReportsPage"));

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
          <Route path={`${paths.lessons}/:pathId`} element={<LessonPathPage />} />
          <Route path={`${paths.lessons}/:pathId/assessment`} element={<PathAssessmentPage />} />
          <Route path={`${paths.lessons}/:pathId/:lessonId`} element={<LessonDetailPage />} />
          <Route path={paths.labs} element={<LabsPage />} />
          <Route path={`${paths.labs}/:labId`} element={<LabDetailPage />} />
          <Route path={paths.tools} element={<ToolsPage />} />
          <Route path={paths.scan} element={<Navigate to={paths.scanme} replace />} />
          <Route path={paths.scanme} element={<ScanMePage />} />
          <Route path={`${paths.scanme}/:missionId`} element={<ScanMeMissionPage />} />
          <Route path={paths.resources} element={<ResourcesPage />} />
          <Route path={paths.about} element={<AboutPage />} />
          <Route path={paths.legal} element={<LegalHubPage />} />
          <Route path={paths.terms} element={<TermsPage />} />
          <Route path={paths.privacy} element={<PrivacyPage />} />
          <Route path={paths.acceptableUse} element={<AcceptableUsePage />} />
          <Route path={paths.support} element={<SupportPage />} />
          <Route path={paths.games} element={<GamesHubPage />} />
          <Route path={`${paths.games}/stick-rider`} element={<GamePage />} />
          <Route path={`${paths.games}/cyber-trivia`} element={<CyberTriviaPage />} />
          <Route path={`${paths.games}/crypto-puzzle`} element={<CryptoPuzzlePage />} />
          <Route path={`${paths.games}/terminal-challenge`} element={<TerminalChallengePage />} />
          <Route path={`${paths.games}/password-strength`} element={<PasswordStrengthPage />} />
          <Route path={`${paths.games}/phishing-detector`} element={<PhishingDetectorPage />} />
          <Route path={`${paths.games}/log-hunt`} element={<LogHuntPage />} />
          <Route path={`${paths.games}/secure-or-vulnerable`} element={<SecureOrVulnerablePage />} />
          <Route path="/Game" element={<Navigate to={`${paths.games}/stick-rider`} replace />} />
          <Route path={paths.vulnerableLab} element={<VulnerableLabPage />} />
          <Route path={`${paths.vulnerableLab}/:challengeId`} element={<VulnerableLabChallengePage />} />

          {/* CMS dynamic pages at /pages/:slug */}
          <Route path="/pages/:slug" element={<CmsPage />} />

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

          {/* Admin CMS — admin role only; non-admins see restricted message */}
          <Route path={paths.admin} element={<AdminGate />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="pages" element={<AdminPagesPage />} />
              <Route path="pages/new" element={<AdminPageEditorPage />} />
              <Route path="pages/:id" element={<AdminPageEditorPage />} />
              <Route path="lessons" element={<AdminLessonsPage />} />
              <Route path="paths" element={<AdminPathsPage />} />
              <Route path="assessments" element={<AdminAssessmentsPage />} />
              <Route path="labs" element={<AdminLabsPage />} />
              <Route path="resources" element={<AdminResourcesPage />} />
              <Route path="media" element={<AdminMediaPage />} />
              <Route path="navigation" element={<AdminNavigationPage />} />
              <Route path="homepage" element={<AdminHomepagePage />} />
              <Route path="appearance" element={<AdminAppearancePage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="discord" element={<AdminDiscordPage />} />
              <Route path="support" element={<AdminSupportPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
            </Route>
          </Route>

          {/* CMS catch-all slug — must be after all reserved routes */}
          <Route path="/:slug" element={<DynamicSlugPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

