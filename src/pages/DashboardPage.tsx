import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { LayersIcon, FlaskIcon, BookIcon, SparklesIcon } from "@/components/ui/icons";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { formatDate, timeAgo } from "@/lib/date";
import { labs, getLabById } from "@/data/labs";
import { localLabProgressCount, migrateLabProgress } from "@/lib/progressMigration";
import { paths } from "@/routes/paths";

interface LabProgressRow {
  labId: string;
  status: "in_progress" | "completed";
  startedAt: string | null;
  completedAt: string | null;
}
interface LessonProgressRow {
  lessonId: string;
  completed: boolean;
  completedAt: string | null;
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof LayersIcon;
  label: string;
  value: string;
}) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-accent-400/25 bg-accent-400/10 text-xl text-accent-300">
        <Icon />
      </span>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-sm text-slate-400">{label}</span>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [labProgress, setLabProgress] = useState<LabProgressRow[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgressRow[]>([]);
  const [localCount, setLocalCount] = useState(0);
  const [migrating, setMigrating] = useState(false);
  const [migrateMsg, setMigrateMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [labsRes, lessonsRes] = await Promise.all([
        api.get<{ labs: LabProgressRow[] }>("/progress/labs"),
        api.get<{ lessons: LessonProgressRow[] }>("/progress/lessons"),
      ]);
      setLabProgress(labsRes.labs);
      setLessonProgress(lessonsRes.lessons);
    } catch {
      // Non-fatal: dashboard still renders with zeroed progress.
    }
  }, []);

  useEffect(() => {
    void load();
    setLocalCount(localLabProgressCount());
  }, [load]);

  const labsCompleted = labProgress.filter((l) => l.status === "completed").length;
  const labsInProgress = labProgress.filter((l) => l.status === "in_progress").length;
  const lessonsCompleted = lessonProgress.filter((l) => l.completed).length;
  const overall = labs.length > 0 ? Math.round((labsCompleted / labs.length) * 100) : 0;

  const recent = [...labProgress]
    .sort((a, b) =>
      (b.completedAt ?? b.startedAt ?? "").localeCompare(a.completedAt ?? a.startedAt ?? ""),
    )
    .slice(0, 5);

  async function handleMigrate() {
    setMigrating(true);
    setMigrateMsg(null);
    try {
      const count = await migrateLabProgress();
      await load();
      setLocalCount(localLabProgressCount());
      setMigrateMsg(
        count > 0
          ? `Synced ${count} local lab record${count === 1 ? "" : "s"} to your account.`
          : "No local progress found to sync.",
      );
    } catch {
      setMigrateMsg("Could not sync local progress. Please try again.");
    } finally {
      setMigrating(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Your account"
        title={`Welcome back, ${user?.displayName ?? user?.username ?? ""}`}
        description="Track your learning progress and pick up where you left off."
        icon={SparklesIcon}
      />
      <PageContainer className="py-10">
        <div className="flex flex-col gap-8">
          {localCount > 0 && (
            <Card className="flex flex-col gap-4 border-accent-400/25 bg-accent-400/[0.04] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold text-white">Sync your local progress</h2>
                <p className="text-sm text-slate-400">
                  You have {localCount} lab record{localCount === 1 ? "" : "s"} saved on this
                  device. Sync them to your account so they follow you everywhere.
                </p>
              </div>
              <Button onClick={handleMigrate} disabled={migrating} className="shrink-0">
                {migrating ? "Syncing…" : "Sync now"}
              </Button>
            </Card>
          )}
          {migrateMsg && <Alert variant="success">{migrateMsg}</Alert>}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={FlaskIcon} label="Labs completed" value={String(labsCompleted)} />
            <StatCard icon={LayersIcon} label="Labs in progress" value={String(labsInProgress)} />
            <StatCard icon={BookIcon} label="Lessons completed" value={String(lessonsCompleted)} />
            <StatCard icon={SparklesIcon} label="Overall lab progress" value={`${overall}%`} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <h2 className="mb-4 text-lg font-semibold text-white">Recent activity</h2>
              {recent.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No lab activity yet.{" "}
                  <Button to={paths.labs} variant="ghost" size="sm" className="px-1">
                    Explore labs
                  </Button>
                </p>
              ) : (
                <ul className="flex flex-col divide-y divide-white/5">
                  {recent.map((row) => {
                    const lab = getLabById(row.labId);
                    return (
                      <li key={row.labId} className="flex items-center justify-between gap-3 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-100">
                            {lab?.title ?? row.labId}
                          </span>
                          <span className="text-xs text-slate-500">
                            {timeAgo(row.completedAt ?? row.startedAt)}
                          </span>
                        </div>
                        <Badge variant={row.status === "completed" ? "success" : "warning"}>
                          {row.status === "completed" ? "Completed" : "In progress"}
                        </Badge>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>

            <Card>
              <h2 className="mb-4 text-lg font-semibold text-white">Account</h2>
              <dl className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Username</dt>
                  <dd className="font-medium text-slate-100">{user?.username}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Display name</dt>
                  <dd className="font-medium text-slate-100">{user?.displayName}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Role</dt>
                  <dd>
                    <Badge variant={user?.role === "user" ? "neutral" : "accent"}>
                      {user?.role}
                    </Badge>
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Joined</dt>
                  <dd className="font-medium text-slate-100">{formatDate(user?.createdAt)}</dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-col gap-2">
                <Button to={paths.profile} variant="secondary" size="sm">
                  Edit profile
                </Button>
                <Button to={paths.settings} variant="ghost" size="sm">
                  Account settings
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
