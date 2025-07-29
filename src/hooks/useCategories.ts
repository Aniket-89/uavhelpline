import { useQuery } from "@tanstack/react-query";
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
