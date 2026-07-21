import { NavLink } from "react-router-dom";
import { cn } from "@/lib/cn";
import { ADMIN_SECTIONS } from "@/types/cms";

export function AdminSidebar() {
  return (
    <aside className="w-full shrink-0 lg:w-56">
      <nav aria-label="Admin sections" className="flex flex-col gap-0.5">
        {ADMIN_SECTIONS.map((section) => (
          <NavLink
            key={section.to}
            to={section.to}
            end={"end" in section ? section.end : false}
            className={({ isActive }) =>
              cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent-400/10 text-white"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-white",
              )
            }
          >
            {section.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
