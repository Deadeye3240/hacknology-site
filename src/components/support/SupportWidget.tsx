import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SupportContactForm } from "@/components/support/SupportContactForm";
import { Modal } from "@/components/ui/Modal";
import { MessageIcon } from "@/components/ui/icons";
import { creator } from "@/data/creator";
import { paths } from "@/routes/paths";

/** Subtle bottom-left support entry — opens contact form without dominating the UI. */
export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  if (location.pathname.startsWith("/admin") || location.pathname === paths.support) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-base-950/90 px-4 py-2.5 text-sm font-medium text-slate-200 shadow-lg shadow-black/30 backdrop-blur-md transition-all hover:border-accent-400/30 hover:text-white"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-400/15 text-accent-300">
            <MessageIcon className="text-base" />
          </span>
          <span className="hidden sm:inline">
            Support · <span className="text-slate-400">{creator.agentLabel}</span>
          </span>
          <span className="sm:hidden">Support</span>
        </button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Contact ${creator.agentLabel}`}
        footer={
          <Link
            to={paths.support}
            className="text-sm text-accent-300 hover:text-accent-200"
            onClick={() => setOpen(false)}
          >
            Full support page →
          </Link>
        }
      >
        <p className="mb-4 text-sm text-slate-400">
          Platform support for {creator.name}. Your message is delivered to the admin inbox.
        </p>
        <SupportContactForm compact onSuccess={() => setTimeout(() => setOpen(false), 2000)} />
      </Modal>
    </>
  );
}
