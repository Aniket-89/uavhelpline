"use client";
import DividerLink from "../divider-link";
import HorizontalSlider from "../horizontal-slider";
import { usePublishedBlogPosts } from "@/hooks/usePosts";

export default function BlogsSection() {
    const { data: posts = [], isLoading, error } = usePublishedBlogPosts();

    if (isLoading) {
        return (
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <DividerLink href="/blogs">View All Blogs</DividerLink>
                    <div className="flex justify-center py-8">
                        <div className="text-gray-500">Loading blog posts...</div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <DividerLink href="/blogs">View All Blogs</DividerLink>
                    <div className="flex justify-center py-8">
                        <div className="text-red-500">Error loading blog posts</div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto">
                <DividerLink href="/blogs">View All Blogs</DividerLink>
                <HorizontalSlider posts={posts} />
            </div>
        </section>
    );
}