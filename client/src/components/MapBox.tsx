import React from "react";
import Map, { NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setCenter, setZoom } from "../store/mapSlice";

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZGV2ZXNoMTYwMiIsImEiOiJjbHhweHM2YWEwcnM4MnNxcmg5ZHJ0Z2hkIn0.snk-kofrjuC8sN1YaCpFZA";

const MapBox: React.FC = () => {
  const { center, zoom } = useSelector((state: RootState) => state.map);
  const dispatch = useDispatch();

  const handleMapMove = (evt) => {
    dispatch(setCenter([evt.viewState.longitude, evt.viewState.latitude]));
    dispatch(setZoom(evt.viewState.zoom));
  };

  return (
    <Map
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      initialViewState={{
        longitude: center[0],
        latitude: center[1],
        zoom: zoom,
      }}
      style={{ width: "100%", height: 400 }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onMove={handleMapMove}
    >
      <NavigationControl position="top-left" />
    </Map>
  );
};

export default MapBox;


