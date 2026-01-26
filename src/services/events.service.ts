import { api } from "@/lib/api-client";
import type {
  EventDto,
  CreateEventDto,
  UpdateEventDto,
  DayDto,
  CreateDayDto,
  UpdateDayDto,
} from "@/types/api";

export const eventsService = {
  // Get all events
  getAllEvents: async (): Promise<EventDto[]> => {
    return api.get<EventDto[]>("/events");
  },

  // Get event by ID
  getEventById: async (id: string): Promise<EventDto> => {
    return api.get<EventDto>(`/events/${id}`);
  },

  // Create event
  createEvent: async (data: CreateEventDto): Promise<EventDto> => {
    return api.post<EventDto>("/events", data);
  },

  // Update event
  updateEvent: async (id: string, data: UpdateEventDto): Promise<EventDto> => {
    return api.patch<EventDto>(`/events/${id}`, data);
  },

  // Delete event
  deleteEvent: async (id: string): Promise<void> => {
    return api.delete<void>(`/events/${id}`);
  },

  // Get all days for an event
  getDaysByEvent: async (eventId: string): Promise<DayDto[]> => {
    return api.get<DayDto[]>(`/events/${eventId}/days`);
  },

  // Get day by ID
  getDayById: async (id: string): Promise<DayDto> => {
    return api.get<DayDto>(`/days/${id}`);
  },

  // Create day for an event
  createDay: async (eventId: string, data: CreateDayDto): Promise<DayDto> => {
    return api.post<DayDto>(`/events/${eventId}/days`, data);
  },

  // Update day
  updateDay: async (id: string, data: UpdateDayDto): Promise<DayDto> => {
    return api.patch<DayDto>(`/days/${id}`, data);
  },

  // Delete day
  deleteDay: async (id: string): Promise<void> => {
    return api.delete<void>(`/days/${id}`);
  },
};

