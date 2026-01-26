import { api } from "@/lib/api-client";
import { useAuthStore } from "@/stores/authStore";
import type {
    AuthResponseDto,
    UserProfileDto,
    UpdateUserDto,
} from "@/types/api";

function getApiUrl(): string {
    const url = import.meta.env.VITE_API_URL;
    if (!url) {
        throw new Error(
            "VITE_API_URL is not set. Please add it to your .env file: VITE_API_URL=https://your-api-url.com/api"
        );
    }
    return url;
}

export const authService = {
    // Initiate Google OAuth - redirects to backend, which then redirects to Google
    initiateGoogleAuth: () => {
        const API_URL = getApiUrl();
        // Redirect to backend OAuth endpoint - backend will handle redirecting to Google
        window.location.href = `${API_URL}/auth/google`;
    },

    // Handle Google OAuth callback
    // The backend redirects back to the frontend after OAuth completes
    // Backend flow: Frontend -> Backend /auth/google -> Google -> Backend /auth/google/callback -> Frontend
    // The backend should redirect to frontend with token or call the callback endpoint
    handleGoogleCallback: async (): Promise<AuthResponseDto> => {
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));

        // Check both query params and hash params
        const code = urlParams.get("code") || hashParams.get("code");
        const token = urlParams.get("token") || hashParams.get("token");
        const error = urlParams.get("error") || hashParams.get("error");
        const errorDescription = urlParams.get("error_description") || hashParams.get("error_description");

        // If there's an error from OAuth
        if (error) {
            const errorMsg = errorDescription || error;
            throw new Error(`OAuth authentication failed: ${errorMsg}. Please ensure the backend is properly configured with Google OAuth credentials.`);
        }

        // If token is directly in URL (backend redirected with token in query/hash)
        if (token) {
            const userParam = urlParams.get("user") || hashParams.get("user");
            if (userParam) {
                try {
                    const user = JSON.parse(decodeURIComponent(userParam));
                    return { accessToken: token, user };
                } catch (e) {
                    console.warn("Failed to parse user from URL, will fetch from API", e);
                }
            }
            // If no user in URL, fetch profile using the token
            // Temporarily store token to make authenticated request
            const tempStore = useAuthStore.getState();
            const tempUser: UserProfileDto = {
                id: "",
                email: "",
                name: "",
                createdAt: new Date().toISOString(),
            };
            tempStore.login(token, tempUser);
            try {
                const profile = await authService.getProfile();
                return { accessToken: token, user: profile };
            } catch (err) {
                tempStore.logout();
                throw new Error(`Failed to fetch user profile: ${err instanceof Error ? err.message : "Unknown error"}`);
            }
        }

        // If there's a code, call backend callback endpoint
        // The backend should exchange the code for a token
        if (code) {
            try {
                return await api.get<AuthResponseDto>(`/auth/google/callback?code=${code}`, { skipAuth: true });
            } catch (err) {
                throw new Error(`Failed to exchange OAuth code for token: ${err instanceof Error ? err.message : "Unknown error"}`);
            }
        }

        // If no code or token, the backend might have already processed it
        // Try calling the callback endpoint - backend might use session/cookies
        try {
            return await api.get<AuthResponseDto>("/auth/google/callback", { skipAuth: true });
        } catch (err) {
            throw new Error(
                `OAuth callback failed. No code or token found in URL. ` +
                `This usually means the backend redirect URI is not configured correctly. ` +
                `Error: ${err instanceof Error ? err.message : "Unknown error"}`
            );
        }
    },

    // Get current user profile
    getProfile: async (): Promise<UserProfileDto> => {
        return api.get<UserProfileDto>("/auth/me");
    },

    // Update own profile
    updateProfile: async (data: UpdateUserDto): Promise<UserProfileDto> => {
        return api.patch<UserProfileDto>("/users/me", data);
    },
};

