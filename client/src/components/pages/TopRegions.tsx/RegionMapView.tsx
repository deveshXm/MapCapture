import geohash from "ngeohash";
import React, { useState, useEffect } from "react";
import Map, { Source, Layer, ViewState, ViewStateChangeEvent } from "react-map-gl";

import { MAPBOX_CONFIG } from "../../../constants/config";
import Progress from "../../ui/Progress";
import { notification } from "antd";

interface RegionMapViewProps {
  geohashString: string;
}

interface GeoJsonFeature {
  type: "Feature";
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

const RegionMapView: React.FC<RegionMapViewProps> = ({ geohashString }) => {
  const [viewState, setViewState] = useState<ViewState>({
    latitude: 0,
    longitude: 0,
    zoom: 2,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  const [geojson, setGeojson] = useState<GeoJsonFeature | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (geohashString) {
      const { latitude, longitude } = geohash.decode(geohashString);
      const bbox = geohash.decode_bbox(geohashString);

      setViewState((prevState) => ({
        ...prevState,
        latitude,
        longitude,
        zoom: 5,
      }));

      setGeojson({
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [bbox[1], bbox[0]],
              [bbox[3], bbox[0]],
              [bbox[3], bbox[2]],
              [bbox[1], bbox[2]],
              [bbox[1], bbox[0]],
            ],
          ],
        },
      });
    }
  }, [geohashString]);

  const layerStyle: React.ComponentProps<typeof Layer>["style"] = {
    id: "geohash-region",
    type: "fill",
    paint: {
      "fill-color": "#088",
      "fill-opacity": 0.5,
      "fill-outline-color": "#000",
    },
  };

  const handleMove = (evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
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
        {...viewState}
        onMove={handleMove}
        onLoad={handleLoad}
        onError={handleError}
        style={{ width: "100%", height: "100%", borderRadius: "0.5rem" }}
        mapStyle={MAPBOX_CONFIG.STYLE_URL}
        mapboxAccessToken={MAPBOX_CONFIG.ACCESS_TOKEN}
      >
        {geojson && (
          <Source type="geojson" data={geojson}>
            <Layer {...layerStyle} />
          </Source>
        )}
      </Map>
    </div>
  );
};

export default RegionMapView;
