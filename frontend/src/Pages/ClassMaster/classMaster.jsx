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
import { handleApiErrors, validationRegex } from "../../Utils/Utils";
import generatePaginationFooter from "../../Components/Reusable/CustomPagination";
import dayjs from "dayjs";
import RoutesPath from "../../Utils/RoutesPath";
import { useNavigate } from "react-router-dom";

const ClassMaster = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [deleteId, setDeleteId] = useState("");
  const [searchQuery, setSearchQuery] = useState(null);
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

  // Form validation schema using Yup
  const schema = Yup.object().shape({
    class: validationRegex.required,
    classEndDate: validationRegex.required,
  });

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    formState: { errors: errorsAdd },
    reset: resetAdd,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      class: "",
      classEndDate: "",
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
    setValue: setEditValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      class: "",
      classEndDate: "",
    },
  });

  // Function to handle opening add modal
  const handleOpenAddModal = () => {
    resetAdd(); // Reset form fields when opening Add modal
    setShowAddModal(true);
  };

  // Function to handle opening edit modal
  const handleOpenEditModal = (item) => {
    var date = new Date(item.class_end_date);
    setEditValues("class", item.class_name);
    setEditValues("classEndDate", date.toLocaleDateString("sv-SE"));
    setEditData(item);
    setShowEditModal(true);
  };

  const fetchData = async () => {
    try {
      const response = await ClassService.getAllClasses(
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

  const addClassApiTask = async (data) => {
    try {
      await ClassService.addClass({
        class_name: data.class,
        class_end_date: data.classEndDate,
      });
      setShowAddModal(false);
      toast.success("Class added successfully");
      fetchData();
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const editClassApiTask = async (params) => {
    try {
      await ClassService.editClass({
        id: editData._id,
        class_name: params.class.trim(),
        class_end_date: params.classEndDate,
      });

      setShowEditModal(false);
      toast.success("Class updated successfully");

      var updatedData = data;
      const index = updatedData.findIndex((item) => item._id === editData._id);
      updatedData[index].class_name = params.class.trim();
      updatedData[index].class_end_date = params.classEndDate;
      setData(updatedData);
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const deleteSingleClass = async (id) => {
    try {
      await ClassService.deleteClass([id]);
      toast.success("Class Deleted successfully");
      setShowDeleteModal(false);

      setOffset(0);
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const deleteMultipleClasses = async () => {
    try {
      if (data.findIndex((item) => item.isChecked) != -1) {
        var itemsToDelete = [];
        data.map((item) => {
          if (item.isChecked) {
            itemsToDelete.push(item._id);
          }
        });
      }
      await ClassService.deleteClass(itemsToDelete);
      toast.success("Classes Deleted successfully");
      setShowDeleteModal(false);

      setOffset(0);
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const ChangeStatus = async (id, status) => {
    try {
      await ClassService.updateClassStatus(id, status);
      toast.success("Class Status Updated successfully");

      var updatedData = data;
      updatedData[updatedData.findIndex((item) => item._id === id)].is_active =
        status;
      setData(updatedData);

      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setOffset(0);
      if (searchQuery != null) {
        fetchData();
      }
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, [offset]);

  return (
    <div>
      <div>
        <div className="content" data-number="1">
          <div className="mb-3 d-flex justify-content-between">
            <h1 className="black fs-18 fw-600 mb-0">CLASS MASTER</h1>
            <div className="d-flex">
              <h4 className="fs-12 fw-500 black mb-0 me-1">Dashboard &gt;</h4>
              <h4 className="fs-12 fw-500 primary mb-0">Class Master</h4>
            </div>
          </div>

          <div className="table_container" style={{ display: "block" }}>
            <div className="table_title">
              <div className="table_headings">
                <h1 className="black fs-18 fw-600 mb-0">Class List</h1>
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
                    text={"Add Class"}
                    icon={SvgImages.plus}
                    onClick={handleOpenAddModal}
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
                      Class
                    </th>
                    <th scope="col" style={{ width: "30%" }}>
                      Class End Date
                    </th>
                    <th scope="col" style={{ width: "30%" }}>
                      View
                    </th>
                    <th scope="col" style={{ width: "15%" }}>
                      Status
                    </th>
                    <th scope="col" style={{ width: "10%" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg_light">
                  {data?.map((item, index) => (
                    <tr key={index}>
                      <td>
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
                      <td>{limit * offset + (index + 1)}</td>
                      <td>{item.class_name}</td>
                      <td>
                        {dayjs(item.class_end_date).format("DD MMM YYYY")}
                      </td>
                      <td className="link">
                        <a
                          class="link-opacity-100"
                          onClick={() =>
                            navigate(RoutesPath.subjectMaster, {
                              state: item
                            })
                          }
                        >
                          {"View"}
                        </a>
                      </td>
                      <td>
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
                      <td>
                        <div className="d-flex gap_8">
                          <a
                            onClick={() => handleOpenEditModal(item)}
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

      {/* Add Class Modal */}
      <FormModal
        title={"Add Class"}
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        submitClickAction={handleSubmitAdd(addClassApiTask)}
        children={
          <form onSubmit={handleSubmitAdd(addClassApiTask)}>
            {/* Custom Text Field for Class */}
            <CustomTextField
              labelTitle="Class"
              placeholder="Enter class"
              name="class"
              id="class"
              showError={errorsAdd?.class}
              errorMessage={errorsAdd?.class?.message}
              register={registerAdd}
              additionalClasses="profile_edit"
              showMandatory={true}
            />

            {/* Custom Text Field for Class End Date */}
            <CustomTextField
              labelTitle="Class End Date"
              placeholder="Enter class end date"
              name="classEndDate"
              id="classEndDate"
              showError={errorsAdd?.classEndDate}
              errorMessage={errorsAdd?.classEndDate?.message}
              register={registerAdd}
              additionalClasses="profile_edit"
              inputType="date"
              showMandatory={true}
            />
          </form>
        }
      />

      {/* Edit Class Modal */}
      <FormModal
        title={"Edit Class"}
        showModal={showEditModal}
        submitButtonText="Update"
        submitButtonIcon={SvgImages.tick_mark}
        setShowModal={setShowEditModal}
        submitClickAction={handleSubmitEdit(editClassApiTask)}
        children={
          <form onSubmit={handleSubmitEdit(editClassApiTask)}>
            {/* Custom Text Field for Class */}
            <CustomTextField
              labelTitle="Class"
              placeholder="Enter class"
              name="class"
              id="class"
              showError={errorsEdit?.class}
              errorMessage={errorsEdit?.class?.message}
              register={registerEdit}
              additionalClasses="profile_edit"
              showMandatory={true}
            />

            {/* Custom Text Field for Class End Date */}
            <CustomTextField
              labelTitle="Class End Date"
              placeholder="Enter class end date"
              name="classEndDate"
              id="classEndDate"
              showError={errorsEdit?.classEndDate}
              errorMessage={errorsEdit?.classEndDate?.message}
              register={registerEdit}
              additionalClasses="profile_edit"
              inputType="date"
              showMandatory={true}
            />
          </form>
        }
      />

      {/* Delete Class Modal */}
      <ConfirmationModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        text={
          isMultipleDelete
            ? "Are you sure want to delete selected classes?"
            : "Are you sure want to delete this class?"
        }
        icon={SvgImages.deleteIcon} // Specify the path to your delete icon
        rightClickAction={() => {
          isMultipleDelete
            ? deleteMultipleClasses()
            : deleteSingleClass(deleteId);
        }}
        theme={ConfirmationModalTheme.error}
      />

      {/* Change Class Status Modal */}
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

export default ClassMaster;
