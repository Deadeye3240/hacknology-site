import { useEffect, useId, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/cn";
import type { NavGroup } from "@/types";
import { ChevronDownIcon } from "@/components/ui/icons";

function isRouteActive(pathname: string, to: string): boolean {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

interface NavDropdownProps {
  group: NavGroup;
}

/** Desktop dropdown menu for a grouped navigation section. */
export function NavDropdown({ group }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const location = useLocation();

  const isActive = group.items.some((item) =>
    isRouteActive(location.pathname, item.to),
  );

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

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className={cn(
          "relative inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "text-white"
            : "text-slate-400 hover:bg-white/[0.04] hover:text-white",
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        {group.label}
        <ChevronDownIcon
          className={cn(
            "text-base transition-transform duration-200",
            open && "rotate-180",
          )}
        />
        {isActive && (
          <span className="pointer-events-none absolute inset-x-3 -bottom-2 h-0.5 rounded-full bg-accent-400 shadow-glow-sm" />
        )}
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 min-w-[12rem] overflow-hidden rounded-xl border border-white/10 bg-base-950/95 py-1.5 shadow-xl shadow-black/40 backdrop-blur-md"
        >
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              role="menuitem"
              className={({ isActive: itemActive }) =>
                cn(
                  "block px-4 py-2.5 text-sm transition-colors",
                  itemActive
                    ? "bg-accent-400/10 text-white"
                    : "text-slate-300 hover:bg-white/[0.04] hover:text-white",
                )
              }
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
