"use client";
import { usePublishedPosts } from "@/hooks/usePosts";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, TrendingUp } from "lucide-react";
import type { Post } from "@/types";
import { StoryCard } from "../story-card";
import DividerLink from "../divider-link";

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
    <section className="border-b border-border  my-32 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:py-16">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 flex flex-col gap-4">
          <StoryCard post={sidePosts[0]} skipImage={true}  className="h-[120px] p-2"/>
          <hr />
          <StoryCard post={sidePosts[1]} skipImage={false} />
        </div>
        <div className="col-span-6">
          <div className="space-y-4">
            <StoryCard post={featuredPost} className="max-w-full -mt-24 bg-white h-fit"/>
          </div>
        </div>
        <div className="col-span-3">
            {/* <SubscriberComments /> */}
          </div>
        </div>
      </div>
    </section>
  );
}