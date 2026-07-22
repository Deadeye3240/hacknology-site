import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/cn";
import { useCmsNavigation } from "@/hooks/useCmsNavigation";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { NavDropdown } from "@/components/navigation/NavDropdown";
import { ProfileMenu } from "@/components/navigation/ProfileMenu";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useAuth } from "@/context/AuthContext";
import { paths } from "@/routes/paths";

function linkClasses({ isActive }: { isActive: boolean }): string {
  return cn(
    "block rounded-lg px-3 py-3 text-base font-medium transition-colors",
    isActive
      ? "bg-accent-400/10 text-white"
      : "text-slate-300 hover:bg-white/[0.04] hover:text-white",
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout, loading, user } = useAuth();
  const navGroups = useCmsNavigation();

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

  const accountLinks = [
    { label: "Dashboard", to: paths.dashboard },
    { label: "Profile", to: paths.profile },
    { label: "Settings", to: paths.settings },
    ...(isAdmin ? [{ label: "Admin", to: paths.admin }] : []),
  ];

  const displayName = user?.displayName || user?.username;

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-base-950/80 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Logo />

        {/* Desktop grouped navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navGroups.map((group) => (
            <NavDropdown key={group.label} group={group} />
          ))}
        </div>

        {/* Desktop auth cluster */}
        <div className="hidden items-center gap-2 lg:flex">
          {loading ? null : isAuthenticated && user ? (
            <ProfileMenu user={user} />
          ) : (
            <>
              <NavLink
                to={paths.login}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-white"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-white",
                  )
                }
              >
                Log in
              </NavLink>
              <Button to={paths.register} size="sm">
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
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          {isAuthenticated && user && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
              <Avatar
                name={displayName ?? "?"}
                avatar={user.avatar}
                size="md"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {displayName}
                </p>
                <p className="truncate text-xs text-slate-500">
                  @{user.username}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-5">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {group.label}
                </p>
                <ul className="flex flex-col gap-1">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      {item.external ? (
                        <a
                          href={item.to}
                          target="_blank"
                          rel="noreferrer noopener"
                          className={cn(linkClasses({ isActive: false }), "block")}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <NavLink
                          to={item.to}
                          end={item.to === "/"}
                          className={linkClasses}
                        >
                          {item.label}
                        </NavLink>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="my-4 border-t border-white/5" aria-hidden />

          {isAuthenticated ? (
            <ul className="flex flex-col gap-1">
              {accountLinks.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={linkClasses}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li className="mt-2">
                <Button variant="secondary" onClick={handleLogout} className="w-full">
                  Log out
                </Button>
              </li>
            </ul>
          ) : (
            <ul className="flex flex-col gap-1">
              <li>
                <NavLink to={paths.login} className={linkClasses}>
                  Log in
                </NavLink>
              </li>
              <li className="mt-1">
                <Button to={paths.register} className="w-full">
                  Create account
                </Button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
