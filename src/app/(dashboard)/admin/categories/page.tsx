"use client";

import { useCategories, useCreateCategory } from "@/hooks/useCategories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Tags } from "lucide-react";
import { useState } from "react";

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();

  const [newName, setNewName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      await createCategory.mutateAsync({ name: newName.trim() });
      setNewName("");
      setIsAdding(false);
    } catch {
      alert("Failed to create category. It may already exist.");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            {categories.length} {categories.length === 1 ? "category" : "categories"}
          </p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? "secondary" : "default"}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {isAdding ? "Cancel" : "Add Category"}
        </Button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleCreate} className="flex gap-3">
              <Input
                placeholder="Category name (e.g. News, Reviews, Tutorials)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
                className="flex-1"
              />
              <Button type="submit" disabled={createCategory.isPending || !newName.trim()}>
                {createCategory.isPending ? "Creating..." : "Create"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      {categories.length === 0 ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <Tags className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-medium mb-1">No categories yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create categories to organize your posts.
            </p>
            <Button onClick={() => setIsAdding(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add First Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="transition-colors hover:bg-accent/50">
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                <Badge variant="outline" className="text-xs font-mono">
                  {category.slug}
                </Badge>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
