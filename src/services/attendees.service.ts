import { api } from "@/lib/api-client";
import type {
    AttendeeDto,
    UpdateAttendeeDto,
    ImportResultDto,
} from "@/types/api";

export interface GetAttendeesParams {
    eventId: string;
    status?: "PENDING" | "CHECKED_IN";
    userType?: string;
    limit?: number;
    offset?: number;
}

export const attendeesService = {
    // Get all attendees for an event
    getAttendeesByEvent: async (params: GetAttendeesParams): Promise<AttendeeDto[]> => {
        const { eventId, ...queryParams } = params;
        const queryString = new URLSearchParams(
            Object.entries(queryParams).reduce((acc, [key, value]) => {
                if (value !== undefined && value !== null) {
                    acc[key] = String(value);
                }
                return acc;
            }, {} as Record<string, string>)
        ).toString();

        const url = `/events/${eventId}/attendees${queryString ? `?${queryString}` : ""}`;
        return api.get<AttendeeDto[]>(url);
    },

    // Get attendee by ID
    getAttendeeById: async (id: string): Promise<AttendeeDto> => {
        return api.get<AttendeeDto>(`/attendees/${id}`);
    },

    // Update attendee
    updateAttendee: async (id: string, data: UpdateAttendeeDto): Promise<AttendeeDto> => {
        return api.patch<AttendeeDto>(`/attendees/${id}`, data);
    },

    // Import attendees from CSV
    importAttendees: async (eventId: string, file: File): Promise<ImportResultDto> => {
        const formData = new FormData();
        formData.append("file", file);
        return api.postFormData<ImportResultDto>(`/events/${eventId}/attendees/import`, formData);
    },

    // Get attendee count/analytics for an event
    getAttendeesCount: async (
        eventId: string,
        params?: {
            status?: "PENDING" | "CHECKED_IN";
            userType?: string;
            limit?: number;
            offset?: number;
        }
    ): Promise<{ count: number }> => {
        const queryString = params
            ? new URLSearchParams(
                Object.entries(params).reduce((acc, [key, value]) => {
                    if (value !== undefined && value !== null) {
                        acc[key] = String(value);
                    }
                    return acc;
                }, {} as Record<string, string>)
            ).toString()
            : "";

        const url = `/events/${eventId}/attendees/analytics${queryString ? `?${queryString}` : ""}`;
        return api.get<{ count: number }>(url);
    },
};

