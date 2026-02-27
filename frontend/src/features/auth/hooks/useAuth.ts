"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux";
import { authActions } from "../store/authActions";
import {
  selectUser,
  selectIsAuthenticated,
  selectIsAuthenticating,
  selectIsSigningUp,
  selectIsSigningIn,
  selectUserType,
  selectVehicles,
  selectProfile,
  selectProfileLoading,
  selectProfileUpdating,
} from "../store/authSelectors";

/**
 * useAuth Hook
 * Custom hook for accessing auth state and actions
 * 
 * @example
 * const { user, signin, signout, isAuthenticating } = useAuth();
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthenticating = useSelector(selectIsAuthenticating);
  const isSigningUp = useSelector(selectIsSigningUp);
  const isSigningIn = useSelector(selectIsSigningIn);
  const userType = useSelector(selectUserType);
  const vehicles = useSelector(selectVehicles);
  const profile = useSelector(selectProfile);
  const profileLoading = useSelector(selectProfileLoading);
  const profileUpdating = useSelector(selectProfileUpdating);

  // Actions
  const setUser = (user: any) => dispatch(authActions.handleSetUser(user));
  
  const listVehicles = () => dispatch(authActions.handleListVehicles() as any);
  
  const signup = (data: {
    name: string;
    email: string;
    vehicle: string;
    password: string;
    userType: string;
  }) => dispatch(authActions.handleSignup(data) as any);
  
  const signin = (data: { email: string; password: string }) =>
    dispatch(authActions.handleSignin(data) as any);
  
  const signout = () => dispatch(authActions.handleSignout());
  
  const getProfile = (callback?: (user: any) => void) =>
    dispatch(authActions.handleGetProfile(callback) as any);
  
  const updateProfile = (data: {
    name?: string;
    phone?: string;
    vehicle?: string | number;
  }) => dispatch(authActions.handleUpdateProfile(data) as any);

  return {
    // State
    user,
    isAuthenticated,
    isAuthenticating,
    isSigningUp,
    isSigningIn,
    userType,
    vehicles,
    profile,
    profileLoading,
    profileUpdating,
    // Actions
    setUser,
    listVehicles,
    signup,
    signin,
    signout,
    getProfile,
    updateProfile,
  };
};
