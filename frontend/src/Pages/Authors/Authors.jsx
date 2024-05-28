import React, { useEffect, useState } from "react";
import { SvgImages } from "../../Utils/LocalImages";
import { ConfirmationModalTheme, ImageFilters } from "../../Utils/Enums";
import ButtonWithIcon from "../../Components/Reusable/ButtonWithIcon";
import ConfirmationModal from "../../Components/modal/ConfirmationModal";
import FormModal from "../../Components/modal/FormModal";
import CustomTextField from "../../Components/Reusable/CustomTextField";
import Image from "../../Components/Reusable/Image";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../Utils/RoutesPath";
import { handleApiErrors, validationRegex } from "../../Utils/Utils";
import { toast } from "react-toastify";
import generatePaginationFooter from "../../Components/Reusable/CustomPagination";
import Authorservice from "../../Services/AuthorService";

const Authors = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [availableDataCount, setAvailableDataCount] = useState(0);
  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isMultipleDelete, setIsMultipleDelete] = useState(false);
  const [getStatusChangeData, setStatusChangeData] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await Authorservice.getAllAuthors(
        offset,
        limit,
        searchQuery || ""
      );
      setData(response.authorData);

      setAvailableDataCount(response.availableDataCount);
      if (offset != 0 && offset * limit > availableDataCount - 1) {
        setOffset(offset - 1);
      }
    } catch (error) {
      handleApiErrors(error);
    }
  };
  const ChangeStatus = async (id, status) => {
    try {
      await Authorservice.updateAuthorStatus(id, status);
      toast.success("Author Status Updated successfully");
      var updatedData = data;
      updatedData[
        updatedData.findIndex((item) => item.author_id === id)
      ].is_active = status;
      setEditData(updatedData);
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const deleteSingleAuther = async (id) => {
    try {
      await Authorservice.deleteAuthor([id]);
      toast.success("Auther Deleted successfully");
      setShowDeleteModal(false);
      setOffset(0);
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const deleteMultipleAuthors = async () => {
    try {
      if (data?.findIndex((item) => item.isChecked) != -1) {
        var itemsToDelete = [];
        data.map((item) => {
          if (item.isChecked) {
            itemsToDelete.push(item.author_id);
          }
        });
      }
      await Authorservice.deleteAuthor(itemsToDelete);
      toast.success("Authors Deleted successfully");
      setShowDeleteModal(false);
      setOffset(0);
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
      <div className="mb-3 d-flex justify-content-between">
        <h1 className="black fs-18 fw-600 mb-0">Authors</h1>
        <div className="d-flex">
          <h4 className="fs-12 fw-500 black mb-0 me-1">Dashboard &gt;</h4>
          <h4 className="fs-12 fw-500 primary mb-0">Authors</h4>
        </div>
      </div>
      <div className="table_container" style={{ display: "block" }}>
        <h1 className="black fs-18 fw-600 mb-0">Authors List</h1>
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
                    placeholder="Search auther name"
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
                  text={"Add Author"}
                  icon={SvgImages.plus}
                  onClick={() => {
                    navigate(RoutesPath.authors, { state: null });
                  }}
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
                      Name
                    </th>
                    <th scope="col" style={{ width: "30%" }}>
                      Current Status
                    </th>
                    <th scope="col" style={{ width: "10%" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                {console.log(data)}
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
                      <td>{item.name}</td>

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
                            onClick={() =>
                              navigate(RoutesPath.addAuthors, {
                                state: item,
                              })
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
                              setDeleteId(item.author_id);
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

      {/* Change Authors Status Modal */}
      <ConfirmationModal
        showModal={showConfirmationModal}
        setShowModal={setShowConfirmationModal}
        text={"Are you sure want to change the status?"}
        icon={SvgImages.exclamation_mark} // Specify the path to your delete icon
        rightClickAction={() => {
          ChangeStatus(
            getStatusChangeData.author_id,
            !getStatusChangeData.is_active
          );
        }}
        theme={ConfirmationModalTheme.warning}
      />

      {/* Delete Authors  Modal */}

      <ConfirmationModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        text={
          isMultipleDelete
            ? "Are you sure want to delete Authors?"
            : "Are you sure want to delete  Auther?"
        }
        icon={SvgImages.deleteIcon} // Specify the path to your delete icon
        rightClickAction={() => {
          isMultipleDelete
            ? deleteMultipleAuthors()
            : deleteSingleAuther(deleteId);
        }}
        theme={ConfirmationModalTheme.error}
      />
    </div>
  );
};

export default Authors;
