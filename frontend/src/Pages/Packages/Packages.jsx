import React, { useEffect, useState } from "react";
import { SvgImages } from "../../Utils/LocalImages";
import { ConfirmationModalTheme, ImageFilters } from "../../Utils/Enums";
import { toast } from "react-toastify";
import ButtonWithIcon from "../../Components/Reusable/ButtonWithIcon";
import Image from "../../Components/Reusable/Image";
import ConfirmationModal from "../../Components/modal/ConfirmationModal";
import {  handleApiErrors } from "../../Utils/Utils";
import generatePaginationFooter from "../../Components/Reusable/CustomPagination";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../Utils/RoutesPath";
import PackagesService from "../../Services/PackagesServices";

const Packages = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [deleteId, setDeleteId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isMultipleDelete, setIsMultipleDelete] = useState(false);
  const [getStatusChangeData, setStatusChangeData] = useState({});
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [availableDataCount, setAvailableDataCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState(null);


  const fetchData = async () => {
    try {
      const response = await PackagesService.getAllPackages(
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

  const deleteSingleSubject = async (id) => {
    try {
      await PackagesService.deletePackage([id]);
      toast.success("Package Deleted successfully");
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
      await PackagesService.deletePackage(itemsToDelete);
      toast.success("Packages Deleted successfully");
      setShowDeleteModal(false);

      setOffset(0);
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const ChangeStatus = async (id, status) => {
    try {
      await PackagesService.updatePackageStatus(id, status);
      toast.success("Package Status Updated successfully");

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
            <h1 className="black fs-18 fw-600 mb-0">PACKAGES</h1>
            <div className="d-flex">
              <h4 className="fs-12 fw-500 black mb-0 me-1">Dashboard &gt;</h4>
              <h4 className="fs-12 fw-500 primary mb-0">PACKAGES </h4>
            </div>
          </div>

          <div className="table_container" style={{ display: "block" }}>
            <div className="table_title">
              <div className="table_headings">
                <h1 className="black fs-18 fw-600 mb-0"> PACKAGES List</h1>
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
                    text={"Add Packages"}
                    icon={SvgImages.plus}
                    onClick={() => navigate(RoutesPath.addPackages)}
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
                      Packages Name
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

                      <td key={`${item._id} ${item.packageName}`}>
                        {item.packageName}
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
                              navigate(RoutesPath.addPackages, { state: item })
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

     

      {/* Delete Package Modal */}
      <ConfirmationModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        text={
          isMultipleDelete
            ? "Are you sure want to delete selected Package ?"
            : "Are you sure want to delete this Package ?"
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

export default Packages;
