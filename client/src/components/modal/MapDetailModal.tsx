import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAnnotation, setCapturedImage, setCenter, setZoom } from "../../store/mapSlice";
import CuboidViewer from "../common/CuboidViewer";
import { Image } from "antd";
import Card from "../ui/Card";
import { Title } from "../ui/Title";
import Button from "../ui/Button";
import { Text } from "../ui/Text";
import Banner from "../ui/Banner";

interface MapDetailModalProps {
  map: MapTypes.MapData;
  onClose: () => void;
}

const MapDetailModal: React.FC<MapDetailModalProps> = ({ map, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Disable scrolling on the body
    document.body.style.overflow = "hidden";
    return () => {
      // Re-enable scrolling when the component unmounts
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleModalClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Prevent click events within the modal content from propagating to the overlay
    event.stopPropagation();
  };

  const handleReloadState = () => {
    dispatch(setZoom(map.zoom));
    dispatch(setCenter(map.center));
    dispatch(setCapturedImage(map.capturedImage));
    dispatch(setAnnotation(map.annotation));
    navigate("/capture");
  };

  return (
    <div className="fixed inset-0 bg-[#1f1f1f] bg-opacity-50 flex items-center justify-center overflow-y-auto" onClick={onClose}>
      <Card variant="elevated" className="p-4 max-w-3xl w-full bg-[#1f1f1f] overflow-auto max-h-[90vh]" onClick={handleModalClick}>
        <Button.Root onClick={onClose} variant="ghost">
          <Button.Label>&larr; Go Back</Button.Label>
        </Button.Root>
        <Title className="mb-4">Capture</Title>
        <Image src={map.capturedImage} alt="Captured Map" className="rounded-xl" />
        <div className="mb-4 mt-4">
          <Banner.Root intent="info" className="p-[--toast-padding]">
            <Banner.Content>
              <Text>Created at: {new Date(map.createdAt).toLocaleString()}</Text>
            </Banner.Content>
            <Banner.Content>{map.annotation && <Text>Annotation: {map.annotation}</Text>}</Banner.Content>
          </Banner.Root>
        </div>
        <Title className="mb-4">3D View</Title>
        <div className="rounded-xl">
          <CuboidViewer capturedImage={map.capturedImage} />
        </div>
        <Button.Root onClick={handleReloadState} className="mt-2 mx-auto" variant="solid">
          <Button.Label>Reload State</Button.Label>
        </Button.Root>
      </Card>
    </div>
  );
};

export default MapDetailModal;
