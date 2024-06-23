// src/store/authSlice.js (assuming you are using Redux Toolkit)

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setAuthToken } from "../services/apiService";

interface AuthState {
  token: string | null;
  user: {
    id: string;
    username: string;
    email: string;
  } | null;
}

const initialState: AuthState = {
  token: sessionStorage.getItem("token"),
  user: JSON.parse(sessionStorage.getItem("user") || "null"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: { id: string; username: string; email: string } }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      sessionStorage.setItem("token", action.payload.token);
      sessionStorage.setItem("user", JSON.stringify(action.payload.user));
      setAuthToken(action.payload.token);
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      setAuthToken("");
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
