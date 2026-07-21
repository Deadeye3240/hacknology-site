import { useAuth } from "@/context/AuthContext";
import { PageContainer } from "@/components/layout/PageContainer";

/** Shown to anyone who is not an authenticated admin — no hints about accounts. */
export default function AdminRestrictedPage() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <PageContainer className="flex min-h-[50vh] items-center justify-center py-20">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-accent-400" />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="flex min-h-[50vh] items-center justify-center py-20">
      <p className="text-center text-lg text-slate-400">
        You are not an administrator.
      </p>
    </PageContainer>
  );
}
