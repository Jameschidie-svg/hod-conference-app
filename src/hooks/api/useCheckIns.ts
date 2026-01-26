import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { checkInsService } from "@/services/checkins.service";
import { toast } from "@/hooks/use-toast";
import type { CreateCheckInDto } from "@/types/api";

export function useCreateCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCheckInDto) => checkInsService.createCheckIn(data),
    onSuccess: (checkIn) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["check-ins"] });
      queryClient.invalidateQueries({ queryKey: ["attendees"] });
      queryClient.invalidateQueries({ queryKey: ["attendee", checkIn.attendeeId] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: ["attendees-count"] });
      
      toast({
        title: "Check-in successful",
        description: "Attendee has been checked in successfully.",
      });
    },
    onError: (error: Error) => {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes("duplicate") || errorMessage.includes("409")) {
        toast({
          title: "Already checked in",
          description: "This attendee is already checked in for this day.",
          variant: "destructive",
        });
      } else if (errorMessage.includes("404")) {
        toast({
          title: "Not found",
          description: "Attendee or day not found.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Check-in failed",
          description: error.message || "Failed to check in. Please try again.",
          variant: "destructive",
        });
      }
    },
  });
}

export function useGetCheckInsByAttendee(attendeeId: string | null) {
  return useQuery({
    queryKey: ["check-ins", "attendee", attendeeId],
    queryFn: () => {
      if (!attendeeId) throw new Error("Attendee ID is required");
      return checkInsService.getCheckInsByAttendee(attendeeId);
    },
    enabled: !!attendeeId,
    staleTime: 1 * 60 * 1000,
  });
}

export function useGetCheckInsByDay(dayId: string | null) {
  return useQuery({
    queryKey: ["check-ins", "day", dayId],
    queryFn: () => {
      if (!dayId) throw new Error("Day ID is required");
      return checkInsService.getCheckInsByDay(dayId);
    },
    enabled: !!dayId,
    staleTime: 30 * 1000,
  });
}

export function useGetCheckInsCount() {
  return useQuery({
    queryKey: ["check-ins", "count"],
    queryFn: () => checkInsService.getCheckInsCount(),
    staleTime: 30 * 1000,
  });
}

