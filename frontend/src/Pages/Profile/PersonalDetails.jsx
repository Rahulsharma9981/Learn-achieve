import React, { useContext, useEffect, useState } from "react";
import CustomTextField from "../../Components/Reusable/CustomTextField";
import Image from "../../Components/Reusable/Image";
import { SvgImages } from "../../Utils/LocalImages";
import ButtonWithIcon from "../../Components/Reusable/ButtonWithIcon";
import { handleApiErrors, validationRegex } from "../../Utils/Utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import ConfirmationModal from "../../Components/modal/ConfirmationModal";
import { ConfirmationModalTheme } from "../../Utils/Enums";
import AuthService from "../../Services/AuthService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../Context/authContext";
import ApiConstants from "../../Utils/ApiConstant";
import SessionManager from "../../Utils/Session";

const PersonalDetails = ({ show }) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const validationSchema = yup.object().shape({
    name: validationRegex.required,
    email: validationRegex.email,
    mobile: validationRegex.required,
  });

  const { register: registerDetails, handleSubmit: handleSubmitDetails, setValue: setUserValues, formState: { errors: errorsDetails } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: user?.name?.trim(),
      email: user?.email?.trim(),
      mobile: user?.mobile_number?.trim(),
    },
  });

  const getData = async () => {
    try {
      const response = await AuthService.getDetails();
      if (response) {
        SessionManager.shared.storeUserData(response.user);
        setUserValues("name", response.user?.name?.trim())
        setUserValues("mobile", response.user?.mobile_number?.trim())
        setUserValues("email", response.user?.email?.trim())
      }
    } catch (error) {
      handleApiErrors(error);
    }
  };

  useEffect(() => { getData() }, []);

  const handleChangeDetails = async (data) => {
    const { name, email, mobile } = data;
    try {
      const response = await AuthService.updateProfileDetails(name, email, mobile,);
      // setShowConfirmationModal(true);

      toast.success("Profile Updated Successfully!");

      SessionManager.shared.storeUserData(response.user);
      setUserValues("name", response.user?.name?.trim())
      setUserValues("mobile", response.user?.mobile_number?.trim())
      setUserValues("email", response.user?.email?.trim())
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const updateProfilePic = async (file) => {
    try {
      const response = await AuthService.updateProfilePic(file);
      // setShowConfirmationModal(true);

      toast.success("Profile Pic Updated Successfully!");
      SessionManager.shared.storeUserData(response.user);
      setUserValues("name", response.user?.name?.trim())
      setUserValues("mobile", response.user?.mobile_number?.trim())
      setUserValues("email", response.user?.email?.trim())
    } catch (error) {
      handleApiErrors(error);
    }
  };

  return (
    <div className={`tab-pane fade ${show ? "show active" : ""} fs-16 fw-600`} >
      <form onSubmit={handleSubmitDetails(handleChangeDetails)}>
        <div className="table_container d-flex flex-column p-0">

          <div className="mx-auto my-4">
            <div className="mb-4 d-flex justify-content-center select_profile_img">
              <CustomTextField id="file" type="file" className="d-none" />
              <Image className="modal_profile" id="output" style={{ objectFit: "cover" }}
                src={user?.profile_pic && user.profile_pic?.trim() !== "" ? ApiConstants.BASE_URL + user.profile_pic : SvgImages.user_profile}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = SvgImages.user_profile;
                }} />
              <div className="position-relative">
                <a className="secondary fs-16 fw-500 edit_img d-flex justify-content-center align-items-center" >
                  <Image src={SvgImages.camera} />
                </a>

                <input type="file" className="edit_img opacity-0" multiple={false} accept="image/*" name="fileupload"
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      updateProfilePic(e.target.files[0]);
                    }
                  }} />
              </div>
            </div>
            <div className="profile_text mb-0">
              <h2>{user?.name?.trim()}</h2>
              <h3>Admin</h3>
            </div>
          </div>

          <div className="row profile_inputs w-100">
            <div className="col-md-6">
              <CustomTextField
                labelTitle="Name"
                placeholder="Enter Name"
                name="name"
                id="name"
                showError={errorsDetails?.name}
                errorMessage={errorsDetails?.name?.message}
                register={registerDetails}
                additionalClasses="profile_edit"
                showMandatory={true}
              />
            </div>

            <div className="col-md-6">
              <CustomTextField
                labelTitle="Email Id"
                placeholder="Enter Email"
                name="email"
                id="email"
                disabled={true}
                showError={errorsDetails?.email}
                errorMessage={errorsDetails?.email?.message}
                register={registerDetails}
                additionalClasses="profile_edit"
                showMandatory={true}
              />
            </div>

            <div className="col-md-6">
              <CustomTextField
                labelTitle="Mobile No."
                placeholder="Enter Mobile No."
                name="mobile"
                id="mobile"
                showError={errorsDetails?.mobile}
                errorMessage={errorsDetails?.mobile?.message}
                register={registerDetails}
                additionalClasses="profile_edit"
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
              <ButtonWithIcon text={"Update"} icon={SvgImages.tick_mark} onClick={handleSubmitDetails(handleChangeDetails)} />
            </div>
          </div>
        </div>
      </form>

      <ConfirmationModal
        showModal={showConfirmationModal}
        setShowModal={setShowConfirmationModal}
        text={"Profile Updated Successfully"}
        icon={SvgImages.tick_mark}
        rightClickAction={() => {
          setShowConfirmationModal(false);
        }}
        theme={ConfirmationModalTheme.success}
        isSingleButtoned={true}
      />
    </div>
  );
};

export default PersonalDetails;
