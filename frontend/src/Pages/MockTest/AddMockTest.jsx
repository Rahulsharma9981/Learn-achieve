import React, { useEffect, useState } from "react";
import { SvgImages } from "../../Utils/LocalImages";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import ButtonWithIcon from "../../Components/Reusable/ButtonWithIcon";
import CustomDropDown from "../../Components/Reusable/CustomDropDown";
import * as yup from "yup";
import { InputType, handleApiErrors, validationRegex } from "../../Utils/Utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ClassService from "../../Services/ClassService";
import DataProvider from "../../Utils/DataProvider";
import SubjectService from "../../Services/SubjectService";
import RoutesPath from "../../Utils/RoutesPath";

import CustomTextField from "../../Components/Reusable/CustomTextField";
import MockTestService from "../../Services/MockTestService";

const AddMockTest = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [resetSubject, setResetSubject] = useState(false);
  const [resetMedium, setResetMedium] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [question, setQuestion] = useState({ ...useLocation().state });
  const [isEdit, setIsEdit] = useState({ ...useLocation().state });

  const navigate = useNavigate();

  const stepOneValidations = yup.object().shape({
    mocktest: validationRegex.required,
    subjects: yup.array().required("Field can't be empty!"),
    class_id: validationRegex.required,
    medium: validationRegex.required,
    noOfQuestions: validationRegex.required,
    duration: validationRegex.required,
  });

  const {
    register: registerStepOne,
    handleSubmit: handleSubmitStepOne,
    setValue: setValuesStepOne,
    formState: { errors: errorsStepOne },
    watch: watchStepOne,
    getValues: getValuesStepOne,
    reset: resetStepOne,
  } = useForm({
    resolver: yupResolver(stepOneValidations),
    defaultValues: {
      mocktest: isEdit ? isEdit.mockTestName : "",
      subjects: isEdit ? isEdit?.subject_ids?.map((value) => value) : "",
      class_id: isEdit ? isEdit.class_id : "",
      medium: isEdit ? isEdit.medium : "",
      noOfQuestions: isEdit ? isEdit.totalQuestions : "",
      duration: isEdit ? isEdit.durationInMinutes : "",
    },
  });

  const onSubmit = async (data) => {
    const { mocktest, class_id, medium, subjects, noOfQuestions, duration } =
      data;
    try {
      const response = await MockTestService.addMockTest(
        isEdit?._id || "",
        mocktest,
        class_id,
        medium,
        subjects,
        noOfQuestions,
        duration
      );
      toast.success(response.message);
      setIsEdit({});
      navigate(RoutesPath.viewMockTest);
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const getAllClasses = async () => {
    try {
      const response = await ClassService.getAllClassesWithoutPagination();
      setClasses(response.data);
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const getAllSubjects = async (classId) => {
    try {
      const response = await SubjectService.getAllSubjectsWithoutPagination(
        classId
      );

      setSubjects(response.data);
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const importantStyle = {
    marginBottom: "0px !important",
  };

  useEffect(() => {
    getAllClasses();
  }, []);

  useEffect(() => {
    if (getValuesStepOne("class_id")) {
      if (!isFirstLoad) {
        setValuesStepOne("subject", "");
        setResetSubject(true);
        setSubjects([]);
        setValuesStepOne("medium", "");
        setResetMedium(true);
      } else {
        setTimeout(() => setIsFirstLoad(false), 1000);
      }
      getAllSubjects(getValuesStepOne("class_id"));
    }
  }, [watchStepOne("class_id")]);

  return (
    <div className="content" data-number="1">
      <div className="mb-3 d-flex justify-content-between">
        <h1 className="black fs-18 fw-600 mb-0">MOCK TEST</h1>
        <div className="d-flex">
          <h4 className="fs-12 fw-500 black mb-0 me-1">Dashboard &gt;</h4>
          <h4 className="fs-12 fw-500 primary mb-0">MOCK TEST</h4>
        </div>
      </div>

      <div className="table_container ">
        <div className="table_title p-0 mb-4">
          <div className="table_headings">
            <h1 className="black fs-18 fw-600 mb-0">
              {isEdit._id ? "Update" : "Create"} Mock Test
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmitStepOne(onSubmit)}>
          <div className="row profile_inputs w-100">
            <div className="col-md-6">
              <CustomTextField
                labelTitle="Mock Test Name"
                placeholder="Enter Mock Test"
                name="mocktest"
                id="mocktest"
                resetValue={resetStepOne}
                showError={errorsStepOne?.mocktest}
                errorMessage={errorsStepOne?.mocktest?.message}
                register={registerStepOne}
                additionalClasses="profile_edit"
                showMandatory={true}
              />
            </div>

            <div className="col-md-6">
              {classes && classes.length != 0 && (
                <CustomDropDown
                  labelTitle="Select Class"
                  placeholder="Select"
                  name="class_id"
                  id="class_id"
                  additionalClasses="profile_edit"
                  inputType={InputType.text}
                  showError={errorsStepOne?.class_id}
                  errorMessage={errorsStepOne?.class_id?.message}
                  showMandatory={true}
                  setValue={setValuesStepOne}
                  options={classes?.map((e) => {
                    return { value: e._id, label: e.class_name };
                  })}
                  defaultOption={() => {
                    if (isEdit?.class_id && classes) {
                      const matchingClass = classes.find(
                        (value) => value._id === isEdit.class_id
                      );
                      if (matchingClass) {
                        return {
                          value: matchingClass._id,
                          label: matchingClass.class_name,
                        };
                      }
                    }
                    return null;
                  }}
                />
              )}
            </div>
            <div className="col-md-6">
              <CustomDropDown
                labelTitle="Select Medium"
                placeholder="Select"
                name="medium"
                id="medium"
                additionalClasses="profile_edit"
                setResetValue={setResetMedium}
                resetValue={resetMedium}
                inputType={InputType.text}
                showError={errorsStepOne?.medium}
                errorMessage={errorsStepOne?.medium?.message}
                showMandatory={true}
                setValue={setValuesStepOne}
                options={DataProvider.mediumList}
                defaultOption={() => {
                  return question.medium
                    ? { value: question.medium, label: question.medium }
                    : null;
                }}
              />
            </div>
            <div className="col-md-6">
              {!isEdit._id && (
                <CustomDropDown
                  labelTitle="Select Subjects"
                  placeholder="Select"
                  name="subjects"
                  id="subjects"
                  additionalClasses="profile_edit"
                  inputType={InputType.text}
                  setResetValue={setResetSubject}
                  resetValue={resetSubject}
                  showError={errorsStepOne?.subjects}
                  errorMessage={errorsStepOne?.subjects?.message}
                  showMandatory={true}
                  setValue={setValuesStepOne}
                  options={subjects?.map((e) => {
                    return { value: e._id, label: e.subject_name };
                  })}
                  isMulti={true} // Set isMulti to true for multiple selection
                />
              )}

              {subjects && subjects.length != 0 && isEdit._id && (
                <CustomDropDown
                  labelTitle="Select Subjects"
                  placeholder="Select"
                  name="subjects"
                  id="subjects"
                  additionalClasses="profile_edit"
                  inputType={InputType.text}
                  setResetValue={setResetSubject}
                  resetValue={resetSubject}
                  showError={errorsStepOne?.subjects}
                  errorMessage={errorsStepOne?.subjects?.message}
                  showMandatory={true}
                  setValue={setValuesStepOne}
                  options={subjects?.map((e) => {
                    return { value: e._id, label: e.subject_name };
                  })}
                  defaultOption={() => {
                    if (isEdit.subject_ids && subjects) {
                      const defaultValues = subjects.filter((subject) =>
                        isEdit.subject_ids.includes(subject._id)
                      );

                      return defaultValues.map((subject) => ({
                        value: subject._id,
                        label: subject.subject_name,
                      }));
                    }
                    return { value: "", label: "Select Subjects" };
                  }}
                  isMulti={true} // Set isMulti to true for multiple selection
                />
              )}
            </div>

            <div className="col-md-6">
              <CustomTextField
                labelTitle="Total No of Questions"
                placeholder="Total No of Questions"
                name="noOfQuestions"
                id="questionsno"
                inputType={InputType.number}
                showError={errorsStepOne?.noOfQuestions}
                errorMessage={errorsStepOne?.noOfQuestions?.message}
                register={registerStepOne}
                additionalClasses="profile_edit"
                showMandatory={true}
              />
            </div>

            <div className="col-md-6">
              <CustomTextField
                labelTitle="Duration in Mins"
                placeholder="Enter Duration in Mins"
                name="duration"
                id="duration"
                inputType={InputType.number}
                showError={errorsStepOne?.duration}
                errorMessage={errorsStepOne?.duration?.message}
                register={registerStepOne}
                additionalClasses="profile_edit"
                showMandatory={true}
              />
            </div>

            <div className="d-flex justify-content-end">
              <ButtonWithIcon
                text={isEdit._id ? "Update" : "Submit"}
                icon={SvgImages.tick_mark}
                onClick={handleSubmitStepOne(onSubmit)}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMockTest;
