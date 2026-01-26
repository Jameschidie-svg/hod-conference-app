import { api } from "@/lib/api-client";
import type {
  EventAnalyticsDto,
  GenderBreakdownDto,
  AgeRangeItemDto,
  ServiceAttendanceDto,
} from "@/types/api";

export interface GetAttendanceListParams {
  eventId: string;
  limit?: number;
  page?: number;
}

export const analyticsService = {
  // Get complete event analytics
  getEventAnalytics: async (eventId: string, day?: number): Promise<EventAnalyticsDto> => {
    const queryString = day !== undefined ? `?day=${day}` : "";
    return api.get<EventAnalyticsDto>(`/events/${eventId}/analytics${queryString}`);
  },

  // Get paginated attendance list
  getAttendanceList: async (params: GetAttendanceListParams): Promise<{
    data: unknown[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const { eventId, ...queryParams } = params;
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const url = `/events/${eventId}/analytics/attendance-list${queryString ? `?${queryString}` : ""}`;
    return api.get<{
      data: unknown[];
      total: number;
      page: number;
      limit: number;
    }>(url);
  },

  // Get gender breakdown
  getGenderBreakdown: async (eventId: string): Promise<GenderBreakdownDto> => {
    return api.get<GenderBreakdownDto>(`/events/${eventId}/analytics/gender`);
  },

  // Get age range breakdown
  getAgeRangeBreakdown: async (eventId: string): Promise<AgeRangeItemDto[]> => {
    return api.get<AgeRangeItemDto[]>(`/events/${eventId}/analytics/age-ranges`);
  },

  // Get service attendance
  getServiceAttendance: async (eventId: string): Promise<ServiceAttendanceDto[]> => {
    return api.get<ServiceAttendanceDto[]>(`/events/${eventId}/analytics/services`);
  },
};

