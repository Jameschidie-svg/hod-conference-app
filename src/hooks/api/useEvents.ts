import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsService } from "@/services/events.service";
import { useEventStore } from "@/stores/eventStore";
import { toast } from "@/hooks/use-toast";
import type { CreateEventDto, UpdateEventDto, CreateDayDto, UpdateDayDto } from "@/types/api";

export function useGetEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => eventsService.getAllEvents(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useGetEvent(eventId: string | null) {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: () => {
      if (!eventId) throw new Error("Event ID is required");
      return eventsService.getEventById(eventId);
    },
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useGetDaysByEvent(eventId: string | null) {
  return useQuery({
    queryKey: ["days", eventId],
    queryFn: () => {
      if (!eventId) throw new Error("Event ID is required");
      return eventsService.getDaysByEvent(eventId);
    },
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useGetDay(dayId: string | null) {
  return useQuery({
    queryKey: ["day", dayId],
    queryFn: () => {
      if (!dayId) throw new Error("Day ID is required");
      return eventsService.getDayById(dayId);
    },
    enabled: !!dayId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const { setCurrentEvent } = useEventStore();

  return useMutation({
    mutationFn: (data: CreateEventDto) => eventsService.createEvent(data),
    onSuccess: (newEvent) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setCurrentEvent(newEvent);
      toast({
        title: "Event created",
        description: "Event has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create event",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useCreateDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: CreateDayDto }) =>
      eventsService.createDay(eventId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["days", variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ["event", variables.eventId] });
      toast({
        title: "Day created",
        description: "Day has been added to the event.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create day",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
}

