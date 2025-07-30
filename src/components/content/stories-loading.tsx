import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StoriesLoadingProps {
  count?: number;
  viewMode?: "grid" | "list";
}

export function StoriesLoading({ count = 6, viewMode = "grid" }: StoriesLoadingProps) {
  return (
    <div className={viewMode === "grid" 
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" 
      : "space-y-4 sm:space-y-6"
    }>
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="overflow-hidden rounded-xs">
          <Skeleton className="aspect-[16/10] w-full rounded-xs" />
          <CardContent className="p-4 sm:p-6">
            <div className="flex gap-2 mb-3 sm:mb-4">
              <Skeleton className="h-4 sm:h-5 w-12 sm:w-16 rounded-full" />
              <Skeleton className="h-4 sm:h-5 w-16 sm:w-20 rounded-full" />
            </div>
            <Skeleton className="h-5 sm:h-6 w-full mb-2 sm:mb-3" />
            <Skeleton className="h-3 sm:h-4 w-full mb-1 sm:mb-2" />
            <Skeleton className="h-3 sm:h-4 w-3/4 mb-3 sm:mb-4" />
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
              <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}