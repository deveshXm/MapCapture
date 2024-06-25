import React, { ChangeEventHandler, useState } from "react";

import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";

interface AnnotationModalProps {
  onClose: () => void;
  onSubmit: (value: string) => void;
}

const AnnotationModal: React.FC<AnnotationModalProps> = ({ onSubmit, onClose }) => {
  const [value, setValue] = useState("");

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (evt) => setValue(evt.target.value);

  const handleSubmit = () => {
    onSubmit(value);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="max-w-md">
        <div className="overflow-auto max-h-[90vh] space-y-4">
          <Label>Annotate</Label>
          <Input variant="bottomOutlined" placeholder="Enter Annotation" onChange={onInputChange} minLength={1} maxLength={50} />
          <Button.Root variant="solid" className="mx-auto" onClick={handleSubmit}>
            <Button.Label>Done</Button.Label>
          </Button.Root>
        </div>
      </div>
    </Modal>
  );
};

export default AnnotationModal;
