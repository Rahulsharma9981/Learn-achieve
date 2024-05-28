import React, { useEffect, useState } from "react";
import { SvgImages } from "../../Utils/LocalImages";
import ButtonWithIcon from "../../Components/Reusable/ButtonWithIcon";
import CustomTextField from "../../Components/Reusable/CustomTextField";
import {
  InputType,
  createFileFromMetadata,
  handleApiErrors,
  validationRegex,
} from "../../Utils/Utils";
import { useLocation, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import RoutesPath from "../../Utils/RoutesPath";
import { toast } from "react-toastify";
import AuthorService from "../../Services/AuthorService";
import CustomFileInput from "../../Components/Reusable/CustomFileInput";

const AddAuthors = () => {
  const location = useLocation();
  const EditData = location.state || null;
  const [isEdit, setIsEdit] = useState(EditData);
  const [uploadMainImg, setUploadMainImg] = useState(Array());

  const navigate = useNavigate();

  const Validations = yup.object().shape({
    name: validationRegex.required,
    briefIntro: validationRegex.required,
    instagramLink: validationRegex.instagram,
    twitterLink: validationRegex.twitter,
    youtubeLink: validationRegex.youtube,
    facebookLink: validationRegex.facebook,
    linkedInLink: validationRegex.linkedin,
    mainImage: validationRegex.image,
  });

  const {
    register,
    handleSubmit,
    setValue: setValues,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(Validations),
    defaultValues: {
      name: isEdit?.name || "",
      briefIntro: isEdit?.briefIntro || "",
      instagramLink: isEdit?.instagramLink || "",
      twitterLink: isEdit?.twitterLink || "",
      youtubeLink: isEdit?.youtubeLink || "",
      facebookLink: isEdit?.facebookLink || "",
      linkedInLink: isEdit?.linkedInLink || "",
      mainImage: "",
    },
  });
  const addAuthor = async (author) => {
    try {
      const response = await AuthorService.addAuthors(
        isEdit.author_id || "",
        author.name,
        author.briefIntro,
        author.instagramLink,
        author.linkedInLink,
        author.youtubeLink,
        author.facebookLink,
        author.twitterLink,
        uploadMainImg
      );
      toast.success(response.message);
      navigate(RoutesPath.authors);
    } catch (error) {
      handleApiErrors(error);
      toast.error("Failed to add auther. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        if (isEdit) {
          // To validate the Input Field in Edit Case
          setValues("mainImage", isEdit?.image, {
            shouldValidate: true,
          });

          // To convert the Image Object in File because Backend only takes Files array
          const mainImage = await createFileFromMetadata(isEdit?.image);

          setUploadMainImg(mainImage);
        }
      } catch (error) {
        console.log("Error creating file from metadata:", error);
      }
    };

    fetchFiles();
  }, [isEdit]);
  
  return (
    <div>
      <div>
        <div className="mb-3 d-flex justify-content-between">
          <h1 className="black fs-18 fw-600 mb-0">AUTHORS</h1>
          <div className="d-flex">
            <h4 className="fs-12 fw-500 black mb-0 me-1">Dashboard &gt;</h4>
            <h4 className="fs-12 fw-500 primary mb-0">Authors</h4>
          </div>
        </div>
        <div className="table_container" style={{ display: "block" }}>
          <div className="table_title">
            <div className="table_headings">
              <h1 className="black fs-18 fw-600 mb-0">Add Author</h1>
            </div>
            <form onSubmit={handleSubmit(addAuthor)}>
              <div className="row profile_inputs w-100 mt-5">
                <div className="col-md-6">
                  <CustomTextField
                    labelTitle="Name"
                    placeholder="File Name"
                    name="name"
                    id="name"
                    additionalClasses="profile_edit"
                    inputType={InputType.text}
                    showMandatory={true}
                    register={register}
                    setValue={setValues}
                    showError={errors?.name}
                    errorMessage={errors?.name?.message}
                  />
                </div>

                <div className="col-md-6">
                  <CustomFileInput
                    name="mainImage"
                    labelTitle="Main Image"
                    labelTitleText="(Extension: jpg. jpeg. webp) Note: Dimension Size 1000x600 px"
                    showMandatory={true}
                    showError={!!errors.mainImage}
                    errorMessage={errors.mainImage?.message}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setUploadMainImg(file);
                      setValues("mainImage", file, {
                        shouldValidate: true,
                      });
                    }}
                    defaultValue={isEdit?.image?.name || ""}
                  />
                </div>
                <CustomTextField
                  labelTitle="Brief Intro"
                  placeholder="Brief Intro"
                  name="briefIntro"
                  id="briefIntro"
                  inputType={InputType.text}
                  showMandatory={true}
                  additionalClasses="brief"
                  register={register}
                  setValue={setValues}
                  showError={errors?.briefIntro}
                  errorMessage={errors?.briefIntro?.message}
                />
                <div className="col-md-6">
                  <CustomTextField
                    labelTitle="Facebook Link"
                    placeholder="Link"
                    name="facebookLink"
                    id="facebookLink"
                    additionalClasses="profile_edit"
                    inputType={InputType.text}
                    showMandatory={true}
                    register={register}
                    setValue={setValues}
                    showError={errors?.facebookLink}
                    errorMessage={errors?.facebookLink?.message}
                  />
                </div>
                <div className="col-md-6">
                  <CustomTextField
                    labelTitle="Instagram Link"
                    placeholder="Link"
                    name="instagramLink"
                    id="instagramLink"
                    additionalClasses="profile_edit"
                    inputType={InputType.text}
                    showMandatory={true}
                    register={register}
                    setValue={setValues}
                    showError={errors?.instagramLink}
                    errorMessage={errors?.instagramLink?.message}
                  />
                </div>
                <div className="col-md-6">
                  <CustomTextField
                    labelTitle=" LinkedIn Link"
                    linkedInLink
                    placeholder="Link"
                    name="linkedInLink"
                    id="linkedInLink"
                    additionalClasses="profile_edit"
                    inputType={InputType.text}
                    showMandatory={true}
                    register={register}
                    setValue={setValues}
                    showError={errors?.linkedInLink}
                    errorMessage={errors?.linkedInLink?.message}
                  />
                </div>
                <div className="col-md-6">
                  <CustomTextField
                    labelTitle="Youtube Link"
                    placeholder="Link"
                    name="youtubeLink"
                    id="youtubeLink"
                    additionalClasses="profile_edit"
                    inputType={InputType.text}
                    showMandatory={true}
                    register={register}
                    setValue={setValues}
                    showError={errors?.youtubeLink}
                    errorMessage={errors?.youtubeLink?.message}
                  />
                </div>
                <div className="col-md-6">
                  <CustomTextField
                    labelTitle="Twitter Link"
                    placeholder="Link"
                    name="twitterLink"
                    id="twitterLink"
                    additionalClasses="profile_edit"
                    inputType={InputType.text}
                    showMandatory={true}
                    register={register}
                    setValue={setValues}
                    showError={errors?.twitterLink}
                    errorMessage={errors?.twitterLink?.message}
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <ButtonWithIcon
                    text={isEdit?._id ? "Update" : "Submit"}
                    icon={SvgImages.right_arrow}
                    onClick={handleSubmit(addAuthor)}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAuthors;
