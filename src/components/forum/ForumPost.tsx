import type { ReactNode } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ForumContent } from "@/components/forum/ForumContent";
import { extractHashtags } from "@/lib/forumContent";
import { formatDate, timeAgo } from "@/lib/date";
import { cn } from "@/lib/cn";

interface AuthorInfo {
  displayName: string;
  avatar?: string | null;
  role?: string;
}

interface ForumPostProps {
  author: AuthorInfo;
  createdAt: string;
  updatedAt?: string;
  content: string;
  title?: string;
  categoryName?: string;
  locked?: boolean;
  isOriginalPost?: boolean;
  actions?: ReactNode;
  editing?: ReactNode;
}

function RoleTag({ role }: { role?: string }) {
  if (!role || role === "user") return null;
  return (
    <Badge variant="accent" className="px-1 py-0 text-[9px] capitalize">
      {role}
    </Badge>
  );
}

export function ForumPost({
  author,
  createdAt,
  updatedAt,
  content,
  title,
  categoryName,
  locked,
  isOriginalPost,
  actions,
  editing,
}: ForumPostProps) {
  const tags = extractHashtags(title ?? "", content);
  const edited = updatedAt != null && updatedAt !== createdAt;

  return (
    <article
      className={cn(
        "overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.01]",
        isOriginalPost && "border-accent-400/20 bg-accent-400/[0.02] ring-1 ring-accent-400/10",
      )}
    >
      {isOriginalPost && (
        <div className="border-b border-accent-400/10 bg-accent-400/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent-200">
          Original post
        </div>
      )}
      <div className="flex gap-2.5 border-b border-white/[0.04] px-3 py-2.5 sm:px-4">
        <Avatar name={author.displayName} avatar={author.avatar} size="sm" className="mt-px shrink-0" />
        <div className="min-w-0 flex-1">
          {title && (
            <h1 className="text-lg font-semibold leading-snug tracking-tight text-white sm:text-xl">{title}</h1>
          )}
          <div
            className={cn(
              "flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-slate-500",
              title && "mt-1",
            )}
          >
            <span className="font-medium text-slate-300">{author.displayName}</span>
            <RoleTag role={author.role} />
            {categoryName && (
              <>
                <span aria-hidden>·</span>
                <Badge variant="neutral" className="px-1.5 py-0 text-[9px]">
                  {categoryName}
                </Badge>
              </>
            )}
            <span aria-hidden>·</span>
            <time dateTime={createdAt} title={formatDate(createdAt)}>
              {timeAgo(createdAt)}
            </time>
            {edited && <span className="text-slate-600">(edited)</span>}
            {locked && (
              <Badge variant="warning" className="px-1 py-0 text-[9px]">
                Locked
              </Badge>
            )}
          </div>
          {tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-0.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-white/[0.06] bg-white/[0.03] px-1 py-px font-mono text-[9px] text-slate-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-3 py-3 sm:px-4">{editing ?? <ForumContent content={content} compact />}</div>

      {actions && (
        <div className="flex flex-wrap gap-px border-t border-white/[0.04] px-2 py-1.5 sm:px-3">
          {actions}
        </div>
      )}
    </article>
  );
}

interface ForumReplyProps {
  author: AuthorInfo;
  createdAt: string;
  updatedAt?: string;
  content: string;
  removed?: boolean;
  actions?: ReactNode;
  editing?: ReactNode;
}

export function ForumReply({
  author,
  createdAt,
  updatedAt,
  content,
  removed,
  actions,
  editing,
}: ForumReplyProps) {
  const edited = updatedAt != null && updatedAt !== createdAt;

  return (
    <article className="flex gap-2.5 rounded-lg border border-white/[0.05] border-l-accent-400/20 bg-white/[0.008] px-3 py-2.5 sm:px-4 sm:pl-3">
      <Avatar name={author.displayName} avatar={author.avatar} size="xs" className="mt-px shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-slate-500">
          <span className="font-medium text-slate-300">{author.displayName}</span>
          <RoleTag role={author.role} />
          <span aria-hidden>·</span>
          <time dateTime={createdAt}>{timeAgo(createdAt)}</time>
          {edited && <span className="text-slate-600">(edited)</span>}
        </div>
        {removed ? (
          <p className="text-[11px] italic text-slate-500">[removed by a moderator]</p>
        ) : (
          editing ?? <ForumContent content={content} compact />
        )}
        {actions && !removed && <div className="mt-1 flex flex-wrap gap-px">{actions}</div>}
      </div>
    </article>
  );
}

export function PostAction({
  children,
  onClick,
  danger,
}: {
  children: ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-400/40",
        danger
          ? "text-slate-500 hover:bg-red-400/10 hover:text-red-300"
          : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300",
      )}
    >
      {children}
    </button>
  );
}
