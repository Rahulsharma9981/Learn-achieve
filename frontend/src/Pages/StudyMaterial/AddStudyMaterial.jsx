import React, { useEffect, useState } from "react";
import { PngImages, SvgImages } from "../../Utils/LocalImages";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import ButtonWithIcon from "../../Components/Reusable/ButtonWithIcon";
import CustomDropDown from "../../Components/Reusable/CustomDropDown";
import * as yup from "yup";
import { InputType, ValidationHelper, handleApiErrors, validationRegex } from "../../Utils/Utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ClassService from "../../Services/ClassService";
import DataProvider from "../../Utils/DataProvider";
import SubjectService from "../../Services/SubjectService";
import StudyMaterialService from "../../Services/StudyMaterialService";
import Image from "../../Components/Reusable/Image";
import { ConfirmationModalTheme, ImageFilters } from "../../Utils/Enums";
import FormModal from "../../Components/modal/FormModal";
import CustomTextField from "../../Components/Reusable/CustomTextField";
import RoutesPath from "../../Utils/RoutesPath";
import ConfirmationModal from "../../Components/modal/ConfirmationModal";
import CustomTextEditor from "../../Components/Reusable/CustomTextEditor";

const AddStudyMaterial = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [topics, setTopics] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [showEditModuleModal, setShowEditModuleModal] = useState(false);
  const [resetTopicDetailsValue, setResetTopicDetailsValue] = useState(false);
  const [editData, setEditData] = useState(false);
  const [studyMaterialId, setStudyMaterialId] = useState(null);
  const [studyMaterial, setStudyMaterial] = useState({ ...useLocation().state });
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [moduleSearchQuery, setModuleSearchQuery] = useState("");
  const [updatedTopicDetailsValue, setUpdatedTopicDetailsValue] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteTopicModal, setShowDeleteTopicModal] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState(false);
  const [resetSubject, setResetSubject] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState("");
  const [showAddModuleBtn, setShowAddModuleBtn] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [showAddTopicPage, setShowAddTopicPage] = useState(false);
  const [youtubeLinks, setYoutubeLinks] = useState(Array());
  const [uploadedDocuments, setUploadedDocuments] = useState(Array());

  const navigate = useNavigate();

  const moduleBackgroundOptions = [
    { background: PngImages.ModuleCardOrangeBackground, color: "#FDD18E" }, // orange
    { background: PngImages.ModuleCardGreenBackground, color: "#A6F499" }, // green
    { background: PngImages.ModuleCardBlueBackground, color: "#A9E9F9" }, // blue
    { background: PngImages.ModuleCardPurpleBackground, color: "#E1CAFF" }, // purple
    { background: PngImages.ModuleCardPinkBackground, color: "#FFBDBD" },  // pink
    { background: PngImages.ModudleCardYellowBackground, color: "#FCEEA9" }  // yellow
  ];

  const stepOneValidations = yup.object().shape({
    class_id: validationRegex.required,
    subject: validationRegex.required,
    medium: validationRegex.required
  });

  const addTopicValidation = yup.object().shape({
    topicName: validationRegex.required,
    topicDetails: validationRegex.required
  });

  const addEditModuleValidations = yup.object().shape({
    moduleName: validationRegex.required
  });

  const { register: registerStepOne, handleSubmit: handleSubmitStepOne, setValue: setValuesStepOne, formState: { errors: errorsStepOne }, watch: watchStepOne, getValues: getValuesStepOne, reset: resetStepOne } = useForm({
    resolver: yupResolver(stepOneValidations),
    defaultValues: {
      class_id: studyMaterial ? studyMaterial?.class_id : "",
      subject: studyMaterial ? studyMaterial?.subject_id : "",
      medium: studyMaterial ? studyMaterial?.medium : "",
    },
  });

  const { register: registerAddTopic, handleSubmit: handleSubmitAddTopic, setValue: setValuesAddTopic, setError: setErrorAddTopics, formState: { errors: errorsAddTopic }, watch: watchAddTopic, getValues: getValuesAddTopic, reset: resetAddTopic } = useForm({
    resolver: yupResolver(addTopicValidation),
    defaultValues: {
      topicName: "",
      topicDetails: ""
    },
  });

  const { register: registerAddModule, handleSubmit: handleSubmitAddModule, setValue: setValuesAddModule, formState: { errors: errorsAddModule }, watch: watchAddModule, getValues: getValuesAddModule, reset: resetAddModule } = useForm({
    resolver: yupResolver(addEditModuleValidations),
    defaultValues: {
      moduleName: ""
    },
  });

  const { register: registerEditModule, handleSubmit: handleSubmitEditModule, setValue: setValuesEditModule, formState: { errors: errorsEditModule }, watch: watchEditModule, getValues: getValuesEditModule, reset: resetEditModule } = useForm({
    resolver: yupResolver(addEditModuleValidations),
    defaultValues: {
      moduleName: ""
    },
  });

  useEffect(() => {
    if (getValuesStepOne("class_id")) {
      if (!isFirstLoad) {
        setValuesStepOne("subject", "");
        setResetSubject(true);
      } else {
        setIsFirstLoad(false);
      }
      getAllSubjects(getValuesStepOne("class_id"));
    }
  }, [watchStepOne("class_id")]);

  useEffect(() => {
    if (currentStep === 2) {
      if (studyMaterialId)
        getAllModules();
    }
  }, [currentStep]);

  useEffect(() => {
    if (selectedModule && selectedModule.module_id) {
      getAllTopics();
    }
  }, [selectedModule]);

  useEffect(() => {
    if (selectedTopic && selectedTopic.topic_id) {
      setValuesAddTopic("topicName", selectedTopic.topic_name);
      setValuesAddTopic("topicDetails", selectedTopic.details);
      setUpdatedTopicDetailsValue(selectedTopic.details);
      setYoutubeLinks(selectedTopic.youtube_links);
      setUploadedDocuments(selectedTopic.uploaded_files);
    }
  }, [selectedTopic]);

  useEffect(() => {
    setStudyMaterialId(studyMaterial?.id)
    if (studyMaterialId)
      getAllModules();
  }, [studyMaterial?.id]);

  useEffect(() => {
    const timeOutId = setTimeout(() => { if (studyMaterialId) getAllModules() }, 500);
    return () => clearTimeout(timeOutId);
  }, [moduleSearchQuery]);

  const clearAddTopicForm = () => {
    setSelectedTopic(null);
    setSelectedTopic(null);
    setYoutubeLinks(Array());
    setUploadedDocuments(Array());
    setResetTopicDetailsValue(true);
    setUpdatedTopicDetailsValue("");
    resetAddTopic();
  }

  const resetAddTopicPage = () => {
    setTopics(Array());
    setSelectedModule(null);
    clearAddTopicForm();
  }

  const addModuleApiTask = async (data) => {
    try {
      await StudyMaterialService.addModule(data.moduleName, studyMaterialId);
      setShowAddModuleModal(false);
      getAllModules();
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const addTopicApiTask = async (data) => {
    try {
      var filesToUpload = [];
      uploadedDocuments.map((e) => filesToUpload.push(e.name));
      const response = await StudyMaterialService.addTopic(
        data.topicName,
        selectedModule.module_id,
        studyMaterialId,
        data.topicDetails,
        uploadedDocuments,
        youtubeLinks,
        (selectedTopic && selectedTopic.topic_id) ? selectedTopic.topic_id : ""
      );
      toast.success((selectedTopic && selectedTopic.topic_id) ? "Topic Updated Successfully" : "Topic Added Successfully");
      getAllTopics();
      clearAddTopicForm();
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const deleteTopicApiTask = async (data) => {
    try {
      await StudyMaterialService.deleteTopic(data.topic_id);
      clearAddTopicForm();
      setShowDeleteTopicModal(false);
      getAllTopics();
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const deleteModuleApiTask = async (data) => {
    try {
      await StudyMaterialService.deleteModule(data.module_id);
      setShowDeleteModal(false);
      setModuleSearchQuery("");
      getAllModules();
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const updateModuleApiTask = async (data) => {
    try {
      await StudyMaterialService.updateModule(editData.module_id, data.moduleName, studyMaterialId);
      setShowEditModuleModal(false);
      getAllModules();
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const addStudyMaterial = async (data) => {
    try {
      const response = await StudyMaterialService.addStudyMaterial(data.subject, data.class_id, data.medium);
      const studyMaterialData = {
        id: response.study_material_id,
        class_id: data.class_id,
        class_name: classes[classes.findIndex((e) => e._id == data.class_id)].class_name,
        subject_name: subjects[subjects.findIndex((e) => e._id == data.subject)].subject_name,
        subject_id: data.subject,
        medium: data.medium,
      };
      setStudyMaterial(studyMaterialData);
      setStudyMaterialId(response.study_material_id);
      setCurrentStep(2);
      setShowAddTopicPage(false);
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const updateStudyMaterial = async (data) => {
    try {
      const response = await StudyMaterialService.updateStudyMaterial(data.subject, data.class_id, data.medium, studyMaterialId);
      const studyMaterialData = {
        id: studyMaterialId,
        class_id: data.class_id,
        class_name: classes[classes?.findIndex((e) => e._id == data.class_id)].class_name,
        subject_name: subjects[subjects?.findIndex((e) => e._id == data.subject)].subject_name,
        subject_id: data.subject,
        medium: data.medium,
      }
      setStudyMaterial(studyMaterialData);
      setCurrentStep(2);
      setShowAddTopicPage(false);
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const getAllModules = async (data) => {
    try {
      const response = await StudyMaterialService.getAllModules(studyMaterialId, moduleSearchQuery);
      setModules(response.moduleList);
      setShowAddModuleBtn(response.moduleList.length === 0 && moduleSearchQuery.trim() === "");
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const getAllTopics = async () => {
    try {
      const response = await StudyMaterialService.getAllTopics(selectedModule.module_id);
      setTopics(response.topicList);
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
      const response = await SubjectService.getAllSubjectsWithoutPagination(classId);
      setSubjects(response.data);

    } catch (error) {
      handleApiErrors(error);
    }
  };

  useEffect(() => { getAllClasses() }, []);

  return (
    <div className="content" data-number="1">
      <div className="mb-3 d-flex justify-content-between">
        <h1 className="black fs-18 fw-600 mb-0">STUDY MATERIAL</h1>
        <div className="d-flex">
          <h4 className="fs-12 fw-500 black mb-0 me-1">Dashboard &gt;</h4>
          <h4 className="fs-12 fw-500 primary mb-0">Study Material</h4>
        </div>
      </div>

      <div className="table_container">
        <div className="table_title p-0">
          <div className="table_headings">
            <h1 className="black fs-18 fw-600 mb-0">Add Study Material</h1>
          </div>
        </div>

        <div className="progress_bar">
          <div className={`step-${currentStep}`} id="checkout-progress" data-current-step="1">
            <div className="progress-bar">
              <div onClick={() => setCurrentStep(1)} className={`step cursor-pointer step-1 ${currentStep === 1 ? "active" : currentStep > 1 ? "valid" : ""}`}><span> 01</span>
                <div className="fa fa-check opaque">
                  <Image src={SvgImages.tick_mark}></Image>
                </div>
              </div>
              <div onClick={() => { if (currentStep > 2) setCurrentStep(2) }} className={`step cursor-pointer step-2 ${currentStep === 2 ? "active" : currentStep > 2 ? "valid" : ""}`}><span>02</span>
                <div className="fa fa-check opaque">
                  <Image src={SvgImages.tick_mark}></Image>
                </div>
              </div>
              <div className={`step cursor-pointer step-3 ${currentStep === 3 ? "active" : currentStep > 3 ? "valid" : ""}`}><span> 03</span>
                <div className="fa fa-check opaque">
                  <Image src={SvgImages.tick_mark}></Image>
                </div>
              </div>
            </div>
          </div>
        </div>

        {
          currentStep === 1 ?
            <form onSubmit={handleSubmitStepOne((studyMaterialId && studyMaterialId !== "") ? updateStudyMaterial : addStudyMaterial)}>
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
                    register={registerStepOne}
                    showMandatory={true}
                    setValue={setValuesStepOne}
                    options={
                      classes?.map((e) => { return { value: e._id, label: e.class_name } })
                    }
                    defaultOption={() => {
                      return studyMaterial.class_id ? { value: studyMaterial.class_id, label: studyMaterial.class_name } : null
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
                    resetValue={resetSubject}
                    setResetValue={setResetSubject}
                    inputType={InputType.text}
                    showError={errorsStepOne?.subject}
                    errorMessage={errorsStepOne?.subject?.message}
                    register={registerStepOne}
                    showMandatory={true}
                    setValue={setValuesStepOne}
                    options={
                      subjects?.map((e) => { return { value: e._id, label: e.subject_name } })
                    }
                    defaultOption={() => {
                      return studyMaterial.subject_id ? { value: studyMaterial.subject_id, label: studyMaterial.subject_name } : null
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
                    inputType={InputType.text}
                    showError={errorsStepOne?.medium}
                    errorMessage={errorsStepOne?.medium?.message}
                    register={registerStepOne}
                    showMandatory={true}
                    setValue={setValuesStepOne}
                    options={
                      DataProvider.mediumList
                    }
                    defaultOption={() => {
                      return studyMaterial.medium ? { value: studyMaterial.medium, label: studyMaterial.medium } : null
                    }}
                  />
                </div>

                <div className="d-flex justify-content-end">
                  <ButtonWithIcon text={"Next Step"} icon={SvgImages.right_arrow} onClick={handleSubmitStepOne((studyMaterialId && studyMaterialId !== "") ? updateStudyMaterial : addStudyMaterial)} />
                </div>
              </div>
            </form> : null
        }

        {currentStep === 2 ?
          showAddTopicPage ?
            //  - Add Topic Section
            <div className="d-flex flex-column">
              <div className="d-flex gap-4 w-100">
                <div className="d-flex flex-column w-50">
                  <form onSubmit={handleSubmitAddTopic(addTopicApiTask)}>
                    <CustomTextField
                      labelTitle="Topic Name"
                      placeholder="Enter topic name"
                      name="topicName"
                      id="topicName"
                      showError={errorsAddTopic?.topicName}
                      errorMessage={errorsAddTopic?.topicName?.message}
                      register={registerAddTopic}
                      additionalClasses="profile_edit"
                      showMandatory={true}
                    />

                    <CustomTextEditor
                      labelTitle={"Details"}
                      name="topicDetails"
                      id="topicDetails"
                      updateValue={updatedTopicDetailsValue}
                      setResetValue={setResetTopicDetailsValue}
                      resetValue={resetTopicDetailsValue}
                      setValue={setValuesAddTopic}
                      showError={errorsAddTopic?.topicDetails}
                      errorMessage={errorsAddTopic?.topicDetails?.message}
                      showMandatory={true}
                    />

                    <label className="singleLineHeading">Upload Pdf, Docs, PPT</label>

                    <div className="position-relative file_select_box">
                      <input type="file" className="input_feilds bg_light file_select" multiple={true} name="fileupload"
                        {...registerAddTopic("uploadDocument")}
                        onChange={(e) => {
                          if (e.target.files.length > 0) {
                            setUploadedDocuments([...uploadedDocuments, ...e.target.files])
                          }
                        }} />
                      <label className="w-75">
                        <Image src={SvgImages.select_file} style={ImageFilters.lightGrey} />
                        <h3 className="file_upload_text">Upload File</h3>
                      </label>
                    </div>

                    {
                      uploadedDocuments?.map((data, index) => (
                        <div key={index} className="d-flex gap-2 align-items-center p-1 youtubeLinkBackground mt-3">
                          <div className="d-flex w-100 align-items-center">
                            <label className="singleLineHeading ms-2 my-2">{data.name}</label>
                            <label className="fs-14 subText mb-0 ms-1 me-2">{ValidationHelper.formatBytes(data.size)}</label>
                          </div>

                          <div className="topic_add_btn link_add" style={{ background: "#FFFFFF" }} onClick={() => {
                            setUploadedDocuments([
                              ...uploadedDocuments.slice(0, index),
                              ...uploadedDocuments.slice(index + 1)
                            ]);
                          }}>
                            <Image src={SvgImages.deleteIcon} style={{ filter: ImageFilters.red.filter, height: 20 }} />
                          </div>
                        </div>
                      ))
                    }

                    <div className="form-group mt-3 d-flex flex-column">
                      <label className="singleLineHeading">Youtube Link</label>
                      <div className="d-flex gap-2 align-items-center">
                        <input
                          type={InputType.text}
                          className="form-control profile_edit"
                          placeholder="Enter youtube link"
                          {...registerAddTopic("youtubeLink")}
                        />

                        <div className="topic_add_btn link_add" onClick={() => { 
                          if (ValidationHelper.isValidYoutubeUrl(getValuesAddTopic("youtubeLink"))) {
                            if (youtubeLinks.findIndex((e) => e.trim() == getValuesAddTopic("youtubeLink").trim()) == -1) {
                              setErrorAddTopics("youtubeLink", null);
                              setYoutubeLinks([...youtubeLinks, getValuesAddTopic("youtubeLink")]);
                              setValuesAddTopic("youtubeLink", "");
                            } else {
                              setErrorAddTopics("youtubeLink", { message: "URL already added!" });
                            }
                          } else {
                            setErrorAddTopics("youtubeLink", { message: "Data should be a valid URL" });
                          }
                        }}>
                          <Image src={SvgImages.circle_plus} />
                        </div>
                      </div>

                      {errorsAddTopic?.youtubeLink ? <span className="danger fs-14 fw-400 mt-1">{errorsAddTopic?.youtubeLink?.message}</span> : null}
                    </div>

                    {
                      youtubeLinks?.map((data, index) => (
                        <div key={index} className="d-flex gap-2 align-items-center p-1 youtubeLinkBackground mt-3">
                          <label className="login_heading w-100 m-2">{data}</label>

                          <div className="topic_add_btn link_add" style={{ background: "#FFFFFF" }} onClick={() => {
                            setYoutubeLinks([
                              ...youtubeLinks.slice(0, index),
                              ...youtubeLinks.slice(index + 1)
                            ]);
                          }}>
                            <Image src={SvgImages.deleteIcon} style={{ filter: ImageFilters.red.filter, height: 20 }} />
                          </div>
                        </div>
                      ))
                    }


                    <div className="d-flex justify-content-end mt-3">
                      <ButtonWithIcon
                        text={selectedTopic && selectedTopic.topic_id ? "Update" : "Add"}
                        icon={selectedTopic && selectedTopic.topic_id ? SvgImages.tick_mark : SvgImages.plus}
                        onClick={handleSubmitAddTopic(addTopicApiTask)} />
                    </div>
                  </form>
                </div>

                <div className="d-flex flex-column w-50 topic_card p-4">
                  <label className="fs-20 fw-600">Topics</label>

                  {topics.length > 0 ?
                    <div className="mt-4 gap-4 topicGrid">
                      {
                        topics?.map((data, index) => {
                          return <div key={index} className="topics_cards position-relative">
                            <h3>{data.topic_name}</h3>
                            <div className="d-flex position-absolute end-0 bottom-0">
                              <div className="position-relative chapter_edit cursor-pointer" onClick={() => {
                                setSelectedTopic(data);
                              }}>
                                <Image src={SvgImages.edit} className="chapter_edit_image" />
                              </div>
                              <div className="position-relative chapter_delete cursor-pointer" onClick={() => {
                                setTopicToDelete(data);
                                setShowDeleteTopicModal(true);
                              }}>
                                <Image src={SvgImages.deleteIcon} className="chapter_delete_image" />
                              </div>
                            </div>
                          </div>
                        })
                      }
                    </div>
                    :
                    <div className="d-flex flex-column align-items-center justify-content-center my-3 h-100">
                      <Image src={SvgImages.noTopics} style={{ height: 250 }} />
                      <h1 className="subText fs-20 fw-600 my-3">No Topics Found</h1>
                    </div>
                  }
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center w-100 mt-4">
                <a className="back_login m-0 cursor-pointer" onClick={() => {
                  setShowAddTopicPage(false);
                  getAllModules();
                }}>
                  <Image src={SvgImages.back_arrow_login} className="m-0" />
                  Back
                </a>
                <div className="select-btn ">
                  <ButtonWithIcon text={"Submit Changes"} icon={SvgImages.right_arrow} onClick={() => {
                    setShowAddTopicPage(false);
                    getAllModules();
                  }} />
                </div>
              </div>
            </div>
            :
            // - Module Listing
            (modules.length > 0 || moduleSearchQuery.trim() !== "") ?
              <div className="d-flex flex-column">
                <div className="d-flex gap-4 align-items-center justify-content-end">
                  <div className="position-relative">
                    <input type="search" className="search_box search_bar" placeholder="Search" value={moduleSearchQuery} onChange={(e) => {
                      setModuleSearchQuery(e.target.value)
                    }} />
                    <Image src={SvgImages.search} style={ImageFilters.gray} className="search_icon" alt="Search Icon" height="20px"/>
                  </div>

                  <ButtonWithIcon text={"Add Module"} icon={SvgImages.plus} onClick={() => {
                    resetAddModule();
                    setShowAddModuleModal(true)
                  }} />
                </div>

                {(modules.length > 0) ?
                  < div className="mt-5 gap-5 moduleGrid px-3 overflow-hidden">
                    {modules?.map((data, index) => {
                      const backgroundData = moduleBackgroundOptions[index % moduleBackgroundOptions.length];
                      return <div key={index} className="position-relative">
                        <div className="d-flex flex-column align-items-center mx-auto" style={{ width: 180, height: 200 }}>
                          <div className="Chapter_img">
                            <Image src={backgroundData.background} style={{ width: 180 }} />
                          </div>

                          <div className="Chapter px-3 pb-2 align-items-start d-flex flex-column w-100 h-100">
                            <div className="d-flex justify-content-end align-items-center w-100 mb-2 gap-2">
                              <Image className="cursor-pointer" src={SvgImages.edit} style={ImageFilters.blue} onClick={() => {
                                setEditData(data);
                                setValuesEditModule("moduleName", data.module_name)
                                setShowEditModuleModal(true)
                              }} />

                              <div className="dashedFullHeightView" />

                              <Image className="cursor-pointer" src={SvgImages.deleteIcon} style={ImageFilters.red} onClick={() => {
                                setModuleToDelete(data);
                                setShowDeleteModal(true)
                              }} />
                            </div>

                            <h2>{data.module_name}</h2>
                            <div className="d-flex gap-2 align-items-center justify-content-center add_topic_btn p-2 mt-auto cursor-pointer"
                              style={{ backgroundColor: backgroundData.color }}
                              onClick={() => {
                                resetAddTopicPage();
                                setSelectedModule(data);
                                setShowAddTopicPage(true);
                              }}>
                              <h3 className="primary fs-12 fw-500 mb-0">Add Topic</h3>
                              <Image src={SvgImages.right_arrow} style={{ filter: ImageFilters.blue.filter, height: 16 }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    })}
                  </div>
                  : getNoModulesFoundDiv(resetAddModule, setShowAddModuleModal, showAddModuleBtn)
                }

                <div className="d-flex justify-content-between align-items-center w-100 mt-5">
                  <a className="cursor-pointer back_login m-0" onClick={() => setCurrentStep(1)}>
                    <Image src={SvgImages.back_arrow_login} className="m-0" />
                    Back
                  </a>
                  <div className="select-btn">
                    <ButtonWithIcon text={"Submit"} icon={SvgImages.right_arrow} onClick={() => setCurrentStep(3)} />
                  </div>
                </div>
              </div> :
              getNoModulesFoundDiv(resetAddModule, setShowAddModuleModal, showAddModuleBtn)
          : null
        }

        {currentStep === 3 ?
          <div className="d-flex flex-column align-items-center justify-content-center mt-5">
            <Image src={SvgImages.StudyMaterialAddedSuccess} style={{ height: 250 }} />
            <h1 className="primary fs-20 fw-600 mb-0">Well Done!</h1>
            <h3 className="black fs-14 fw-400 mb-0 mt-1">You have successfully added Study Material</h3>

            <div className="d-flex justify-content-between align-items-center w-100 mt-5">
              <a className="back_login m-0 cursor-pointer" onClick={() => setCurrentStep(2)}>
                <Image src={SvgImages.back_arrow_login} className="m-0" />
                Back
              </a>
              <div className="select-btn ">
                <ButtonWithIcon text={"Add Syllabus"} icon={SvgImages.plus} onClick={() => {
                  setStudyMaterial(null);
                  navigate(RoutesPath.addStudyMaterial, { state: null });
                  window.location.reload();
                }} />
              </div>
            </div>
          </div>
          : null
        }

      </div>

      {/* Add Module Modal */}
      <FormModal
        title={"Add Module"}
        showModal={showAddModuleModal}
        setShowModal={setShowAddModuleModal}
        submitClickAction={handleSubmitAddModule(addModuleApiTask)}
        children={
          <form onSubmit={
            handleSubmitAddModule(addModuleApiTask)
          } >
            {/* Custom Text Field for Module Name */}
            <CustomTextField
              labelTitle="Module"
              placeholder="Enter module name"
              name="moduleName"
              id="moduleName"
              showError={errorsAddModule?.moduleName}
              errorMessage={errorsAddModule?.moduleName?.message}
              register={registerAddModule}
              additionalClasses="profile_edit"
              showMandatory={true}
            />
          </form>
        }
      />

      {/* Edit Module Modal */}
      <FormModal
        title={"Edit Module"}
        showModal={showEditModuleModal}
        setShowModal={setShowEditModuleModal}
        submitButtonText="Update"
        submitButtonIcon={SvgImages.tick_mark}
        submitClickAction={handleSubmitEditModule(updateModuleApiTask)}
        children={
          <form onSubmit={
            handleSubmitEditModule(updateModuleApiTask)
          } >
            {/* Custom Text Field for Module Name */}
            <CustomTextField
              labelTitle="Module"
              placeholder="Enter module name"
              name="moduleName"
              id="moduleName"
              showError={errorsEditModule?.moduleName}
              errorMessage={errorsEditModule?.moduleName?.message}
              register={registerEditModule}
              additionalClasses="profile_edit"
              showMandatory={true}
            />
          </form>
        }
      />

      {/* Delete Study Material Modal */}
      <ConfirmationModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        text={"Are you sure want to delete this module?"}
        icon={SvgImages.deleteIcon} // Specify the path to your delete icon
        rightClickAction={() => { deleteModuleApiTask(moduleToDelete) }}
        theme={ConfirmationModalTheme.error}
      />

      {/* Delete Topic Modal */}
      <ConfirmationModal
        showModal={showDeleteTopicModal}
        setShowModal={setShowDeleteTopicModal}
        text={"Are you sure want to delete this topic?"}
        icon={SvgImages.deleteIcon} // Specify the path to your delete icon
        rightClickAction={() => { deleteTopicApiTask(topicToDelete) }}
        theme={ConfirmationModalTheme.error}
      />
    </div >
  );
};

export default AddStudyMaterial;

function getNoModulesFoundDiv(resetAddModule, setShowAddModuleModal, showAddModuleBtn) {
  return <div className="d-flex flex-column align-items-center justify-content-center mt-5 mb-3">
    <Image src={SvgImages.noTopics} style={{ height: 250 }} />
    <h1 className="subText fs-20 fw-600 my-3">No Modules Found</h1>
    {showAddModuleBtn ? <ButtonWithIcon text={"Add Module"} icon={SvgImages.plus} onClick={() => {
      resetAddModule();
      setShowAddModuleModal(true);
    }} /> : null}
  </div>;
}
