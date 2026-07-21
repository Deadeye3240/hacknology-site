/** Shared auth/user shapes mirrored from the server's safe response types. */

export type Role = "user" | "moderator" | "admin";

/** The authenticated user's own account (never includes secrets). */
export interface SelfUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  avatar: string | null;
  role: Role;
  profilePublic: boolean;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
}
