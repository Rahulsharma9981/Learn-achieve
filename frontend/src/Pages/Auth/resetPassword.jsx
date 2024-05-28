import React from "react";
import { PngImages, SvgImages } from "../../Utils/LocalImages";
import { InputType, handleApiErrors, validationRegex } from "../../Utils/Utils";
import { Link, useNavigate } from "react-router-dom";
import Image from "../../Components/Reusable/Image";
import AuthLayout from "../../Layouts/authLayout";
import CustomTextField from "../../Components/Reusable/CustomTextField";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import AuthService from "../../Services/AuthService";
import { SubTitleLabel, TitleLabel } from "../../Components/Reusable/LabelComponents";
import SubmitButton from "../../Components/Reusable/Buttons";
import RoutesPath from "../../Utils/RoutesPath";

const ResetPassword = () => {
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    newPassword: validationRegex.newPassword,
    confirmPassword: validationRegex.confirmPassword,
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    const { newPassword } = data;
    try {
      await AuthService.resetPassword(newPassword);
      toast.success("Your password has been reset succesfully");
      navigate(RoutesPath.login);
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
          <TitleLabel text={"Reset Password"} />
          <SubTitleLabel text={"Lorem ipsum dolor sit amet, consectetur adipiscing"} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb_40">
            <CustomTextField
              labelTitle="New Password"
              additionalClasses="profile_input"
              icon={SvgImages.lock}
              id="newPassword"
              name="newPassword"
              inputType={InputType.password}
              placeholder="Enter your new password"
              showError={errors?.newPassword}
              errorMessage={errors?.newPassword?.message}
              register={register}
            />

            <CustomTextField
              labelTitle="Confirm Password"
              additionalClasses="profile_input"
              icon={SvgImages.lock}
              id="confirmPassword"
              name="confirmPassword"
              inputType={InputType.password}
              placeholder="Enter your confirm password"
              showError={errors?.confirmPassword}
              errorMessage={errors?.confirmPassword?.message}
              register={register}
            />
          </div>

          <SubmitButton title={"Reset Password"} />
        </form>

        <Link to={RoutesPath.login} className="back_login">
          <img src={SvgImages.back_arrow_login} alt="Back" /> Back to login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
