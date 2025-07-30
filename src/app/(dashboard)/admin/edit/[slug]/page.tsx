"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { usePost, useUpdatePost, useDeletePost, useUpdatePostStatus } from "@/hooks/usePosts";
import CategorySelector from "@/components/CategorySelector";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import TiptapEditor from "@/components/dashboard/tiptap";
import { TipTapContent } from "@/lib/utils/tiptap-renderer";
import { 
  ArrowLeft, 
  Eye, 
  Edit3, 
  Save, 
  Trash2, 
  Calendar,
  User,
  Tag,
  Globe,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import type { Post, PostStatus } from "@/types";

export default function EditPost() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode') || 'preview';
  
  const { data: post, isLoading, error } = usePost(slug as string);
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  const updatePostStatus = useUpdatePostStatus();
  
  // Edit form state
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [title, setTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [status, setStatus] = useState<PostStatus>("draft");
  const [content, setContent] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [author, setAuthor] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Initialize form when post loads
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setEditSlug(post.slug);
      setStatus(post.status);
      setContent(post.content);
      setSelectedCategories(post.categories?.map(cat => cat.id) || []);
      setAuthor(post.author);
    }
  }, [post]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };



  const handleSave = async () => {
    setIsSaving(true);
    try {
      const postData = {
        title: title.trim(),
        slug: editSlug,
        status,
        content,
        author,
        categoryIds: selectedCategories
      };

      await updatePost.mutateAsync({ 
        slug: slug as string, 
        postData 
      });
      
      alert("Post saved successfully!");
      
      // If slug changed, redirect to new URL
      if (editSlug !== slug) {
        router.push(`/admin/edit/${editSlug}`);
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost.mutateAsync(slug as string);
      alert("Post deleted successfully!");
      router.push('/admin/posts');
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handlePublishToggle = async () => {
    setIsPublishing(true);
    try {
      const newStatus = post?.status === "published" ? "draft" : "published";
      await updatePostStatus.mutateAsync({
        slug: slug as string,
        status: newStatus
      });
    } catch (error) {
      console.error("Error updating post status:", error);
      alert("Failed to update post status. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="aspect-video bg-gray-200 rounded"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-6 py-8 text-center">
        <div className="text-red-600 mb-4">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Post Not Found</h2>
          <p>The post you're looking for doesn't exist or couldn't be loaded.</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Posts
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/posts">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Posts
            </Link>
          </Button>
          {/* <div>
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author}
              </div>
              {post.publishedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Published {formatDate(post.publishedAt)}
                </div>
              )}
              {post.draftedAt && !post.publishedAt && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Draft from {formatDate(post.draftedAt)}
                </div>
              )}
            </div>
          </div> */}
        </div>

        <div className="flex items-center gap-2">
          <Badge 
            variant={post.status === "published" ? "default" : "secondary"}
            className={`${
              post.status === "published" 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-orange-600 hover:bg-orange-700"
            } text-white`}
          >
            {post.status === "published" ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <Clock className="w-3 h-3 mr-1" />
            )}
            {post.status === "published" ? "Published" : "Draft"}
          </Badge>

          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </>
            )}
          </Button>

          {isEditing && (
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          )}

          <Button
            onClick={handlePublishToggle}
            disabled={isPublishing}
            variant={post?.status === "published" ? "outline" : "default"}
            size="sm"
            className={post?.status === "published" ? "" : "bg-green-600 hover:bg-green-700"}
          >
            {isPublishing ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : post?.status === "published" ? (
              <>
                <Clock className="w-4 h-4 mr-2" />
                Unpublish
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Publish Now
              </>
            )}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Post</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{post.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {isEditing ? (
            /* Edit Mode */
            <Card>
              <CardHeader>
                <CardTitle>Edit Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post title..."
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium mb-2">Slug</label>
                  <Input
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                    placeholder="post-slug"
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium mb-2">Author</label>
                  <Input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author name..."
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={status === "draft"}
                        onChange={(e) => setStatus(e.target.value as PostStatus)}
                        className="mr-2"
                      />
                      Draft
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="published"
                        checked={status === "published"}
                        onChange={(e) => setStatus(e.target.value as PostStatus)}
                        className="mr-2"
                      />
                      Published
                    </label>
                  </div>
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <TiptapEditor 
                    onChange={setContent}
                    initialContent={content}
                    placeholder="Edit your UAV/drone content here..."
                    characterLimit={15000}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Preview Mode */
            <div className="space-y-6">
              {/* Featured Image */}
              {post.thumbnail && (
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <img 
                    src={post.thumbnail} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

          <div>
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author}
              </div>
              {post.publishedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Published {formatDate(post.publishedAt)}
                </div>
              )}
              {post.draftedAt && !post.publishedAt && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Draft from {formatDate(post.draftedAt)}
                </div>
              )}
            </div>
          </div>

              {/* Content */}
              <Card>
                <CardContent className="pt-6">
                  <TipTapContent content={post.content} />
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <CategorySelector
                  selectedCategories={selectedCategories}
                  onCategoryToggle={handleCategoryToggle}
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {post.categories && post.categories.length > 0 ? (
                    post.categories.map((category) => (
                      <Badge key={category.id} variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {category.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No categories</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Publishing Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Publishing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge 
                  variant={post.status === "published" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {post.status}
                </Badge>
              </div>
              
              {post.publishedAt && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Published:</span>
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Modified:</span>
                <span>{formatDate(post.updatedAt)}</span>
              </div>

              <Separator />

              <div className="flex items-center gap-2 text-sm">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xs">
                    {post.author.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.author}</p>
                  <p className="text-muted-foreground text-xs">Author</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {!isEditing && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button size="sm" className="w-full" onClick={() => setIsEditing(true)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Post
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={handlePublishToggle}
                  disabled={isPublishing}
                >
                  {post.status === "published" ? (
                    <>
                      <Clock className="w-4 h-4 mr-2" />
                      {isPublishing ? "Unpublishing..." : "Unpublish"}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {isPublishing ? "Publishing..." : "Publish Now"}
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/posts/${post.slug}`} target="_blank">
                    <Globe className="w-4 h-4 mr-2" />
                    View Live
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}