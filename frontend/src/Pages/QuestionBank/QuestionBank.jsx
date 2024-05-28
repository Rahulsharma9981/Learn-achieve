import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SvgImages } from "../../Utils/LocalImages";
import { ConfirmationModalTheme, ImageFilters } from "../../Utils/Enums";
import { toast } from "react-toastify";
import ButtonWithIcon from "../../Components/Reusable/ButtonWithIcon";
import Image from "../../Components/Reusable/Image";
import ConfirmationModal from "../../Components/modal/ConfirmationModal";
import generatePaginationFooter from "../../Components/Reusable/CustomPagination";
import QuestionBankService from "../../Services/QuestionBankService";
import RoutesPath from "../../Utils/RoutesPath";
import { Modal, ModalBody } from "react-bootstrap";
import { FileUploader } from "react-drag-drop-files";
import ApiConstants from "../../Utils/ApiConstant";
import { handleApiErrors } from "../../Utils/Utils";

const QuestionBank = () => {
  const [data, setData] = useState([]);
  const [deleteId, setDeleteId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [isMultipleDelete, setIsMultipleDelete] = useState(false);
  const [getStatusChangeData, setStatusChangeData] = useState({});
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [availableDataCount, setAvailableDataCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await QuestionBankService.getAllQuestions(
        offset,
        limit,
        searchQuery || ""
      );
      setData(response.data);
      setAvailableDataCount(response.availableDataCount);

      if (offset !== 0 && offset * limit > availableDataCount - 1) {
        setOffset(offset - 1);
      }
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const deleteSingleQuestion = async (id) => {
    try {
      await QuestionBankService.deleteQuestion([id]);
      toast.success("Question Deleted successfully");
      setShowDeleteModal(false);

      setOffset(0);
      fetchData();
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const bulkUploadQuestions = async (file) => {
    try {
      await QuestionBankService.bulkUploadQuestions(file);
      toast.success("Questions Uploaded successfully");
      setShowBulkUploadModal(false);

      setOffset(0);
      fetchData();
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const deleteMultipleQuestions = async () => {
    try {
      if (data?.findIndex((item) => item.isChecked) !== -1) {
        var itemsToDelete = [];
        data.map((item) => {
          if (item.isChecked) {
            return itemsToDelete.push(item.id);
          }
        });
      }
      await QuestionBankService.deleteQuestion(itemsToDelete);
      toast.success("Questions Deleted successfully");
      setShowDeleteModal(false);

      setOffset(0);
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const ChangeStatus = async (id, status) => {
    try {
      const response = await QuestionBankService.updateQuestionStatus(
        id,
        status
      );
      toast.success(response.message);

      var updatedData = data;
      updatedData[updatedData?.findIndex((item) => item.id === id)].is_active =
        status;
      setData(updatedData);

      setShowConfirmationModal(false);
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
            <h1 className="black fs-18 fw-600 mb-0">QUESTION BANK</h1>
            <div className="d-flex">
              <h4 className="fs-12 fw-500 black mb-0 me-1">Dashboard &gt;</h4>
              <h4 className="fs-12 fw-500 primary mb-0">Question Bank</h4>
            </div>
          </div>

          <div className="table_container" style={{ display: "block" }}>
            <div className="table_title">
              <div className="table_headings">
                <h1 className="black fs-18 fw-600 mb-0">Question Bank List</h1>
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
                    text={"Add Question Bank"}
                    icon={SvgImages.plus}
                    onClick={() => {
                      navigate(RoutesPath.addQuestionBank);
                    }}
                  />
                  <ButtonWithIcon
                    text={"Bulk Upload"}
                    icon={SvgImages.plus}
                    onClick={() => {
                      setShowBulkUploadModal(true);
                    }}
                  />
                </div>
              </div>

              <div
                className="table_delete_icon"
                style={{
                  opacity:
                    data?.findIndex((item) => item?.isChecked) === -1 ? 0.3 : 1,
                }}
                onClick={() => {
                  if (!(data?.findIndex((item) => item?.isChecked) === -1)) {
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
                            data.findIndex((item) => !item?.isChecked) === -1
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
                    <th scope="col" style={{ width: "10%" }}>
                      Class
                    </th>
                    <th scope="col" style={{ width: "10%" }}>
                      Medium
                    </th>
                    <th scope="col" style={{ width: "10%" }}>
                      Subject
                    </th>
                    <th scope="col" style={{ width: "15%" }}>
                      Type Of Question
                    </th>
                    <th scope="col" style={{ width: "30%" }}>
                      Question
                    </th>
                    <th scope="col" style={{ width: "10%" }}>
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
                            checked={item?.isChecked || false}
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
                      <td>{item?.class_name}</td>
                      <td>{item?.medium}</td>
                      <td>{item?.subject_name}</td>
                      <td>{item?.type_of_question}</td>
                      <td>
                        <h2 className="threeLineText fs-14 fs-500 mb-0">
                          {item?.question.replace(/<[^>]+>/g, "")}
                        </h2>
                      </td>
                      <td>
                        <label
                          className="switch"
                          data-bs-target="#change_status"
                          data-bs-toggle="modal"
                        >
                          <input
                            type="checkbox"
                            checked={item?.is_active}
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
                          <button
                            onClick={() => {
                              navigate(RoutesPath?.addQuestionBank, {
                                state: item,
                              });
                            }}
                            className="edit_icons cursor-pointer"
                          >
                            <Image
                              src={SvgImages.edit}
                              style={ImageFilters.green}
                              className="add_icons"
                              alt="Edit Icon"
                            />
                          </button>
                          <button
                            className="delete_icons cursor-pointer"
                            onClick={() => {
                              setDeleteId(item?.id);
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
                          </button>
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

      {/* Delete Questions Modal */}
      <ConfirmationModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        text={
          isMultipleDelete
            ? "Are you sure want to delete selected questions?"
            : "Are you sure want to delete this question?"
        }
        icon={SvgImages.deleteIcon} // Specify the path to your delete icon
        rightClickAction={() => {
          isMultipleDelete
            ? deleteMultipleQuestions()
            : deleteSingleQuestion(deleteId);
        }}
        theme={ConfirmationModalTheme.error}
      />

      {/* Change Question Status Modal */}
      <ConfirmationModal
        showModal={showConfirmationModal}
        setShowModal={setShowConfirmationModal}
        text={"Are you sure want to change the status?"}
        icon={SvgImages.exclamation_mark} // Specify the path to your delete icon
        rightClickAction={() => {
          ChangeStatus(getStatusChangeData.id, !getStatusChangeData.is_active);
        }}
        theme={ConfirmationModalTheme.warning}
      />

      <BulkUploadModal
        showModal={showBulkUploadModal}
        setShowModal={setShowBulkUploadModal}
        onSuccess={(file) => bulkUploadQuestions(file)}
      />
    </div>
  );
};

export default QuestionBank;

const BulkUploadModal = ({ showModal, setShowModal, onSuccess }) => {
  const fileTypes = ["csv", "xlsx", "xls"];

  const handleChange = (file) => {
    onSuccess(file);
  };

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      dialogClassName="my-0"
      centered // Center the modal vertically and horizontally
      aria-labelledby="exampleModalToggleLabel2"
      contentClassName="p-0 bg-transparent border-0 shadow-none m-0"
    >
      <ModalBody className="p-0">
        <div className="w-100 d-flex flex-column">
          <div className="modal-content p-4">
            <div className="d-flex gap-3 flex-column justify-content-center align-items-center">
              <h1 className="black fs-18 fw-600 mb-0">Bulk Upload</h1>

              <div className="file_select_box2 w-100 d-flex gap-1 flex-column justify-content-center align-items-center p-4">
                <FileUploader
                  handleChange={handleChange}
                  name="file"
                  types={fileTypes}
                  onTypeError={(error) => {
                    toast.error(error);
                  }}
                  dropMessageStyle={{
                    backgroundColor: "#c2c2c2",
                    color: "transparent",
                    border: 0,
                  }}
                >
                  <div className="d-flex gap-2 flex-column justify-content-center align-items-center">
                    <div className="d-flex gap-2 flex-column justify-content-center align-items-center">
                      <Image
                        src={SvgImages.select_file}
                        style={{
                          height: 36,
                          filter: ImageFilters.lightGrey.filter,
                        }}
                      />
                      <h2 className="primary fs-14  fw-500 mb-0">
                        Drag and drop file here
                      </h2>
                    </div>

                    <h3 className="subText fs-14  fw-500 mb-0">OR</h3>

                    <ButtonWithIcon
                      text={"Browse Files"}
                      icon={SvgImages.file}
                    />

                    <h3 className="subText fs-12  fw-400 mb-0 mt-2 text-center">
                      We only support CSV and Excel format here. Here's a sample
                      of how it should look like
                    </h3>
                  </div>
                </FileUploader>
                <a
                  href={
                    ApiConstants.BASE_URL +
                    "uploads/Sample/BulkUploadQuestions.xlsx"
                  }
                  className="primary fs-14 fw-600 mb-0"
                  style={{ borderBottom: "1px solid #14489f", zIndex: 999 }}
                >
                  Click to Download Sample File
                </a>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
