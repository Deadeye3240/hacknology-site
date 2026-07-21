import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Modal } from "@/components/ui/Modal";
import { TextField, TextAreaField } from "@/components/ui/TextField";
import { EmptyState } from "@/components/ui/EmptyState";
import { LockIcon } from "@/components/ui/icons";
import { api, ApiError } from "@/lib/api";
import { formatDate, timeAgo } from "@/lib/date";
import { useAuth } from "@/context/AuthContext";
import { paths } from "@/routes/paths";
import type { DiscussionDetail, ReplyItem } from "@/types/forum";

type Action =
  | { kind: "delete-discussion" }
  | { kind: "delete-reply"; id: string }
  | { kind: "lock"; locked: boolean }
  | { kind: "report"; targetType: "discussion" | "reply"; targetId: string };

function RoleTag({ role }: { role: string }) {
  if (role === "user") return null;
  return <Badge variant="accent" className="capitalize">{role}</Badge>;
}

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
      <PageContainer className="py-20">
        <div className="flex items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-accent-400" />
        </div>
      </PageContainer>
    );
  }

  if (status === "notfound" || !detail) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          title="Discussion not found"
          description="This discussion may have been removed or never existed."
          action={<Button to={paths.forum}>Back to forum</Button>}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <Button to={paths.forum} variant="ghost" size="sm" className="self-start px-2">
          ← Back to forum
        </Button>

        {pageError && <Alert variant="error">{pageError}</Alert>}
        {notice && <Alert variant="success">{notice}</Alert>}

        {/* Discussion */}
        <Card className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral">{detail.categoryName}</Badge>
            {detail.locked && (
              <Badge variant="warning">
                <LockIcon className="text-xs" /> Locked
              </Badge>
            )}
          </div>

          {editingDiscussion ? (
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
                <Button type="button" variant="ghost" onClick={() => setEditingDiscussion(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white">{detail.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                <span className="font-medium text-slate-200">
                  {detail.author?.displayName ?? "Unknown"}
                </span>
                {detail.author && <RoleTag role={detail.author.role} />}
                <span aria-hidden>·</span>
                <span>{formatDate(detail.createdAt)}</span>
              </div>
              <p className="whitespace-pre-wrap text-pretty leading-relaxed text-slate-300">
                {detail.content}
              </p>
              <div className="flex flex-wrap gap-2 border-t border-white/5 pt-4">
                {detail.canEdit && (
                  <Button variant="secondary" size="sm" onClick={startEditDiscussion}>
                    Edit
                  </Button>
                )}
                {detail.canDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAction({ kind: "delete-discussion" })}
                  >
                    Delete
                  </Button>
                )}
                {detail.canModerate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAction({ kind: "lock", locked: !detail.locked })}
                  >
                    {detail.locked ? "Unlock" : "Lock"}
                  </Button>
                )}
                {isAuthenticated && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setAction({ kind: "report", targetType: "discussion", targetId: detail.id })
                    }
                  >
                    Report
                  </Button>
                )}
              </div>
            </>
          )}
        </Card>

        {/* Replies */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-white">
            {replies.length} {replies.length === 1 ? "reply" : "replies"}
          </h2>
          {replies.map((reply) => (
            <Card key={reply.id} className="flex flex-col gap-3 p-5">
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                <span className="font-medium text-slate-200">{reply.author.displayName}</span>
                <RoleTag role={reply.author.role} />
                <span aria-hidden>·</span>
                <span>{timeAgo(reply.createdAt)}</span>
              </div>

              {reply.removed ? (
                <p className="text-sm italic text-slate-500">[removed by a moderator]</p>
              ) : editingReplyId === reply.id ? (
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
              ) : (
                <>
                  <p className="whitespace-pre-wrap text-pretty leading-relaxed text-slate-300">
                    {reply.content}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {reply.canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingReplyId(reply.id);
                          setEditReplyContent(reply.content);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                    {reply.canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAction({ kind: "delete-reply", id: reply.id })}
                      >
                        Delete
                      </Button>
                    )}
                    {isAuthenticated && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setAction({ kind: "report", targetType: "reply", targetId: reply.id })
                        }
                      >
                        Report
                      </Button>
                    )}
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>

        {/* Reply composer */}
        {detail.locked ? (
          <Alert variant="info">This discussion is locked. New replies are disabled.</Alert>
        ) : isAuthenticated ? (
          <Card>
            <form onSubmit={submitReply} className="flex flex-col gap-3">
              {replyError && <Alert variant="error">{replyError}</Alert>}
              <TextAreaField
                label="Add a reply"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Share your thoughts…"
                maxLength={10000}
                required
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={posting}>
                  {posting ? "Posting…" : "Post reply"}
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <Alert variant="info">
            <Button to={paths.login} variant="ghost" size="sm" className="px-1">
              Sign in
            </Button>{" "}
            to join the discussion.
          </Alert>
        )}
      </div>

      {/* Action modals */}
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
            <Button variant="ghost" onClick={() => setAction(null)} disabled={actionBusy}>
              Cancel
            </Button>
            <Button onClick={runAction} disabled={actionBusy}>
              {actionBusy ? "Working…" : "Confirm"}
            </Button>
          </>
        }
      >
        {actionError && <Alert variant="error" className="mb-3">{actionError}</Alert>}
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
              onClick={() => {
                setAction(null);
                setReportReason("");
              }}
              disabled={actionBusy}
            >
              Cancel
            </Button>
            <Button onClick={runAction} disabled={actionBusy || reportReason.trim().length === 0}>
              {actionBusy ? "Submitting…" : "Submit report"}
            </Button>
          </>
        }
      >
        {actionError && <Alert variant="error" className="mb-3">{actionError}</Alert>}
        <TextAreaField
          label="Why are you reporting this?"
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          placeholder="Briefly describe the problem…"
          maxLength={500}
        />
      </Modal>
    </PageContainer>
  );
}
