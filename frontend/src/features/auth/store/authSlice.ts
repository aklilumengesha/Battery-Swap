import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userTypes } from "../../../common/constants";

/**
 * Auth State Interface
 */
export interface AuthState {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  isSigningUp: boolean;
  isSigningIn: boolean;
  user: any | null;
  userType: string;
  vehicles: any[];
  profile: any;
  profileLoading: boolean;
  profileUpdating: boolean;
}

/**
 * Initial Auth State
 */
const initialState: AuthState = {
  isAuthenticated: false,
  isAuthenticating: false,
  isSigningUp: false,
  isSigningIn: false,
  user: null,
  userType: userTypes.consumer.key,
  vehicles: [],
  profile: {},
  profileLoading: false,
  profileUpdating: false,
};

/**
 * Auth Slice
 * Manages authentication state using Redux Toolkit
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticating = action.payload;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setIsSigningUp: (state, action: PayloadAction<boolean>) => {
      state.isSigningUp = action.payload;
    },
    setIsSigningIn: (state, action: PayloadAction<boolean>) => {
      state.isSigningIn = action.payload;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    setUserType: (state, action: PayloadAction<string>) => {
      state.userType = action.payload;
    },
    setVehicles: (state, action: PayloadAction<any[]>) => {
      state.vehicles = action.payload;
    },
    setProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
    },
    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.profileLoading = action.payload;
    },
    setProfileUpdating: (state, action: PayloadAction<boolean>) => {
      state.profileUpdating = action.payload;
    },
    resetAuth: () => initialState,
  },
});

export const {
  setIsAuthenticating,
  setIsAuthenticated,
  setIsSigningUp,
  setIsSigningIn,
  setUser,
  setUserType,
  setVehicles,
  setProfile,
  setProfileLoading,
  setProfileUpdating,
  resetAuth,
} = authSlice.actions;

export default authSlice.reducer;
