export const ENV = import.meta.env.VITE_ENV;


export const MAPBOX_CONFIG = {
  ACCESS_TOKEN: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
  STYLE_URL: "mapbox://styles/mapbox/streets-v11",
  MAP_WIDTH: "100%",
  MAP_HEIGHT: 400,
  DEFAULT_CENTER: [-74.5, 40] as [number, number],
  DEFAULT_ZOOM: 9,
  MIN_ZOOM: 0,
  MAX_ZOOM: 22,
};

export const UI_CONFIG = {
  ITEMS_PER_PAGE: 9,
};

export const STATIC_MAP_CONFIG = {
  WIDTH: 600,
  HEIGHT: 400,
};

export const API_CONFIG = {
  BASE_URL: ENV === "dev" ? "http://localhost:3333/api" : import.meta.env.VITE_BASE_URL,
};
