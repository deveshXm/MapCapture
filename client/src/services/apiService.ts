import axios from "axios";
import { MAPBOX_CONFIG } from "../constants/config";

const API_BASE_URL = "http://localhost:3333/api"; // Update this with your actual API URL

const api = axios.create({
  baseURL: API_BASE_URL,
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
    const response = await api.post("/maps", { center, zoom, capturedImage, annotation });
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
  getStaticMapImageUrl: (center: [number, number], zoom: number, width: number, height: number): string => {
    const [lng, lat] = center;
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lng},${lat},${zoom}/${width}x${height}@2x?access_token=${MAPBOX_CONFIG.ACCESS_TOKEN}`;
  },
};
