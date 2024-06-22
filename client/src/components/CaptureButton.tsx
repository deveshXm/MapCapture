// src/components/CaptureButton.tsx

import React from 'react';
import { useDispatch } from 'react-redux';
import html2canvas from 'html2canvas';
import { setCapturedImage, setLoading, setError } from '../store/mapSlice';

const CaptureButton: React.FC = () => {
  const dispatch = useDispatch();

  const handleCapture = async () => {
    dispatch(setLoading(true));
    try {
      const mapElement = document.querySelector('.mapboxgl-canvas-container') as HTMLElement;
      if (!mapElement) {
        throw new Error('Map element not found');
      }

      const canvas = await html2canvas(mapElement);
      const imageDataUrl = canvas.toDataURL('image/png');

      dispatch(setCapturedImage(imageDataUrl));
      console.log(imageDataUrl)
      dispatch(setError(null));
    } catch (error) {
      console.error('Failed to capture map:', error);
      dispatch(setError('Failed to capture map'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <button
      onClick={handleCapture}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Capture Map and Create 3D Model
    </button>
  );
};

export default CaptureButton;