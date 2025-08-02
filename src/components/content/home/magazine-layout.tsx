"use client";
import { usePublishedPosts } from "@/hooks/usePosts";
import { StoryCard } from "../story-card";
import { Post } from "@/types";
import DividerLink from "../divider-link";

export default function MagazineLayout({title}: {title: string}) {
    const { data: allPosts = [], isLoading, error } = usePublishedPosts();
    
    // Get the latest 5 posts for the magazine layout (with optional 5th post)
    const posts = allPosts
        .sort((a: Post, b: Post) => 
            new Date(b.publishedAt || b.updatedAt).getTime() - 
            new Date(a.publishedAt || a.updatedAt).getTime()
        )
        .slice(0, 5);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Mobile Loading */}
                <div className="block lg:hidden space-y-6">
                    <div className="h-6 bg-gray-200 animate-pulse rounded-xs w-32 mb-4"></div>
                    {/* Featured Post Loading - First on mobile */}
                    <div className="h-80 bg-gray-200 animate-pulse rounded-xs"></div>
                    {/* Side Posts Loading - Second on mobile */}
                    <div className="space-y-4">
                        <div className="h-32 bg-gray-200 animate-pulse rounded-xs"></div>
                        <div className="h-64 bg-gray-200 animate-pulse rounded-xs"></div>
                        <div className="h-32 bg-gray-200 animate-pulse rounded-xs"></div>
                    </div>
                </div>

                {/* Desktop Loading */}
                <div className="hidden lg:block">
                    <div className="h-6 bg-gray-200 animate-pulse rounded-xs w-32 mb-4"></div>
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
            </div>
        );
    }

    if (error || posts.length < 4) {
        return null; // Don't render if not enough posts (minimum 4 required)
    }

    return (
        <div className="max-w-7xl mx-auto px-4">
            <DividerLink href="/blogs">{title}</DividerLink>
            
            {/* Mobile Layout - Stacked */}
            <div className="block md:hidden space-y-6">
                {/* Featured Post - First on mobile */}
                <StoryCard post={posts[0]} showCategories={false} showMetaInfo={true} showPreview={true} isBig={true} contentClassName="text-left px-4 pb-2" />
                
                {/* Left Side Posts - Second on mobile */}
                <div className="space-y-4 w-full">
                    <StoryCard post={posts[1]} skipImage={true} showPreview={true} className="max-w-full"/>
                    <hr />
                    <StoryCard post={posts[2]} showPreview={true} className="max-w-full w-full grid grid-cols-2" />
                    <hr />

                </div>
                
                {/* Right Side Posts - Third on mobile */}
                <div className="space-y-4">
                    <StoryCard post={posts[3]} skipImage={true} showPreview={true}/>
                    {posts[4] && 
                    <div className="">

                    <hr />
                    <StoryCard post={posts[4]} skipImage={true} showPreview={true}/>
                    </div>
                    }
                </div>
            </div>

            {/* Desktop Layout - Grid */}
            <div className="hidden md:grid grid-cols-12 gap-6">
                <div className="lg:col-span-3 md:col-span-3 space-y-6 mt-2">
                    <StoryCard post={posts[1]} skipImage={true} showPreview={true} />
                    <hr />
                    <StoryCard post={posts[2]} showPreview={true}/>
                </div>
                <div className="lg:col-span-9 md:col-span-9">
                    <div className="grid lg:grid-cols-12 gap-6">

                    <StoryCard post={posts[0]} showPreview={true} isBig={true} className="bg-white aspect-auto max-w-full col-span-12 lg:col-span-9" />
                    <div className=" col-span-12 lg:col-span-3">

                    <StoryCard post={posts[3]} skipImage={true} showPreview={true} className="aspect-auto max-w-full"/>
                    <hr />
                    {posts[4] && <StoryCard post={posts[4]} skipImage={true} showPreview={true}/>}
                    </div>
                    </div>
                </div>

            </div>
        </div>
    );
}