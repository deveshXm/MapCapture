import "mapbox-gl/dist/mapbox-gl.css";
import { notification } from "antd";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Map, { NavigationControl, ViewStateChangeEvent } from "react-map-gl";

import { RootState } from "../../store";
import { MAPBOX_CONFIG } from "../../constants/config";
import { setCenter, setZoom } from "../../store/mapSlice";

import Progress from "../ui/Progress";

const MapView: React.FC = () => {
  const { center, zoom } = useSelector((state: RootState) => state.map);
  const [progress, setProgress] = useState(0);

  const dispatch = useDispatch();

  const handleMapMove = (evt: ViewStateChangeEvent) => {
    dispatch(setCenter([evt.viewState.longitude, evt.viewState.latitude]));
    dispatch(setZoom(evt.viewState.zoom));
  };

  const handleLoad = () => {
    setProgress(100);
  };

  const handleError = () => {
    notification.error({ message: "Something went wrong!" });
    setProgress(100);
  };

  return (
    <div style={{ position: "relative", width: MAPBOX_CONFIG.MAP_WIDTH, height: MAPBOX_CONFIG.MAP_HEIGHT }}>
      {progress !== 100 && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-[#1f1f1f] flex-1 ">
          <Progress.Root className="w-72" data-orientation="vertical" value={progress} size="md" variant="soft">
            <Progress.Indicator intent="primary" loading="primary" complete="success" style={{ transform: `translateX(-${100 - progress}%)` }} />
          </Progress.Root>
        </div>
      )}
      <Map
        mapboxAccessToken={MAPBOX_CONFIG.ACCESS_TOKEN}
        initialViewState={{
          longitude: center[0],
          latitude: center[1],
          zoom: zoom,
        }}
        style={{ width: "100%", height: "100%", borderRadius: "0.5rem" }}
        mapStyle={MAPBOX_CONFIG.STYLE_URL}
        onError={handleError}
        onMove={handleMapMove}
        minZoom={MAPBOX_CONFIG.MIN_ZOOM}
        maxZoom={MAPBOX_CONFIG.MAX_ZOOM}
        onLoad={handleLoad}
      >
        <NavigationControl position="top-left" />
      </Map>
    </div>
  );
};

export default MapView;
