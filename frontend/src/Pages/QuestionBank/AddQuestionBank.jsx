import React, { useEffect, useState } from "react";
import { SvgImages } from "../../Utils/LocalImages";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import ButtonWithIcon from "../../Components/Reusable/ButtonWithIcon";
import CustomDropDown from "../../Components/Reusable/CustomDropDown";
import * as yup from "yup";
import {
  InputType,
  getTextFromHtml,
  handleApiErrors,
  validationRegex,
} from "../../Utils/Utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ClassService from "../../Services/ClassService";
import DataProvider from "../../Utils/DataProvider";
import SubjectService from "../../Services/SubjectService";
import Image from "../../Components/Reusable/Image";
import RoutesPath from "../../Utils/RoutesPath";
import CustomTextEditor from "../../Components/Reusable/CustomTextEditor";
import QuestionBankService from "../../Services/QuestionBankService";
import StudyMaterialService from "../../Services/StudyMaterialService";
import {
  TitleLabel,
} from "../../Components/Reusable/LabelComponents";
import ConfirmationModal from "../../Components/modal/ConfirmationModal";
import { ConfirmationModalTheme } from "../../Utils/Enums";

const AddQuestionBank = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [topics, setTopics] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [resetSubject, setResetSubject] = useState(false);
  const [resetModule, setResetModule] = useState(false);
  const [resetTopic, setResetTopic] = useState(false);
  const [resetMedium, setResetMedium] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [question, setQuestion] = useState({ ...useLocation().state });
  const [allSubQuestions, setAllSubQuestions] = useState([]);
  const [resetTopicDetailsValue, setResetTopicDetailsValue] = useState(false);
  const [subQuestionToDelete, setSubQuestionToDelete] = useState(null);
  const [selectedSubQuestion, setSelectedSubQuestion] = useState({});
  const [showSubQuestionDeleteModal, setShowSubQuestionDeleteModal] =
    useState(false);
  const [defaultCorrectOption, setDefaultCorrectOption] = useState(null);
  const navigate = useNavigate();

  const stepOneValidations = yup.object().shape({
    class_id: validationRegex.required,
    subject: validationRegex.required,
    type: validationRegex.required,
    medium: validationRegex.required,
  });

  const stepTwoValidations = yup.object().shape({
    question: validationRegex.required,
    correctOption: validationRegex.required,
    optionOne: validationRegex.required,
    optionTwo: validationRegex.required,
    optionThree: validationRegex.required,
    optionFour: validationRegex.required,
  });
  const subSolutionValidations = yup.object().shape({
    subquestion: validationRegex.required,
    subCorrectOption: validationRegex.required,
    subOptionOne: validationRegex.required,
    subOptionTwo: validationRegex.required,
    subOptionThree: validationRegex.required,
    subOptionFour: validationRegex.required,
  });
  const stepTwoValidationsParent = yup.object().shape({
    questions: validationRegex.required,
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
      class_id: question ? question?.class_id : "",
      subject: question ? question?.subject_id : "",
      module: question ? question?.module_id : "",
      topic: question ? question?.topic_id : "",
      type: question ? question?.question_type : "",
      typeOfQuestion: question ? question?.type_of_question : "",
      medium: question ? question?.medium : "",
    },
  });

  const {
    register: registerStepTwo,
    handleSubmit: handleSubmitStepTwo,
    setValue: setValuesStepTwo,
    formState: { errors: errorsStepTwo },
    watch: watchStepTwo,
    getValues: getValuesStepTwo,
    reset: resetStepTwo,
  } = useForm({
    resolver: yupResolver(stepTwoValidations),
    defaultValues: {
      question: question?.question || "",
      solution: question?.solution || "",
      correctOption: question?.correctOption || "",
    },
  });

  const {
    register: registerSubQuestion,
    handleSubmit: handleSubmitSubQuestion,
    setValue: setValuesSubQuestion,
    formState: { errors: errorsSubQuestion },
    watch: watchSubQuestion,
    getValues: getValuesSubQuestion,
    reset: resetSubQuestion,
  } = useForm({
    resolver: yupResolver(subSolutionValidations),
    defaultValues: {
      subquestion: "",
      subSolution: "",
      // subCorrectOption: "",
      subOptionOne: "",
      subOptionTwo: "",
      subOptionThree: "",
      subOptionFour: "",
    },
  });

  const {
    register: registerParent,
    handleSubmit: handleSubmitStepTwoParent,
    setValue: setValuesStepTwoParent,
    formState: { errors: errorsStepTwoParent },
    watch: watchStepTwoParent,
    getValues: getValuesStepTwoParent,
    reset: resetStepTwoParent,
  } = useForm({
    resolver: yupResolver(stepTwoValidationsParent),
    defaultValues: { questions: "" },
  });

  const saveStepOneData = (data) => {
    var updatedData = { ...question };
    updatedData.class_id = data.class_id;
    updatedData.class_name =
      classes?.find((e) => e._id === data.class_id)?.class_name ||
      updatedData.class_name;
    updatedData.subject_id = data.subject;
    updatedData.subject_name =
      subjects?.find((e) => e._id === data.subject)?.subject_name ||
      updatedData.subject_name;
    updatedData.medium = data.medium;
    updatedData.question_type = data.type;
    updatedData.type_of_question = data.typeOfQuestion;
    updatedData.module_id = data.module;
    updatedData.module_name =
      modules?.find((e) => e.module_id === data.module)?.module_name ||
      updatedData.module_name;
    updatedData.topic_id = data.topic;
    updatedData.topic_name =
      topics?.find((e) => e.topic_id === data.topic)?.topic_name ||
      updatedData.topic_name;
    setQuestion(updatedData);
    setCurrentStep(2);
  };

  const addQuestionApiTask = async (data) => {
    var newData = { ...question };
    newData.question = data.question || data.questions;
    newData.correctOption = Number.parseInt(data.correctOption);
    newData.solution = data.solution;
    newData.optionOne = data.optionOne;
    newData.optionTwo = data.optionTwo;
    newData.optionThree = data.optionThree;
    newData.optionFour = data.optionFour;

    try {
      const response = await QuestionBankService.addQuestion(
        question.id || "",
        question.class_id,
        question.medium,
        question.subject_id,
        question.question_type,
        question.type_of_question,
        watchStepOne("typeOfQuestion") === "Comprehensive"
          ? data.questions
          : data.question,
        watchStepOne("typeOfQuestion") === "Comprehensive" ? "" : data.solution,
        data?.correctOption,
        data?.optionOne,
        data?.optionTwo,
        data?.optionThree,
        data?.optionFour,
        question.module_id,
        question.topic_id
      );

      newData.id = response.question._id;
      setQuestion(newData);
      setResetTopicDetailsValue(true);

      question.type_of_question === "General"
        ? setCurrentStep(3)
        : setCurrentStep(2.1);
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const getAllSubQuestions = async () => {
    try {
      const response = await QuestionBankService.getAllSubQuestions(
        question.id
      );
      const subQuestions = response.subQuestionList.map((value, index) => {
        return {
          ...value,
          optionOne: getTextFromHtml(value.optionOne),
          optionTwo: getTextFromHtml(value.optionTwo),
          optionThree: getTextFromHtml(value.optionThree),
          optionFour: getTextFromHtml(value.optionFour),
        };
      });
      setAllSubQuestions(subQuestions);
    } catch (error) {
      handleApiErrors(error);
    }
  };
  const addSubQuestionApiTask = async (data) => {

    var newData = { ...allSubQuestions };
    newData.question = data.question;
    newData.correctOption = Number.parseInt(data.correctOption);
    newData.solution = data.solution;
    newData.optionOne = data.optionOne;
    newData.optionTwo = data.optionTwo;
    newData.optionThree = data.optionThree;
    newData.optionFour = data.optionFour;

    try {
      const response = await QuestionBankService.addSubQuestion(
        question.id,
        data.subquestion,
        data.subSolution || "",
        data.subCorrectOption,
        data.subOptionOne,
        data.subOptionTwo,
        data.subOptionThree,
        data.subOptionFour,
        selectedSubQuestion?.sub_question_id || ""
      );
      toast.success(
        selectedSubQuestion?.sub_question_id
          ? "Sub Question Updated Successfully"
          : "Sub Question Added Successfully"
      );

      setResetTopicDetailsValue(true);

      getAllSubQuestions();
    } catch (error) {
      handleApiErrors(error);
    }
  };

  useEffect(() => {
    if (currentStep === 2.1) {
      setResetTopicDetailsValue(true);
    }
  }, [currentStep]);

  const deleteSubQuestionApiTask = async (data) => {
    try {
      await QuestionBankService.deleteSubQuestion(data.sub_question_id);
      setResetTopicDetailsValue(true);
      setShowSubQuestionDeleteModal(false);
      getAllSubQuestions();
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

  const getAllModules = async (data) => {
    try {
      const response = await StudyMaterialService.getAllModulesBySubject(
        getValuesStepOne("subject"),
        getValuesStepOne("medium")
      );
      setModules(response.moduleList);
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const getAllTopics = async () => {
    try {
      const response = await StudyMaterialService.getAllTopics(
        getValuesStepOne("module")
      );
      setTopics(response.topicList);
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const importantStyle = {
    marginBottom: "0px !important",
  };
  // For reset the Curret step 2.1 Form state
  useEffect(() => {
    if (resetTopicDetailsValue) {
      // Reset the form values
      resetSubQuestion({
        subSolution: "",
        // subCorrectOption: "",
        subOptionOne: "",
        subOptionTwo: "",
        subOptionThree: "",
        subOptionFour: "",
      });
      setResetTopicDetailsValue(false);
      setSelectedSubQuestion({});
    }
  }, [resetTopicDetailsValue, resetSubQuestion]);

  // This is used to prefill the value of curent step 2.1
  useEffect(() => {
    if (selectedSubQuestion) {
      // Set default values based on selectedSubQuestion
      setValuesSubQuestion("subquestion", selectedSubQuestion?.question || "");
      setValuesSubQuestion("subSolution", selectedSubQuestion.solution || "");
      setValuesSubQuestion(
        "subCorrectOption",
        selectedSubQuestion.correctOption || ""
      );
      setValuesSubQuestion("subOptionOne", selectedSubQuestion.optionOne || "");
      setValuesSubQuestion("subOptionTwo", selectedSubQuestion.optionTwo || "");
      setValuesSubQuestion(
        "subOptionThree",
        selectedSubQuestion.optionThree || ""
      );
      setValuesSubQuestion(
        "subOptionFour",
        selectedSubQuestion.optionFour || ""
      );
    }
  }, [selectedSubQuestion, setValuesSubQuestion]);

  useEffect(() => {
    getAllClasses();
  }, []);
  useEffect(() => {
    if (
      currentStep === 2.1 &&
      watchStepOne("typeOfQuestion") === "Comprehensive"
    ) {
      getAllSubQuestions();
      setResetTopicDetailsValue(true);
    }
  }, [currentStep]);

  useEffect(() => {
    if (getValuesStepOne("class_id")) {
      if (!isFirstLoad) {
        setValuesStepOne("subject", "");
        setResetSubject(true);
        setSubjects([]);
        setValuesStepOne("medium", "");
        setResetMedium(true);
        setValuesStepOne("topic", "");
        setResetTopic(true);
        setTopics([]);
        setValuesStepOne("module", "");
        setResetModule(true);
        setModules([]);
      } else {
        setTimeout(() => setIsFirstLoad(false), 1000);
      }
      getAllSubjects(getValuesStepOne("class_id"));
    }
  }, [watchStepOne("class_id")]);

  useEffect(() => {
    if (getValuesStepOne("subject")) {
      if (!isFirstLoad) {
        setValuesStepOne("topic", "");
        setResetTopic(true);
        setTopics([]);
        setValuesStepOne("module", "");
        setResetModule(true);
        setModules([]);
        setValuesStepOne("medium", "");
        setResetMedium(true);
      }
    }
  }, [watchStepOne("subject")]);

  useEffect(() => {
    if (getValuesStepOne("medium")) {
      if (!isFirstLoad) {
        setValuesStepOne("topic", "");
        setResetTopic(true);
        setTopics([]);
        setValuesStepOne("module", "");
        setResetModule(true);
        setModules([]);
      }
      const mediumValue = getValuesStepOne("medium");
      const subjectValue = getValuesStepOne("subject");
      if (
        mediumValue &&
        mediumValue !== "" &&
        subjectValue &&
        subjectValue !== ""
      ) {
        getAllModules();
      }
    }
  }, [watchStepOne("medium")]);

  useEffect(() => {
    if (getValuesStepOne("module")) {
      if (!isFirstLoad) {
        setValuesStepOne("topic", "");
        setResetTopic(true);
        setTopics([]);
      }
      getAllTopics();
    }
  }, [watchStepOne("module")]);

  return (
    <div className="content" data-number="1">
      <div className="mb-3 d-flex justify-content-between">
        <h1 className="black fs-18 fw-600 mb-0">QUESTION BANK</h1>
        <div className="d-flex">
          <h4 className="fs-12 fw-500 black mb-0 me-1">Dashboard &gt;</h4>
          <h4 className="fs-12 fw-500 primary mb-0">Question Bank</h4>
        </div>
      </div>

      <div className="table_container">
        <div className="table_title p-0">
          <div className="table_headings">
            <h1 className="black fs-18 fw-600 mb-0">Add Question Bank</h1>
          </div>
        </div>

        <div className="progress_bar">
          <div
            className={`step-${currentStep === 2.1 ? 2 : currentStep}`}
            id="checkout-progress"
            data-current-step="1"
          >
            <div className="progress-bar">
              <div
                onClick={() => setCurrentStep(1)}
                className={`step cursor-pointer step-1 ${
                  currentStep === 1 ? "active" : currentStep > 1 ? "valid" : ""
                }`}
              >
                <span> 01</span>
                <div className="fa fa-check opaque">
                  <Image src={SvgImages.tick_mark}></Image>
                </div>
              </div>
              <div
                onClick={() => {
                  if (currentStep > 2) setCurrentStep(2);
                }}
                className={`step cursor-pointer step-2 ${
                  currentStep === 2 || currentStep === 2.1
                    ? "active"
                    : currentStep > 2 || currentStep > 2.1
                    ? "valid"
                    : ""
                }`}
              >
                <span> 02</span>
                <div className="fa fa-check opaque">
                  <Image src={SvgImages.tick_mark}></Image>
                </div>
              </div>
              <div
                className={`step cursor-pointer step-3 ${
                  currentStep === 3 ? "active" : currentStep > 3 ? "valid" : ""
                }`}
              >
                <span> 03</span>
                <div className="fa fa-check opaque">
                  <Image src={SvgImages.tick_mark}></Image>
                </div>
              </div>
            </div>
          </div>
        </div>

        {currentStep === 1 ? (
          <form onSubmit={handleSubmitStepOne(saveStepOneData)}>
            <div className="row profile_inputs w-100">
              <div className="col-md-6">
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
                    return question.class_id && question.class_name
                      ? { value: question.class_id, label: question.class_name }
                      : null;
                  }}
                />
              </div>

              <div className="col-md-6">
                <CustomDropDown
                  labelTitle="Select Subject"
                  placeholder="Select"
                  name="subject"
                  id="subject"
                  additionalClasses="profile_edit"
                  inputType={InputType.text}
                  setResetValue={setResetSubject}
                  resetValue={resetSubject}
                  showError={errorsStepOne?.subject}
                  errorMessage={errorsStepOne?.subject?.message}
                  showMandatory={true}
                  setValue={setValuesStepOne}
                  options={subjects?.map((e) => {
                    return { value: e._id, label: e.subject_name };
                  })}
                  defaultOption={() => {
                    return question.subject_id && question.subject_name
                      ? {
                          value: question.subject_id,
                          label: question.subject_name,
                        }
                      : null;
                  }}
                />
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
                <CustomDropDown
                  labelTitle="Module"
                  placeholder="Select"
                  name="module"
                  id="module"
                  setResetValue={setResetModule}
                  resetValue={resetModule}
                  additionalClasses="profile_edit"
                  inputType={InputType.text}
                  showError={errorsStepOne?.module}
                  errorMessage={errorsStepOne?.module?.message}
                  setValue={setValuesStepOne}
                  options={modules?.map((e) => {
                    return { value: e.module_id, label: e.module_name };
                  })}
                  defaultOption={() => {
                    return question.module_id && question.module_name
                      ? {
                          value: question.module_id,
                          label: question.module_name,
                        }
                      : null;
                  }}
                />
              </div>

              <div className="col-md-6">
                <CustomDropDown
                  labelTitle="Topic Name"
                  placeholder="Select"
                  name="topic"
                  id="topic"
                  setResetValue={setResetTopic}
                  resetValue={resetTopic}
                  additionalClasses="profile_edit"
                  inputType={InputType.text}
                  showError={errorsStepOne?.topic}
                  errorMessage={errorsStepOne?.topic?.message}
                  setValue={setValuesStepOne}
                  options={topics?.map((e) => {
                    return { value: e.topic_id, label: e.topic_name };
                  })}
                  defaultOption={() => {
                    return question.topic_id && question.topic_name
                      ? { value: question.topic_id, label: question.topic_name }
                      : null;
                  }}
                />
              </div>

              <div className="col-md-6">
                <CustomDropDown
                  labelTitle="Type Of Question"
                  placeholder="Select"
                  name="typeOfQuestion"
                  id="typeOfQuestion"
                  additionalClasses="profile_edit"
                  inputType={InputType.text}
                  showError={errorsStepOne?.typeOfQuestion}
                  errorMessage={errorsStepOne?.typeOfQuestion?.message}
                  showMandatory={true}
                  setValue={setValuesStepOne}
                  options={DataProvider.typeOfQuestion}
                  defaultOption={() => {
                    setValuesStepOne(
                      "typeOfQuestion",
                      question.type_of_question ||
                        DataProvider.typeOfQuestion[0].value,
                      { shouldValidate: true }
                    );
                    return question.type_of_question
                      ? DataProvider.typeOfQuestion.find(
                          (e) => e.value === question.type_of_question
                        )
                      : DataProvider.typeOfQuestion[0];
                  }}
                />
              </div>

              <div className="col-md-6">
                <CustomDropDown
                  labelTitle="Question Type"
                  placeholder="Select"
                  name="type"
                  id="type"
                  additionalClasses="profile_edit"
                  inputType={InputType.text}
                  showError={errorsStepOne?.type}
                  errorMessage={errorsStepOne?.type?.message}
                  showMandatory={true}
                  setValue={setValuesStepOne}
                  options={DataProvider.questionType}
                  defaultOption={() => {
                    setValuesStepOne(
                      "type",
                      question.question_type ||
                        DataProvider.questionType[0].value,
                      { shouldValidate: true }
                    );
                    return question.question_type
                      ? DataProvider.questionType.find(
                          (e) => e.value === question.question_type
                        )
                      : DataProvider.questionType[0];
                  }}
                />
              </div>

              <div className="d-flex justify-content-end">
                <ButtonWithIcon
                  text={"Next Step"}
                  icon={SvgImages.right_arrow}
                  onClick={handleSubmitStepOne(saveStepOneData)}
                />
              </div>
            </div>
          </form>
        ) : null}

        {currentStep === 2 || currentStep === 2.1 ? (
          <form
            onSubmit={
              currentStep === 2.1
                ? handleSubmitSubQuestion(addSubQuestionApiTask)
                : watchStepOne("typeOfQuestion") === "General"
                ? handleSubmitStepTwo(addQuestionApiTask)
                : handleSubmitStepTwoParent(addQuestionApiTask)
            }
          >
            {currentStep === 2.1 && (
              <>
                <TitleLabel
                  text={"Parent Question"}
                  className="login_heading"
                />
                <div className="w-100 alert alert-primary text-truncate p-2 font-weight-bold mt-2 mb-4">
                  {getTextFromHtml(question?.question)}
                </div>
              </>
            )}
            <div className="d-flex flex-column gap-2">
              <div className="d-flex gap-4 w-100">
                {watchStepOne("typeOfQuestion") === "General" && (
                  <div className={`d-flex flex-column w-100`}>
                    <CustomTextEditor
                      labelTitle={"Question"}
                      name="question"
                      id="question"
                      setValue={setValuesStepTwo}
                      setResetValue={setResetTopicDetailsValue}
                      resetValue={resetTopicDetailsValue}
                      showError={errorsStepTwo?.question}
                      errorMessage={errorsStepTwo?.question?.message}
                      showMandatory={true}
                      defaultValue={question?.question || ""}
                    />
                    <CustomTextEditor
                      labelTitle={"Option A"}
                      name="optionOne"
                      id="optionOne"
                      setValue={setValuesStepTwo}
                      showError={errorsStepTwo?.optionOne}
                      setResetValue={setResetTopicDetailsValue}
                      resetValue={resetTopicDetailsValue}
                      errorMessage={errorsStepTwo?.optionOne?.message}
                      showMandatory={true}
                      defaultValue={question?.optionOne || ""}
                    />
                    <CustomTextEditor
                      labelTitle={"Option B"}
                      name="optionTwo"
                      id="optionTwo"
                      setValue={setValuesStepTwo}
                      setResetValue={setResetTopicDetailsValue}
                      resetValue={resetTopicDetailsValue}
                      showError={errorsStepTwo?.optionTwo}
                      errorMessage={errorsStepTwo?.optionTwo?.message}
                      showMandatory={true}
                      defaultValue={question?.optionTwo || ""}
                    />
                    <CustomTextEditor
                      labelTitle={"Option C"}
                      name="optionThree"
                      id="optionThree"
                      setValue={setValuesStepTwo}
                      showError={errorsStepTwo?.optionThree}
                      setResetValue={setResetTopicDetailsValue}
                      resetValue={resetTopicDetailsValue}
                      errorMessage={errorsStepTwo?.optionThree?.message}
                      showMandatory={true}
                      defaultValue={question?.optionThree || ""}
                    />
                    <CustomTextEditor
                      labelTitle={"Option D"}
                      name="optionFour"
                      id="optionFour"
                      setValue={setValuesStepTwo}
                      setResetValue={setResetTopicDetailsValue}
                      resetValue={resetTopicDetailsValue}
                      showError={errorsStepTwo?.optionFour}
                      errorMessage={errorsStepTwo?.optionFour?.message}
                      showMandatory={true}
                      defaultValue={question?.optionFour || ""}
                    />
                    <div className="Correct_box py-0 mb-4 mt-2">
                      <div className="col-md-12 ps-0 px-2 pt-3">
                        {
                          <CustomDropDown
                            labelTitle="Correct Option"
                            placeholder="Select"
                            name="correctOption"
                            id="correctOption"
                            additionalClasses="profile_edit"
                            inputType={InputType.text}
                            showError={errorsStepTwo?.correctOption}
                            errorMessage={errorsStepTwo?.correctOption?.message}
                            showMandatory={true}
                            setValue={setValuesStepTwo}
                            options={DataProvider.answerOptions}
                            parentProps={{ style: importantStyle }}
                            defaultOption={
                              question.correctOption
                                ? DataProvider.answerOptions.find(
                                    (e) => e.value === question.correctOption
                                  )
                                : DataProvider.answerOptions[0]
                            }
                          />
                        }
                      </div>
                    </div>
                    <CustomTextEditor
                      labelTitle={"Solution"}
                      name="solution"
                      id="solution"
                      setValue={setValuesStepTwo}
                      showError={errorsStepTwo?.solution}
                      setResetValue={setResetTopicDetailsValue}
                      resetValue={resetTopicDetailsValue}
                      errorMessage={errorsStepTwo?.solution?.message}
                      defaultValue={question?.solution || ""}
                    />
                    {watchStepOne("typeOfQuestion") === "Comprehensive" &&
                      currentStep === 2.1 && (
                        <div className="d-flex justify-content-end mt-3">
                          <ButtonWithIcon
                            text={
                              selectedSubQuestion &&
                              selectedSubQuestion.sub_question_id
                                ? "Update Question"
                                : "Add Question"
                            }
                            icon={
                              selectedSubQuestion &&
                              selectedSubQuestion.sub_question_id
                                ? SvgImages.tick_mark
                                : SvgImages.plus
                            }
                            onClick={handleSubmitStepTwo(addSubQuestionApiTask)}
                          />
                        </div>
                      )}
                  </div>
                )}
                {watchStepOne("typeOfQuestion") === "Comprehensive" &&
                  currentStep === 2 && (
                    <div className={`d-flex flex-column w-100`}>
                      <CustomTextEditor
                        labelTitle={"Parent question"}
                        name="questions"
                        id="questions"
                        // updateValue={question.question}
                        setValue={setValuesStepTwoParent}
                        setResetValue={setResetTopicDetailsValue}
                        resetValue={resetTopicDetailsValue}
                        showError={errorsStepTwoParent?.questions}
                        errorMessage={errorsStepTwoParent?.questions?.message}
                        showMandatory={true}
                        defaultValue={question?.question || ""}
                      />
                    </div>
                  )}

                {currentStep === 2.1 &&
                  watchStepOne("typeOfQuestion") === "Comprehensive" && (
                    <div className="d-flex gap-4 w-100">
                      <div className={`d-flex flex-column ${"w-50"}`}>
                        <CustomTextEditor
                          labelTitle={"Question"}
                          name="subquestion"
                          id="subquestion"
                          setValue={setValuesSubQuestion}
                          setResetValue={setResetTopicDetailsValue}
                          resetValue={resetTopicDetailsValue}
                          showError={errorsSubQuestion?.subquestion}
                          errorMessage={errorsSubQuestion?.subquestion?.message}
                          showMandatory={true}
                          defaultValue={selectedSubQuestion?.question || ""}
                        />
                        <CustomTextEditor
                          labelTitle={"Option A"}
                          name="subOptionOne"
                          id="subOptionOne"
                          setValue={setValuesSubQuestion}
                          showError={errorsSubQuestion?.subOptionOne}
                          setResetValue={setResetTopicDetailsValue}
                          resetValue={resetTopicDetailsValue}
                          errorMessage={
                            errorsSubQuestion?.subOptionOne?.message
                          }
                          showMandatory={true}
                          defaultValue={selectedSubQuestion?.optionOne || ""}
                        />
                        <CustomTextEditor
                          labelTitle={"Option B"}
                          name="subOptionTwo"
                          id="subOptionTwo"
                          setValue={setValuesSubQuestion}
                          setResetValue={setResetTopicDetailsValue}
                          resetValue={resetTopicDetailsValue}
                          showError={errorsSubQuestion?.subOptionTwo}
                          errorMessage={
                            errorsSubQuestion?.subOptionTwo?.message
                          }
                          showMandatory={true}
                          defaultValue={selectedSubQuestion?.optionTwo || ""}
                        />
                        <CustomTextEditor
                          labelTitle={"Option C"}
                          name="subOptionThree"
                          id="subOptionThree"
                          setValue={setValuesSubQuestion}
                          showError={errorsSubQuestion?.subOptionThree}
                          setResetValue={setResetTopicDetailsValue}
                          resetValue={resetTopicDetailsValue}
                          errorMessage={
                            errorsSubQuestion?.subOptionThree?.message
                          }
                          showMandatory={true}
                          defaultValue={selectedSubQuestion?.optionThree || ""}
                        />
                        <CustomTextEditor
                          labelTitle={"Option D"}
                          name="subOptionFour"
                          id="subOptionFour"
                          setValue={setValuesSubQuestion}
                          setResetValue={setResetTopicDetailsValue}
                          resetValue={resetTopicDetailsValue}
                          showError={errorsSubQuestion?.subOptionFour}
                          errorMessage={
                            errorsSubQuestion?.subOptionFour?.message
                          }
                          showMandatory={true}
                          defaultValue={selectedSubQuestion?.optionFour || ""}
                        />
                        <div className="Correct_box py-0 mb-4 mt-2">
                          <div className="col-md-12 ps-0 px-2 pt-3">
                           
                            {
                              <CustomDropDown
                                labelTitle="Correct Option"
                                placeholder="Select"
                                name="subCorrectOption"
                                id="subCorrectOption"
                                additionalClasses="profile_edit"
                                inputType={InputType.text}
                                setResetValue={setResetTopicDetailsValue}
                                showError={errorsSubQuestion?.subCorrectOption}
                                errorMessage={
                                  errorsSubQuestion?.subCorrectOption?.message
                                }
                                showMandatory={true}
                                setValue={setValuesSubQuestion}
                                options={DataProvider?.answerOptions}
                                resetValue={resetTopicDetailsValue}
                                parentProps={{ style: importantStyle }}
                                defaultOption={
                                  selectedSubQuestion?.correctOption
                                    ? DataProvider.answerOptions.find(
                                        (e) =>
                                          e.value ===
                                          selectedSubQuestion?.correctOption
                                      )
                                    : ""
                                }
                              />
                            }
                          </div>
                        </div>
                        <CustomTextEditor
                          labelTitle={"Solution"}
                          name="subSolution"
                          id="subSolution"
                          setValue={setValuesSubQuestion}
                          showError={errorsSubQuestion?.subSolution}
                          setResetValue={setResetTopicDetailsValue}
                          resetValue={resetTopicDetailsValue}
                          errorMessage={errorsSubQuestion?.subSolution?.message}
                          defaultValue={selectedSubQuestion?.subSolution || ""}
                        />

                        <div className="d-flex justify-content-end mt-3">
                          <ButtonWithIcon
                            text={
                              selectedSubQuestion &&
                              selectedSubQuestion.sub_question_id
                                ? "Update Sub Question"
                                : "Add Sub Question"
                            }
                            icon={
                              selectedSubQuestion &&
                              selectedSubQuestion.sub_question_id
                                ? SvgImages.tick_mark
                                : SvgImages.plus
                            }
                            onClick={handleSubmitSubQuestion(
                              addSubQuestionApiTask
                            )}
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-column w-50 topic_card p-4">
                        <label className="fs-20 fw-600">Questions</label>

                        {allSubQuestions.length > 0 ? (
                          <div className="mt-4 gap-4 ">
                            {allSubQuestions?.map((data, index) => {
                              const correctOption = data.correctOption;
                              return (
                                <div
                                  key={index}
                                  className="subQuestion_cards mt-3 mb-4 "
                                >
                                  <h5 className="mb-3">
                                    {index + 1}.{" "}
                                    {getTextFromHtml(data.question)}
                                  </h5>
                                  <div className="d-flex flex-column ">
                                    <div
                                      className={`alert  mb-1 p-1 alert-${
                                        correctOption === 1
                                          ? "success"
                                          : "secondary"
                                      }`}
                                    >
                                      A. {data.optionOne}
                                    </div>
                                    <div
                                      className={`alert  mb-1 p-1 alert-${
                                        correctOption === 2
                                          ? "success"
                                          : "secondary"
                                      }`}
                                    >
                                      B. {data.optionTwo}
                                    </div>
                                    <div
                                      className={`alert  mb-1 p-1 alert-${
                                        correctOption === 3
                                          ? "success"
                                          : "secondary"
                                      }`}
                                    >
                                      C. {data.optionThree}
                                    </div>
                                    <div
                                      className={`alert  mb-1 p-1 alert-${
                                        correctOption === 4
                                          ? "success"
                                          : "secondary"
                                      }`}
                                    >
                                      D. {data.optionFour}
                                    </div>
                                  </div>

                                  <div className="d-flex justify-content-end mb-0 ">
                                    <div
                                      className="cursor-pointer p-1"
                                      onClick={() => {
                                        setSelectedSubQuestion(data);
                                      }}
                                    >
                                      <Image
                                        src={SvgImages.edit}
                                        className="chapter_edit_image p-0 m-0 "
                                      />
                                    </div>
                                    <div className="bg-secondry p-1">:</div>
                                    <div
                                      className="  cursor-pointer p-1"
                                      onClick={() => {
                                        setSubQuestionToDelete(data);
                                        setShowSubQuestionDeleteModal(true);
                                      }}
                                    >
                                      <Image
                                        src={SvgImages.deleteIcon}
                                        className="chapter_delete_image"
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="d-flex flex-column align-items-center justify-content-center my-3 h-100">
                            <Image
                              src={SvgImages.noTopics}
                              style={{ height: 250 }}
                            />
                            <h1 className="subText fs-20 fw-600 my-3">
                              No Questions Found
                            </h1>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {/* Footer */}
              <div className="d-flex justify-content-between align-items-center w-100 mt-2">
                <button
                  className="back_login m-0 cursor-pointer"
                  onClick={() => setCurrentStep(1)}
                >
                  <Image src={SvgImages.back_arrow_login} className="m-0" />
                  Back
                </button>

                <ButtonWithIcon
                  text={
                    watchStepOne("typeOfQuestion") === "General" ||
                    currentStep === 2.1
                      ? "Submit"
                      : "Add Questions"
                  }
                  icon={SvgImages.right_arrow}
                  onClick={() => {
                    if (
                      currentStep === 2 ||
                      watchStepOne("typeOfQuestion") === "Comprehensive"
                    ) {
                      handleSubmitStepTwoParent(addQuestionApiTask);
                    } else if (watchStepOne("typeOfQuestion") === "General") {
                      handleSubmitStepTwo(addQuestionApiTask);
                    }
                    if (
                      currentStep === 2.1 &&
                      watchStepOne("typeOfQuestion") === "Comprehensive"
                    ) {
                      setCurrentStep(3);
                    } else {
                      handleSubmitStepTwo(addQuestionApiTask);
                    }
                  }}
                />
              </div>
            </div>
          </form>
        ) : null}

        {currentStep === 3 ? (
          <div className="d-flex flex-column align-items-center justify-content-center mt-4">
            <Image
              src={SvgImages.StudyMaterialAddedSuccess}
              style={{ height: 250 }}
            />
            <h1 className="primary fs-20 fw-600 mb-0">Well Done!</h1>
            <h3 className="black fs-14 fw-400 mb-0 mt-1">
              You have successfully added question
            </h3>

            <div className="d-flex justify-content-between align-items-center w-100 mt-5">
              <button
                className="back_login m-0 cursor-pointer"
                onClick={() => setCurrentStep(2)}
              >
                <Image src={SvgImages.back_arrow_login} className="m-0" />
                Back
              </button>
              <div className="select-btn">
                <ButtonWithIcon
                  text={"Add More Questions"}
                  icon={SvgImages.plus}
                  onClick={() => {
                    setQuestion(null);
                    navigate(RoutesPath.addQuestionBank, { state: null });
                    window.location.reload();
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {/* Delete Topic Modal */}
      <ConfirmationModal
        showModal={showSubQuestionDeleteModal}
        setShowModal={setShowSubQuestionDeleteModal}
        text={"Are you sure want to delete this topic?"}
        icon={SvgImages.deleteIcon} // Specify the path to your delete icon
        rightClickAction={() => {
          deleteSubQuestionApiTask(subQuestionToDelete);
        }}
        theme={ConfirmationModalTheme.error}
      />
    </div>
  );
};

export default AddQuestionBank;
