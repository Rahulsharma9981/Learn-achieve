import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { PngImages, SvgImages } from "../../Utils/LocalImages";
import AuthLayout from "../../Layouts/authLayout";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputType, handleApiErrors, validationRegex } from "../../Utils/Utils";
import CustomTextField from "../../Components/Reusable/CustomTextField";
import AuthService from "../../Services/AuthService";
import Image from "../../Components/Reusable/Image";
import SubmitButton from "../../Components/Reusable/Buttons";
import { SubTitleLabel, TitleLabel } from "../../Components/Reusable/LabelComponents";
import { OtpVerificationType } from "../../Utils/Enums";
import RoutesPath from "../../Utils/RoutesPath";

const Login = () => {
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    email: validationRegex.email,
    password: validationRegex.required
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    const { email, password } = data;
    try {
      const response = await AuthService.login(email, password);
      const otpParams = {
        email: email,
        password: password,
        type: OtpVerificationType.login
      }
      navigate(RoutesPath.otpVerify, { state: otpParams });
    } catch (error) {
      handleApiErrors(error);
    }
  };

  return (
    <AuthLayout>
      <div className="col-md-7 m-auto">
        <div className="d-flex justify-content-center login_logo">
          <Image src={PngImages.logo} className="img-fluid" alt="Logo" style={{ height: "70px" }} />
        </div>

        <div className="mb-4 text-center">
          <TitleLabel text={"Welcome Back!"} />
          <SubTitleLabel text={"Enter your Credentials to access your account"} />
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

          <CustomTextField
            labelTitle="Password"
            additionalClasses="profile_input"
            icon={SvgImages.lock}
            id="password"
            name="password"
            inputType={InputType.password}
            placeholder="Enter your password"
            showError={errors?.password}
            errorMessage={errors?.password?.message}
            register={register}
          />

          <Link to={RoutesPath.forgotPassword}>
            <h4 className="forgot mb-4 right_menu_toggle">Forgot password?</h4>
          </Link>

          <SubmitButton title={"Login"} />
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;

