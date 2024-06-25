import React, { useEffect } from "react";
import Card from "./Card";

interface ModalProps {
  onClose: () => void;
  children: any;
}

const Modal = ({ onClose, children }: ModalProps) => {
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
  return (
    <div className="fixed inset-0 bg-[#1f1f1f] bg-opacity-50 flex items-center justify-center overflow-y-auto z-[1000]" onClick={onClose}>
      <Card variant="elevated" className="md:p-4 max-w-3xl bg-[#1f1f1f] " onClick={handleModalClick}>
        {children}
      </Card>
    </div>
  );
};

export default Modal;
