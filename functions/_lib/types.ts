/// <reference types="@cloudflare/workers-types" />

/** Bindings and environment variables available to Pages Functions. */
export interface Env {
  DB: D1Database;
  /** R2 bucket for CMS uploads (optional until bucket is provisioned). */
  MEDIA?: R2Bucket;
  /** One-time bootstrap password for the initial admin (secret). */
  ADMIN_INITIAL_PASSWORD?: string;
  /** Session lifetime in days (string env var); defaults to 30. */
  SESSION_TTL_DAYS?: string;
}

export type Role = "user" | "moderator" | "admin";

/** Raw user row as stored in D1 (snake_case). Never sent to the client as-is. */
export interface UserRow {
  id: string;
  username: string;
  username_lower: string;
  email: string;
  email_lower: string;
  password_hash: string;
  display_name: string;
  bio: string;
  avatar: string | null;
  role: Role;
  profile_public: number;
  must_change_password: number;
  created_at: string;
  updated_at: string;
  disabled_at: string | null;
}

/**
 * The safe, minimal user shape returned to the browser. Never includes the
 * password hash, email of other users, or any secret material.
 */
export interface PublicUser {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string | null;
  role: Role;
  profilePublic: boolean;
  mustChangePassword: boolean;
  createdAt: string;
}

/** The authenticated user's own account (includes their private email). */
export interface SelfUser extends PublicUser {
  email: string;
  updatedAt: string;
}

export interface SessionRow {
  id: string;
  user_id: string;
  csrf_secret: string;
  created_at: string;
  expires_at: string;
  user_agent: string | null;
}

export interface AuthContext {
  user: UserRow;
  session: SessionRow;
}

/** Convert a stored user row into the account view for its owner. */
export function toSelfUser(row: UserRow): SelfUser {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    displayName: row.display_name,
    bio: row.bio,
    avatar: row.avatar,
    role: row.role,
    profilePublic: row.profile_public === 1,
    mustChangePassword: row.must_change_password === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Convert a stored user row into the public view shown to other users. */
export function toPublicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    bio: row.profile_public === 1 ? row.bio : "",
    avatar: row.avatar,
    role: row.role,
    profilePublic: row.profile_public === 1,
    mustChangePassword: row.must_change_password === 1,
    createdAt: row.created_at,
  };
}
