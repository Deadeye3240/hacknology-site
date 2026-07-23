/** Subtle homepage atmosphere — restrained so product previews stay focal. */
export function HomeBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -left-[15%] top-[-25%] h-[60vmin] w-[60vmin] rounded-full bg-accent-400/[0.06] blur-[100px] motion-safe:animate-drift-slow" />
      <div className="absolute -right-[10%] top-[5%] h-[45vmin] w-[45vmin] rounded-full bg-brand-500/[0.05] blur-[90px] motion-safe:animate-drift-reverse" />
      <div className="absolute inset-0 bg-grid-faint bg-grid opacity-30 [mask-image:radial-gradient(80%_65%_at_50%_0%,black,transparent)]" />
    </div>
  );
}
