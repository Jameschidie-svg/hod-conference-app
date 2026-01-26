import { useQuery } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";

export function useGetUser(userId: string | null) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return usersService.getUserById(userId);
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useGetUserHistory(userId: string | null, limit?: number) {
  return useQuery({
    queryKey: ["user-history", userId, limit],
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return usersService.getUserHistory(userId, limit);
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

