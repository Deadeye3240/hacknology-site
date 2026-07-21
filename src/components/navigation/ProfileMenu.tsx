import { useEffect, useId, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/Avatar";
import { ChevronDownIcon } from "@/components/ui/icons";
import { useAuth } from "@/context/AuthContext";
import { paths } from "@/routes/paths";
import type { SelfUser } from "@/types/auth";

interface ProfileMenuProps {
  user: SelfUser;
}

/** Authenticated user menu with avatar, account links, and logout. */
export function ProfileMenu({ user }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuth();

  const displayName = user.displayName || user.username;

  const accountLinks = [
    { label: "Dashboard", to: paths.dashboard },
    { label: "Profile", to: paths.profile },
    { label: "Settings", to: paths.settings },
    ...(isAdmin ? [{ label: "Admin", to: paths.admin }] : []),
  ];

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function handleLogout() {
    setOpen(false);
    await logout();
    navigate(paths.home);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:border-white/10 hover:bg-white/[0.04]"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <Avatar name={displayName} avatar={user.avatar} size="sm" />
        <span className="max-w-[8rem] truncate text-sm font-medium text-slate-200">
          {displayName}
        </span>
        <ChevronDownIcon
          className={cn(
            "text-base text-slate-400 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-base-950/95 py-1.5 shadow-xl shadow-black/40 backdrop-blur-md"
        >
          <div className="border-b border-white/5 px-4 py-3">
            <p className="truncate text-sm font-semibold text-white">
              {displayName}
            </p>
            <p className="truncate text-xs text-slate-500">@{user.username}</p>
          </div>

          {accountLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              role="menuitem"
              className={({ isActive }) =>
                cn(
                  "block px-4 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-accent-400/10 text-white"
                    : "text-slate-300 hover:bg-white/[0.04] hover:text-white",
                )
              }
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}

          <div className="mt-1 border-t border-white/5 pt-1">
            <button
              type="button"
              role="menuitem"
              className="block w-full px-4 py-2.5 text-left text-sm text-slate-300 transition-colors hover:bg-white/[0.04] hover:text-white"
              onClick={() => void handleLogout()}
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
