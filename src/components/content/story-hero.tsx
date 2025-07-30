import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/types";
import { formatDate, calculateReadingTime } from "@/lib/utils";

interface StoryHeroProps {
  post: Post;
  onShare?: () => void;
}

export function StoryHero({ post, onShare }: StoryHeroProps) {
  // Get the primary category for the badge
  const primaryCategory = post.categories?.[0];
  
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full lg:h-[60vh] h-full bg-muted border-b border-border/60 " />
      <div className="max-w-screen-xl mx-auto px-3 lg:py-12 py-6 relative z-10">
        {/* Back Navigation */}
        <Link href="/stories">
          <Link href="/stories" className="mb-2 flex items-center gap-2 hover:bg-accent/80 -ml-2 text-sm text-muted-foreground">
            <ArrowLeft className="w-4 h-4 " />
            Back to Stories
          </Link>
        </Link>

        

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start ">
          
          {/* Left Column - Title and Description */}
          <div className="lg:col-span-3">
            <h1 className="text-2xl text-secondary md:text-4xl lg:text-5xl font-headline italic font-semibold leading-tight text-foreground mb-6">
              {post.title}
            </h1>
              {/* Featured Image */}
            {post.thumbnail && (
              <div className="mx-auto w-full lg:-mb-18">
                <div className="relative aspect-[16/9] w-full rounded-xs overflow-hidden">
                  <Image 
                    src={post.thumbnail} 
                    alt={post.title}
                    fill
                    className="object-cover h-full"
                    priority
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Meta Information */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Author */}
            <div >
              <span className="text-sm text-muted-foreground mr-2">By</span>
              <span className="font-medium text-primary">{post.author}</span>
            </div>

            {/* Description for mobile/tablet */}
            <div className="lg:hidden">
              <p className="text-gray-600 leading-relaxed">
                Here are the drone stories and UAV insights that kept our community 
                engaged throughout the year.
              </p>
            </div>

            {/* Meta Info */}
            <div className="flex border-y py-3 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(post.publishedAt || post.updatedAt)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{calculateReadingTime(post.content)} min read</span>
              </div>
            </div>
    {/* Category Badge */}
    {primaryCategory && (
          <div className="mb-4">
            <Badge 
              variant="secondary" 
              className="text-xs font-medium rounded-xs uppercase tracking-wider bg-accent font-sans text-accent-foreground hover:bg-accent/80"
            >
              {primaryCategory.name}
            </Badge>
          </div>
        )}
            {/* Share Button */}
            <Button 
            variant="secondary"
              size="sm" 
              onClick={onShare}
              className="w-full lg:w-auto"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
        
          </div>
        </div>

        {/* Categories - Full Width */}
        {post.categories && post.categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-gray-200">
            {post.categories.slice(1).map((category) => (
              <Badge 
                key={category.id} 
                variant="outline"
                className="text-xs border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                {category.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}