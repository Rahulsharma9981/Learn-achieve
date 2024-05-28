import React from "react";
import { Modal, ModalBody } from "react-bootstrap";
import Image from "../Reusable/Image";
import { SvgImages } from "../../Utils/LocalImages";
import ButtonWithIcon from "../Reusable/ButtonWithIcon";

const FormModal = ({ showModal, setShowModal, title, children, submitClickAction, submitButtonIcon = SvgImages.plus, submitButtonText = "Add" }) => {
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      centered // Center the modal vertically and horizontally
      aria-labelledby="exampleModalToggleLabel2"
      contentClassName="p-0 bg-transparent border-0 shadow-none"
    >
      <ModalBody className="p-0">
        <div>
          <div className="modal-content p-4">
            <div className="modal-header p-0 mb-3">
              <h2 className="fs-20 fw-600 black mb-0">{title}</h2>
              <Image className="cursor-pointer" src={SvgImages.cross} style={{ height: "20px", aspectRatio: 1 }} onClick={() => setShowModal(false)} />
            </div>
            <div className="modal-body p-0">
              {children}
            </div>
            <div className="modal-footer p-0">
              <ButtonWithIcon text={submitButtonText} icon={submitButtonIcon} onClick={submitClickAction} />
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default FormModal;
