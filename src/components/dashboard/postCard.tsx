"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Calendar, 
  Eye, 
  Edit3, 
  MoreHorizontal, 
  Trash2, 
  Tag,
  User,
  Clock,
  ExternalLink
} from "lucide-react";
import type { Post } from "@/types";
import Link from "next/link";
import { useState } from "react";
import { useUpdatePostStatus, useDeletePost } from "@/hooks/usePosts";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  const updatePostStatus = useUpdatePostStatus();
  const deletePost = useDeletePost();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getContentPreview = (content: any) => {
    if (!content) return "No content available";
    
    // Extract text from TipTap JSON content
    const extractText = (node: any): string => {
      if (node.type === 'text') return node.text || '';
      if (node.content) {
        return node.content.map(extractText).join('');
      }
      return '';
    };

    try {
      const text = extractText(content);
      return text.length > 150 ? text.substring(0, 150) + '...' : text;
    } catch {
      return "Content preview not available";
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) return;
    
    setIsDeleting(true);
    try {
      await deletePost.mutateAsync(post.slug);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusToggle = async () => {
    setIsUpdatingStatus(true);
    try {
      const newStatus = post.status === "published" ? "draft" : "published";
      await updatePostStatus.mutateAsync({
        slug: post.slug,
        status: newStatus
      });
    } catch (error) {
      console.error("Error updating post status:", error);
      alert("Failed to update post status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20 overflow-hidden">
      {/* Image Header with Overlay */}
      <div className="relative overflow-hidden">
        <div className="aspect-video relative">
          <img 
            src={post.thumbnail || '/general-img-landscape.png'} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge 
              variant={post.status === "published" ? "default" : "secondary"}
              className={`${
                post.status === "published" 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-orange-600 hover:bg-orange-700"
              } text-white shadow-sm`}
            >
              {post.status === "published" ? "Published" : "Draft"}
            </Badge>
          </div>

          {/* Quick Actions Overlay */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/edit/${post.slug}`} className="flex items-center">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/edit/${post.slug}?mode=edit`} className="flex items-center">
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleStatusToggle}
                  disabled={isUpdatingStatus}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {isUpdatingStatus 
                    ? "Updating..." 
                    : post.status === "published" 
                      ? "Unpublish" 
                      : "Publish"
                  }
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDelete} 
                  disabled={isDeleting}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight hover:text-primary transition-colors">
            <Link href={`/admin/edit/${post.slug}`}>
              {post.title}
            </Link>
          </CardTitle>
        </div>
        
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {post.categories.slice(0, 3).map((category) => (
              <Badge key={category.id} variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {category.name}
              </Badge>
            ))}
            {post.categories.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.categories.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <CardDescription className="text-sm leading-relaxed mb-4">
          {getContentPreview(post.content)}
        </CardDescription>

        {/* Author & Meta Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs">
                {post.author.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{post.author}</span>
          </div>
          
          <div className="flex items-center gap-4">
            {post.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
            )}
            {post.draftedAt && !post.publishedAt && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Draft from {formatDate(post.draftedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/admin/edit/${post.slug}`}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Link>
          </Button>
          <Button asChild size="sm" className="flex-1">
            <Link href={`/admin/edit/${post.slug}?mode=edit`}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}