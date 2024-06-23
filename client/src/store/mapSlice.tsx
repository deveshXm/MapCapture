import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { MAPBOX_CONFIG } from "../constants/config";

const initialState: MapTypes.MapState = {
  center: MAPBOX_CONFIG.DEFAULT_CENTER,
  zoom: MAPBOX_CONFIG.DEFAULT_ZOOM,
  capturedImage: null,
  savedMaps: [],
  annotation: "",
  loading: false,
  error: null,
};

const mapSlice = createSlice({
  name: "map",
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
    setSavedMaps: (state, action: PayloadAction<MapTypes.MapData[]>) => {
      state.savedMaps = action.payload;
    },
    setAnnotation: (state, action: PayloadAction<string>) => {
      state.annotation = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCenter, setZoom, setCapturedImage, setSavedMaps, setLoading, setAnnotation, setError } = mapSlice.actions;
export default mapSlice.reducer;
