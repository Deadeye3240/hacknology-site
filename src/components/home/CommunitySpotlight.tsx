import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CommunityThreadPreview } from "@/components/forum/CommunityThreadPreview";
import { ArrowRightIcon, MessageIcon, UsersIcon } from "@/components/ui/icons";
import { paths } from "@/routes/paths";
import { Link } from "react-router-dom";

const FORUM_FEATURES = [
  "Ask questions and get help from other learners",
  "Share write-ups, lab notes, and study resources",
  "Browse by category — labs, tools, defensive, and more",
  "Use code blocks for commands, logs, and configs",
];

export function CommunitySpotlight() {
  return (
    <Card className="overflow-hidden border-violet-400/15 bg-gradient-to-br from-violet-400/[0.04] via-base-950 to-base-950 p-0">
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-400/25 bg-violet-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-200">
            <UsersIcon className="text-xs" />
            Primary community on Hacknology
          </span>
          <div>
            <h3 className="text-2xl font-bold text-white sm:text-3xl">Forum for practitioners</h3>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400 sm:text-base">
              Long-form discussions built for cybersecurity learning — ask for help, share what you figured out,
              and learn from threads that stay searchable on the platform.
            </p>
          </div>
          <ul className="space-y-2.5">
            {FORUM_FEATURES.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-slate-400">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-400" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button to={paths.forum}>
              <MessageIcon />
              Open forum
            </Button>
            <Button to={paths.forumNew} variant="secondary">
              Start discussion
            </Button>
          </div>
        </div>

        <div className="border-t border-white/5 bg-base-950/60 p-4 sm:p-6 lg:border-l lg:border-t-0">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Recent discussions</p>
            <Link
              to={paths.forum}
              className="inline-flex items-center gap-1 text-[10px] font-medium text-accent-300 hover:text-accent-200"
            >
              View all
              <ArrowRightIcon className="text-[9px]" />
            </Link>
          </div>
          <CommunityThreadPreview />
        </div>
      </div>
    </Card>
  );
}
