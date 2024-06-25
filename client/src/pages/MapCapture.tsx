import React, { useRef, useState } from "react";
import { notification } from "antd";
import html2canvas from "html2canvas";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../store";
import { apiService } from "../services/apiService";
import { setAnnotation, setCapturedImage } from "../store/mapSlice";

import Button from "../components/ui/Button";
import { Label } from "../components/ui/label";
import { Title } from "../components/ui/Title";
import Textarea from "../components/ui/TextArea";
import MapView from "../components/pages/MapCapture/MapView";
import CuboidViewer from "../components/common/CuboidViewer";

const MapCapture: React.FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { capturedImage, center, zoom, annotation } = useSelector((state: RootState) => state.map);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleSaveMap = async () => {
    setLoading(true);
    if (!capturedImage) return;

    try {
      await apiService.saveMapData(center, zoom, capturedImage, annotation);
      notification.success({ message: "Capture saved!" });
    } catch (error) {
      console.error("Failed to save map:", error);
      notification.error({ message: "Something went wrong!" });
    }
    setLoading(false);
  };

  const handleAnnotationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setAnnotation(e.target.value));
  };

  const handleCapture = async () => {
    setLoading(true);
    if (!mapRef.current) return;
    try {
      const canvas = await html2canvas(mapRef.current);
      const imageUrl = canvas.toDataURL("image/png");
      dispatch(setCapturedImage(imageUrl));
    } catch (error) {
      notification.error({ message: "Couldn't capture image." });
    } finally {
      setLoading(false);
    }
  };

  const handleResetCapture = () => {
    dispatch(setCapturedImage(null));
  };

  return (
    <div className="h-full w-full md:w-[60%]">
      {capturedImage ? (
        <div className="mt-4">
          <Button.Root onClick={handleResetCapture} className="mb-4" variant="soft" disabled={loading}>
            <Button.Label>&larr; Go Back</Button.Label>
          </Button.Root>
          <Title className="mb-4">3D View</Title>
          <CuboidViewer capturedImage={capturedImage} onLoad={() => setLoading(false)} />
          <div className="mt-4">
            <Label>Annotation (Optional)</Label>
            <Textarea value={annotation} rows={3} onChange={handleAnnotationChange} placeholder="Add an annotation" className="mt-4" variant="bottomOutlined" />
          </div>
          <Button.Root onClick={handleSaveMap} className="mt-2 mx-auto" disabled={loading}>
            <Button.Label>Save Map</Button.Label>
          </Button.Root>
        </div>
      ) : (
        <>
          <div ref={mapRef}>
            <MapView onLoad={() => setLoading(false)} />
          </div>
          <Button.Root onClick={handleCapture} className="mx-auto mt-4" disabled={loading}>
            <Button.Label>Capture Map</Button.Label>
          </Button.Root>
        </>
      )}
    </div>
  );
};

export default MapCapture;
