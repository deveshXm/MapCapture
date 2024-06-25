import React from "react";
import { Image } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Button from "../../ui/Button";
import { Text } from "../../ui/Text";
import Banner from "../../ui/Banner";
import { Title } from "../../ui/Title";
import Modal from "../../ui/Modal";

import { setAnnotation, setCapturedImage, setCenter, setZoom } from "../../../store/mapSlice";

interface MapDetailModalProps {
  map: MapTypes.MapData;
  onClose: () => void;
}

const MapDetailModal: React.FC<MapDetailModalProps> = ({ map, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleReloadState = () => {
    dispatch(setZoom(map.zoom));
    dispatch(setCenter(map.center));
    dispatch(setCapturedImage(map.capturedImage));
    dispatch(setAnnotation(map.annotation));
    navigate("/capture");
  };

  return (
    <Modal onClose={onClose}>
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
          </Banner.Root>
        </div>
        <Button.Root onClick={handleReloadState} className="mt-2 mx-auto" variant="solid">
          <Button.Label>Load Map</Button.Label>
        </Button.Root>
      </div>
    </Modal>
  );
};

export default MapDetailModal;
