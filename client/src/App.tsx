// src/App.tsx

import React from "react";
import MapComponent from "./components/MapBox";
import CaptureButton from "./components/CaptureButton";
import CuboidViewer from "./components/CuboidViewer";
import { useSelector } from "react-redux";
import { RootState } from "./store";

const App: React.FC = () => {
  const { capturedImage, loading, error } = useSelector((state: RootState) => state.map);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">3D Map Capture App</h1>
      <div className="mb-4">
        <MapComponent />
      </div>
      <div className="mb-4">
        <CaptureButton />
      </div>
      {loading && <div className="text-blue-500">Loading...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}
      {capturedImage && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">3D Map Cube</h2>
          <CuboidViewer />
        </div>
      )}
    </div>
  );
};

export default App;
