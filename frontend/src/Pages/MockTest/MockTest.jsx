import React, { useEffect, useState } from "react";
import { SvgImages } from "../../Utils/LocalImages";
import { ConfirmationModalTheme, ImageFilters } from "../../Utils/Enums";
import CustomTextField from "../../Components/Reusable/CustomTextField";
import ClassService from "../../Services/ClassService";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ButtonWithIcon from "../../Components/Reusable/ButtonWithIcon";
import Image from "../../Components/Reusable/Image";
import ConfirmationModal from "../../Components/modal/ConfirmationModal";
import FormModal from "../../Components/modal/FormModal";
import { InputType, handleApiErrors, validationRegex } from "../../Utils/Utils";
import generatePaginationFooter from "../../Components/Reusable/CustomPagination";
import SubjectService from "../../Services/SubjectService";
import CustomDropDown from "../../Components/Reusable/CustomDropDown";

import MockTestService from "../../Services/MockTestService";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../Utils/RoutesPath";

const MockTest = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [deleteId, setDeleteId] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isMultipleDelete, setIsMultipleDelete] = useState(false);
  const [getStatusChangeData, setStatusChangeData] = useState({});
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [availableDataCount, setAvailableDataCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState(null);

  // Form validation schema using Yup
  const schema = Yup.object().shape({
    class: validationRegex.required,
    subject: validationRegex.required,
  });

  const {
    register: registerAdd,
    setValue: setAddValue,
    handleSubmit: handleSubmitAdd,
    formState: { errors: errorsAdd },
    reset: resetAdd,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      class: "",
      subject: "",
    },
  });

  const {
    register: registerEdit,
    setValue: setEditValue,
    getValues: getEditValues,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
    setValue: setEditValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      class: "",
      subject: "",
    },
  });

  // Function to handle opening add modal
  const handleOpenAddModal = () => {};

  // Function to handle opening edit modal
  const handleOpenEditModal = (item) => {
    resetEdit();
    getAllClasses();
    setEditValues("class", item.class_id);
    setEditValues("subject", item.subject_name);
    setEditData(item);
    setShowEditModal(true);
  };

  const getAllClasses = async () => {
    try {
      const response = await ClassService.getAllClassesWithoutPagination();
      setClasses(response.data);
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await MockTestService.getAllMockTest(
        offset,
        limit,
        searchQuery || ""
      );

      setData(response.data);
      setAvailableDataCount(response.availableDataCount);

      if (offset != 0 && offset * limit > availableDataCount - 1) {
        setOffset(offset - 1);
      }
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const addSubjectApiTask = async (data) => {
    try {
      await SubjectService.addSubject({
        subject_name: data.subject,
        class_id: data.class,
      });
      setShowAddModal(false);
      toast.success("Class added successfully");
      fetchData();
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const editSubjectApiTask = async (params) => {
    try {
      const response = await SubjectService.updateSubject({
        id: editData.id,
        subject_name: params.subject.trim(),
        class_id: params.class.trim(),
      });

      setShowEditModal(false);
      toast.success("Subject updated successfully");

      var updatedData = data;
      const index = updatedData.findIndex((item) => item.id === editData.id);
      updatedData[index] = response.data;
      setData(updatedData);
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const deleteSingleSubject = async (id) => {
    try {
      await MockTestService.deleteMockTest([id]);
      toast.success("Mock Test Deleted successfully");
      setShowDeleteModal(false);

      setOffset(0);
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const deleteMultipleSubjects = async () => {
    try {
      if (data.findIndex((item) => item.isChecked) != -1) {
        var itemsToDelete = [];
        data.map((item) => {
          if (item.isChecked) {
            itemsToDelete.push(item._id);
          }
        });
      }
      await MockTestService.deleteMockTest(itemsToDelete);
      toast.success("Mock Test Deleted successfully");
      setShowDeleteModal(false);

      setOffset(0);
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const ChangeStatus = async (id, status) => {
    try {
      await MockTestService.updateMockTestStatus(id, status);
      toast.success("Mock Status Updated successfully");

      setShowConfirmationModal(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [offset]);
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setOffset(0);
      if (searchQuery != null) {
        fetchData();
      }
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [searchQuery]);

  return (
    <div>
      <div>
        <div className="content" data-number="1">
          <div className="mb-3 d-flex justify-content-between">
            <h1 className="black fs-18 fw-600 mb-0">MOCK TEST</h1>
            <div className="d-flex">
              <h4 className="fs-12 fw-500 black mb-0 me-1">Dashboard &gt;</h4>
              <h4 className="fs-12 fw-500 primary mb-0">MOCK TEST</h4>
            </div>
          </div>

          <div className="table_container" style={{ display: "block" }}>
            <div className="table_title">
              <div className="table_headings">
                <h1 className="black fs-18 fw-600 mb-0">MOCK TEST List</h1>
                <div className="d-flex gap-4 align-items-center">
                  <div className="position-relative">
                    <input
                      type="search"
                      className="search_box search_bar"
                      placeholder="Search"
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                      }}
                    />
                    <Image
                      src={SvgImages.search}
                      style={ImageFilters.gray}
                      className="search_icon"
                      alt="Search Icon"
                      height="20px"
                    />
                  </div>

                  <ButtonWithIcon
                    text={"Add MOCK TEST"}
                    icon={SvgImages.plus}
                    onClick={() => navigate(RoutesPath.addMockTest)}
                  />
                </div>
              </div>

              <div
                className="table_delete_icon"
                style={{
                  opacity:
                    data?.findIndex((item) => item.isChecked) == -1 ? 0.3 : 1,
                }}
                onClick={() => {
                  if (!(data.findIndex((item) => item.isChecked) == -1)) {
                    setIsMultipleDelete(true);
                    setShowDeleteModal(true);
                  }
                }}
              >
                <Image src={SvgImages.deleteIcon} alt="Delete Icon" />
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                className="table mb-0"
                id="dtHorizontalExample"
                cellSpacing="0"
                width="100%"
              >
                <thead>
                  <tr className="table_heading">
                    <th scope="col" style={{ width: "5%" }}>
                      <label className="d-flex align-items-center justify-content-center">
                        <input
                          className="cursor-pointer"
                          type="checkbox"
                          style={{ height: "16px", aspectRatio: 1 }}
                          checked={
                            data?.length > 0 &&
                            data?.findIndex((item) => !item.isChecked) == -1
                          }
                          onChange={(value) => {
                            var updatedData = data;
                            updatedData.map((element) => {
                              element.isChecked = value.target.checked;
                            });
                            setData([...updatedData]);
                          }}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </th>
                    <th scope="col" style={{ width: "10%" }}>
                      Sr No.
                    </th>

                    <th scope="col" style={{ width: "30%" }}>
                      Mock Test Name
                    </th>
                    <th scope="col" style={{ width: "15%" }}>
                      {" "}
                      Current Status
                    </th>
                    <th scope="col" style={{ width: "10%" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg_light">
                  {data?.map((item, index) => (
                    <tr key={index}>
                      <td key={item._id}>
                        <label className="d-flex align-items-center justify-content-center">
                          <input
                            className="cursor-pointer"
                            type="checkbox"
                            checked={item.isChecked || false}
                            style={{ height: "16px", aspectRatio: 1 }}
                            onChange={(value) => {
                              var updatedData = data;
                              updatedData[index].isChecked =
                                value.target.checked;
                              setData([...updatedData]);
                            }}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </td>
                      <td key={`${item._id} ${item.index}`}>
                        {limit * offset + (index + 1)}
                      </td>

                      <td key={`${item._id} ${item.mockTestName}`}>
                        {item.mockTestName}
                      </td>
                      <td key={`${item._id} ${item.is_active}`}>
                        <label
                          className="switch"
                          data-bs-target="#change_status"
                          data-bs-toggle="modal"
                        >
                          <input
                            type="checkbox"
                            checked={item.is_active}
                            onChange={() => {
                              setShowConfirmationModal(true);
                              setStatusChangeData(item);
                            }}
                          />
                          <span className="slider round"></span>
                        </label>
                      </td>
                      <td key={`${item._id} ${item._id}`}>
                        <div className="d-flex gap_8">
                          <a
                            onClick={() =>
                              navigate(RoutesPath.addMockTest, { state: item })
                            }
                            className="edit_icons cursor-pointer"
                            data-bs-target="#editclass"
                            data-bs-toggle="modal"
                          >
                            <Image
                              src={SvgImages.edit}
                              style={ImageFilters.green}
                              className="add_icons"
                              alt="Edit Icon"
                            />
                          </a>
                          <a
                            className="delete_icons cursor-pointer"
                            onClick={() => {
                              setDeleteId(item._id);
                              setIsMultipleDelete(false);
                              setShowDeleteModal(true);
                            }}
                          >
                            <Image
                              src={SvgImages.deleteIcon}
                              style={ImageFilters.red}
                              data-bs-target="#delete-modal"
                              data-bs-toggle="modal"
                              alt="Delete Icon"
                            />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {generatePaginationFooter(
                availableDataCount,
                limit,
                offset,
                setOffset
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Subject Modal */}
      <FormModal
        title={"Add MOCK TEST"}
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        submitClickAction={handleSubmitAdd(addSubjectApiTask)}
        children={
          <form onSubmit={handleSubmitAdd(addSubjectApiTask)}>
            {/* Custom DropDown for Class Selection */}
            <CustomDropDown
              labelTitle="Class"
              placeholder="Select Class"
              name="class"
              id="class"
              setValue={setAddValue}
              showError={errorsAdd?.class}
              errorMessage={errorsAdd?.class?.message}
              register={registerAdd}
              additionalClasses="profile_edit"
              showMandatory={true}
              options={classes.map((e) => {
                return { value: e._id, label: e.class_name };
              })}
            />

            {/* Custom Text Field for Subject input */}
            <CustomTextField
              labelTitle="Subject"
              placeholder="Enter subject"
              name="subject"
              id="subject"
              showError={errorsAdd?.subject}
              errorMessage={errorsAdd?.subject?.message}
              register={registerAdd}
              additionalClasses="profile_edit"
              showMandatory={true}
            />
          </form>
        }
      />

      {/* Edit Subject Modal */}
      <FormModal
        title={"Edit MOCK TEST"}
        showModal={showEditModal}
        submitButtonText="Update"
        submitButtonIcon={SvgImages.tick_mark}
        setShowModal={setShowEditModal}
        submitClickAction={handleSubmitEdit(editSubjectApiTask)}
        children={
          <form onSubmit={handleSubmitEdit(editSubjectApiTask)}>
            {/* Custom DropDown for Class Selection */}
            <CustomDropDown
              labelTitle="Class"
              placeholder="Select Class"
              name="class"
              id="class"
              showError={errorsEdit?.class}
              errorMessage={errorsEdit?.class?.message}
              setValue={setEditValue}
              register={registerEdit}
              additionalClasses="profile_edit"
              inputType={InputType.text}
              showMandatory={true}
              options={classes.map((e) => {
                return { value: e._id, label: e.class_name };
              })}
              defaultOption={() => {
                setEditValue("class", editData.class_id, {
                  shouldValidate: true,
                });
                return { value: editData.class_id, label: editData.class_name };
              }}
            />

            {/* Custom Text Field for Subject Input */}
            <CustomTextField
              labelTitle="Subject"
              placeholder="Enter subject"
              name="subject"
              id="subject"
              showError={errorsEdit?.subject}
              errorMessage={errorsEdit?.subject?.message}
              register={registerEdit}
              additionalClasses="profile_edit"
              showMandatory={true}
            />
          </form>
        }
      />

      {/* Delete Subject Modal */}
      <ConfirmationModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        text={
          isMultipleDelete
            ? "Are you sure want to delete selected MOCK TEST?"
            : "Are you sure want to delete this MOCK TEST?"
        }
        icon={SvgImages.deleteIcon} // Specify the path to your delete icon
        rightClickAction={() => {
          isMultipleDelete
            ? deleteMultipleSubjects()
            : deleteSingleSubject(deleteId);
        }}
        theme={ConfirmationModalTheme.error}
      />

      {/* Change Subject Status Modal */}
      <ConfirmationModal
        showModal={showConfirmationModal}
        setShowModal={setShowConfirmationModal}
        text={"Are you sure want to change the status?"}
        icon={SvgImages.exclamation_mark} // Specify the path to your delete icon
        rightClickAction={() => {
          ChangeStatus(getStatusChangeData._id, !getStatusChangeData.is_active);
        }}
        theme={ConfirmationModalTheme.warning}
      />
    </div>
  );
};

export default MockTest;
