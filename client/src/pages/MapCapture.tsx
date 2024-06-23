// src/pages/MapCapture.tsx

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { apiService } from "../services/apiService";
import { setAnnotation, setCapturedImage, setError, setLoading } from "../store/mapSlice";
import CuboidViewer from "../components/common/CuboidViewer";
import MapView from "../components/common/MapView";
import Button from "../components/ui/Button";
import { Title } from "../components/ui/Title";
import { notification } from "antd";
import Textarea from "../components/ui/TextArea";
import { Label } from "../components/ui/label";

const MapCapture: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error, capturedImage, center, zoom, annotation } = useSelector((state: RootState) => state.map);

  const handleSaveMap = async () => {
    if (!capturedImage) return;

    try {
      await apiService.saveMapData(center, zoom, capturedImage, annotation);
      notification.success({ message: "Capture saved!" });
    } catch (error) {
      console.error("Failed to save map:", error);
      notification.error({ message: "Something went wrong!" });
    }
  };

  const handleAnnotationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setAnnotation(e.target.value));
  };

  const handleCapture = async () => {
    dispatch(setLoading(true));
    try {
      const imageUrl = apiService.getStaticMapImageUrl(center, zoom, 600, 400);
      dispatch(setCapturedImage(imageUrl));
      dispatch(setError(null));
    } catch (error) {
      console.error("Failed to capture map:", error);
      dispatch(setError("Failed to capture map"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Title className="mb-4">Map Capture and 3D Viewer</Title>
      <MapView />
      <Button.Root onClick={handleCapture} className="mx-auto mt-4">
        <Button.Label>Capture Map</Button.Label>
      </Button.Root>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {capturedImage && (
        <div className="mt-4">
          <Title className="mb-4">3D View</Title>
          <CuboidViewer capturedImage={capturedImage} />
          <div className="mt-4">
            <Label>Annotate (Optional)</Label>
            <Textarea value={annotation} rows={3} onChange={handleAnnotationChange} placeholder="Add an annotation" className="mt-4" variant="bottomOutlined" />
          </div>
          <Button.Root onClick={handleSaveMap} className="mt-2 mx-auto">
            <Button.Label>Save Map</Button.Label>
          </Button.Root>
        </div>
      )}
    </div>
  );
};

export default MapCapture;
