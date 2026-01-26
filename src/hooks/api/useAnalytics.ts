import { useQuery } from "@tanstack/react-query";
import { analyticsService, type GetAttendanceListParams } from "@/services/analytics.service";

export function useGetEventAnalytics(eventId: string | null, day?: number) {
  return useQuery({
    queryKey: ["analytics", eventId, day],
    queryFn: () => {
      if (!eventId) throw new Error("Event ID is required");
      return analyticsService.getEventAnalytics(eventId, day);
    },
    enabled: !!eventId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useGetAttendanceList(params: GetAttendanceListParams) {
  return useQuery({
    queryKey: ["attendance-list", params],
    queryFn: () => analyticsService.getAttendanceList(params),
    enabled: !!params.eventId,
    staleTime: 30 * 1000,
  });
}

export function useGetGenderBreakdown(eventId: string | null) {
  return useQuery({
    queryKey: ["analytics", "gender", eventId],
    queryFn: () => {
      if (!eventId) throw new Error("Event ID is required");
      return analyticsService.getGenderBreakdown(eventId);
    },
    enabled: !!eventId,
    staleTime: 1 * 60 * 1000,
  });
}

export function useGetAgeRangeBreakdown(eventId: string | null) {
  return useQuery({
    queryKey: ["analytics", "age-ranges", eventId],
    queryFn: () => {
      if (!eventId) throw new Error("Event ID is required");
      return analyticsService.getAgeRangeBreakdown(eventId);
    },
    enabled: !!eventId,
    staleTime: 1 * 60 * 1000,
  });
}

export function useGetServiceAttendance(eventId: string | null) {
  return useQuery({
    queryKey: ["analytics", "services", eventId],
    queryFn: () => {
      if (!eventId) throw new Error("Event ID is required");
      return analyticsService.getServiceAttendance(eventId);
    },
    enabled: !!eventId,
    staleTime: 1 * 60 * 1000,
  });
}

