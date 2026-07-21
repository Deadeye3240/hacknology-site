import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ExternalLinkIcon } from "@/components/ui/icons";
import { isExternalHref } from "@/lib/url";
import { useExternalLink } from "@/context/ExternalLinkContext";

interface ExternalLinkProps {
  href: string;
  children: ReactNode;
  /** Hide the trailing external-link glyph when false (default true). */
  showIcon?: boolean;
  className?: string;
}

/**
 * Anchor for links that leave the site. External destinations are intercepted
 * and routed through a confirmation dialog before navigation; the user must
 * explicitly choose "Continue". Links still open in a new tab with safe `rel`
 * defaults, and remain usable (right-click, middle-click) as real anchors.
 */
export function ExternalLink({
  href,
  children,
  showIcon = true,
  className,
}: ExternalLinkProps) {
  const { requestNavigation } = useExternalLink();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // Respect modifier clicks and only intercept plain left-clicks on external
    // links so the confirmation dialog governs in-tab navigation.
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    if (isExternalHref(href)) {
      event.preventDefault();
      requestNavigation(href);
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1.5 text-accent-300 transition-colors hover:text-accent-200",
        className,
      )}
    >
      {children}
      {showIcon && (
        <ExternalLinkIcon className="text-xs" aria-label="(opens in a new tab)" />
      )}
    </a>
  );
}
