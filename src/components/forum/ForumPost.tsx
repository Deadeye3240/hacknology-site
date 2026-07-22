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
  content,
  title,
  categoryName,
  locked,
  isOriginalPost,
  actions,
  editing,
}: ForumPostProps) {
  const tags = extractHashtags(title ?? "", content);

  return (
    <article
      className={cn(
        "rounded-md border border-white/[0.06] bg-white/[0.01]",
        isOriginalPost && "border-accent-400/12 bg-accent-400/[0.015]",
      )}
    >
      <div className="flex gap-2 border-b border-white/[0.04] px-2.5 py-2 sm:px-3">
        <Avatar name={author.displayName} avatar={author.avatar} size="xs" className="mt-px shrink-0" />
        <div className="min-w-0 flex-1">
          {title && (
            <h1 className="text-base font-semibold leading-snug tracking-tight text-white">{title}</h1>
          )}
          <div
            className={cn(
              "flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-slate-500",
              title && "mt-0.5",
            )}
          >
            <span className="font-medium text-slate-400">{author.displayName}</span>
            <RoleTag role={author.role} />
            {categoryName && (
              <>
                <span aria-hidden>·</span>
                <span>{categoryName}</span>
              </>
            )}
            <span aria-hidden>·</span>
            <time dateTime={createdAt} title={formatDate(createdAt)}>
              {timeAgo(createdAt)}
            </time>
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

      <div className="px-2.5 py-2 sm:px-3">{editing ?? <ForumContent content={content} compact />}</div>

      {actions && (
        <div className="flex flex-wrap gap-px border-t border-white/[0.04] px-2 py-1 sm:px-3">
          {actions}
        </div>
      )}
    </article>
  );
}

interface ForumReplyProps {
  author: AuthorInfo;
  createdAt: string;
  content: string;
  removed?: boolean;
  actions?: ReactNode;
  editing?: ReactNode;
}

export function ForumReply({ author, createdAt, content, removed, actions, editing }: ForumReplyProps) {
  return (
    <article className="flex gap-2 rounded-md border border-white/[0.04] bg-white/[0.008] px-2.5 py-2 sm:px-3">
      <Avatar name={author.displayName} avatar={author.avatar} size="xs" className="mt-px shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-slate-500">
          <span className="font-medium text-slate-400">{author.displayName}</span>
          <RoleTag role={author.role} />
          <span aria-hidden>·</span>
          <time dateTime={createdAt}>{timeAgo(createdAt)}</time>
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
        "rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors",
        danger
          ? "text-slate-500 hover:bg-red-400/10 hover:text-red-300"
          : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300",
      )}
    >
      {children}
    </button>
  );
}
