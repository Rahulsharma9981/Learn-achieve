import React, { useRef } from "react";
import AuthService from "../../Services/AuthService";
import { toast } from "react-toastify";
import { PngImages } from "../../Utils/LocalImages";
import Image from "../../Components/Reusable/Image";
import AuthLayout from "../../Layouts/authLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { SubTitleLabel, TitleLabel } from "../../Components/Reusable/LabelComponents";
import SubmitButton from "../../Components/Reusable/Buttons";
import { OtpVerificationType } from "../../Utils/Enums";
import RoutesPath from "../../Utils/RoutesPath";
import { handleApiErrors } from "../../Utils/Utils";

const OTPVerify = () => {
  const propData = useLocation().state;  // get email from local storage for verification purpose
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const otpCount = 6;

  // Function to handle input change
  const handleChange = (event, index) => {
    const value = event.target.value;

    if (value && index === inputRefs.current.length - 1) {
      handleOtpSubmit();
      return;
    }

    // Ensure input is a single digit
    if (/^\d$/.test(value)) {
      // Move focus to next input
      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = (index, event) => {
    if (event.key === "Backspace" && index > 0) {
      if (
        index === inputRefs.current.length - 1 &&
        inputRefs.current[index].value !== ""
      ) {
        inputRefs.current[index].value = "";
        return;
      }
      inputRefs.current[index - 1].focus();
    }
  };

  const getOtpValue = () => {
    return inputRefs.current
      .map((e) => e.value)
      .join("")
      .toString();
  };

  const resendOtp = async () => {
    try {
      if (propData.type === OtpVerificationType.login){
        const response = await AuthService.login(propData.email, propData.password);
        toast.success(`OTP resent successfully :: ${response.otp}`);
      }else if (propData.type === OtpVerificationType.forgotPassword){
        const response = await AuthService.forgotPassword(propData.email);
        toast.success(`OTP resent successfully :: ${response.otp}`);
      }
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const handleOtpSubmit = async () => {
    const otp = getOtpValue().trim();
    if (!otp.trim() || otp.length !== otpCount) {
      toast.warning("OTP must be " + otpCount.toString() + " digits");
      return;
    }
    try {
      const response = await AuthService.verifyOTP(propData.email, otp, propData.type);
      toast.success(response.message);
      navigate(propData.type === OtpVerificationType.forgotPassword ? RoutesPath.resetPassword : RoutesPath.classMaster);
    } catch (error) {
      handleApiErrors(error);
    }
  };

  return (
    <AuthLayout>
      <div className="col-md-7 m-auto login_box px-1">
        <div className="d-flex justify-content-center login_logo">
          <Image src={PngImages.logo} className="img-fluid" alt="Logo" style={{ height: "70px" }} />
        </div>

        <div className="mb-4 text-center">
          <TitleLabel text={"OTP Verification"} />
          <SubTitleLabel text={"Please provide your otp verification"} />
        </div>

        <div className="p-0 mb-4">
          <div className="d-flex gap_16 justify-content-between">
            {[...Array(otpCount)].map((_, index) => (
              <input
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                type="text"
                className="otp_number_input"
                onChange={(event) => handleChange(event, index)}
                onKeyDown={(e) => handleKeyPress(index, e)}
                maxLength={1}
              />
            ))}
          </div>
        </div>

        <SubmitButton title={"Verify my account"} onClick={handleOtpSubmit} />

        <h4 className="resent_otp">
          Didn’t get the code?{" "}
          <span onClick={resendOtp} style={{cursor: "pointer"}}>
            Resend OTP
          </span>
        </h4>
      </div>
    </AuthLayout>
  );
};

export default OTPVerify;
