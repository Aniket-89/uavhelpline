"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 2 * 60 * 1000, // 2 minutes — data is fresh for 2 min, no refetch
            gcTime: 10 * 60 * 1000, // 10 minutes — keep unused cache entries longer
            refetchOnWindowFocus: false, // don't refetch every time user tabs back
            retry: 1, // retry once on failure, then show error
          },
        },
      })
  );

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}
