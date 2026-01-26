import { api } from "@/lib/api-client";
import type {
  UserProfileWithHistoryDto,
  UserHistoryDto,
} from "@/types/api";

export const usersService = {
  // Get user profile by ID (with last 5 visits)
  getUserById: async (id: string): Promise<UserProfileWithHistoryDto> => {
    return api.get<UserProfileWithHistoryDto>(`/users/${id}`);
  },

  // Get user attendance history
  getUserHistory: async (id: string, limit?: number): Promise<UserHistoryDto> => {
    const queryString = limit !== undefined ? `?limit=${limit}` : "";
    return api.get<UserHistoryDto>(`/users/${id}/history${queryString}`);
  },
};

