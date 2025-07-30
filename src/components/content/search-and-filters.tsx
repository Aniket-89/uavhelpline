import { Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category } from "@/types";

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: Category[];
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  className?: string;
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  viewMode,
  onViewModeChange,
  className
}: SearchAndFiltersProps) {
  return (
    <div className={`max-w-4xl mx-auto ${className || ''}`}>
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search drone stories, guides, and reviews..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-8 sm:h-10 text-sm rounded-xs bg-white border-0"
          />
        </div>

        {/* Category Filter and View Mode - Row on mobile, inline on desktop */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="h-8 sm:h-10 px-2 sm:px-3 rounded-xs border border-input bg-white text-foreground text-sm min-w-[120px] sm:min-w-[140px] flex-1 sm:flex-none"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border rounded-xs">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="rounded-r-none rounded-l-xs h-8 sm:h-10 px-2 sm:px-3 flex-1 sm:flex-none text-xs sm:text-sm"
            >
              <Grid className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="ml-1 sm:ml-2 sm:hidden">Grid</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="rounded-l-none rounded-r-xs h-8 sm:h-10 px-2 sm:px-3 flex-1 sm:flex-none text-xs sm:text-sm"
            >
              <List className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="ml-1 sm:ml-2 sm:hidden">List</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}