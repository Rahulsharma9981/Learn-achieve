import React from "react";
import { Modal } from "react-bootstrap";

const DynamicModal = ({ showModal, setShowModal, title, bodyContent, footerContent }) => {
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      centered // Center the modal vertically and horizontally
    >
      <Modal.Header closeButton style={{ padding: 0 }}> {/* Remove padding */}
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: 0 }}> {/* Remove padding */}
        {bodyContent}
      </Modal.Body>
      <Modal.Footer style={{ padding: 0 }}> {/* Remove padding */}
        {footerContent}
      </Modal.Footer>
    </Modal>
  );
};

export default DynamicModal;
