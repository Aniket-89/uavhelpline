import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  className?: string;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  maxVisiblePages = 5,
  className
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Adjust if we're near the beginning or end
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-2 ${className || ''}`}>
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto rounded-xs h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
        size="sm"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="sm:inline">Previous</span>
      </Button>

      <div className="flex items-center gap-1 order-first sm:order-none">
        {visiblePages.map((pageNum) => (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "ghost"}
            onClick={() => onPageChange(pageNum)}
            className="w-7 h-7 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm rounded-xs"
            size="sm"
          >
            {pageNum}
          </Button>
        ))}
        
        {totalPages > maxVisiblePages && visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            <span className="px-1 sm:px-2 text-sm">...</span>
            <Button
              variant={currentPage === totalPages ? "default" : "ghost"}
              onClick={() => onPageChange(totalPages)}
              className="w-7 h-7 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm rounded-xs"
              size="sm"
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <Button
        variant="outline"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto rounded-xs h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
        size="sm"
      >
        <span className="sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}