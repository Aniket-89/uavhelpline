"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCategories, useCreateCategory } from "@/hooks/useCategories";
import { Plus, X, Tag, Loader2 } from "lucide-react";
import type { Category } from "@/types";

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  className?: string;
}

export default function CategorySelector({ 
  selectedCategories, 
  onCategoryToggle, 
  className = "" 
}: CategorySelectorProps) {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    // Check if category with same name already exists locally
    const existingCategory = categories.find(
      cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
    );
    
    if (existingCategory) {
      alert(`Category "${existingCategory.name}" already exists. Please choose a different name.`);
      return;
    }

    setIsCreating(true);
    try {
      const newCategory = await createCategory.mutateAsync({
        name: newCategoryName.trim()
      });
      
      // Automatically select the newly created category
      onCategoryToggle(newCategory.id);
      
      // Reset form
      setNewCategoryName("");
      setShowCreateForm(false);
      
      // Show success message
      alert(`Category "${newCategory.name}" created successfully!`);
    } catch (error: any) {
      console.error("Error creating category:", error);
      
      // Handle specific error messages
      if (error.response?.data?.error?.includes("already exists")) {
        alert("A category with this name already exists. Please choose a different name.");
      } else {
        alert("Failed to create category. Please try again.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateCategory();
    }
    if (e.key === 'Escape') {
      setShowCreateForm(false);
      setNewCategoryName("");
    }
  };

  const getSelectedCategoriesData = () => {
    return categories.filter(cat => selectedCategories.includes(cat.id));
  };

  if (isLoading) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading categories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selected Categories Display */}
      {selectedCategories.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Selected Categories</label>
          <div className="flex flex-wrap gap-2">
            {getSelectedCategoriesData().map((category) => (
              <Badge 
                key={category.id} 
                variant="default" 
                className="flex items-center gap-1 pr-1"
              >
                <Tag className="w-3 h-3" />
                {category.name}
                <button
                  type="button"
                  onClick={() => onCategoryToggle(category.id)}
                  className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Available Categories */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">
            Available Categories ({categories.length})
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="h-7 px-2 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            New Category
          </Button>
        </div>

        {/* Create New Category Form */}
        {showCreateForm && (
          <div className="mb-3 p-3 border rounded-md bg-muted/30">
            <div className="flex gap-2">
              <Input
                placeholder="Enter category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 h-8 text-sm"
                disabled={isCreating}
              />
              <Button
                type="button"
                onClick={handleCreateCategory}
                disabled={!newCategoryName.trim() || isCreating}
                size="sm"
                className="h-8 px-3"
              >
                {isCreating ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewCategoryName("");
                }}
                size="sm"
                className="h-8 px-3"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to create, Escape to cancel
            </p>
          </div>
        )}

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            return (
              <label 
                key={category.id} 
                className={`flex items-center text-sm p-2 rounded cursor-pointer transition-colors hover:bg-muted/50 ${
                  isSelected ? 'bg-primary/10 border border-primary/20' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onCategoryToggle(category.id)}
                  className="mr-2"
                />
                <Tag className="w-3 h-3 mr-1 opacity-60" />
                <span className={isSelected ? 'font-medium' : ''}>{category.name}</span>
              </label>
            );
          })}
          
          {categories.length === 0 && (
            <div className="col-span-full text-center py-8">
              <Tag className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm text-muted-foreground mb-2">No categories yet</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="w-3 h-3 mr-1" />
                Create First Category
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Helper Text */}
      <div className="text-xs text-muted-foreground">
        <p>• Select existing categories or create new ones</p>
        <p>• New categories will be immediately available for selection</p>
      </div>
    </div>
  );
}