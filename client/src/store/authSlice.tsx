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

export function setItemWithExpiry<T>(key: string, value: T, expiryTime: number): void {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + expiryTime,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getItemWithExpiry<T>(key: string): T | null {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr) as { value: T; expiry: number };
  const now = new Date();
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

const initialState: AuthState = {
  token: getItemWithExpiry("token"),
  user: JSON.parse(getItemWithExpiry("user") || "null"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: { id: string; username: string; email: string } }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      // Set token and user with 1-day expiration time (24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
      setItemWithExpiry("token", action.payload.token, 24 * 60 * 60 * 1000);
      setItemWithExpiry("user", JSON.stringify(action.payload.user), 24 * 60 * 60 * 1000);
      setAuthToken(action.payload.token);
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAuthToken("");
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
