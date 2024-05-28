import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "../../Components/sideNav/sideBar";
import Navbar from "../../Components/navbar/navbar";
import RoutesPath from "../../Utils/RoutesPath";

// Lazy load components
const ClassMaster = lazy(() => import("../ClassMaster/classMaster"));
const SubjectMaster = lazy(() => import("../SubjectMaster/subjectMaster"));
const StudyMaterial = lazy(() => import("../StudyMaterial/StudyMaterial"));
const ProfilePage = lazy(() => import("../Profile/ProfilePage"));
const QuestionBank = lazy(() => import("../QuestionBank/QuestionBank"));
const AddStudyMaterial = lazy(() =>
  import("../StudyMaterial/AddStudyMaterial")
);
const AddQuestionBank = lazy(() => import("../QuestionBank/AddQuestionBank"));
const BulkUpload = lazy(() => import("../QuestionBank/BulkUpload"));
const MockTest = lazy(() => import("../MockTest/MockTest"));
const AddMockTest = lazy(() => import("../MockTest/AddMockTest"));
const AddPackages = lazy(() => import("../Packages/AddPackages"));
const Packages = lazy(() => import("../Packages/Packages"));
const Blogcategory = lazy(() => import("../Blog/Blogcategory"));
const Blog = lazy(() => import("../Blog/Blog"));
const AddBlog = lazy(() => import("../Blog/AddBlog"));
const Authors = lazy(() => import("../Authors/Authors"));
const AddAuthors = lazy(() => import("../Authors/AddAuthors"));

const Dashboard = () => {
  return (
    <div className="d-flex">
      <Sidebar /> {/* Include Sidebar component */}
      <div className="mainLayout-content">
        <Navbar /> {/* Include Navbar component */}
        <div className="main_content contentSection scroll_bar">
          <Suspense
            fallback={
                <div>
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <div className="fa-3x">
                    <div class="spinner-border" role="status">
                      {/* <span class="sr-only">Loading...</span> */}
                    </div>
                  </div>
                </div>
              </div>
            }
          >
            <Routes>
              <Route path={RoutesPath.classMaster} element={<ClassMaster />} />
              <Route
                path={RoutesPath.subjectMaster}
                element={<SubjectMaster />}
              />
              <Route
                path={RoutesPath.viewStudyMaterial}
                element={<StudyMaterial />}
              />
              <Route
                path={RoutesPath.addStudyMaterial}
                element={<AddStudyMaterial />}
              />
              <Route
                path={RoutesPath.viewQuestionBank}
                element={<QuestionBank />}
              />
              <Route
                path={RoutesPath.addQuestionBank}
                element={<AddQuestionBank />}
              />
              <Route path={RoutesPath.viewMockTest} element={<MockTest />} />
              <Route path={RoutesPath.addPackages} element={<AddPackages />} />
              <Route path={RoutesPath.viewPackages} element={<Packages />} />
              <Route path={RoutesPath.addMockTest} element={<AddMockTest />} />
              <Route
                path={RoutesPath.bulkUploadQuestions}
                element={<BulkUpload />}
              />
              <Route path={RoutesPath.profile} element={<ProfilePage />}>
                <Route path={RoutesPath.viewProfile} element={null} />
                <Route path={RoutesPath.changePasswordProfile} element={null} />
              </Route>
              <Route
                path={RoutesPath.blogcategory}
                element={<Blogcategory />}
              />
              <Route path={RoutesPath.blog} element={<Blog />} />
              <Route path={RoutesPath.addBlog} element={<AddBlog />} />
              <Route path={RoutesPath.authors} element={<Authors />} />
              <Route path={RoutesPath.addAuthors} element={<AddAuthors />} />
              <Route
                path="*"
                element={<Navigate to={RoutesPath.classMaster} />}
              />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
