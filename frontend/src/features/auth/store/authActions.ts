import { message, notification } from "antd";
import { AppDispatch } from "../../../redux";
import { logger } from "../../../utils/logger";
import { routes } from "../../../routes";
import { Cache, UsersService, VehiclesService } from "../../../services";
import {
  setIsAuthenticating,
  setIsSigningUp,
  setIsSigningIn,
  setUser,
  setVehicles,
  setProfile,
  setProfileLoading,
  setProfileUpdating,
  resetAuth,
} from "./authSlice";

/**
 * Auth Actions
 * Thunk actions for authentication operations
 */

export const authActions = {
  /**
   * Set user from cache
   */
  handleSetUser: (user: any) => (dispatch: AppDispatch) => {
    dispatch(setUser(user));
  },

  /**
   * List all available vehicles
   */
  handleListVehicles: () => async (dispatch: AppDispatch) => {
    try {
      const res = await VehiclesService.listVehicles();
      if (res.status === 200) {
        dispatch(setVehicles(res.data));
      }
    } catch (error) {
      logger.error(error, "handleListVehicles()");
    }
  },

  /**
   * User signup
   */
  handleSignup:
    (data: {
      name: string;
      email: string;
      vehicle: string;
      password: string;
      userType: string;
    }) =>
    async (dispatch: AppDispatch) => {
      dispatch(setIsAuthenticating(true));
      dispatch(setIsSigningUp(true));
      try {
        const res = await UsersService.signup({
          name: data?.name ?? "",
          email: data?.email ?? "",
          vehicle: data?.vehicle ?? "",
          password: data?.password ?? "",
          user_type: data?.userType ?? "consumer",
        });
        if (res.data.success && res.data.tokens) {
          dispatch(setUser(res.data.user));
          Cache.setItem({
            user: res.data.user,
            accessToken: res.data.tokens.access_token,
            refreshToken: res.data.tokens.refresh_token,
          });
          window.location.href = routes.HOME;
        } else {
          message.error(res.data.message);
        }
      } catch (error) {
        logger.error(error, "handleSignup()");
        message.error("Some error occured");
      } finally {
        dispatch(setIsAuthenticating(false));
        dispatch(setIsSigningUp(false));
      }
    },

  /**
   * User signin
   */
  handleSignin:
    (data: { email: string; password: string }) =>
    async (dispatch: AppDispatch) => {
      dispatch(setIsAuthenticating(true));
      dispatch(setIsSigningIn(true));
      try {
        const res = await UsersService.signin({
          email: data?.email ?? "",
          password: data?.password ?? "",
        });
        if (res.data.success && res.data.tokens) {
          dispatch(setUser(res.data.user));
          Cache.setItem({
            user: res.data.user,
            accessToken: res.data.tokens.access_token,
            refreshToken: res.data.tokens.refresh_token,
          });
          window.location.href = routes.HOME;
          notification.success({ message: res.data.message });
        } else if (res.status === 401) {
          message.error("Invalid credentials");
        } else {
          message.error("Some error occured");
        }
      } catch (error) {
        logger.error(error, "handleSignin()");
        message.error("Some error occured");
      } finally {
        dispatch(setIsAuthenticating(false));
        dispatch(setIsSigningIn(false));
      }
    },

  /**
   * User signout
   */
  handleSignout: () => (dispatch: AppDispatch) => {
    Cache.clear();
    dispatch(resetAuth());
    window.location.href = routes.SIGNIN;
  },

  /**
   * Get user profile
   */
  handleGetProfile:
    (callback: (user: any) => void = () => {}) =>
    async (dispatch: AppDispatch) => {
      dispatch(setProfileLoading(true));
      try {
        const res = await UsersService.getConsumer();
        if (res.data.success) {
          dispatch(setProfile(res.data.user));
          callback(res.data.user);
        }
      } catch (error) {
        logger.error(error, "handleGetProfile()");
      } finally {
        dispatch(setProfileLoading(false));
      }
    },

  /**
   * Update user profile
   */
  handleUpdateProfile:
    (data: { name?: string; phone?: string; vehicle?: string | number }) =>
    async (dispatch: AppDispatch) => {
      dispatch(setProfileUpdating(true));
      try {
        const res = await UsersService.updateConsumer({
          name: data?.name ?? "",
          phone: data?.phone ?? "",
          vehicle: data?.vehicle ?? "",
        });
        if (res.data.success) {
          message.success("Profile updated");
          window.location.href = routes.HOME;
        } else {
          message.error("Couldn't update profile.");
        }
      } catch (error) {
        logger.error(error, "handleUpdateProfile()");
      } finally {
        dispatch(setProfileUpdating(false));
      }
    },
};
