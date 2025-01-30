import React from "react";

const CustomModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="custom-modal__overlay" onClick={onClose}  data-modal-backdrop="static" />
      <div className="custom-modal__content">
        <div className="custom-modal__inner">{children}</div>
      </div>
    </>
  );
};

export default CustomModal;
