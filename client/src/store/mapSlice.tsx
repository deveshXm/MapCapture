import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MapData } from '../services/api';

interface MapState {
  center: [number, number];
  zoom: number;
  capturedImage: string | null;
  savedMaps: MapData[];
  loading: boolean;
  error: string | null;
}

const initialState: MapState = {
  center: [-74.5, 40],
  zoom: 9,
  capturedImage: null,
  savedMaps: [],
  loading: false,
  error: null,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setCenter: (state, action: PayloadAction<[number, number]>) => {
      state.center = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setCapturedImage: (state, action: PayloadAction<string>) => {
      state.capturedImage = action.payload;
    },
    setSavedMaps: (state, action: PayloadAction<MapData[]>) => {
      state.savedMaps = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCenter, setZoom, setCapturedImage, setSavedMaps, setLoading, setError } = mapSlice.actions;
export default mapSlice.reducer;