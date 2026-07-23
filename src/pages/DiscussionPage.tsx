import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Modal } from "@/components/ui/Modal";
import { TextField, TextAreaField } from "@/components/ui/TextField";
import { EmptyState } from "@/components/ui/EmptyState";
import { CommunityShell } from "@/components/forum/CommunityShell";
import { ForumPost, ForumReply, PostAction } from "@/components/forum/ForumPost";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { paths } from "@/routes/paths";
import type { DiscussionDetail, ReplyItem } from "@/types/forum";

type Action =
  | { kind: "delete-discussion" }
  | { kind: "delete-reply"; id: string }
  | { kind: "lock"; locked: boolean }
  | { kind: "report"; targetType: "discussion" | "reply"; targetId: string };

export default function DiscussionPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [detail, setDetail] = useState<DiscussionDetail | null>(null);
  const [replies, setReplies] = useState<ReplyItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "notfound">("loading");
  const [pageError, setPageError] = useState<string | null>(null);

  const [replyContent, setReplyContent] = useState("");
  const [replyError, setReplyError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  const [editingDiscussion, setEditingDiscussion] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyContent, setEditReplyContent] = useState("");

  const [action, setAction] = useState<Action | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const copyThreadLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      setNotice("Could not copy link.");
    }
  }, []);

  const load = useCallback(async () => {
    if (!postId) return;
    try {
      const res = await api.get<{ discussion: DiscussionDetail; replies: ReplyItem[] }>(
        `/forum/discussions/${postId}`,
      );
      setDetail(res.discussion);
      setReplies(res.replies);
      setStatus("ready");
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) setStatus("notfound");
      else setPageError("Could not load this discussion.");
    }
  }, [postId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function submitReply(event: FormEvent) {
    event.preventDefault();
    setReplyError(null);
    setPosting(true);
    try {
      await api.post(`/forum/discussions/${postId}/replies`, { content: replyContent });
      setReplyContent("");
      await load();
    } catch (err) {
      setReplyError(err instanceof ApiError ? err.message : "Could not post reply.");
    } finally {
      setPosting(false);
    }
  }

  function startEditDiscussion() {
    if (!detail) return;
    setEditTitle(detail.title);
    setEditContent(detail.content);
    setEditingDiscussion(true);
  }

  async function saveDiscussion(event: FormEvent) {
    event.preventDefault();
    setActionError(null);
    try {
      await api.patch(`/forum/discussions/${postId}`, {
        title: editTitle,
        content: editContent,
      });
      setEditingDiscussion(false);
      await load();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not save changes.");
    }
  }

  async function saveReply(id: string) {
    try {
      await api.patch(`/forum/replies/${id}`, { content: editReplyContent });
      setEditingReplyId(null);
      await load();
    } catch {
      setNotice("Could not save reply.");
    }
  }

  async function runAction() {
    if (!action) return;
    setActionBusy(true);
    setActionError(null);
    try {
      if (action.kind === "delete-discussion") {
        await api.del(`/forum/discussions/${postId}`);
        navigate(paths.forum);
        return;
      }
      if (action.kind === "delete-reply") {
        await api.del(`/forum/replies/${action.id}`);
      } else if (action.kind === "lock") {
        await api.post(`/forum/discussions/${postId}/lock`, { locked: action.locked });
      } else if (action.kind === "report") {
        await api.post("/forum/reports", {
          targetType: action.targetType,
          targetId: action.targetId,
          reason: reportReason,
        });
        setNotice("Thanks — your report has been submitted for review.");
      }
      setAction(null);
      setReportReason("");
      await load();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Action failed.");
    } finally {
      setActionBusy(false);
    }
  }

  if (status === "loading") {
    return (
      <CommunityShell title="Loading…">
        <div className="flex min-h-[40vh] items-center justify-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-accent-400" />
        </div>
      </CommunityShell>
    );
  }

  if (status === "notfound" || !detail) {
    return (
      <CommunityShell title="Not found" breadcrumb={[{ label: "Discussion" }]}>
        <EmptyState
          title="Discussion not found"
          description="This discussion may have been removed or never existed."
          action={
            <Button to={paths.forum} size="sm">
              Back to community
            </Button>
          }
        />
      </CommunityShell>
    );
  }

  const postActions = (
    <>
      {detail.canEdit && <PostAction onClick={startEditDiscussion}>Edit</PostAction>}
      {detail.canDelete && (
        <PostAction danger onClick={() => setAction({ kind: "delete-discussion" })}>
          Delete
        </PostAction>
      )}
      {detail.canModerate && (
        <PostAction onClick={() => setAction({ kind: "lock", locked: !detail.locked })}>
          {detail.locked ? "Unlock" : "Lock"}
        </PostAction>
      )}
      {isAuthenticated && (
        <PostAction onClick={() => setAction({ kind: "report", targetType: "discussion", targetId: detail.id })}>
          Report
        </PostAction>
      )}
      <PostAction onClick={() => void copyThreadLink()}>{linkCopied ? "Link copied" : "Copy link"}</PostAction>
    </>
  );

  return (
    <CommunityShell breadcrumb={[{ label: detail.categoryName }]}>
      <div className="mx-auto flex max-w-3xl flex-col gap-2.5">
        {pageError && <Alert variant="error">{pageError}</Alert>}
        {notice && <Alert variant="success">{notice}</Alert>}

        <ForumPost
          isOriginalPost
          author={{
            displayName: detail.author?.displayName ?? "Unknown",
            avatar: detail.author?.avatar,
            role: detail.author?.role,
          }}
          createdAt={detail.createdAt}
          updatedAt={detail.updatedAt}
          title={editingDiscussion ? undefined : detail.title}
          categoryName={detail.categoryName}
          locked={detail.locked}
          content={detail.content}
          actions={!editingDiscussion ? postActions : undefined}
          editing={
            editingDiscussion ? (
              <form onSubmit={saveDiscussion} className="flex flex-col gap-3">
                {actionError && <Alert variant="error">{actionError}</Alert>}
                <TextField
                  label="Title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  maxLength={140}
                />
                <TextAreaField
                  label="Content"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  maxLength={10000}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setEditingDiscussion(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">
                    Save
                  </Button>
                </div>
              </form>
            ) : undefined
          }
        />

        <section aria-labelledby="replies-heading">
          <h2 id="replies-heading" className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            {replies.length} {replies.length === 1 ? "reply" : "replies"}
          </h2>
          <div className="flex flex-col gap-1.5">
            {replies.map((reply) => (
              <ForumReply
                key={reply.id}
                author={{
                  displayName: reply.author.displayName,
                  avatar: reply.author.avatar,
                  role: reply.author.role,
                }}
                createdAt={reply.createdAt}
                updatedAt={reply.updatedAt}
                content={reply.content}
                removed={reply.removed}
                editing={
                  editingReplyId === reply.id ? (
                    <div className="flex flex-col gap-2">
                      <TextAreaField
                        label="Edit reply"
                        value={editReplyContent}
                        onChange={(e) => setEditReplyContent(e.target.value)}
                        maxLength={10000}
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingReplyId(null)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => saveReply(reply.id)}>
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : undefined
                }
                actions={
                  <>
                    {reply.canEdit && (
                      <PostAction
                        onClick={() => {
                          setEditingReplyId(reply.id);
                          setEditReplyContent(reply.content);
                        }}
                      >
                        Edit
                      </PostAction>
                    )}
                    {reply.canDelete && (
                      <PostAction danger onClick={() => setAction({ kind: "delete-reply", id: reply.id })}>
                        Delete
                      </PostAction>
                    )}
                    {isAuthenticated && (
                      <PostAction
                        onClick={() =>
                          setAction({ kind: "report", targetType: "reply", targetId: reply.id })
                        }
                      >
                        Report
                      </PostAction>
                    )}
                  </>
                }
              />
            ))}
          </div>
        </section>

        {detail.locked ? (
          <Alert variant="info">This discussion is locked. New replies are disabled.</Alert>
        ) : isAuthenticated ? (
          <>
            {replies.length > 2 && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => document.getElementById("reply-box")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Jump to reply
                </Button>
              </div>
            )}
          <div id="reply-box" className="rounded-lg border border-white/[0.06] bg-base-950/95 p-3 sm:p-3.5 lg:sticky lg:bottom-4 lg:backdrop-blur-sm">
            <form onSubmit={submitReply} className="flex flex-col gap-2">
              {replyError && <Alert variant="error">{replyError}</Alert>}
              <TextAreaField
                label="Write a reply"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Share your insight. Use ``` for code blocks."
                maxLength={10000}
                required
              />
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] text-slate-600">Plain text · ``` fences for code</p>
                <Button type="submit" size="xs" disabled={posting}>
                  {posting ? "Posting…" : "Post reply"}
                </Button>
              </div>
            </form>
          </div>
          </>
        ) : (
          <Alert variant="info">
            <Button to={paths.login} variant="ghost" size="sm" className="px-1">
              Sign in
            </Button>{" "}
            to join the discussion.
          </Alert>
        )}
      </div>

      <Modal
        open={action !== null && action.kind !== "report"}
        onClose={() => setAction(null)}
        title={
          action?.kind === "lock"
            ? action.locked
              ? "Lock discussion?"
              : "Unlock discussion?"
            : "Delete this content?"
        }
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAction(null)} disabled={actionBusy}>
              Cancel
            </Button>
            <Button size="sm" onClick={runAction} disabled={actionBusy}>
              {actionBusy ? "Working…" : "Confirm"}
            </Button>
          </>
        }
      >
        {actionError && (
          <Alert variant="error" className="mb-3">
            {actionError}
          </Alert>
        )}
        {action?.kind === "lock"
          ? action.locked
            ? "Members will no longer be able to reply."
            : "Members will be able to reply again."
          : "This action cannot be undone from the interface."}
      </Modal>

      <Modal
        open={action?.kind === "report"}
        onClose={() => {
          setAction(null);
          setReportReason("");
        }}
        title="Report content"
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAction(null);
                setReportReason("");
              }}
              disabled={actionBusy}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={runAction} disabled={actionBusy || reportReason.trim().length === 0}>
              {actionBusy ? "Submitting…" : "Submit report"}
            </Button>
          </>
        }
      >
        {actionError && (
          <Alert variant="error" className="mb-3">
            {actionError}
          </Alert>
        )}
        <TextAreaField
          label="Why are you reporting this?"
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          placeholder="Briefly describe the problem…"
          maxLength={500}
        />
      </Modal>
    </CommunityShell>
  );
}
