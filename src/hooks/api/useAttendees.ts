import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendeesService, type GetAttendeesParams } from "@/services/attendees.service";
import { toast } from "@/hooks/use-toast";
import type { UpdateAttendeeDto } from "@/types/api";

export function useGetAttendees(params: GetAttendeesParams) {
  return useQuery({
    queryKey: ["attendees", params],
    queryFn: () => attendeesService.getAttendeesByEvent(params),
    enabled: !!params.eventId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useGetAttendee(attendeeId: string | null) {
  return useQuery({
    queryKey: ["attendee", attendeeId],
    queryFn: () => {
      if (!attendeeId) throw new Error("Attendee ID is required");
      return attendeesService.getAttendeeById(attendeeId);
    },
    enabled: !!attendeeId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useGetAttendeesCount(
  eventId: string | null,
  params?: {
    status?: "PENDING" | "CHECKED_IN";
    userType?: string;
  }
) {
  return useQuery({
    queryKey: ["attendees-count", eventId, params],
    queryFn: () => {
      if (!eventId) throw new Error("Event ID is required");
      return attendeesService.getAttendeesCount(eventId, params);
    },
    enabled: !!eventId,
    staleTime: 30 * 1000,
  });
}

export function useUpdateAttendee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAttendeeDto }) =>
      attendeesService.updateAttendee(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["attendee", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["attendees"] });
      toast({
        title: "Attendee updated",
        description: "Attendee status has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update attendee.",
        variant: "destructive",
      });
    },
  });
}

export function useImportAttendees() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, file }: { eventId: string; file: File }) =>
      attendeesService.importAttendees(eventId, file),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["attendees", { eventId: variables.eventId }] });
      queryClient.invalidateQueries({ queryKey: ["attendees-count", variables.eventId] });
      
      if (result.errorCount > 0) {
        toast({
          title: "Import completed with errors",
          description: `${result.successCount} imported, ${result.errorCount} errors.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Import successful",
          description: `${result.successCount} attendees imported successfully.`,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Import failed",
        description: error.message || "Failed to import attendees.",
        variant: "destructive",
      });
    },
  });
}

