"use client";
import { usePosts } from "@/hooks/usePosts";
import type { Post } from "@/types";
import PostCard from "./postCard";

export default function PostList() {
    const {data:posts, isLoading, error} = usePosts();

    return (
        <main className="m-12">
            <div className="">
                {posts?.map((post) =>(

                    <PostCard post={post} />
                ))}
            </div>
        </main>
    )
}