import { Link } from "react-router-dom";
import { HacknologyMark } from "@/components/brand/HacknologyMark";
import { HeroTerminalDemo } from "@/components/home/HeroTerminalDemo";
import { HomeBackdrop } from "@/components/home/HomeBackdrop";
import { Button } from "@/components/ui/Button";
import {
  ArrowRightIcon,
  MessageIcon,
  PlayIcon,
  TerminalIcon,
} from "@/components/ui/icons";
import { platformStats } from "@/data/platformStats";
import { site } from "@/lib/site";
import { paths } from "@/routes/paths";

const SECTION_ANCHORS = [
  { id: "start-learning", label: "Learn", hint: "Structured lesson paths" },
  { id: "practice", label: "Practice", hint: "ScanMe & vulnerable labs" },
  { id: "games", label: "Games", hint: "Nerd Games arcade" },
  { id: "community", label: "Forum", hint: "Community discussions" },
] as const;

function HeroCyberRiderPreview({ className }: { className?: string }) {
  return (
    <Link
      to={paths.game("stick-rider")}
      className={`group relative block overflow-hidden rounded-xl border border-accent-400/20 bg-[#060a12] p-3 transition hover:border-accent-400/40 hover:shadow-glow-sm ${className ?? ""}`}
      aria-label="Play Cyber Rider — stunt bike game with flips and gaps"
    >
      <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-widest text-slate-500">
        <span className="font-semibold text-slate-300">Cyber Rider</span>
        <span className="inline-flex items-center gap-1 text-accent-300 transition group-hover:text-accent-200">
          <PlayIcon className="text-[9px]" />
          Play
        </span>
      </div>
      <svg viewBox="0 0 320 120" className="h-auto w-full" aria-hidden>
        <defs>
          <linearGradient id="hero-track-glow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <rect width="320" height="120" fill="#070b14" />
        <path d="M0 85 Q50 78 90 82 T160 68 T240 75 T320 62 L320 120 L0 120 Z" fill="#0f172a" />
        <path
          d="M0 85 Q50 78 90 82 T160 68 T240 75 T320 62"
          fill="none"
          stroke="url(#hero-track-glow)"
          strokeWidth="2"
        />
        <g className="motion-safe:animate-hero-bike-air" style={{ transformOrigin: "120px 72px" }}>
          <g stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" fill="none">
            <circle cx="108" cy="78" r="9" className="motion-safe:animate-hero-wheel" />
            <circle cx="138" cy="68" r="9" className="motion-safe:animate-hero-wheel" />
            <path d="M108 78 L125 58 L138 68" />
            <path d="M125 58 L118 38 L132 28 L145 26" />
            <circle cx="130" cy="24" r="6" fill="#22d3ee" stroke="#f8fafc" />
          </g>
        </g>
      </svg>
      <p className="mt-2 text-center text-[10px] text-slate-500 transition group-hover:text-slate-400">
        Stunt run with jumps, flips, and combo landings
      </p>
    </Link>
  );
}

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.04]">
      <HomeBackdrop />

      <div className="container-page relative py-14 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300">
              <TerminalIcon className="text-sm text-accent-300" aria-hidden />
              Hands-on cybersecurity · {site.domain}
            </span>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-accent-400/25 bg-base-950/80 shadow-glow-sm sm:h-16 sm:w-16">
                  <HacknologyMark size={48} />
                </span>
                <div className="flex flex-col leading-none">
                  <h1 className="text-[2.25rem] font-extrabold tracking-tight sm:text-5xl lg:text-[3.1rem]">
                    <span className="text-white">HACK</span>
                    <span className="text-gradient-accent">NOLOGY</span>
                  </h1>
                  <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
                    {site.domain}
                  </span>
                </div>
              </div>

              <p className="max-w-xl text-balance text-xl font-medium leading-snug text-slate-100 sm:text-2xl">
                Learn cybersecurity by doing — not watching.
              </p>
            </div>

            <p className="max-w-xl text-pretty text-base leading-relaxed text-slate-400 sm:text-lg">
              Study structured paths, run commands in embedded lesson terminals, practice in ScanMe recon and sandbox
              labs, play Nerd Games, and discuss techniques on the forum.
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <Button to={paths.lessons} size="lg" className="w-full sm:w-auto">
                Start Learning
                <ArrowRightIcon />
              </Button>
              <Button to={paths.game("stick-rider")} size="lg" variant="secondary" className="w-full sm:w-auto">
                <PlayIcon />
                Play Cyber Rider
              </Button>
              <Button to={paths.forum} size="lg" variant="ghost" className="w-full sm:w-auto">
                <MessageIcon />
                Join Community
              </Button>
            </div>

            <nav className="flex flex-wrap gap-2 pt-1" aria-label="Jump to homepage sections">
              {SECTION_ANCHORS.map((anchor) => (
                <a
                  key={anchor.id}
                  href={`#${anchor.id}`}
                  title={anchor.hint}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-400 transition hover:border-accent-400/30 hover:text-accent-200"
                >
                  {anchor.label}
                </a>
              ))}
            </nav>

            <p className="font-mono text-[10px] text-slate-600">
              {platformStats.pathCount} paths · {platformStats.lessonCount} lessons ·{" "}
              {platformStats.scanMeMissionCount} ScanMe missions
            </p>
          </div>

          <div className="relative flex flex-col gap-3">
            <HeroTerminalDemo />
            <HeroCyberRiderPreview className="hidden md:block" />
          </div>
        </div>

        <div className="mt-8 md:hidden">
          <HeroCyberRiderPreview />
        </div>
      </div>
    </section>
  );
}
