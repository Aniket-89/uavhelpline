"use client";
import { usePublishedPosts } from "@/hooks/usePosts";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, TrendingUp } from "lucide-react";
import type { Post } from "@/types";
import { StoryCard } from "../story-card";

// No custom hook needed - using existing usePublishedPosts

// Loading Component
function HeroLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Mobile Loading */}
      <div className="block lg:hidden space-y-6">
        <Card className="overflow-hidden rounded-xs">
          <Skeleton className="aspect-[16/10] w-full rounded-xs" />
          <div className="p-4">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </Card>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden rounded-xs">
            <Skeleton className="aspect-[16/10] w-full rounded-xs" />
            <div className="p-4">
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </Card>
        ))}
      </div>

      {/* Tablet Loading */}
      <div className="hidden lg:block xl:hidden">
        <div className="grid grid-cols-2 gap-6">
          <Card className="overflow-hidden rounded-xs">
            <Skeleton className="aspect-[16/10] w-full rounded-xs" />
            <div className="p-4">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </Card>
          <div className="space-y-4">
            <Skeleton className="h-6 w-32 mb-4" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Loading */}
      <div className="hidden xl:block">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3 space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-4">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </div>
          <div className="col-span-6">
            <Card className="overflow-hidden rounded-xs">
              <Skeleton className="aspect-[16/10] w-full rounded-xs" />
              <div className="p-4">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </Card>
          </div>
          <div className="col-span-3 space-y-4">
            <Skeleton className="h-4 w-20 mb-4" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-2">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const { data: allPosts = [], isLoading, error } = usePublishedPosts();
  
  // Sort by date and get latest 7 posts
  const posts = allPosts
    .sort((a: Post, b: Post) => 
      new Date(b.publishedAt || b.updatedAt).getTime() - 
      new Date(a.publishedAt || a.updatedAt).getTime()
    )
    .slice(0, 7);
  
  if (isLoading) {
    return (
      <section className="border-b border-gray-200 bg-white">
        <HeroLoading />
      </section>
    );
  }

  if (error || posts.length === 0) {
    return (
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
          <div className="text-6xl mb-4">🚁</div>
          <h2 className="text-2xl font-bold mb-4">No Stories Available</h2>
          <p className="text-gray-600">Check back soon for the latest drone insights and UAV stories.</p>
        </div>
      </section>
    );
  }

  const [featuredPost, ...sidePosts] = posts;

  return (
    <section className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Mobile Layout: Single Column */}
        <div className="block lg:hidden space-y-6">
          {/* Featured Story on Mobile */}
          <div className="mb-8">
            <StoryCard post={featuredPost} />
          </div>
          
          {/* Side Stories on Mobile */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">More Stories</h2>
            {sidePosts.slice(0, 3).map((post: Post) => (
              <StoryCard key={post.id} post={post} className="mb-4" />
            ))}
          </div>
        </div>

        {/* Tablet Layout: 2 Column */}
        <div className="hidden lg:block xl:hidden">
          <div className="grid grid-cols-2 gap-6">
            {/* Featured Story takes left column */}
            <div className="col-span-1">
              <StoryCard post={featuredPost} />
            </div>
            
            {/* Side stories in right column */}
            <div className="col-span-1 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Trending Stories</h2>
              {sidePosts.slice(0, 3).map((post: Post) => (
                <StoryCard key={post.id} post={post} skipImage={true} className="mb-4" />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Layout: 4 Column Grid */}
        <div className="hidden xl:block">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column: Two smaller stories */}
            <div className="col-span-3 space-y-6">
              {sidePosts.slice(0, 2).map((post: Post) => (
                <StoryCard key={post.id} post={post} skipImage={false} />
              ))}
            </div>

            {/* Center: Large featured story */}
            <div className="col-span-6">
              <StoryCard post={featuredPost}  className="bg-white"/>
            </div>  

            {/* Right Column: Three smaller stories */}
            <div className="col-span-3 space-y-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending
              </h3>
              {sidePosts.slice(2, 5).map((post: Post) => (
                <StoryCard key={post.id} post={post} skipImage={true} />
              ))}
            </div>
        </div>

          {/* Bottom Row: Additional stories on large screens */}
          {sidePosts.length > 5 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-6">
                {sidePosts.slice(5, 8).map((post: Post) => (
                  <StoryCard key={post.id} post={post} />
                ))}
              </div>
          </div>
        )}
        </div>

        {/* View All Stories Link */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <Link 
            href="/stories" 
            className="inline-flex items-center gap-1 sm:gap-2 text-red-500 hover:text-red-600 font-semibold transition-colors text-sm sm:text-base"
          >
            View All Stories
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}