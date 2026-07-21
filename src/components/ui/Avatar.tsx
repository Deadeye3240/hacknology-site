import { cn } from "@/lib/cn";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface AvatarProps {
  name: string;
  avatar?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-20 w-20 text-2xl",
};

/** User avatar with image fallback to initials. */
export function Avatar({ name, avatar, size = "md", className }: AvatarProps) {
  const classes = cn(
    "grid shrink-0 place-items-center overflow-hidden rounded-full border border-accent-400/30 bg-accent-400/10 font-semibold text-accent-200",
    sizeClasses[size],
    className,
  );

  if (avatar && (avatar.startsWith("data:image/") || avatar.startsWith("http"))) {
    return (
      <span className={classes}>
        <img src={avatar} alt="" className="h-full w-full object-cover" />
      </span>
    );
  }

  return <span className={classes}>{initials(name || "?")}</span>;
}
