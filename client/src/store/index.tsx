import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "./mapSlice";
import authReducer from "./authSlice";
import { ENV } from "../constants/config";

export const store = configureStore({
  reducer: {
    map: mapReducer,
    auth: authReducer,
  },
  devTools: ENV === "dev",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
