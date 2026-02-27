import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth";
import { stationsReducer } from "../features/stations";

const rootReducer = combineReducers({
  auth: authReducer,
  stations: stationsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
