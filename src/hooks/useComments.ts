import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Comment } from "@/types";

export const useComments = (postId: string) =>
  useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/posts/${postId}/comments`);
      return data;
    },
    enabled: !!postId,
  });

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentData: Partial<Comment>) => {
      const { data } = await axios.post("/api/comments", commentData);
      return data;
    },
    onSuccess: (_data, variables) => {
      if (variables.postId) {
        queryClient.invalidateQueries({
          queryKey: ["comments", variables.postId],
        });
      }
    },
  });
};
