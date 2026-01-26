// Authentication Types
export interface AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string | null;
  };
}

export interface UserProfileDto {
  id: string;
  email: string;
  name: string;
  picture?: string | null;
  phone?: string | null;
  gender?: "MALE" | "FEMALE" | null;
  dateOfBirth?: string | null;
  createdAt: string;
}

export interface UserProfileWithHistoryDto extends UserProfileDto {
  age?: number;
  totalEventsAttended: number;
  lastVisits: VisitHistoryItemDto[];
}

export interface UserHistoryDto {
  visits: VisitHistoryItemDto[];
}

export interface VisitHistoryItemDto {
  date: string;
  event: string;
  eventId: string;
  day: string;
  dayNumber: number;
  servicesAttended: string[];
  checkedInAt: string;
}

export interface UpdateUserDto {
  name?: string;
  phone?: string;
  gender?: "MALE" | "FEMALE";
  dateOfBirth?: string;
}

// Event Types
export interface EventDto {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDto {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface UpdateEventDto {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

// Day Types
export interface DayDto {
  id: string;
  eventId: string;
  dayNumber: number;
  date: string;
  services: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDayDto {
  dayNumber: number;
  date: string;
  services: string[];
}

export interface UpdateDayDto {
  dayNumber?: number;
  date?: string;
  services?: string[];
}

// Attendee Types
export interface AttendeeDto {
  id: string;
  eventId: string;
  userId: string;
  status: "PENDING" | "CHECKED_IN";
  userType?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    picture?: string | null;
    phone?: string | null;
    gender?: "MALE" | "FEMALE" | null;
    dateOfBirth?: string | null;
  };
  event?: EventDto;
}

export interface UpdateAttendeeDto {
  status?: "PENDING" | "CHECKED_IN";
}

export interface ImportResultDto {
  successCount: number;
  errorCount: number;
  errors: ImportErrorDto[];
  totalProcessed: number;
}

export interface ImportErrorDto {
  row: number;
  email?: string;
  message: string;
}

// Check-in Types
export interface CheckInDto {
  id: string;
  attendeeId: string;
  dayId: string;
  servicesAttended: string[];
  checkedInAt: string;
  attendee?: AttendeeDto;
  day?: DayDto;
}

export interface CreateCheckInDto {
  attendeeId: string;
  dayId: string;
  servicesAttended: string[];
}

// Analytics Types
export interface EventAnalyticsDto {
  totalAttendance: number;
  byDay: {
    allDays: number;
    [key: string]: number; // day1, day2, day3, etc.
  };
  byService: ServiceAttendanceDto[];
  byGender: GenderBreakdownDto;
  byAgeRange: AgeRangeItemDto[];
}

export interface ServiceAttendanceDto {
  service: string;
  count: number;
}

export interface GenderBreakdownDto {
  male: GenderStatDto;
  female: GenderStatDto;
}

export interface GenderStatDto {
  count: number;
  percentage: number;
}

export interface AgeRangeItemDto {
  range: string;
  count: number;
  percentage: number;
}

export interface DayAttendanceDto {
  allDays: number;
}

// API Error Types
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
  offset?: number;
}

