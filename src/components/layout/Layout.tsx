import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { SupportWidget } from "@/components/support/SupportWidget";

/**
 * Application shell shared by every route: skip link, sticky navbar, the
 * routed page content, and the footer.
 */
export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-base-950">
      <ScrollToTop />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-accent-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-base-950"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <SupportWidget />
    </div>
  );
}
