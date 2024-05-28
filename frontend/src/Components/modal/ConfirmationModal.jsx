import React from "react";
import { Modal, ModalBody } from "react-bootstrap";
import Image from "../Reusable/Image";
import { ConfirmationModalTheme } from "../../Utils/Enums";

const ConfirmationModal = ({ showModal, setShowModal, text, rightClickAction, leftClickAction, icon, rightButtonText = "Yes", leftButtonText = "No", theme = ConfirmationModalTheme.theme, isSingleButtoned = false}) => {
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      dialogClassName="my-0"
      centered // Center the modal vertically and horizontally
      aria-labelledby="exampleModalToggleLabel2"
      contentClassName="p-0 bg-transparent border-0 shadow-none m-0"
    >
      <ModalBody className="p-0">
        <div className="w-100 d-flex flex-column">
          <div className="modal_icon_background bg_red mx-auto" style={{background: theme.primary}}>
            <Image src={icon} style={{ height: "50%", aspectRatio: 1 }} />
          </div>

          <div className="modal-content clip_content align-items-center d-flex flex-column">
            <div className="modal-header p-0 justify-content-center align-items-center d-flex flex-column">
              <div className="circle_1 red_primary" style={{background: theme.secondary}}>
                <div className="circle_2 red_secondary" style={{background: theme.tertiary}}/>
              </div>
              <div className="mb-4">
                <h1 className="fs-26 fw-600 text_small mb-0 text-center mt-3" id="exampleModalToggleLabel2">{text}</h1>
              </div>
            </div>
            <div className="modal-footer p-0 justify-content-center">
              <div className="gap-3 d-flex">
                {!isSingleButtoned ? <button className="modal_primary_btn" data-bs-dismiss="modal" aria-label="Close" onClick={() => {
                  setShowModal(false)
                  if (leftClickAction) {
                    leftClickAction()
                  }
                }}>{leftButtonText}</button> : null}
                <button className="modal_secondary_btn bg_red" style={{background : isSingleButtoned ? theme.primary : ""}} onClick={rightClickAction}>{rightButtonText}</button>
              </div>
            </div>
          </div>

          <div className="modal_border_bottom bg_red" style={{background: theme.primary}}/>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ConfirmationModal;
