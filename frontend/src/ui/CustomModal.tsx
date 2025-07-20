import React, { FC } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const CustomModal: FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{title}</h2>
          </ModalHeader>
          <ModalBody>{children}</ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
};
