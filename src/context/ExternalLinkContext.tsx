import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { hostnameOf } from "@/lib/url";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { AlertTriangleIcon, ExternalLinkIcon, GlobeIcon } from "@/components/ui/icons";

interface ExternalLinkContextValue {
  /** Open the confirmation dialog for a destination URL. */
  requestNavigation: (href: string) => void;
}

const ExternalLinkContext = createContext<ExternalLinkContextValue | null>(null);

export function ExternalLinkProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLAnchorElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useLockBodyScroll(pending !== null);

  const requestNavigation = useCallback((href: string) => {
    lastFocused.current = document.activeElement as HTMLElement | null;
    setPending(href);
  }, []);

  const close = useCallback(() => {
    setPending(null);
    // Restore focus to the element that opened the dialog.
    lastFocused.current?.focus?.();
  }, []);

  // Move focus into the dialog when it opens.
  useEffect(() => {
    if (pending) continueRef.current?.focus();
  }, [pending]);

  // Escape to close + focus trap within the dialog.
  useEffect(() => {
    if (!pending) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [pending, close]);

  const value = useMemo(() => ({ requestNavigation }), [requestNavigation]);

  return (
    <ExternalLinkContext.Provider value={value}>
      {children}
      {pending && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="absolute inset-0 bg-base-950/80 backdrop-blur-sm" />
          <div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="external-link-title"
            aria-describedby="external-link-desc"
            className="relative w-full max-w-md animate-fade-in-up rounded-2xl border border-white/10 bg-surface p-6 shadow-card"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-amber-400/25 bg-amber-400/10 text-lg text-amber-300">
                <AlertTriangleIcon />
              </span>
              <div className="flex flex-col gap-1">
                <h2
                  id="external-link-title"
                  className="text-lg font-semibold text-white"
                >
                  You&apos;re leaving Hacknology
                </h2>
                <p
                  id="external-link-desc"
                  className="text-sm leading-relaxed text-slate-400"
                >
                  You&apos;re about to visit an external website. Hacknology does
                  not control or guarantee the security, privacy, availability, or
                  content of external websites, regardless of how reputable or
                  popular they may be.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <GlobeIcon className="shrink-0 text-sm text-slate-400" />
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Destination
              </span>
              <span className="truncate text-sm font-medium text-slate-200">
                {hostnameOf(pending)}
              </span>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={close}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] px-5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/[0.06]"
              >
                Cancel
              </button>
              <a
                ref={continueRef}
                href={pending}
                target="_blank"
                rel="noreferrer noopener"
                onClick={close}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-accent-400 px-5 text-sm font-semibold text-base-950 shadow-glow-sm transition-all hover:bg-accent-300 hover:shadow-glow"
              >
                Continue
                <ExternalLinkIcon className="text-sm" />
              </a>
            </div>
          </div>
        </div>
      )}
    </ExternalLinkContext.Provider>
  );
}

export function useExternalLink(): ExternalLinkContextValue {
  const ctx = useContext(ExternalLinkContext);
  if (!ctx) {
    throw new Error("useExternalLink must be used within an ExternalLinkProvider");
  }
  return ctx;
}
