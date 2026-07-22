import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { LayersIcon, FlaskIcon, BookIcon, SparklesIcon, TargetIcon, RadarIcon } from "@/components/ui/icons";
import { useAuth } from "@/context/AuthContext";
import { useVulnerableLab } from "@/context/VulnerableLabContext";
import { useLessonProgress } from "@/context/LessonProgressContext";
import { useScanMe } from "@/context/ScanMeContext";
import { api } from "@/lib/api";
import { formatDate, timeAgo } from "@/lib/date";
import { labs, getLabById } from "@/data/labs";
import { achievements } from "@/data/achievements";
import { vulnerableLabs } from "@/data/vulnerableLabs";
import { localLabProgressCount, localLessonProgressCount, migrateAllLessonProgress, migrateLabProgress } from "@/lib/progressMigration";
import { paths } from "@/routes/paths";

interface LabProgressRow {
  labId: string;
  status: "in_progress" | "completed";
  startedAt: string | null;
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
  const { totalXp: vulnXp, completedIds, unlockedAchievements } = useVulnerableLab();
  const { totalXp: lessonXp, completedIds: lessonCompletedIds } = useLessonProgress();
  const { totalXp: scanMeXp } = useScanMe();
  const totalLearningXp = lessonXp + vulnXp + scanMeXp;
  const [labProgress, setLabProgress] = useState<LabProgressRow[]>([]);
  const [localLabCount, setLocalLabCount] = useState(0);
  const [localLessonCount, setLocalLessonCount] = useState(0);
  const [migrating, setMigrating] = useState(false);
  const [migratingLessons, setMigratingLessons] = useState(false);
  const [migrateMsg, setMigrateMsg] = useState<string | null>(null);
  const [lessonMigrateMsg, setLessonMigrateMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const labsRes = await api.get<{ labs: LabProgressRow[] }>("/progress/labs");
      setLabProgress(labsRes.labs);
    } catch {
      // Non-fatal: dashboard still renders with zeroed progress.
    }
  }, []);

  useEffect(() => {
    void load();
    setLocalLabCount(localLabProgressCount());
    setLocalLessonCount(localLessonProgressCount());
  }, [load]);

  async function handleMigrateLessons() {
    setMigratingLessons(true);
    setLessonMigrateMsg(null);
    try {
      const { lessons, paths } = await migrateAllLessonProgress();
      setLocalLessonCount(localLessonProgressCount());
      setLessonMigrateMsg(
        lessons + paths > 0
          ? `Synced ${lessons} lesson${lessons === 1 ? "" : "s"} and ${paths} path certification${paths === 1 ? "" : "s"} to your account.`
          : "No local lesson progress found to sync.",
      );
    } catch {
      setLessonMigrateMsg("Could not sync lesson progress. Please try again.");
    } finally {
      setMigratingLessons(false);
    }
  }

  const labsCompleted = labProgress.filter((l) => l.status === "completed").length;
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
      setLocalLabCount(localLabProgressCount());
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
          {localLabCount > 0 && (
            <Card className="flex flex-col gap-4 border-accent-400/25 bg-accent-400/[0.04] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold text-white">Sync your local lab progress</h2>
                <p className="text-sm text-slate-400">
                  You have {localLabCount} lab record{localLabCount === 1 ? "" : "s"} saved on this
                  device. Sync them to your account so they follow you everywhere.
                </p>
              </div>
              <Button onClick={handleMigrate} disabled={migrating} className="shrink-0">
                {migrating ? "Syncing…" : "Sync labs"}
              </Button>
            </Card>
          )}
          {localLessonCount > 0 && (
            <Card className="flex flex-col gap-4 border-accent-400/25 bg-accent-400/[0.04] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold text-white">Sync your local lesson progress</h2>
                <p className="text-sm text-slate-400">
                  You have {localLessonCount} completed lesson{localLessonCount === 1 ? "" : "s"} on
                  this device. Sync lessons and path certifications to your account.
                </p>
              </div>
              <Button onClick={handleMigrateLessons} disabled={migratingLessons} className="shrink-0">
                {migratingLessons ? "Syncing…" : "Sync lessons"}
              </Button>
            </Card>
          )}
          {migrateMsg && <Alert variant="success">{migrateMsg}</Alert>}
          {lessonMigrateMsg && <Alert variant="success">{lessonMigrateMsg}</Alert>}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={SparklesIcon} label="Total learning XP" value={String(totalLearningXp)} />
            <StatCard icon={BookIcon} label="Lessons completed" value={String(lessonCompletedIds.length)} />
            <StatCard icon={FlaskIcon} label="Labs completed" value={String(labsCompleted)} />
            <StatCard icon={LayersIcon} label="Overall lab progress" value={`${overall}%`} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon={TargetIcon} label="Vulnerable Lab XP" value={String(vulnXp)} />
            <StatCard
              icon={TargetIcon}
              label="Challenges solved"
              value={`${completedIds.length} / ${vulnerableLabs.length}`}
            />
            <StatCard icon={RadarIcon} label="ScanMe XP" value={String(scanMeXp)} />
          </div>

          {unlockedAchievements.length > 0 && (
            <Card>
              <h2 className="mb-4 text-lg font-semibold text-white">Vulnerable Lab achievements</h2>
              <div className="flex flex-wrap gap-2">
                {achievements
                  .filter((a) => unlockedAchievements.some((u) => u.achievementId === a.id))
                  .map((a) => (
                    <Badge key={a.id} variant="success">
                      {a.title} (+{a.xpBonus} XP)
                    </Badge>
                  ))}
              </div>
            </Card>
          )}

          <Card className="flex flex-col gap-3 border-accent-400/20 bg-accent-400/[0.03] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Learning Center</h2>
              <p className="text-sm text-slate-400">
                Structured lessons, knowledge checks, and path certifications.
              </p>
            </div>
            <Button to={paths.lessons} className="shrink-0">
              Go to Learn
            </Button>
          </Card>

          <Card className="flex flex-col gap-3 border-accent-400/20 bg-accent-400/[0.03] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Web Security Playground</h2>
              <p className="text-sm text-slate-400">
                Practice exploits safely in isolated, client-side simulations.
              </p>
            </div>
            <Button to={paths.vulnerableLab} variant="secondary" className="shrink-0">
              Enter Vulnerable Lab
            </Button>
          </Card>

          <Card className="flex flex-col gap-3 border-emerald-400/20 bg-emerald-400/[0.03] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">ScanMe Lab</h2>
              <p className="text-sm text-slate-400">
                Authorized Nmap reconnaissance against an isolated training target.
              </p>
            </div>
            <Button to={paths.scanme} variant="secondary" className="shrink-0">
              Open ScanMe
            </Button>
          </Card>

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
