import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

// PostCard Skeleton Component
function PostCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative overflow-hidden">
        <Skeleton className="aspect-video w-full" />
        
        {/* Status Badge Skeleton */}
        <div className="absolute top-3 left-3">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Actions Button Skeleton */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>

      {/* Content */}
      <CardHeader className="pb-3">
        {/* Title Skeleton */}
        <Skeleton className="h-6 w-3/4 mb-3" />
        
        {/* Categories Skeleton */}
        <div className="flex flex-wrap gap-1 mt-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Content Preview Skeleton */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>

        {/* Author & Meta Info Skeleton */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        {/* Action Buttons Skeleton */}
        <div className="flex gap-2 w-full">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
        </div>
      </CardFooter>
    </Card>
  );
}

// Main Loading Component
export default function PostsLoading() {
  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Filters and Search Skeleton */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search Skeleton */}
          <div className="relative flex-1 min-w-[300px]">
            <Skeleton className="h-9 w-full" />
          </div>

          {/* Filter Dropdowns Skeleton */}
          <Skeleton className="h-9 w-[140px]" />
          <Skeleton className="h-9 w-[160px]" />
        </div>

        {/* View Controls Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <div className="flex border rounded-md">
            <Skeleton className="h-8 w-8 rounded-r-none" />
            <Skeleton className="h-8 w-8 rounded-l-none" />
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="flex gap-4 text-sm">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-1" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-1" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Posts Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      </div>

      {/* Pagination Skeleton (if needed) */}
      <div className="flex justify-center mt-8">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
