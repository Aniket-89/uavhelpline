// This is a Client Component
"use client";

import { useParams } from "next/navigation";
import { usePost } from "@/hooks/usePosts";

export default function EditPost() {
  const { slug } = useParams();
  const { data: post, isLoading, error } = usePost(slug as string);

  if (isLoading) return <p>Loading...</p>;
  if (error || !post) return <p>Error loading post</p>;

  return (
    <div>
      <h1>{post.title}</h1>
    </div>
  );
}
