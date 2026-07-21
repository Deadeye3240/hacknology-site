import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-400 text-base-950 font-semibold hover:bg-accent-300 shadow-glow-sm hover:shadow-glow",
  secondary:
    "bg-white/[0.03] text-slate-100 border border-white/10 hover:border-accent-400/50 hover:bg-white/[0.06]",
  ghost:
    "bg-transparent text-slate-300 hover:text-white hover:bg-white/[0.05]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

const baseClasses =
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

interface ButtonAsButton
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  to?: undefined;
  href?: undefined;
}

interface ButtonAsLink extends CommonProps {
  /** Internal route target — renders a React Router `Link`. */
  to: string;
  href?: undefined;
}

interface ButtonAsAnchor extends CommonProps {
  /** External URL — renders an anchor with safe `rel` defaults. */
  href: string;
  to?: undefined;
}

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

/**
 * Polymorphic button that renders a `<button>`, a router `<Link>` (via `to`),
 * or an `<a>` (via `href`) while sharing a single set of styles.
 */
export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
  } = props;

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if ("to" in props && props.to !== undefined) {
    return (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    );
  }

  if ("href" in props && props.href !== undefined) {
    return (
      <a
        href={props.href}
        className={classes}
        target="_blank"
        rel="noreferrer noopener"
      >
        {children}
      </a>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton;
  void _v;
  void _s;
  void _c;
  void _ch;

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
