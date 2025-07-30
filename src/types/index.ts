// Post status enum
export type PostStatus = "draft" | "published";

// User roles
export type UserRole = "admin" | "author";

// Category
export interface Category {
  id: string;
  name: string;
  slug: string;
}

// Post
export interface Post {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  status: PostStatus;
  content: any; // Rich text format - can be Editor.js JSON, TipTap nodes, etc.
  author: string;
  categories: Category[];
  publishedAt?: string; // ISO string
  draftedAt?: string;
  updatedAt: string;
}

// Post-Category Mapping (optional, useful for SQL-type DBs)
export interface PostCategory {
  postId: string;
  categoryId: string;
}

// Comment
export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  parentId?: string;
  replies?: Comment[]; // Optional if fetched nested
  createdAt: string;
}
