import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Category } from "@/types";

export const useCategories = () =>
  useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/categories");
      return data;
    },
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryData: { name: string; slug?: string }) => {
      const slug = categoryData.slug || categoryData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      const { data } = await axios.post("/api/categories", {
        name: categoryData.name,
        slug
      });
      return data;
    },
    onSuccess: () => {
      // Invalidate categories to refetch and show new category
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
