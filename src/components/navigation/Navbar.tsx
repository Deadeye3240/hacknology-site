import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/cn";
import { primaryNav } from "@/data/navigation";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useAuth } from "@/context/AuthContext";
import { paths } from "@/routes/paths";

function linkClasses({ isActive }: { isActive: boolean }): string {
  return cn(
    "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "text-white"
      : "text-slate-400 hover:text-white hover:bg-white/[0.04]",
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isModerator, logout, loading } = useAuth();

  useLockBodyScroll(open);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function handleLogout() {
    await logout();
    navigate(paths.home);
  }

  // Account links shown to authenticated users (mirrored on mobile).
  const accountLinks = [
    { label: "Dashboard", to: paths.dashboard },
    { label: "Forum", to: paths.forum },
    { label: "Profile", to: paths.profile },
    ...(isModerator ? [{ label: "Admin", to: paths.admin }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-base-950/80 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Logo />

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.to === "/"} className={linkClasses}>
                {({ isActive }) => (
                  <span className="relative">
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-accent-400 shadow-glow-sm" />
                    )}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop auth cluster */}
        <div className="hidden items-center gap-1 lg:flex">
          {loading ? null : isAuthenticated ? (
            <>
              {accountLinks.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClasses}>
                  {item.label}
                </NavLink>
              ))}
              <Button size="sm" variant="secondary" onClick={handleLogout} className="ml-1">
                Log out
              </Button>
            </>
          ) : (
            <>
              <NavLink to={paths.login} className={linkClasses}>
                Log in
              </NavLink>
              <Button to={paths.register} size="sm" className="ml-1">
                Create account
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-200 hover:bg-white/[0.05] lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon className="text-xl" /> : <MenuIcon className="text-xl" />}
        </button>
      </nav>

      {/* Mobile navigation drawer */}
      <div
        id="mobile-menu"
        hidden={!open}
        className={cn(
          "lg:hidden",
          open && "border-t border-white/5 bg-base-950/95 backdrop-blur-md",
        )}
      >
        <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
          {primaryNav.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "block rounded-lg px-3 py-3 text-base font-medium transition-colors",
                    isActive
                      ? "bg-accent-400/10 text-white"
                      : "text-slate-300 hover:bg-white/[0.04] hover:text-white",
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}

          <li className="my-2 border-t border-white/5" aria-hidden />

          {isAuthenticated ? (
            <>
              {accountLinks.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "block rounded-lg px-3 py-3 text-base font-medium transition-colors",
                        isActive
                          ? "bg-accent-400/10 text-white"
                          : "text-slate-300 hover:bg-white/[0.04] hover:text-white",
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li className="mt-2">
                <Button variant="secondary" onClick={handleLogout} className="w-full">
                  Log out
                </Button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to={paths.login}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-slate-300 hover:bg-white/[0.04] hover:text-white"
                >
                  Log in
                </NavLink>
              </li>
              <li className="mt-1">
                <Button to={paths.register} className="w-full">
                  Create account
                </Button>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}
