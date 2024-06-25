import axios from "axios";
import { API_CONFIG } from "../constants/config";

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
});

export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const apiService = {
  register: async (username: string, email: string, password: string) => {
    const response = await api.post("/users/register", { username, email, password });
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post("/users/login", { email, password });
    return response.data;
  },
  saveMapData: async (center: [number, number], zoom: number, capturedImage: string, annotation?: string) => {
    const formData = new FormData();
    formData.append("center", JSON.stringify(center));
    formData.append("zoom", zoom.toString());
    const imageBlob = await fetch(capturedImage).then((res) => res.blob());
    formData.append("capturedImage", imageBlob, "mapImage.png");
    if (annotation) {
      formData.append("annotation", annotation);
    }
    const response = await api.post("/maps", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  getMapData: async (id: string) => {
    const response = await api.get(`/maps/${id}`);
    return response.data;
  },
  getUserMaps: async (page: number = 1, limit: number = 10) => {
    const response = await api.get(`/maps/user/?page=${page}&limit=${limit}`);
    return response.data;
  },
  getTopRegions: async () => {
    const response = await api.get("/maps/top");
    return response.data;
  },
  getTopRegions24H: async () => {
    const response = await api.get("/maps/top/24h");
    return response.data;
  },
};
