import React, { useState } from "react";
import CustomTextField from "../../Components/Reusable/CustomTextField";
import Image from "../../Components/Reusable/Image";
import ButtonWithIcon from "../../Components/Reusable/ButtonWithIcon";
import { SvgImages } from "../../Utils/LocalImages";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { InputType, handleApiErrors, validationRegex } from "../../Utils/Utils";
import ConfirmationModal from "../../Components/modal/ConfirmationModal";
import { ConfirmationModalTheme } from "../../Utils/Enums";
import AuthService from "../../Services/AuthService";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../Utils/RoutesPath";

const ChangePassword = ({ show }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const navigate = useNavigate();
  const schema = yup.object().shape({
    currentPassword: validationRegex.currentPassword,
    newPassword: validationRegex.newPassword,
    confirmPassword: validationRegex.confirmPassword,
  });

  const { register: registerUpdate, handleSubmit: handleSubmitUpdate, formState: { errors: errorsUpdate } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleChangePassword = async (data) => {
    const { currentPassword, newPassword } = data;
    try {
      await AuthService.changePassword(
        currentPassword,
        newPassword,
      );

      setShowConfirmationModal(true);
    } catch (error) {
      handleApiErrors(error);
    }
  };

  return (
    <div className={`tab-pane fade ${!show ? "show active" : ""} fs-16 fw-600`}>
      <div className="table_container d-flex flex-column p-0 mt-4">
        <form onSubmit={handleSubmitUpdate(handleChangePassword)}>

          <div className="row profile_inputs w-100">
            <div className="col-md-6">
              <CustomTextField
                labelTitle="Current Password"
                placeholder="Enter Current Password"
                inputType={InputType.password}
                id="currentPassword"
                name="currentPassword"
                showError={errorsUpdate?.currentPassword}
                errorMessage={errorsUpdate?.currentPassword?.message}
                register={registerUpdate}
                additionalClasses="profile_edit"
                showMandatory={true}
              />
            </div>

            <div className="col-md-6">
              <CustomTextField
                labelTitle="New Password"
                additionalClasses="profile_edit"
                inputType={InputType.password}
                id="newPassword"
                name="newPassword"
                placeholder="Enter New Password"
                showError={errorsUpdate?.newPassword}
                errorMessage={errorsUpdate?.newPassword?.message}
                register={registerUpdate}
                showMandatory={true}
              />
            </div>

            <div className="col-md-6">
              <CustomTextField
                labelTitle="Confirm Password"
                inputType={InputType.password}
                additionalClasses="profile_edit"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Enter Confirm Password"
                showError={errorsUpdate?.confirmPassword}
                errorMessage={errorsUpdate?.confirmPassword?.message}
                register={registerUpdate}
                showMandatory={true}
              />
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <a className="back_login m-0 cursor-pointer" onClick={() => window.history.back()}>
              <Image src={SvgImages.back_arrow_login} className="m-0" />
              Back
            </a>
            <div className="select-btn ">
              <ButtonWithIcon text={"Change Password"} icon={SvgImages.lock} onClick={handleSubmitUpdate(handleChangePassword)}/>
            </div>
          </div>
        </form>
      </div>

      <ConfirmationModal
        showModal={showConfirmationModal}
        setShowModal={setShowConfirmationModal}
        text={"Password Updated Successfully"}
        icon={SvgImages.tick_mark}
        rightClickAction={() => {
          setShowConfirmationModal(false);
          navigate(RoutesPath.viewProfile);
        }}
        theme={ConfirmationModalTheme.success}
        isSingleButtoned={true}
      />
    </div>
  );
};

export default ChangePassword;
