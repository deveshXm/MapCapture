import { notification } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../store";
import { apiService } from "../services/apiService";
import { setAnnotation, setCapturedImage, setError} from "../store/mapSlice";

import { STATIC_MAP_CONFIG } from "../constants/config";

import Button from "../components/ui/Button";
import { Label } from "../components/ui/label";
import { Title } from "../components/ui/Title";
import Textarea from "../components/ui/TextArea";
import MapView from "../components/common/MapView";
import CuboidViewer from "../components/common/CuboidViewer";


const MapCapture: React.FC = () => {
  const dispatch = useDispatch();
  const { error, capturedImage, center, zoom, annotation } = useSelector((state: RootState) => state.map);

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
    try {
      const imageUrl = apiService.getStaticMapImageUrl(center, zoom, STATIC_MAP_CONFIG.WIDTH, STATIC_MAP_CONFIG.HEIGHT);
      dispatch(setCapturedImage(imageUrl));
      dispatch(setError(null));
    } catch (error) {
      console.error("Failed to capture map:", error);
      dispatch(setError("Failed to capture map"));
    }
  };

  const handleResetCapture = async () => {
    dispatch(setCapturedImage(null));
  };

  return (
    <div className="h-full w-full md:w-[60%]">
      {capturedImage ? (
        <div className="mt-4">
          <Button.Root onClick={handleResetCapture} className="mb-4" variant="soft">
            <Button.Label>&larr; Go Back</Button.Label>
          </Button.Root>
          <Title className="mb-4">3D View</Title>
          <CuboidViewer capturedImage={capturedImage} />
          <div className="mt-4">
            <Label>Annotation (Optional)</Label>
            <Textarea value={annotation} rows={3} onChange={handleAnnotationChange} placeholder="Add an annotation" className="mt-4" variant="bottomOutlined" />
          </div>
          <Button.Root onClick={handleSaveMap} className="mt-2 mx-auto">
            <Button.Label>Save Map</Button.Label>
          </Button.Root>
        </div>
      ) : (
        <MapView />
      )}
      {!capturedImage && (
        <Button.Root onClick={handleCapture} className="mx-auto mt-4">
          <Button.Label>Capture Map</Button.Label>
        </Button.Root>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default MapCapture;
