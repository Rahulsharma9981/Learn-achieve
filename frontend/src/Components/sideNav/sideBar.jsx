import React, { useEffect, useState } from "react";
import { SvgImages, PngImages } from "../../Utils/LocalImages";
import "../../assets/styles/style.css";
import { Link, useLocation } from "react-router-dom";
import Image from "../Reusable/Image";
import RoutesPath from "../../Utils/RoutesPath";

const Sidebar = () => {
  const [activeAccordion, setActiveAccordion] = useState(1);
  const [currentPath, setCurrentPath] = useState(0);

  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case RoutesPath.classMaster:
        setActiveAccordion(1);
        break;
      case RoutesPath.subjectMaster:
        setActiveAccordion(2);
        break;
      case RoutesPath.viewStudyMaterial:
      case RoutesPath.addStudyMaterial:
        setActiveAccordion(3);
        break;
      case RoutesPath.viewQuestionBank:
      case RoutesPath.addQuestionBank:
      case RoutesPath.bulkUploadQuestions:
        setActiveAccordion(4);
        break;
      case RoutesPath.blogcategory:
      case RoutesPath.blog:
      case RoutesPath.addBlog:
        setActiveAccordion(5);
        break;
      case RoutesPath.viewMockTest:
      case RoutesPath.addMockTest:
        setActiveAccordion(6);
        break;
      case RoutesPath.viewPackages:
      case RoutesPath.addPackages:
        setActiveAccordion(7);
        break;
      case RoutesPath.authors:
      case RoutesPath.addAuthors:
        setActiveAccordion(8);
        break;
      default:
        setActiveAccordion(0);
        break;
    }
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  return (
    <div className="sidebar d-flex flex-column">
      <div className="logo mt-3 mb-5">
        <Link to={RoutesPath.classMaster}>
          <Image
            src={PngImages.DashboardLogo}
            className="img-fluid object-fit-contain"
            alt="Logo"
            style={{ height: "60px" }}
          />
        </Link>
      </div>

      <div className="d-flex flex-column ps-4 mb-3">
        <Link to={RoutesPath.classMaster}>
          <div
            className={`d-flex py-3 ps-3 pe-2 gap_12 align-items-center accordianHeader ${
              activeAccordion == 1
                ? "accordianHeaderActive"
                : "accordianHeaderInactive"
            }`}
            onClick={() => {
              setActiveAccordion(1);
            }}
          >
            <Image src={SvgImages.menu_icon} />
            <h1 className="white fs-16 fw-500 mb-0" style={{ marginTop: 1 }}>
              Class Master
            </h1>
          </div>
        </Link>
      </div>

      <div className="d-flex flex-column ps-4 mb-3">
        <Link to={RoutesPath.subjectMaster}>
          <div
            className={`d-flex py-3 ps-3 pe-2 gap_12 align-items-center accordianHeader ${
              activeAccordion == 2
                ? "accordianHeaderActive"
                : "accordianHeaderInactive"
            }`}
            onClick={() => {
              setActiveAccordion(2);
            }}
          >
            <Image src={SvgImages.menu_icon} />
            <h1 className="white fs-16 fw-500 mb-0" style={{ marginTop: 1 }}>
              Subject Master
            </h1>
          </div>
        </Link>
      </div>

      <div className="d-flex flex-column ps-4 mb-3">
        <Link to={RoutesPath.viewStudyMaterial}>
          <div
            className={`d-flex py-3 ps-3 pe-2 gap_12 align-items-center accordianHeader ${
              activeAccordion == 3
                ? "accordianHeaderActive"
                : "accordianHeaderInactive"
            }`}
            onClick={() => {
              setActiveAccordion(3);
            }}
          >
            <Image src={SvgImages.menu_icon} />
            <h1 className="white fs-16 fw-500 mb-0" style={{ marginTop: 1 }}>
              Study Material
            </h1>
            <Image
              src={SvgImages.up_down_arrow}
              className={`${
                activeAccordion == 3 ? "accordianArrowInvert" : "accordianArrow"
              }`}
            />
          </div>
        </Link>
        <div
          className={`accordion-body p-0 ms-4 ${
            activeAccordion == 3 ? "accordiaBodyActive" : "accordiaBodyInactive"
          }`}
        >
          <div className="selectSection select_option">
            <Link to={RoutesPath.addStudyMaterial}>
              <h2
                style={{
                  color:
                    currentPath === RoutesPath.addStudyMaterial
                      ? "#F6821F"
                      : "#a8a8a8",
                }}
              >
                Add
              </h2>
            </Link>

            <Link to={RoutesPath.viewStudyMaterial}>
              <h2
                style={{
                  color:
                    currentPath === RoutesPath.viewStudyMaterial
                      ? "#F6821F"
                      : "#a8a8a8",
                }}
              >
                View
              </h2>
            </Link>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column ps-4 mb-3">
        <Link to={RoutesPath.viewQuestionBank}>
          <div
            className={`d-flex py-3 ps-3 pe-2 gap_12 align-items-center accordianHeader ${
              activeAccordion == 4
                ? "accordianHeaderActive"
                : "accordianHeaderInactive"
            }`}
            onClick={() => {
              setActiveAccordion(4);
            }}
          >
            <Image src={SvgImages.menu_icon} />
            <h1 className="white fs-16 fw-500 mb-0" style={{ marginTop: 1 }}>
              Question Bank
            </h1>
            <Image
              src={SvgImages.up_down_arrow}
              className={`${
                activeAccordion == 4 ? "accordianArrowInvert" : "accordianArrow"
              }`}
            />
          </div>
        </Link>
        <div
          className={`accordion-body p-0 ms-4 ${
            activeAccordion == 4 ? "accordiaBodyActive" : "accordiaBodyInactive"
          }`}
        >
          <div className="selectSection select_option">
            <Link to={RoutesPath.addQuestionBank}>
              <h2
                style={{
                  color:
                    currentPath === RoutesPath.addQuestionBank
                      ? "#F6821F"
                      : "#a8a8a8",
                }}
              >
                Add
              </h2>
            </Link>

            <Link to={RoutesPath.viewQuestionBank}>
              <h2
                style={{
                  color:
                    currentPath === RoutesPath.viewQuestionBank
                      ? "#F6821F"
                      : "#a8a8a8",
                }}
              >
                View
              </h2>
            </Link>

            <Link to={RoutesPath.bulkUploadQuestions}>
              <h2
                style={{
                  color:
                    currentPath === RoutesPath.bulkUploadQuestions
                      ? "#F6821F"
                      : "#a8a8a8",
                }}
              >
                Bulk Upload
              </h2>
            </Link>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column ps-4 mb-3">
        <Link to={RoutesPath.blogcategory}>
          <div
            className={`d-flex py-3 ps-3 pe-2 gap_12 align-items-center justify-content-between accordianHeader ${
              activeAccordion == 5
                ? "accordianHeaderActive"
                : "accordianHeaderInactive"
            }`}
            onClick={() => {
              setActiveAccordion(5);
            }}
          >
            <div className="d-flex ">
              <Image src={SvgImages.menu_icon} />
              <h1
                className="white  mx-2 fs-16 fw-500 mb-0"
                style={{ marginTop: 1 }}
              >
                Blog
              </h1>
            </div>
            <div>
              <Image
                src={SvgImages.up_down_arrow}
                className={`${
                  activeAccordion == 5
                    ? "accordianArrowInvert"
                    : "accordianArrow"
                }`}
              />
            </div>
          </div>
        </Link>
        <div
          className={`accordion-body p-0 ms-4 ${
            activeAccordion == 5 ? "accordiaBodyActive" : "accordiaBodyInactive"
          }`}
        >
          <div className="selectSection select_option">
            <Link to={RoutesPath.blogcategory}>
              <h2
                style={{
                  color:
                    currentPath === RoutesPath.blogcategory
                      ? "#F6821F"
                      : "#a8a8a8",
                }}
              >
                Blog Category
              </h2>
            </Link>
            <Link to={RoutesPath.addBlog}>
              <h2
                style={{
                  color:
                    currentPath === RoutesPath.addBlog ? "#F6821F" : "#a8a8a8",
                }}
              >
                Add
              </h2>
            </Link>
            <Link to={RoutesPath.blog}>
              <h2
                style={{
                  color:
                    currentPath === RoutesPath.blog ? "#F6821F" : "#a8a8a8",
                }}
              >
                View
              </h2>
            </Link>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column ps-4 mb-3">
        <Link to={RoutesPath.viewMockTest}>
          <div
            className={`d-flex py-3 ps-3 pe-2 gap_12 align-items-center accordianHeader ${
              activeAccordion == 6
                ? "accordianHeaderActive"
                : "accordianHeaderInactive"
            }`}
            onClick={() => {
              setActiveAccordion(6);
            }}
          >
            <Image src={SvgImages.menu_icon} />
            <h1 className="white fs-16 fw-500 mb-0" style={{ marginTop: 1 }}>
              Mock Test
            </h1>
            <Image
              src={SvgImages.up_down_arrow}
              className={`${
                activeAccordion == 6 ? "accordianArrowInvert" : "accordianArrow"
              }`}
            />
          </div>
        </Link>
        <div
          className={`accordion-body p-0 ms-4 ${
            activeAccordion == 6 ? "accordiaBodyActive" : "accordiaBodyInactive"
          }`}
        >
          <div className="selectSection select_option">
            <Link to={RoutesPath.addMockTest}>
              <h2
                style={{
                  color:
                    currentPath === RoutesPath.addMockTest
                      ? "#F6821F"
                      : "#a8a8a8",
                }}
              >
                Add
              </h2>
            </Link>

            <Link to={RoutesPath.viewMockTest}>
              <h2
                style={{
                  color:
                    currentPath === RoutesPath.viewMockTest
                      ? "#F6821F"
                      : "#a8a8a8",
                }}
              >
                View
              </h2>
            </Link>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column ps-4 mb-3">
        <Link to={RoutesPath.viewPackages}>
          <div
            className={`d-flex py-3 ps-3 pe-2 gap_12 align-items-center accordianHeader ${
              activeAccordion == 7
                ? "accordianHeaderActive"
                : "accordianHeaderInactive"
            }`}
            onClick={() => {
              setActiveAccordion(7);
            }}
          >
            <Image src={SvgImages.menu_icon} />
            <h1 className="white fs-16 fw-500 mb-0" style={{ marginTop: 1 }}>
              Packages
            </h1>
            <Image
              src={SvgImages.up_down_arrow}
              className={`${
                activeAccordion == 7 ? "accordianArrowInvert" : "accordianArrow"
              }`}
            />
          </div>
        </Link>
        <div
          className={`accordion-body p-0 ms-4 ${
            activeAccordion == 7 ? "accordiaBodyActive" : "accordiaBodyInactive"
          }`}
        >
          <div className="selectSection select_option">
            <Link to={RoutesPath.addPackages}>
              <h2
                style={{
                  color:
                    currentPath === RoutesPath.addPackages
                      ? "#F6821F"
                      : "#a8a8a8",
                }}
              >
                Add
              </h2>
            </Link>

            <Link to={RoutesPath.viewPackages}>
              <h2
                style={{
                  color:
                    currentPath === RoutesPath.viewPackages
                      ? "#F6821F"
                      : "#a8a8a8",
                }}
              >
                View
              </h2>
            </Link>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column ps-4 mb-3">
        <Link to={RoutesPath.authors}>
          <div
            className={`d-flex py-3 ps-3 pe-2 gap_12 align-items-center accordianHeader ${
              activeAccordion == 8
                ? "accordianHeaderActive"
                : "accordianHeaderInactive"
            }`}
            onClick={() => {
              setActiveAccordion(8);
            }}
          >
            <Image src={SvgImages.menu_icon} />
            <h1 className="white fs-16 fw-500 mb-0" style={{ marginTop: 1 }}>
              Authors
            </h1>
            <Image
              src={SvgImages.up_down_arrow}
              className={`${
                activeAccordion == 8 ? "accordianArrowInvert" : "accordianArrow"
              }`}
            />
          </div>
        </Link>
        <div
          className={`accordion-body p-0 ms-4 ${
            activeAccordion == 8 ? "accordiaBodyActive" : "accordiaBodyInactive"
          }`}
        >
          <div className="selectSection select_option">
            <Link to={RoutesPath.addAuthors}>
              <h2
                style={{
                  color:
                    currentPath === RoutesPath.addAuthors
                      ? "#F6821F"
                      : "#a8a8a8",
                }}
              >
                Add
              </h2>
            </Link>
            <Link to={RoutesPath.authors}>
              <h2
                style={{
                  color:
                    currentPath === RoutesPath.authors ? "#F6821F" : "#a8a8a8",
                }}
              >
                View
              </h2>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
