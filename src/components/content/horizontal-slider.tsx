import DividerLink from "./divider-link";
import { Post } from "@/types";
import { StoryCard } from "./story-card";

export default function HorizontalSlider({ posts }: { posts: Post[] }) {
  return (
    <div className="flex items-center gap-2 max-w-7xl mx-auto h-full px-2">
      {posts.map((post) => (
        <StoryCard key={post.id} post={post} skipImage={false} />
      ))}
    </div>
  );
}