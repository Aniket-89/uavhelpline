"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCategories, useCreateCategory } from "@/hooks/useCategories";
import { Plus, X, Tag, Loader2, Search } from "lucide-react";
import type { Category } from "@/types";

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  className?: string;
}

export default function CategorySelector({
  selectedCategories,
  onCategoryToggle,
  className = "",
}: CategorySelectorProps) {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();

  const [query, setQuery] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const norm = (s: string) => s.toLowerCase().trim();

  const filtered = useMemo(() => {
    const q = norm(query);
    if (!q) return categories;
    return categories.filter((c) => norm(c.name).includes(q));
  }, [categories, query]);

  // Keep selected categories pinned to the top of the filtered list
  const filteredSorted = useMemo(() => {
    const set = new Set(selectedCategories);
    return [...filtered].sort((a, b) => {
      const aSel = set.has(a.id) ? 0 : 1;
      const bSel = set.has(b.id) ? 0 : 1;
      if (aSel !== bSel) return aSel - bSel;
      return a.name.localeCompare(b.name);
    });
  }, [filtered, selectedCategories]);

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    // Prevent duplicate (client-side)
    const exists = categories.find((c) => norm(c.name) === norm(name));
    if (exists) {
      alert(`Category "${exists.name}" already exists.`);
      return;
    }

    setIsCreating(true);
    try {
      const created = await createCategory.mutateAsync({ name });
      onCategoryToggle(created.id); // auto-select
      setNewCategoryName("");
      setShowCreateForm(false);
      alert(`Category "${created.name}" created.`);
    } catch (e: any) {
      console.error(e);
      if (e?.response?.data?.error?.includes("already exists")) {
        alert("This category already exists.");
      } else {
        alert("Failed to create category. Please try again.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateCategory();
    }
    if (e.key === "Escape") {
      setShowCreateForm(false);
      setNewCategoryName("");
    }
  };

  const selectedData = useMemo(
    () => categories.filter((c) => selectedCategories.includes(c.id)),
    [categories, selectedCategories]
  );

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
    <div className={`space-y-3 ${className} font-sans`}>
      {/* Selected chips */}
      {selectedData.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Selected Categories</label>
          <div className="flex flex-wrap gap-2">
            {selectedData.map((category) => (
              <Badge
                key={category.id}
                variant="outline"
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

      {/* Search + actions */}
      <div className="space-y-2 ">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-bold">
            Categories {query ? `(filtered ${filtered.length})` : `(${categories.length})`}
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCreateForm((s) => !s)}
            className="h-7 px-2 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            New Category
          </Button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 opacity-60" />
          <Input
            placeholder="Search categories…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 h-9 bg-accent rounded-xs"
          />
        </div>
      </div>

      {/* Create form */}
      {showCreateForm && (
        <div className="mb-1 p-3 border rounded-xs bg-muted/30">
          <div className="flex gap-2">
            <Input
              placeholder="Enter category name…"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={handleCreateKey}
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
              {isCreating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
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

      {/* Results list (search-driven) */}
      <div className="max-h-42 overflow-y-auto border rounded-sm">
        {filteredSorted.length > 0 ? (
          <ul className="divide-y">
            {filteredSorted.map((category) => {
              const checked = selectedCategories.includes(category.id);
              return (
                <li key={category.id}>
                  <label
                    className={`flex text-sm items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors ${
                      checked ? "bg-primary/10" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onCategoryToggle(category.id)}
                      className="shrink-0"
                    />
                    <span className={checked ? "font-medium" : ""}>{category.name}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-6 text-center">
            <Tag className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm text-muted-foreground">
              No categories match “{query}”.
            </p>
            <div className="mt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCreateForm(true);
                  setNewCategoryName(query);
                }}
              >
                <Plus className="w-3 h-3 mr-1" />
                Create “{query}”
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        <p>• Search to filter categories, or create a new one if not found.</p>
      </div>
    </div>
  );
}
