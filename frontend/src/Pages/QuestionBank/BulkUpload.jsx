import React, { useEffect, useState } from "react";
import generatePaginationFooter from "../../Components/Reusable/CustomPagination";
import QuestionBankService from "../../Services/QuestionBankService";
import dayjs from "dayjs";
import ApiConstants from "../../Utils/ApiConstant";
import { SvgImages } from "../../Utils/LocalImages";
import { ImageFilters } from "../../Utils/Enums";
import Image from "../../Components/Reusable/Image";
import { handleApiErrors } from "../../Utils/Utils";

const BulkUpload = () => {
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [availableDataCount, setAvailableDataCount] = useState(0);

  const fetchData = async () => {
    try {
      const response = await QuestionBankService.getBulkUploadHistory(offset, limit, "");
      setData(response.data);
      setAvailableDataCount(response.availableDataCount);

      if (offset !== 0 && (offset * limit) > (availableDataCount - 1)) {
        setOffset(offset - 1)
      }
    } catch (error) {
      handleApiErrors(error);
    }
  };

  useEffect(() => { fetchData() }, [offset]);

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
                <h1 className="black fs-18 fw-600 mb-0">Parameter - Bulk Uploads</h1>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="table mb-0" id="dtHorizontalExample" cellSpacing="0" width="100%">
                <thead>
                  <tr className="table_heading">
                    <th scope="col" style={{ width: "10%" }}>Sr No.</th>
                    <th scope="col" style={{ width: "35%" }}>File Name</th>
                    <th scope="col" style={{ width: "10%" }}>Date</th>
                    <th scope="col" style={{ width: "10%" }}>Time</th>
                    <th scope="col" style={{ width: "10%" }}>Total Count</th>
                    <th scope="col" style={{ width: "10%" }}>Success Count</th>
                    <th scope="col" style={{ width: "10%" }}>Fail Count</th>
                    <th scope="col" style={{ width: "5%" }}>Action</th>
                  </tr>
                </thead>
                <tbody className="bg_light">
                  {data?.map((item, index) => (
                    <tr key={index}>
                      <td>{(limit * (offset)) + (index + 1)}</td>
                      <td>{item.file_name}</td>
                      <td>{dayjs(item.created_date).format("DD MMM YYYY")}</td>
                      <td>{dayjs(item.created_date).format("hh:mm A")}</td>
                      <td>{item.totalCount}</td>
                      <td>{item.successCount}</td>
                      <td>{item.failedCount}</td>
                      <td>
                        <a href={ApiConstants.BASE_URL + item.logFile} className="delete_icons cursor-pointer" style={{ backgroundColor: "#14489f" }}>
                          <Image src={SvgImages.file} style={ImageFilters.white} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {generatePaginationFooter(availableDataCount, limit, offset, setOffset)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;