"use client";

import { useQuery } from "@tanstack/react-query";
import { getTokenProblem } from "@/lib/token";
import { exploreStorage } from "@/services/storage.service";
import { useAuthStore } from "@/store/auth.store";

export function useExplore(folderId: string) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const tokenProblem = getTokenProblem(accessToken);

  return useQuery({
    queryKey: ["storage", "explore", folderId],
    queryFn: () => exploreStorage(folderId),
    enabled: tokenProblem === null && Boolean(folderId),
  });
}
