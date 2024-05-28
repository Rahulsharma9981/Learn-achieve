import React, { useEffect, useState } from "react";
import { SvgImages } from "../../Utils/LocalImages";
import ButtonWithIcon from "../../Components/Reusable/ButtonWithIcon";
import Image from "../../Components/Reusable/Image";
import { ConfirmationModalTheme, ImageFilters } from "../../Utils/Enums";
import generatePaginationFooter from "../../Components/Reusable/CustomPagination";
import BlogCategoryService from "../../Services/Blogcategory";
import { handleApiErrors, validationRegex } from "../../Utils/Utils";
import ConfirmationModal from "../../Components/modal/ConfirmationModal";
import FormModal from "../../Components/modal/FormModal";
import CustomTextField from "../../Components/Reusable/CustomTextField";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
const Blogcategory = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [availableDataCount, setAvailableDataCount] = useState(0);
  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isMultipleDelete, setIsMultipleDelete] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [getStatusChangeData, setStatusChangeData] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Form validation schema using Yup
  const schema = Yup.object().shape({
    categoryName: validationRegex.required,
  });

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    formState: { errors: errorsAdd },
    reset: resetAdd,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      categoryName: "",
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
      categoryName: "",
    },
  });

  // Function to handle opening edit modal
  const handleOpenEditModal = (item) => {
    setEditValues("categoryName", item.categoryName);
    setShowEditModal(true);
  };

  // Function to handle opening add modal
  const handleOpenAddModal = () => {
    resetAdd(); // Reset form fields when opening Add modal
    setShowAddModal(true);
  };

  const fetchData = async () => {
    try {
      const response = await BlogCategoryService.getBlogCategoryService(
        offset,
        limit,
        searchQuery || ""
      );

      setData(response.blogCategory);

      setAvailableDataCount(response.availableDataCount);
      if (offset != 0 && offset * limit > availableDataCount - 1) {
        setOffset(offset - 1);
      }
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const addCategoryApiTask = async (item) => {
    try {
      await BlogCategoryService.addCategory(
        editData?.blog_category_id,
        item.categoryName
      );
      setShowEditModal(false);
      setShowAddModal(false);
      setEditData({});
      toast.success("category added successfully");
      fetchData();
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const ChangeStatus = async (id, status) => {
    try {
      await BlogCategoryService.updateBlogCategroyStatus(id, status);
      toast.success("Blogcategory Status Updated successfully");
      var updatedData = data;
      updatedData[
        updatedData.findIndex((item) => item.blog_category_id === id)
      ].is_active = status;
      setData(updatedData);
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Error deleting item:", error);
      handleApiErrors(error);
    }
  };

  const deleteSingleBlog = async (id) => {
    try {
      await BlogCategoryService.deleteBlogCategory([id]);
      toast.success("Blogcategory Deleted successfully");
      setShowDeleteModal(false);
      setOffset(0);
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
      handleApiErrors(error);
    }
  };

  const deleteMultipleBlogCategroys = async () => {
    try {
      if (data?.findIndex((item) => item.isChecked) != -1) {
        var itemsToDelete = [];
        data.map((item) => {
          if (item.isChecked) {
            itemsToDelete.push(item.blog_category_id);
          }
        });
      }
      await BlogCategoryService.deleteBlogCategory(itemsToDelete);
      toast.success("Blog Categories Deleted successfully");
      setShowDeleteModal(false);
      setOffset(0);
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
      handleApiErrors(error);
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
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [searchQuery]);

  return (
    <div>
      <div className="mb-3 d-flex justify-content-between">
        <h1 className="black fs-18 fw-600 mb-0">BLOG</h1>
        <div className="d-flex">
          <h4 className="fs-12 fw-500 black mb-0 me-1">Dashboard &gt;</h4>
          <h4 className="fs-12 fw-500 primary mb-0">Blog </h4>
        </div>
      </div>
      <div className="table_container" style={{ display: "block" }}>
        <h1 className="black fs-18 fw-600 mb-0">Blog Category </h1>
        <div className="table_container" style={{ display: "block" }}>
          <div className="table_title">
            <div className="table_headings">
              <h1 className="black fs-18 fw-600 mb-0">
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
              </h1>
              <div className="d-flex gap-4 align-items-center ">
                <div className="position-relative ">
                  <input
                    type="search"
                    className="search_box search_bar"
                    placeholder="Search category name"
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
                  text={"Add Blog"}
                  icon={SvgImages.plus}
                  onClick={handleOpenAddModal}
                />
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table
                className="table mb-0 mt-3"
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
                      Category Name
                    </th>
                    <th scope="col" style={{ width: "30%" }}>
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
                      <td>{item.categoryName}</td>

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
                            onClick={() => (
                              handleOpenEditModal(item), setEditData(item)
                            )}
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
                              setDeleteId(item.blog_category_id);
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
      {/* Change Class Status Modal */}
      <ConfirmationModal
        showModal={showConfirmationModal}
        setShowModal={setShowConfirmationModal}
        text={"Are you sure want to change the status?"}
        icon={SvgImages.exclamation_mark} // Specify the path to your delete icon
        rightClickAction={() => {
          ChangeStatus(
            getStatusChangeData.blog_category_id,
            !getStatusChangeData.is_active
          );
        }}
        theme={ConfirmationModalTheme.warning}
      />

      <FormModal
        title={"EDIT BLOG CATEGORY"}
        showModal={showEditModal}
        submitButtonText="Update"
        submitButtonIcon={SvgImages.tick_mark}
        setShowModal={setShowEditModal}
        submitClickAction={handleSubmitEdit(addCategoryApiTask)}
        children={
          <form onSubmit={handleSubmitEdit(addCategoryApiTask)}>
            {/* Custom Text Field for Class */}
            <CustomTextField
              labelTitle="Category Name"
              placeholder="Enter category name"
              name="categoryName"
              id="categoryName"
              showError={errorsEdit?.categoryName}
              errorMessage={errorsEdit?.categoryName?.message}
              register={registerEdit}
              showMandatory={true}
            />
            {/* Custom Text Field for Class End Date */}
          </form>
        }
      />
      {/* Delete blog category Modal */}

      <ConfirmationModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        text={
          isMultipleDelete
            ? "Are you sure want to delete blog category?"
            : "Are you sure want to delete blog category?"
        }
        icon={SvgImages.deleteIcon} // Specify the path to your delete icon
        rightClickAction={() => {
          isMultipleDelete
            ? deleteMultipleBlogCategroys()
            : deleteSingleBlog(deleteId);
        }}
        theme={ConfirmationModalTheme.error}
      />
      {/* Add Class Modal */}
      <FormModal
        title={"ADD BLOG CATEGORY"}
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        submitClickAction={handleSubmitAdd(addCategoryApiTask)}
        children={
          <form onSubmit={handleSubmitAdd(addCategoryApiTask)}>
            {/* Custom Text Field for Class */}
            <CustomTextField
              labelTitle="Category Name"
              placeholder="Enter category name"
              name="categoryName"
              id="categoryName"
              showError={errorsAdd?.categoryName}
              errorMessage={errorsAdd?.categoryName?.message}
              register={registerAdd}
              showMandatory={true}
            />
          </form>
        }
      />
    </div>
  );
};

export default Blogcategory;
