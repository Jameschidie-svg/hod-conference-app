import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";

function getApiUrl(): string {
    const url = import.meta.env.VITE_API_URL;
    if (!url) {
        throw new Error(
            "VITE_API_URL is not set. Please add it to your .env file: VITE_API_URL=https://your-api-url.com/api"
        );
    }
    return url;
}

export interface ApiRequestOptions extends RequestInit {
    skipAuth?: boolean;
}

class ApiError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public data?: unknown
    ) {
        super(message);
        this.name = "ApiError";
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let errorMessage = "An error occurred";
        let errorData: unknown;

        try {
            errorData = await response.json();
            if (typeof errorData === "object" && errorData !== null) {
                if ("message" in errorData && typeof errorData.message === "string") {
                    errorMessage = errorData.message;
                } else if ("error" in errorData && typeof errorData.error === "string") {
                    errorMessage = errorData.error;
                }
            }
        } catch {
            errorMessage = response.statusText || `HTTP ${response.status}`;
        }

        throw new ApiError(response.status, errorMessage, errorData);
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204 || response.headers.get("content-length") === "0") {
        return undefined as T;
    }

    try {
        return await response.json();
    } catch {
        return undefined as T;
    }
}

export async function apiRequest<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
): Promise<T> {
    const { skipAuth = false, ...fetchOptions } = options;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
    };

    // Add auth token if not skipped
    if (!skipAuth) {
        const token = useAuthStore.getState().token;
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    const url = endpoint.startsWith("http") ? endpoint : `${getApiUrl()}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
        });

        // Handle 401 Unauthorized - logout user
        if (response.status === 401 && !skipAuth) {
            useAuthStore.getState().logout();
            toast({
                title: "Session expired",
                description: "Please log in again",
                variant: "destructive",
            });
            throw new ApiError(401, "Unauthorized");
        }

        return handleResponse<T>(response);
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        // Network errors
        throw new ApiError(0, error instanceof Error ? error.message : "Network error");
    }
}

// Convenience methods
export const api = {
    get: <T>(endpoint: string, options?: ApiRequestOptions) =>
        apiRequest<T>(endpoint, { ...options, method: "GET" }),

    post: <T>(endpoint: string, data?: unknown, options?: ApiRequestOptions) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        }),

    patch: <T>(endpoint: string, data?: unknown, options?: ApiRequestOptions) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: "PATCH",
            body: data ? JSON.stringify(data) : undefined,
        }),

    delete: <T>(endpoint: string, options?: ApiRequestOptions) =>
        apiRequest<T>(endpoint, { ...options, method: "DELETE" }),

    // For file uploads (multipart/form-data)
    postFormData: <T>(endpoint: string, formData: FormData, options?: ApiRequestOptions) => {
        const headers: HeadersInit = {};
        const token = useAuthStore.getState().token;
        if (token && !options?.skipAuth) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const url = endpoint.startsWith("http") ? endpoint : `${getApiUrl()}${endpoint}`;

        return fetch(url, {
            ...options,
            method: "POST",
            headers,
            body: formData,
        }).then((response) => {
            if (response.status === 401 && !options?.skipAuth) {
                useAuthStore.getState().logout();
                toast({
                    title: "Session expired",
                    description: "Please log in again",
                    variant: "destructive",
                });
                throw new ApiError(401, "Unauthorized");
            }
            return handleResponse<T>(response);
        });
    },
};

