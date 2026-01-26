import { api } from "@/lib/api-client";
import type {
  CheckInDto,
  CreateCheckInDto,
} from "@/types/api";

export const checkInsService = {
  // Create a check-in record
  createCheckIn: async (data: CreateCheckInDto): Promise<CheckInDto> => {
    return api.post<CheckInDto>("/check-ins", data);
  },

  // Get all check-ins for an attendee
  getCheckInsByAttendee: async (attendeeId: string): Promise<CheckInDto[]> => {
    return api.get<CheckInDto[]>(`/check-ins/attendee/${attendeeId}`);
  },

  // Get all check-ins for a day
  getCheckInsByDay: async (dayId: string): Promise<CheckInDto[]> => {
    return api.get<CheckInDto[]>(`/check-ins/day/${dayId}`);
  },

  // Get total checked-in count
  getCheckInsCount: async (): Promise<{ count: number }> => {
    return api.get<{ count: number }>("/check-ins/count");
  },
};

