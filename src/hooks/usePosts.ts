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
