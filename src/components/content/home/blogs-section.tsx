"use client";
import DividerLink from "../divider-link";
import HorizontalSlider from "../horizontal-slider";
import { usePublishedBlogPosts } from "@/hooks/usePosts";

export default function BlogsSection({title}: {title: string}) {
    const { data: posts = [], isLoading, error } = usePublishedBlogPosts();

    if (isLoading) {
        return (
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <DividerLink href="/blogs">{title}</DividerLink>
                    <div className="flex justify-center py-8">
                        <div className="text-gray-500">Loading blog posts...</div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <DividerLink href="/blogs">{title}</DividerLink>
                    <div className="flex justify-center py-8">
                        <div className="text-red-500">Error loading blog posts</div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="pb-4 px-4">
            <div className="max-w-7xl mx-auto">
                <DividerLink href="/blogs">{title}</DividerLink>
                <HorizontalSlider posts={posts} />
            </div>
        </section>
    );
}