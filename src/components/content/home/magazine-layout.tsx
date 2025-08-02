"use client";
import { usePublishedPosts } from "@/hooks/usePosts";
import { StoryCard } from "../story-card";
import { Post } from "@/types";

export default function MagazineLayout() {
    const { data: allPosts = [], isLoading, error } = usePublishedPosts();
    
    // Get the latest 4 posts for the magazine layout
    const posts = allPosts
        .sort((a: Post, b: Post) => 
            new Date(b.publishedAt || b.updatedAt).getTime() - 
            new Date(a.publishedAt || a.updatedAt).getTime()
        )
        .slice(0, 4);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-3 space-y-6">
                        <div className="h-64 bg-gray-200 animate-pulse rounded-xs"></div>
                        <div className="h-64 bg-gray-200 animate-pulse rounded-xs"></div>
                    </div>
                    <div className="col-span-6">
                        <div className="h-80 bg-gray-200 animate-pulse rounded-xs"></div>
                    </div>
                    <div className="col-span-3">
                        <div className="h-64 bg-gray-200 animate-pulse rounded-xs"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || posts.length < 4) {
        return null; // Don't render if not enough posts
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-3 space-y-6">
                    <StoryCard post={posts[1]} />
                    <StoryCard post={posts[2]} />
                </div>
                <div className="col-span-6">
                    <StoryCard post={posts[0]} className="bg-white" />
                </div>
                <div className="col-span-3">
                    <StoryCard post={posts[3]} />
                </div>
            </div>
        </div>
    );
}