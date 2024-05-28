import React, { useEffect, useState } from "react";
import { SvgImages } from "../../Utils/LocalImages";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import ButtonWithIcon from "../../Components/Reusable/ButtonWithIcon";
import CustomDropDown from "../../Components/Reusable/CustomDropDown";
import * as yup from "yup";
import {
  InputType,
  createFileFromMetadata,
  handleApiErrors,
  validationRegex,
} from "../../Utils/Utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Image from "../../Components/Reusable/Image";
import RoutesPath from "../../Utils/RoutesPath";
import CustomTextEditor from "../../Components/Reusable/CustomTextEditor";
import CustomTextField from "../../Components/Reusable/CustomTextField";
import MockTestService from "../../Services/MockTestService";
import PackagesService from "../../Services/PackagesServices";
import CustomFileInput from "../../Components/Reusable/CustomFileInput";

const AddPackages = () => {
  const location = useLocation();
  const EditData = location.state ? location.state : null;
  const initialMockTests = location.state?.mockTests || [
    { mockTest_id: "", numberOfAttempts: "" },
  ];
  const [mockTests, setMockTests] = useState(initialMockTests);
  const [mockTest1, setMockTest] = useState([]);
  const [isEdit, setIsEdit] = useState(EditData);
  const [resetTopicDetailsValue, setResetTopicDetailsValue] = useState(false);
  const [uploadFeatureImg, setUploadFeatureImg] = useState(Array());
  const [uploadMainImg, setUploadMainImg] = useState(Array());

  const navigate = useNavigate();

  const PackageValidation = yup.object().shape({
    packageName: validationRegex.required,
    featureImage: validationRegex.image,
    mainImage: validationRegex.image,
    validity: validationRegex.required,
    actualPrice: validationRegex.required,
    discountedPrice: validationRegex.required,
    briefIntro: validationRegex.required,
    details: validationRegex.required,
    mockTests: yup.array().of(
      yup.object().shape({
        mockTest_id: yup.string().required("Mock test ID is required"),
        numberOfAttempts: yup
          .number()
          .required("Number of attempts is required")
          .min(1, "Minimum 1 attempt required"),
      })
    ),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch: watchStepOne,
    getValues: getValuesStepOne,
    reset,
  } = useForm({
    resolver: yupResolver(PackageValidation),
    defaultValues: {
      packageName: isEdit?.packageName || "",
      featureImage: null,
      mainImage: null,
      validity: isEdit?.validityInDays || "",
      actualPrice: isEdit?.actualPrice || "",
      discountedPrice: isEdit?.discountedPrice || "",
      briefIntro: isEdit?.briefIntro || "",
      details: "",
    },
  });

  const AddPackage = async (data) => {
    const {
      packageName,
      validity,
      actualPrice,
      discountedPrice,
      briefIntro,
      details,
      mockTests,
    } = data;

    try {
      const response = await PackagesService.addPackage(
        isEdit?._id || "",
        mockTests,
        packageName,
        uploadFeatureImg,
        uploadMainImg,
        validity,
        actualPrice,
        discountedPrice,
        briefIntro,
        details
      );
      toast.success(response.message);
      setResetTopicDetailsValue();
      setIsEdit({});
      navigate(RoutesPath.viewPackages);
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const getAllMockTest = async () => {
    try {
      const response = await MockTestService.getAllMockTestWithoutPagination();
      setMockTest(response.data);
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const addMockTestInput = () => {
    setMockTests([...mockTests, { mockTest_id: "", numberOfAttempts: "" }]);
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        if (isEdit) {
          mockTests.forEach((value, index) => {
            setValue(`mockTests[${index}].mockTest_id`, value?.mockTest_id);
            setValue(
              `mockTests[${index}].numberOfAttempts`,
              value?.numberOfAttempts
            );
          });

          setValue("featureImage", isEdit?.featuredImage, {
            shouldValidate: true,
          });
          setValue("mainImage", isEdit?.mainImage, {
            shouldValidate: true,
          });

          const featureImage = await createFileFromMetadata(
            isEdit?.featuredImage
          );
          const mainImage = await createFileFromMetadata(isEdit?.mainImage);

          setUploadFeatureImg(featureImage);
          setUploadMainImg(mainImage);
        }
      } catch (error) {
        console.error("Error creating file from metadata:", error);
      }
    };

    fetchFiles();
  }, [isEdit]);

  useEffect(() => {
    getAllMockTest();
  }, []);

  return (
    <div className="content" data-number="1">
      <div className="mb-3 d-flex justify-content-between">
        <h1 className="black fs-18 fw-600 mb-0">PACKAGES </h1>
        <div className="d-flex">
          <h4 className="fs-12 fw-500 black mb-0 me-1">Dashboard &gt;</h4>
          <h4 className="fs-12 fw-500 primary mb-0">PACKAGES </h4>
        </div>
      </div>

      <div className="table_container ">
        <div className="table_title p-0 mb-4">
          <div className="table_headings">
            <h1 className="black fs-18 fw-600 mb-0">
              {isEdit?._id ? "Update" : "Create"} packages
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit(AddPackage)}>
          <div className="row profile_inputs w-100">
            <div className="col-md-12">
              <CustomTextField
                labelTitle="Package Name"
                placeholder="Enter Package Name"
                name="packageName"
                id="packageName"
                resetValue={reset}
                showError={errors?.packageName}
                errorMessage={errors?.packageName?.message}
                register={register}
                additionalClasses="profile_edit"
                showMandatory={true}
              />
            </div>

            <div className="col-md-6">
              <CustomFileInput
                name="featureImage"
                labelTitle="Feature Image"
                labelTitleText="(Extension: jpg. jpeg. webp) Note: Dimension Size 1000x600 px"
                showMandatory={true}
                showError={!!errors.featureImage}
                errorMessage={errors.featureImage?.message}
                onChange={(e) => {
                  const file = e.target.files[0];
                  setUploadFeatureImg(file);
                  setValue("featureImage", file, {
                    shouldValidate: true,
                  });
                }}
                defaultValue={isEdit?.featuredImage?.name || ""}
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
                  setValue("mainImage", file, {
                    shouldValidate: true,
                  });
                }}
                defaultValue={isEdit?.mainImage?.name || ""}
              />
            </div>
            <div className="col-md-12">
              {" "}
              <div className="alert alert-primary row mt-4 mb-4 ">
                {mockTests?.map((mockTest, index) => {
                  return (
                    <>
                      {" "}
                      <div className="col-md-6 ">
                        {mockTest1.length != 0 && (
                          <CustomDropDown
                            labelTitle="Select Mock Test"
                            placeholder="Select"
                            name={`mockTests[${index}].mockTest_id`}
                            id="mockTest_id"
                            additionalClasses="profile_edit text-primary"
                            inputType={InputType.text}
                            showError={errors?.mockTests?.[index]?.mockTest_id}
                            errorMessage={
                              errors?.mockTests?.[index]?.mockTest_id?.message
                            }
                            showMandatory={true}
                            setValue={setValue}
                            options={mockTest1?.map((e) => {
                              return { value: e._id, label: e.mockTestName };
                            })}
                            defaultOption={() => {
                              const data = mockTest1?.find(
                                (value) => value?._id === mockTest.mockTest_id
                              );

                              return data
                                ? {
                                    value: data._id,
                                    label: data.mockTestName,
                                  }
                                : null;
                            }}
                          />
                        )}
                      </div>
                      <div className="col-md-6 ">
                        <CustomTextField
                          labelTitle="No Of Attempts "
                          placeholder="No Of Attempts"
                          name={`mockTests[${index}].numberOfAttempts`}
                          id="noOfAttempts"
                          inputType={InputType.number}
                          showError={
                            errors?.mockTests?.[index]?.numberOfAttempts
                          }
                          errorMessage={
                            errors?.mockTests?.[index]?.numberOfAttempts
                              ?.message
                          }
                          register={register}
                          additionalClasses="profile_edit"
                          showMandatory={true}
                        />
                      </div>
                    </>
                  );
                })}

                <div
                  className="topic_add_btn link_add"
                  onClick={addMockTestInput}
                >
                  <Image src={SvgImages.circle_plus} />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <CustomTextField
                labelTitle="Validity in Days (Number)   "
                placeholder="Validity in Days"
                name="validity"
                id="validity"
                inputType={InputType.number}
                showError={errors?.validity}
                errorMessage={errors?.validity?.message}
                register={register}
                additionalClasses="profile_edit"
                showMandatory={true}
              />
            </div>

            <div className="col-md-6">
              <CustomTextField
                labelTitle="Actual Price Inclusive of GST"
                placeholder="Actual Price"
                name="actualPrice"
                id="actualPrice"
                inputType={InputType.number}
                showError={errors?.actualPrice}
                errorMessage={errors?.actualPrice?.message}
                register={register}
                additionalClasses="profile_edit"
                showMandatory={true}
              />
            </div>
            <div className="col-md-6">
              <CustomTextField
                labelTitle="Discounted Price Inclusive of GST (Number)"
                placeholder="Discounted Price"
                name="discountedPrice"
                id="discountedPrice"
                inputType={InputType.number}
                showError={errors?.discountedPrice}
                errorMessage={errors?.discountedPrice?.message}
                register={register}
                additionalClasses="profile_edit"
                showMandatory={true}
              />
            </div>
            <div className="col-md-6">
              <CustomTextField
                labelTitle="Brief Intro"
                placeholder="File Name"
                name="briefIntro"
                id="briefIntro"
                inputType={InputType.text}
                showMandatory={true}
                // setValue={setValuesStepTwo}
                register={register}
                additionalClasses="brief_input"
                showError={errors?.briefIntro}
                errorMessage={errors?.briefIntro?.message}
              />
            </div>
            <div className="col-md-6">
              <CustomTextEditor
                labelTitle={"Details"}
                name="details"
                id="details"
                updateValue={""}
                setValue={setValue}
                setResetValue={setResetTopicDetailsValue}
                resetValue={resetTopicDetailsValue}
                showError={errors?.details}
                errorMessage={errors?.details?.message}
                showMandatory={true}
                defaultValue={isEdit?.details}
              />
            </div>
            <div className="d-flex justify-content-end">
              <ButtonWithIcon
                text={isEdit?._id ? "Update" : "Submit"}
                icon={SvgImages.tick_mark}
                onClick={handleSubmit(AddPackage)}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPackages;
