import { RootState } from "../../../redux";

/**
 * Auth Selectors
 * Memoized selectors for accessing auth state
 */

export const selectAuth = (state: RootState) => state.auth;

export const selectUser = (state: RootState) => state.auth.user;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export const selectIsAuthenticating = (state: RootState) => state.auth.isAuthenticating;

export const selectIsSigningUp = (state: RootState) => state.auth.isSigningUp;

export const selectIsSigningIn = (state: RootState) => state.auth.isSigningIn;

export const selectUserType = (state: RootState) => state.auth.userType;

export const selectVehicles = (state: RootState) => state.auth.vehicles;

export const selectProfile = (state: RootState) => state.auth.profile;

export const selectProfileLoading = (state: RootState) => state.auth.profileLoading;

export const selectProfileUpdating = (state: RootState) => state.auth.profileUpdating;
