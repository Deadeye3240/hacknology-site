import { Outlet } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ShieldIcon } from "@/components/ui/icons";

export default function AdminLayout() {
  return (
    <PageContainer className="py-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-400/10 text-accent-300">
          <ShieldIcon />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Admin CMS</h1>
          <p className="text-sm text-slate-500">Manage site content and settings</p>
        </div>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <AdminSidebar />
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </PageContainer>
  );
}
