import axios from 'axios';

const API_BASE_URL = 'https://api.example.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface MapData {
  id: string;
  center: [number, number];
  zoom: number;
  capturedImage: string;
  createdAt: string;
}

export const apiService = {
  saveMapData: async (mapData: Omit<MapData, 'id' | 'createdAt'>): Promise<MapData> => {
    // Dummy API call
    const response = await api.post<MapData>('/map-data', mapData);
    return response.data;
  },

  getMapData: async (id: string): Promise<MapData> => {
    // Dummy API call
    const response = await api.get<MapData>(`/map-data/${id}`);
    return response.data;
  },

  getUserMapData: async (): Promise<MapData[]> => {
    // Dummy API call
    const response = await api.get<MapData[]>('/user/map-data');
    return response.data;
  },

  getTopRegions: async (): Promise<{ region: string; count: number }[]> => {
    // Dummy API call
    const response = await api.get<{ region: string; count: number }[]>('/top-regions');
    return response.data;
  },
};