import DividerLink from "./divider-link";
import { Post } from "@/types";
import { StoryCard } from "./story-card";

export default function HorizontalSlider({ posts }: { posts: Post[] }) {
  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Mobile: 2 cards in view */}
      <div className="grid grid-cols-2 gap-1 sm:hidden">
        {posts.slice(0, 2).map((post) => (
          <StoryCard key={post.id} post={post} skipImage={false} className="w-full p-0"/>
        ))}
      </div>
      
      {/* Tablet and Desktop: Horizontal scroll */}
      <div className="hidden sm:flex items-center gap-4 overflow-x-auto scrollbar-hide">
        {posts.map((post) => (
          <StoryCard key={post.id} post={post} skipImage={false} className="flex-shrink-0 w-80"/>
        ))}
      </div>
    </div>
  );
}