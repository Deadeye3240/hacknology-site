import type { Role } from "@/types/auth";

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  position: number;
}

export interface DiscussionListItem {
  id: string;
  category_id: string;
  category_name: string;
  category_slug: string;
  title: string;
  locked: number;
  created_at: string;
  updated_at: string;
  author_username: string;
  author_display_name: string;
  reply_count: number;
}

export interface DiscussionAuthor {
  username: string;
  displayName: string;
  role: Role;
}

export interface DiscussionDetail {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  content: string;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
  author: DiscussionAuthor | null;
  canEdit: boolean;
  canDelete: boolean;
  canModerate: boolean;
}

export interface ReplyItem {
  id: string;
  content: string;
  removed: boolean;
  createdAt: string;
  updatedAt: string;
  author: { username: string; displayName: string; role: Role };
  canEdit: boolean;
  canDelete: boolean;
}
