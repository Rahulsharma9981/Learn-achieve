import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Image from "../../Components/Reusable/Image";
import { handleApiErrors, validationRegex } from "../../Utils/Utils";
import { PngImages, SvgImages } from "../../Utils/LocalImages";
import AuthLayout from "../../Layouts/authLayout";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomTextField from "../../Components/Reusable/CustomTextField";
import AuthService from "../../Services/AuthService";
import SubmitButton from "../../Components/Reusable/Buttons";
import { SubTitleLabel, TitleLabel } from "../../Components/Reusable/LabelComponents";
import { OtpVerificationType } from "../../Utils/Enums";
import RoutesPath from "../../Utils/RoutesPath";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    email: validationRegex.email,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    const { email } = data;
    try {
      const response = await AuthService.forgotPassword(email);
      // toast.success(`OTP Sent Successfully!`);
      const otpParams = {
        email: email,
        type: OtpVerificationType.forgotPassword
      }
      navigate(RoutesPath.otpVerify, { state: otpParams });
    } catch (error) {
      handleApiErrors(error);
    }
  };

  return (
    <AuthLayout>
      <div className="col-md-7 m-auto login_box">
        <div className="d-flex justify-content-center login_logo">
          <Image src={PngImages.logo} className="img-fluid" alt="Logo" style={{ height: "70px" }} />
        </div>
        <div className="mb-4 text-center">
          <TitleLabel text={"Forgot your password?"} />
          <SubTitleLabel text={"Please provide your email for verification"} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CustomTextField
            labelTitle="Email Id"
            additionalClasses="profile_input"
            icon={SvgImages.email}
            id="email"
            name="email"
            placeholder="Enter your email"
            showError={errors?.email}
            errorMessage={errors?.email?.message}
            register={register}
          />

          <SubmitButton title={"Send OTP"} />
        </form>

        <Link to={RoutesPath.login} className="back_login">
          <Image src={SvgImages.back_arrow_login} alt="Back" />
          Back to login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;


