"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { queryKeys } from "../../../lib/react-query";
import { UsersService, VehiclesService } from "../../../services";
import { Cache } from "../../../services/api/cache";
import { routes } from "../../../routes";

/**
 * Auth Data Interfaces
 */
interface SignupData {
  name: string;
  email: string;
  vehicle: string | number;
  password: string;
  userType: string;
}

interface SigninData {
  email: string;
  password: string;
  userType?: string;
}

interface UpdateProfileData {
  name?: string;
  phone?: string;
  vehicle?: string | number;
}

/**
 * useAuthQuery Hook
 * React Query version of auth management
 * 
 * @example
 * const { user, isAuthenticated, signin, signup, signout } = useAuthQuery();
 */
export const useAuthQuery = () => {
  const queryClient = useQueryClient();

  // Get current user from cache
  const cachedUser = Cache.getItem("user");
  const isAuthenticated = !!Cache.checkItem("accessToken");

  // Query: Get user profile
  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: async () => {
      const res = await UsersService.getConsumer();
      if (res.data.success) {
        const user = res.data.user;
        Cache.setItem({ user });
        return user;
      }
      throw new Error(res.data.message || "Failed to fetch profile");
    },
    enabled: isAuthenticated, // Only fetch if authenticated
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Query: List vehicles
  const {
    data: vehicles = [],
    isLoading: vehiclesLoading,
  } = useQuery({
    queryKey: queryKeys.auth.vehicles(),
    queryFn: async () => {
      const res = await VehiclesService.listVehicles();
      if (res.status === 200) {
        return res.data.vehicles || [];
      }
      return [];
    },
    staleTime: 30 * 60 * 1000, // 30 minutes (vehicles don't change often)
  });

  // Mutation: Sign up
  const signupMutation = useMutation({
    mutationFn: async (data: SignupData) => {
      const res = await UsersService.signup({
        name: data.name,
        email: data.email,
        vehicle: data.vehicle,
        password: data.password,
        user_type: data.userType,
      });
      if (res.data.success && res.data.tokens) {
        return {
          user: res.data.user,
          access: res.data.tokens.access_token,
          refresh: res.data.tokens.refresh_token,
          message: res.data.message,
        };
      }
      throw new Error(res.data.message || "Signup failed");
    },
    onSuccess: (data) => {
      message.success(data.message || "Account created successfully!");
      Cache.setItem({
        accessToken: data.access,
        refreshToken: data.refresh,
        user: data.user,
      });
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      
      // Redirect to home
      window.location.href = routes.HOME;
    },
    onError: (error: Error) => {
      message.error(error.message || "Signup failed");
    },
  });

  // Mutation: Sign in
  const signinMutation = useMutation({
    mutationFn: async (data: SigninData) => {
      const res = await UsersService.signin(data);
      if (res.data.success && res.data.tokens) {
        return {
          user: res.data.user,
          access: res.data.tokens.access_token,
          refresh: res.data.tokens.refresh_token,
          message: res.data.message,
        };
      }
      throw new Error(res.data.message || "Signin failed");
    },
    onSuccess: (data) => {
      message.success(data.message || "Signed in successfully!");
      Cache.setItem({
        accessToken: data.access,
        refreshToken: data.refresh,
        user: data.user,
      });
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      
      // Redirect to home
      window.location.href = routes.HOME;
    },
    onError: (error: Error) => {
      message.error(error.message || "Signin failed");
    },
  });

  // Mutation: Update profile
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const res = await UsersService.updateConsumer(data);
      if (res.data.success) {
        return res.data.user;
      }
      throw new Error(res.data.message || "Update failed");
    },
    onSuccess: (user) => {
      message.success("Profile updated successfully!");
      Cache.setItem({ user });
      
      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    },
    onError: (error: Error) => {
      message.error(error.message || "Update failed");
    },
  });

  // Action: Sign out
  const signout = () => {
    Cache.removeItem("accessToken");
    Cache.removeItem("refreshToken");
    Cache.removeItem("user");
    
    // Clear all queries
    queryClient.clear();
    
    message.success("Signed out successfully!");
    window.location.href = routes.SIGNIN;
  };

  // Action: Get profile with callback
  const getProfile = async (callback?: (user: any) => void) => {
    const result = await refetchProfile();
    if (result.data && callback) {
      callback(result.data);
    }
  };

  return {
    // State
    user: cachedUser,
    isAuthenticated,
    profile: profile || cachedUser,
    profileLoading,
    vehicles,
    vehiclesLoading,
    isSigningUp: signupMutation.isPending,
    isSigningIn: signinMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,

    // Actions
    signup: signupMutation.mutate,
    signin: signinMutation.mutate,
    signout,
    updateProfile: updateProfileMutation.mutate,
    getProfile,
    refetchProfile,
  };
};
