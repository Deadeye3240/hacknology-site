import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "@/components/ui/icons";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Footer actions (buttons). */
  footer?: ReactNode;
}

/**
 * Accessible modal dialog with Escape-to-close, backdrop click, and a basic
 * focus trap. Used for confirmations and small forms.
 */
export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement | null;
    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select',
    );
    focusables?.[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      lastFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-base-950/80 backdrop-blur-sm" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-md animate-fade-in-up rounded-2xl border border-white/10 bg-surface p-6 shadow-card"
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1 text-slate-400 transition-colors hover:text-white"
          >
            <CloseIcon className="text-lg" />
          </button>
        </div>
        <div className="text-sm text-slate-300">{children}</div>
        {footer && <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  );
}
