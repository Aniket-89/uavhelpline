"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { User, Tag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { TipTapContent } from "@/lib/utils/tiptap-renderer";
import { StoryHero } from "@/components/content/story-hero";
import { calculateReadingTime } from "@/lib/utils";
import type { Post } from "@/types";

// Local storage utility functions
const getFromLocalStorage = (key: string, ttlMinutes: number = 5) => {
  if (typeof window === 'undefined') return null;
  
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    const now = new Date().getTime();
    const expiry = parsed.timestamp + (ttlMinutes * 60 * 1000);
    
    if (now > expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return parsed.data;
  } catch (error) {
    localStorage.removeItem(key);
    return null;
  }
};

const setInLocalStorage = (key: string, data: any) => {
  if (typeof window === 'undefined') return;
  
  try {
    const item = {
      data,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

// Fetch single published post with local storage caching
const usePublishedPost = (slug: string) => {
  return useQuery<Post>({
    queryKey: ["published-post", slug],
    queryFn: async () => {
      // Check local storage first
      const cacheKey = `post_${slug}`;
      const cachedPost = getFromLocalStorage(cacheKey);
      
      if (cachedPost) {
        console.log('Using cached post data');
        return cachedPost;
      }
      
      // Fetch from API if not in cache or expired
      const { data } = await axios.get(`/api/posts/${slug}`);
      
      // Only return if published
      if (data.status !== "published") {
        throw new Error("Story not found or not published");
      }
      
      // Store in local storage for 5 minutes
      setInLocalStorage(cacheKey, data);
      console.log('Post data cached locally');
      
      return data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

function StoryLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Hero skeleton */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <Skeleton className="h-10 w-32 mb-8" />
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2">
                <Skeleton className="h-12 md:h-16 lg:h-20 w-full mb-6" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="lg:col-span-1 space-y-4">
                <div>
                  <Skeleton className="h-4 w-12 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-full lg:w-20" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Featured image skeleton */}
        <div className="max-w-4xl mx-auto px-6 -mt-8">
          <Skeleton className="w-full aspect-[21/9] rounded-lg" />
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-6">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
          <Skeleton className="h-12 w-full" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Separator />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PostDetailPage() {
  const { slug } = useParams();
  const { data: post, isLoading, error } = usePublishedPost(slug as string);



  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: `Check out this drone story: ${post?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return <StoryLoading />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🚁</div>
          <h2 className="text-xl font-semibold mb-4">Story Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This drone story may have been moved or is no longer available.
          </p>
          <Link href="/stories">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Stories
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <StoryHero post={post} onShare={handleShare} />

      {/* Content */}
      <article className="max-w-screen-md mx-auto px-3 py-24">
        {!post.thumbnail && <Separator className="mb-8" />}

        {/* Story Content */}
        <div className="prose prose-lg max-w-none">
          <TipTapContent content={post.content} />
        </div>


        {/* Author Info
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">About {post.author}</h3>
              <p className="text-muted-foreground">
                Drone enthusiast and UAV expert sharing insights from years of experience 
                in aerial photography, commercial applications, and aviation technology.
              </p>
            </div>
          </div>
        </Card> */}

        {/* Navigation */}
        <div className="mt-12 text-center">
          <Link href="/stories">
            <Button size="lg" variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Explore More Stories
            </Button>
          </Link>
        </div>
      </article>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-16 mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Enjoyed This Story?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Subscribe to get the latest drone insights, UAV reviews, and aviation stories 
            delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="font-semibold">
              Subscribe to Updates
            </Button>
            <Button size="lg" variant="outline">
              Share Your Story
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}