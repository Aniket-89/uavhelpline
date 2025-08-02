import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Post } from "@/types";

export const usePosts = () =>
  useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await axios.get("/api/posts");
      return data;
    },
  });

export const usePost = (slug: string) =>
  useQuery<Post>({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data } = await axios.get(`/api/posts/${slug}`);
      return data;
    },
    enabled: !!slug,
  });

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPost: Partial<Post>) => {
      const { data } = await axios.post("/api/posts", newPost);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, postData }: { slug: string; postData: Partial<Post> }) => {
      const { data } = await axios.put(`/api/posts/${slug}`, postData);
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate all posts
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      // Invalidate the specific post
      queryClient.invalidateQueries({ queryKey: ["post", variables.slug] });
      // If slug changed, also invalidate the new slug
      if (data.slug !== variables.slug) {
        queryClient.invalidateQueries({ queryKey: ["post", data.slug] });
      }
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      const { data } = await axios.delete(`/api/posts/${slug}`);
      return data;
    },
    onSuccess: (_, slug) => {
      // Invalidate all posts
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      // Remove the specific post from cache
      queryClient.removeQueries({ queryKey: ["post", slug] });
    },
  });
};

export const useUpdatePostStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, status }: { slug: string; status: "draft" | "published" }) => {
      const { data } = await axios.put(`/api/posts/${slug}`, { status });
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate all posts
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      // Invalidate the specific post
      queryClient.invalidateQueries({ queryKey: ["post", variables.slug] });
    },
  });
};

// Hook specifically for published posts (public view)
export const usePublishedPosts = () => {
  return useQuery<Post[]>({
    queryKey: ["published-posts"],
    queryFn: async () => {
      const { data } = await axios.get("/api/posts");
      // Filter only published posts for public view
      return data.filter((post: Post) => post.status === "published");
    },
  });
};

// Hook specifically for published blog posts
export const usePublishedBlogPosts = () => {
  return useQuery<Post[]>({
    queryKey: ["published-blog-posts"],
    queryFn: async () => {
      const { data } = await axios.get("/api/posts");
      // Filter only published posts with "blogs" category
      return data.filter((post: Post) => 
        post.status === "published" && 
        post.categories?.some(cat => cat.slug === "blogs")
      );
    },
  });
};
