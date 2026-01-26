import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import type { UpdateUserDto, UserProfileDto } from "@/types/api";

export function useLogin() {
    const navigate = useNavigate();
    const { login } = useAuthStore();

    return useMutation({
        mutationFn: async () => {
            // Check if we're coming from OAuth callback
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");

            if (code || window.location.pathname.includes("/auth/google/callback")) {
                // Handle callback
                const response = await authService.handleGoogleCallback();
                // Convert AuthResponseDto user to UserProfileDto format
                const userProfile: UserProfileDto = {
                    ...response.user,
                    createdAt: new Date().toISOString(), // Will be updated when profile is fetched
                    phone: null,
                    gender: null,
                    dateOfBirth: null,
                };
                login(response.accessToken, userProfile);
                return response;
            } else {
                // Initiate OAuth flow
                authService.initiateGoogleAuth();
                return null;
            }
        },
        onSuccess: (data) => {
            if (data) {
                toast({
                    title: "Welcome back!",
                    description: "You have been signed in successfully.",
                });
                navigate("/dashboard");
            }
        },
        onError: (error: Error) => {
            console.error("Login error:", error);
            toast({
                title: "Login failed",
                description: error.message || "Failed to sign in. Please try again.",
                variant: "destructive",
            });
        },
    });
}

export function useGetProfile() {
    const { setUser } = useAuthStore();

    return useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const profile = await authService.getProfile();
            setUser(profile);
            return profile;
        },
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const { setUser } = useAuthStore();

    return useMutation({
        mutationFn: async (data: UpdateUserDto) => {
            return authService.updateProfile(data);
        },
        onSuccess: (updatedProfile) => {
            setUser(updatedProfile);
            queryClient.setQueryData(["profile"], updatedProfile);
            toast({
                title: "Profile updated",
                description: "Your profile has been updated successfully.",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Update failed",
                description: error.message || "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        },
    });
}

