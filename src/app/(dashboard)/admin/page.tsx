"use client";

import { usePosts } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Eye,
  Edit3,
  PlusCircle,
  Clock,
  Tags,
} from "lucide-react";
import Link from "next/link";
import type { Post } from "@/types";

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function RecentPostRow({ post }: { post: Post }) {
  const date = post.publishedAt || post.draftedAt || post.updatedAt;
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 min-w-0 mr-4">
        <Link
          href={`/admin/edit/${post.slug}`}
          className="text-sm font-medium hover:underline truncate block"
        >
          {post.title}
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{post.author}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant={post.status === "published" ? "default" : "secondary"}
          className={`text-xs ${
            post.status === "published"
              ? "bg-green-600 text-white"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {post.status === "published" ? "Published" : "Draft"}
        </Badge>
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link href={`/admin/edit/${post.slug}?mode=edit`}>
            <Edit3 className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: posts = [], isLoading: postsLoading } = usePosts();
  const { data: categories = [], isLoading: catsLoading } = useCategories();

  if (postsLoading || catsLoading) return <DashboardSkeleton />;

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  const recentPosts = [...posts]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 7);

  const recentDrafts = posts
    .filter((p) => p.status === "draft")
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Content overview for UAV Helpline
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/create">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Posts"
          value={posts.length}
          icon={FileText}
        />
        <StatCard
          title="Published"
          value={published}
          icon={Eye}
          description="Live on site"
        />
        <StatCard
          title="Drafts"
          value={drafts}
          icon={Clock}
          description="Awaiting publish"
        />
        <StatCard
          title="Categories"
          value={categories.length}
          icon={Tags}
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent Posts */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Posts</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/posts">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No posts yet. Create your first one.
              </p>
            ) : (
              <div className="divide-y">
                {recentPosts.map((post) => (
                  <RecentPostRow key={post.id} post={post} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Drafts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Drafts to Finish</CardTitle>
          </CardHeader>
          <CardContent>
            {recentDrafts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No drafts. Nice work!
              </p>
            ) : (
              <div className="space-y-3">
                {recentDrafts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/admin/edit/${post.slug}?mode=edit`}
                    className="block group"
                  >
                    <div className="rounded-md border p-3 transition-colors hover:bg-accent">
                      <p className="text-sm font-medium group-hover:underline line-clamp-1">
                        {post.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last edited{" "}
                        {new Date(post.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
