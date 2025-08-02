import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Tag, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Post } from "@/types";
import { getContentPreview, formatDate, calculateReadingTime } from "@/lib/utils";

interface StoryCardProps {
  post: Post;
  className?: string;
  skipImage?: boolean;
  showCategories?: boolean;
  showMetaInfo?: boolean;
  showPreview?: boolean;
  isBig?: boolean;
  contentClassName?: string;
}

export function StoryCard({ post, className, skipImage = false, showCategories = false, showMetaInfo = false, showPreview = false, isBig = false, contentClassName = '' }: StoryCardProps) {
  return (
    <Card className={`group bg-transparent border-0 shadow-none transition-all duration-300 overflow-hidden rounded-xs ${isBig ? 'max-w-full bg-white h-full' : 'max-w-xs'} flex-shrink-0 ${
      skipImage ? '' : 'border-0 shadow-none'
    } ${className || ''}`}>
      {/* Image Section - Only show if not skipping */}
      {!skipImage && (
        <div className="relative overflow-hidden">
          <div className={`${isBig ? 'aspect-[16/10]' : 'aspect-[16/9]'} relative object-cover group-hover:scale-105 transition-all duration-500 rounded-xs`}>
            <Image 
              src={post.thumbnail || '/general-img-landscape.png'} 
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 ease-in group-hover:scale-110"
            />
            {/* <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
          </div>
        </div>
      )}

      <CardContent className={`${contentClassName || ''} ${isBig ? "" : "p-0"}`}>
        {/* Categories */}
        {showCategories && post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {post.categories.slice(0, skipImage ? 1 : 3).map((category) => (
              <Badge 
                key={category.id} 
                variant="secondary"
                className="text-xs rounded-sm bg-accent text-accent-foreground hover:bg-accent/80"
              >
                {skipImage ? '' : <Tag className="w-3 h-3 mr-1" />}
                {category.name}
              </Badge>
            ))}
            {!skipImage && post.categories.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.categories.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Title */}
        <h2 className={`font-italic mb-2 leading-snug md:leading-tight ${showPreview ? 'line-clamp-3' : 'line-clamp-2 text-sm md:text-base lg:text-lg'} relative cursor-pointer overflow-hidden ${
          skipImage ? 'text-xl italic' : isBig ? 'text-3xl md:text-3xl font-bold lg:text-3xl xl:text-4xl italic' : 'font-medium text-2xl lg:text-2xl'
        }`}>
          <Link href={`/stories/${post.slug}`} className="block relative z-10">
            <span className="relative">
              {post.title}
              <span className="absolute inset-0 bg-accent/40 transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 -z-10 rounded-xs"></span>
            </span>
          </Link>
        </h2>

        {/* Preview - Show less on skipImage */}
        {showPreview && (
          <p className="leading-tight mb-4 line-clamp-2">
            {getContentPreview(post.content, skipImage ? 60 : 120)}
          </p>
        )}

        {/* Meta Info */}
        {showMetaInfo && (
        <div className={`flex items-center text-xs text-gray-500 ${
          skipImage ? 'gap-2 flex-wrap' : 'gap-4'
        }`}>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span className={skipImage ? 'hidden sm:inline' : ''}>
              {formatDate(post.publishedAt || post.updatedAt)}
            </span>
          </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{calculateReadingTime(post.content)} min read</span>
            </div>
        </div>
        )}
      </CardContent>
    </Card>
  );
}