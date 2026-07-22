/// <reference types="@cloudflare/workers-types" />
import type { Env } from "./types";
import { CmsDb } from "./cms-db";

const SITE_NAME = "Hacknology";
const SITE_URL = "https://hacknology.xyz";

/** Embed colors (Discord decimal). */
export const DiscordColor = {
  brand: 0x34d399,
  forum: 0x5865f2,
  reply: 0x38bdf8,
  signup: 0x22c55e,
  lesson: 0xf59e0b,
  admin: 0xa855f7,
  test: 0x64748b,
} as const;

export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  author?: { name: string; url?: string; icon_url?: string };
  footer?: { text: string; icon_url?: string };
  timestamp?: string;
  fields?: { name: string; value: string; inline?: boolean }[];
}

export interface DiscordWebhookPayload {
  content?: string;
  username?: string;
  avatar_url?: string;
  embeds?: DiscordEmbed[];
}

type DiscordContext = { waitUntil?: (promise: Promise<unknown>) => void } | undefined;

export interface DiscordPersona {
  username: string;
  avatarUrl: string | null;
}

export interface DiscordNotificationSettings {
  forum: boolean;
  signups: boolean;
  lessons: boolean;
}

const SETTING_WEBHOOK_URL = "discord.webhook.url";
const SETTING_USERNAME = "discord.webhook.username";
const SETTING_AVATAR = "discord.webhook.avatar_url";
const SETTING_NOTIFY_FORUM = "discord.notify.forum";
const SETTING_NOTIFY_SIGNUPS = "discord.notify.signups";
const SETTING_NOTIFY_LESSONS = "discord.notify.lessons";

const DISCORD_WEBHOOK_URL_PATTERN =
  /^https:\/\/(?:discord\.com|discordapp\.com)\/api\/webhooks\/\d+\/[\w-]+(?:\?.*)?$/i;

const DEFAULT_PERSONA: DiscordPersona = {
  username: `${SITE_NAME} Bot`,
  avatarUrl: null,
};

const DEFAULT_NOTIFICATIONS: DiscordNotificationSettings = {
  forum: true,
  signups: true,
  lessons: false,
};

function truncate(text: string, max: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

function brandFooter(): DiscordEmbed["footer"] {
  return { text: SITE_NAME, icon_url: `${SITE_URL}/favicon.ico` };
}

function brandAuthor(name: string, url?: string): DiscordEmbed["author"] {
  return { name: truncate(name, 256), url, icon_url: `${SITE_URL}/favicon.ico` };
}

function isTruthySetting(value: string | null, defaultValue: boolean): boolean {
  if (value === null) return defaultValue;
  return value === "1" || value.toLowerCase() === "true";
}

export function isValidDiscordWebhookUrl(url: string): boolean {
  return DISCORD_WEBHOOK_URL_PATTERN.test(url.trim());
}

/** Prefer Cloudflare secret; fall back to admin-saved URL in site settings. */
export async function getDiscordWebhookUrl(env: Env, db: D1Database): Promise<string | null> {
  const fromEnv = env.DISCORD_WEBHOOK_URL?.trim();
  if (fromEnv) return fromEnv;
  const fromDb = (await new CmsDb(db).getSetting(SETTING_WEBHOOK_URL))?.trim();
  return fromDb && isValidDiscordWebhookUrl(fromDb) ? fromDb : null;
}

export async function isDiscordConfigured(env: Env, db: D1Database): Promise<boolean> {
  return Boolean(await getDiscordWebhookUrl(env, db));
}

export async function getDiscordWebhookStatus(
  env: Env,
  db: D1Database,
): Promise<{
  configured: boolean;
  webhookUrl: string | null;
  webhookSource: "env" | "database" | null;
}> {
  const fromEnv = env.DISCORD_WEBHOOK_URL?.trim();
  if (fromEnv) {
    return { configured: true, webhookUrl: null, webhookSource: "env" };
  }
  const fromDb = (await new CmsDb(db).getSetting(SETTING_WEBHOOK_URL))?.trim() ?? null;
  if (fromDb && isValidDiscordWebhookUrl(fromDb)) {
    return { configured: true, webhookUrl: fromDb, webhookSource: "database" };
  }
  return { configured: false, webhookUrl: fromDb, webhookSource: null };
}

export async function getDiscordPersonaOverrides(db: D1Database): Promise<Partial<DiscordPersona>> {
  const cms = new CmsDb(db);
  const username = (await cms.getSetting(SETTING_USERNAME))?.trim();
  const avatarUrl = (await cms.getSetting(SETTING_AVATAR))?.trim();
  const overrides: Partial<DiscordPersona> = {};
  if (username) overrides.username = username;
  if (avatarUrl) overrides.avatarUrl = avatarUrl;
  return overrides;
}

/** Persona for admin UI display (includes friendly defaults). */
export async function getDiscordPersona(db: D1Database): Promise<DiscordPersona> {
  const overrides = await getDiscordPersonaOverrides(db);
  return {
    username: overrides.username || DEFAULT_PERSONA.username,
    avatarUrl: overrides.avatarUrl ?? null,
  };
}

export async function getDiscordNotificationSettings(
  db: D1Database,
): Promise<DiscordNotificationSettings> {
  const cms = new CmsDb(db);
  const [forum, signups, lessons] = await Promise.all([
    cms.getSetting(SETTING_NOTIFY_FORUM),
    cms.getSetting(SETTING_NOTIFY_SIGNUPS),
    cms.getSetting(SETTING_NOTIFY_LESSONS),
  ]);
  return {
    forum: isTruthySetting(forum, DEFAULT_NOTIFICATIONS.forum),
    signups: isTruthySetting(signups, DEFAULT_NOTIFICATIONS.signups),
    lessons: isTruthySetting(lessons, DEFAULT_NOTIFICATIONS.lessons),
  };
}

export const DISCORD_SETTING_KEYS = {
  webhookUrl: SETTING_WEBHOOK_URL,
  username: SETTING_USERNAME,
  avatarUrl: SETTING_AVATAR,
  notifyForum: SETTING_NOTIFY_FORUM,
  notifySignups: SETTING_NOTIFY_SIGNUPS,
  notifyLessons: SETTING_NOTIFY_LESSONS,
} as const;

export function parseEmbedColor(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.min(0xffffff, Math.floor(value)));
  }
  if (typeof value !== "string") return undefined;
  const raw = value.trim();
  if (!raw) return undefined;
  const hex = raw.startsWith("#") ? raw.slice(1) : raw.startsWith("0x") ? raw.slice(2) : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return undefined;
  return parseInt(hex, 16);
}

/** Run Discord work without blocking the main response when possible. */
export function scheduleDiscord(ctx: DiscordContext, promise: Promise<unknown>): void {
  if (ctx?.waitUntil) {
    ctx.waitUntil(promise);
    return;
  }
  void promise.catch(() => {});
}

/** POST to the configured Discord webhook. Returns false when skipped or failed. */
export async function sendDiscordWebhook(
  env: Env,
  db: D1Database,
  payload: DiscordWebhookPayload,
  persona?: Partial<DiscordPersona>,
): Promise<boolean> {
  const url = await getDiscordWebhookUrl(env, db);
  if (!url) return false;

  const body: DiscordWebhookPayload = { ...payload };
  // Only override Discord's webhook name/avatar when explicitly configured in admin.
  // Otherwise Discord uses the avatar and name set on the webhook in channel settings.
  const username = persona?.username?.trim();
  const avatarUrl = persona?.avatarUrl?.trim();
  if (username) body.username = truncate(username, 80);
  else delete body.username;
  if (avatarUrl) body.avatar_url = avatarUrl;
  else delete body.avatar_url;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendDiscordEmbed(
  env: Env,
  db: D1Database,
  embed: DiscordEmbed,
  options?: {
    content?: string;
    color?: number;
    persona?: Partial<DiscordPersona>;
  },
): Promise<boolean> {
  const persona = { ...(await getDiscordPersonaOverrides(db)), ...options?.persona };
  const payload: DiscordWebhookPayload = {
    embeds: [
      {
        ...embed,
        color: embed.color ?? options?.color ?? DiscordColor.brand,
        footer: embed.footer ?? brandFooter(),
        timestamp: embed.timestamp ?? new Date().toISOString(),
      },
    ],
  };
  if (options?.content) payload.content = truncate(options.content, 2000);
  return sendDiscordWebhook(env, db, payload, persona);
}

async function shouldNotify(
  env: Env,
  db: D1Database,
  kind: keyof DiscordNotificationSettings,
): Promise<boolean> {
  if (!(await isDiscordConfigured(env, db))) return false;
  const settings = await getDiscordNotificationSettings(db);
  return settings[kind];
}

export async function notifyNewForumDiscussion(
  env: Env,
  db: D1Database,
  ctx: DiscordContext,
  input: {
    discussionId: string;
    title: string;
    content: string;
    categoryName: string;
    authorUsername: string;
  },
): Promise<void> {
  scheduleDiscord(
    ctx,
    (async () => {
      if (!(await shouldNotify(env, db, "forum"))) return;
      await sendDiscordEmbed(env, db, {
        title: "New forum discussion",
        url: `${SITE_URL}/forum/${input.discussionId}`,
        color: DiscordColor.forum,
        author: brandAuthor(input.authorUsername),
        description: truncate(`**${input.title}**\n\n${input.content}`, 4000),
        fields: [{ name: "Category", value: input.categoryName, inline: true }],
      });
    })(),
  );
}

export async function notifyNewForumReply(
  env: Env,
  db: D1Database,
  ctx: DiscordContext,
  input: {
    discussionId: string;
    discussionTitle: string;
    replyId: string;
    content: string;
    authorUsername: string;
  },
): Promise<void> {
  scheduleDiscord(
    ctx,
    (async () => {
      if (!(await shouldNotify(env, db, "forum"))) return;
      await sendDiscordEmbed(env, db, {
        title: "New forum reply",
        url: `${SITE_URL}/forum/${input.discussionId}`,
        color: DiscordColor.reply,
        author: brandAuthor(input.authorUsername),
        description: truncate(input.content, 4000),
        fields: [
          { name: "Discussion", value: truncate(input.discussionTitle, 256), inline: false },
        ],
      });
    })(),
  );
}

export async function notifyNewUserSignup(
  env: Env,
  db: D1Database,
  ctx: DiscordContext,
  input: { username: string; userId: string },
): Promise<void> {
  scheduleDiscord(
    ctx,
    (async () => {
      if (!(await shouldNotify(env, db, "signups"))) return;
      await sendDiscordEmbed(env, db, {
        title: "New member joined",
        color: DiscordColor.signup,
        author: brandAuthor(input.username),
        description: `@${input.username} created an account on ${SITE_NAME}.`,
        fields: [{ name: "User ID", value: input.userId, inline: true }],
      });
    })(),
  );
}

export async function notifyLessonCompleted(
  env: Env,
  db: D1Database,
  ctx: DiscordContext,
  input: { username: string; lessonId: string },
): Promise<void> {
  scheduleDiscord(
    ctx,
    (async () => {
      if (!(await shouldNotify(env, db, "lessons"))) return;
      await sendDiscordEmbed(env, db, {
        title: "Lesson completed",
        url: `${SITE_URL}/lessons`,
        color: DiscordColor.lesson,
        author: brandAuthor(input.username),
        description: `@${input.username} completed a lesson.`,
        fields: [{ name: "Lesson", value: input.lessonId, inline: true }],
      });
    })(),
  );
}

export async function notifySupportRequest(
  env: Env,
  db: D1Database,
  ctx: DiscordContext,
  input: {
    id: string;
    name: string;
    email: string;
    subject: string;
    messagePreview: string;
  },
): Promise<void> {
  scheduleDiscord(
    ctx,
    (async () => {
      if (!(await isDiscordConfigured(env, db))) return;
      await sendDiscordEmbed(env, db, {
        title: "New support message",
        url: `${SITE_URL}/admin/support`,
        color: DiscordColor.admin,
        author: brandAuthor(input.name),
        description: truncate(input.messagePreview, 4000),
        fields: [
          { name: "Subject", value: truncate(input.subject, 256), inline: false },
          { name: "Email", value: truncate(input.email, 256), inline: true },
          { name: "Message ID", value: input.id, inline: true },
        ],
      });
    })(),
  );
}

export async function sendDiscordTest(
  env: Env,
  db: D1Database,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isDiscordConfigured(env, db))) {
    return { ok: false, error: "Discord webhook URL is not configured." };
  }
  const ok = await sendDiscordEmbed(env, db, {
    title: "Webhook test successful",
    description: `${SITE_NAME} admin panel connected to this channel.`,
    color: DiscordColor.test,
  });
  return ok ? { ok: true } : { ok: false, error: "Discord rejected the webhook request." };
}

export async function sendDiscordAdminMessage(
  env: Env,
  db: D1Database,
  input: {
    content?: string;
    embedTitle?: string;
    embedDescription?: string;
    embedColor?: number;
    username?: string;
    avatarUrl?: string;
  },
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isDiscordConfigured(env, db))) {
    return { ok: false, error: "Discord webhook URL is not configured." };
  }

  const content = input.content ? truncate(input.content, 2000) : undefined;
  const embedTitle = input.embedTitle ? truncate(input.embedTitle, 256) : undefined;
  const embedDescription = input.embedDescription
    ? truncate(input.embedDescription, 4000)
    : undefined;

  if (!content && !embedTitle && !embedDescription) {
    return { ok: false, error: "Provide message text or embed title/description." };
  }

  const persona: Partial<DiscordPersona> = {
    ...(await getDiscordPersonaOverrides(db)),
    ...(input.username?.trim() ? { username: truncate(input.username, 80) } : {}),
    ...(input.avatarUrl?.trim() ? { avatarUrl: input.avatarUrl.trim() } : {}),
  };

  const payload: DiscordWebhookPayload = {};
  if (content) payload.content = content;

  if (embedTitle || embedDescription) {
    payload.embeds = [
      {
        title: embedTitle,
        description: embedDescription,
        color: input.embedColor ?? DiscordColor.admin,
        footer: brandFooter(),
        timestamp: new Date().toISOString(),
      },
    ];
  }

  const ok = await sendDiscordWebhook(env, db, payload, persona);
  return ok ? { ok: true } : { ok: false, error: "Discord rejected the webhook request." };
}
