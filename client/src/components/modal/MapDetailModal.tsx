import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAnnotation, setCapturedImage, setCenter, setZoom } from "../../store/mapSlice";
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
      <Card variant="elevated" className="md:p-4 max-w-3xl w-full bg-[#1f1f1f] " onClick={handleModalClick}>
        <Button.Root onClick={onClose} variant="ghost" className="mb-4">
          <Button.Label>&larr; Go Back</Button.Label>
        </Button.Root>
        <div className="overflow-auto max-h-[90vh]">
          <Title className="mb-4">Capture</Title>
          <Image src={map.capturedImage} alt="Captured Map" className="rounded-xl" />
          <div className="mb-4 mt-4">
            <Banner.Root intent="info" className="p-[--toast-padding]">
              <Banner.Content>
                <Text>{new Date(map.createdAt).toLocaleString()}</Text>
              </Banner.Content>
              <Banner.Content>{map.annotation && <Text>{map.annotation}</Text>}</Banner.Content>
            </Banner.Root>
          </div>
          <Button.Root onClick={handleReloadState} className="mt-2 mx-auto" variant="solid">
            <Button.Label>Load Map</Button.Label>
          </Button.Root>
        </div>
      </Card>
    </div>
  );
};

export default MapDetailModal;
