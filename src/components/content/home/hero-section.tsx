"use client";
import { usePublishedPosts } from "@/hooks/usePosts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Post } from "@/types";
import { StoryCard } from "../story-card";
import DividerLink from "../divider-link";
import { SubscriberComments } from "../subscriber-comments";

// No custom hook needed - using existing usePublishedPosts

// Loading Component
function HeroLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Mobile Loading */}
      <div className="block lg:hidden space-y-6">
        {/* Featured Post Loading - First on mobile */}
        <div className="space-y-4">
          <Card className="overflow-hidden rounded-xs">
            <Skeleton className="aspect-[16/10] w-full rounded-xs" />
            <div className="p-4">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </Card>
          <div className="p-4">
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
        
        {/* Side Posts Loading - Second on mobile */}
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i}>
              <Card className="overflow-hidden rounded-xs">
                <Skeleton className="aspect-[16/10] w-full rounded-xs" />
                <div className="p-4">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </Card>
            </div>
          ))}
        </div>
        
        {/* Subscriber Comments Loading - Last on mobile */}
        <div className="p-4">
          <Skeleton className="h-32 w-full rounded-xs" />
        </div>
      </div>

      {/* Desktop Loading */}
      <div className="hidden lg:block">
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
            <Skeleton className="h-32 w-full rounded-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const { data: allPosts = [], isLoading, error } = usePublishedPosts();
  
  // Sort by date and get latest posts
  const posts = allPosts
    .sort((a: Post, b: Post) => 
      new Date(b.publishedAt || b.updatedAt).getTime() - 
      new Date(a.publishedAt || a.updatedAt).getTime()
    )
    .slice(0, 6);
  
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
    <section className="lg:mt-32 mt-12 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:py-16">
        
        {/* Mobile Layout - Stacked */}
        <div className="block lg:hidden space-y-6">
          {/* Featured Post - First on mobile */}
          <div className="space-y-4">
            <StoryCard post={featuredPost} showCategories={false} showMetaInfo={true} showPreview={true} isBig={true} contentClassName="text-left px-4 pb-2" />
            <hr />
            <StoryCard post={sidePosts[1]} skipImage={true} showCategories={false} showMetaInfo={true} showPreview={true} isBig={true} contentClassName="px-0" className="bg-transparent w-full" />
          </div>
          
          {/* Side Posts - Second on mobile */}
          <div className="space-y-4 p-0">
            <StoryCard post={sidePosts[0]} skipImage={true} showCategories={false} showMetaInfo={true} showPreview={true} contentClassName="p-0" />
            <hr />
            <StoryCard post={sidePosts[2] || sidePosts[0]} skipImage={false} showCategories={false} showMetaInfo={true} showPreview={true} contentClassName="p-0" />
          </div>
          
          {/* Subscriber Comments - Last on mobile */}
          <div>
            <SubscriberComments />
          </div>
        </div>

        {/* Desktop Layout - Grid */}
        <div className="hidden lg:grid grid-cols-12 gap-6">
          <div className="col-span-3 flex flex-col gap-4">
            <StoryCard post={sidePosts[0]} skipImage={true} showCategories={false} showMetaInfo={true} showPreview={true} className=" p-2" />
            <hr />
            <StoryCard post={sidePosts[2] || sidePosts[0]} skipImage={false} showCategories={false} showMetaInfo={true} showPreview={true} className="p-2" />
          </div>
          <div className="col-span-6">
            <div className="space-y-4">
              <StoryCard post={featuredPost} showCategories={false} showMetaInfo={true} showPreview={true} isBig={true} contentClassName="text-left px-8 pb-2" className="-mt-24"/>
              <hr />
              <StoryCard post={sidePosts[1]} skipImage={true} showCategories={false} showMetaInfo={true} showPreview={true} isBig={true} contentClassName="px-0" className="bg-transparent w-full" />
            </div>
          </div>
          <div className="col-span-3">
            <SubscriberComments />
          </div>
        </div>
      </div>
    </section>
  );
}