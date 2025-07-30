"use client";
import { usePosts } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import type { Post } from "@/types";
import PostCard from "./postCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// Removed select imports to avoid module resolution issues
import { 
  Search, 
  Plus, 
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

export default function PostList() {
  const { data: posts = [], isLoading, error } = usePosts();
  const { data: categories = [] } = useCategories();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post: Post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || post.status === statusFilter;
      
      const matchesCategory = categoryFilter === "all" || 
                            post.categories?.some(cat => cat.id === categoryFilter);

      return matchesSearch && matchesStatus && matchesCategory;
    }).sort((a: Post, b: Post) => {
      const dateA = new Date(a.publishedAt || a.draftedAt || a.updatedAt);
      const dateB = new Date(b.publishedAt || b.draftedAt || b.updatedAt);
      
      return sortOrder === "desc" 
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });
  }, [posts, searchTerm, statusFilter, categoryFilter, sortOrder]);

  // Post actions are now handled directly in PostCard component

  // Loading is now handled by loading.tsx file
  if (isLoading) {
    return null; // Loading UI is handled by Next.js loading.tsx
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center text-red-600">
          <p>Error loading posts. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your blog posts and content
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search posts by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-9 w-[140px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          {/* Category Filter */}
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 w-[160px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          >
            {sortOrder === "desc" ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
          </Button>
          
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>Total: {posts.length}</span>
        <span>•</span>
        <span>Published: {posts.filter((p: Post) => p.status === "published").length}</span>
        <span>•</span>
        <span>Drafts: {posts.filter((p: Post) => p.status === "draft").length}</span>
        {filteredPosts.length !== posts.length && (
          <>
            <span>•</span>
            <span>Filtered: {filteredPosts.length}</span>
          </>
        )}
      </div>

      {/* Posts Grid/List */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {posts.length === 0 ? (
              <>
                <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                <p>Create your first post to get started.</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-2">No posts match your filters</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </>
            )}
          </div>
          {posts.length === 0 && (
            <Button asChild>
              <Link href="/admin/posts/create">
                <Plus className="w-4 h-4 mr-2" />
                Create First Post
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
        }>
          {filteredPosts.map((post: Post) => (
            <PostCard 
              key={post.id} 
              post={post} 
            />
          ))}
        </div>
      )}
    </div>
  );
}