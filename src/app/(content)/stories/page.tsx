"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Post } from "@/types";
import { usePublishedPosts } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import { StoryCard } from "@/components/content/story-card";
import { StoriesLoading } from "@/components/content/stories-loading";
import { SearchAndFilters } from "@/components/content/search-and-filters";
import { Pagination } from "@/components/ui/pagination";
import { CTASection } from "@/components/content/cta-section";



export default function StoriesListPage() {
  const { data: posts = [], isLoading, error } = usePublishedPosts();
  const { data: categories = [] } = useCategories();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || 
                             post.categories?.some(cat => cat.id === selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold mb-4">Unable to Load Stories</h2>
          <p className="text-muted-foreground">
            We're having trouble loading the latest drone stories. Please try again later.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Search and Filters Section */}
      <div className="mt-16">
        <div className="max-w-4xl mx-auto px-3">
          

          <div className="max-w-3xl mx-auto">
            <SearchAndFilters
              searchTerm={searchTerm}
              onSearchChange={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
              selectedCategory={selectedCategory}
              onCategoryChange={(value) => {
                setSelectedCategory(value);
                setCurrentPage(1);
              }}
              categories={categories}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                {searchTerm || selectedCategory !== "all" ? "Search Results" : "Latest Stories"}
              </h2>
              <p className="text-muted-foreground mt-1">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'} found
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>

            {filteredPosts.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(startIndex + postsPerPage, filteredPosts.length)} of {filteredPosts.length}
              </div>
            )}
          </div>

          {/* Stories Grid/List */}
          {isLoading ? (
            <StoriesLoading count={12} viewMode={viewMode} />
          ) : filteredPosts.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">🚁</div>
              <h3 className="text-xl font-semibold mb-2">No Stories Found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "No published stories are available at the moment."
                }
              </p>
              {(searchTerm || selectedCategory !== "all") && (
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setCurrentPage(1);
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              )}
            </Card>
          ) : (
            <>
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" 
                : "space-y-6"
              }>
                {paginatedPosts.map((post) => (
                  <StoryCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                className="mt-16"
              />
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}