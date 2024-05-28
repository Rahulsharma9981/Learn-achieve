const BASE_URL = "http://localhost:8003/";
const ADMIN_BASE_URL = BASE_URL + "admin/";
const CLASS_BASE_URL = BASE_URL + "class/";
const SUBJECT_BASE_URL = BASE_URL + "subject/";
const STUDY_MATERIAL_BASE_URL = BASE_URL + "studyMaterial/";
const QUESTION_BANK_BASE_URL = BASE_URL + "questionBank/";
const MOCK_TEST_BASE_URL = BASE_URL + "mockTest/";
const BLOG_CATEGORY_BASE_URL = BASE_URL + "blogCategory/";
const BLOG_BASE_URL = BASE_URL + "blog/";
const AUTHOR_BASE_URL = BASE_URL + "author/";
const PACKAGE_BASE_URL = BASE_URL + "package/";

const ApiConstants = {
  BASE_URL: BASE_URL,
  // - Auth Service Endpoints
  login: ADMIN_BASE_URL + "login",
  verifyOtp: ADMIN_BASE_URL + "verify-otp",
  forgotPassword: ADMIN_BASE_URL + "forget-password",
  resetPassword: ADMIN_BASE_URL + "reset-password",
  getAdminDetails: ADMIN_BASE_URL,
  changePassword: ADMIN_BASE_URL + "change-password",
  updateProfileDetails: ADMIN_BASE_URL + "updateProfileDetails",

  // -Class Master Service Endpoints
  getAllClasses: CLASS_BASE_URL + "all",
  getAllClassesWithoutPagination: CLASS_BASE_URL + "getAllClasses",
  deleteClass: CLASS_BASE_URL + "deleteClass",
  addClass: CLASS_BASE_URL + "addclass",
  updateClass: CLASS_BASE_URL + "updateClass",
  updateClassStatus: CLASS_BASE_URL + "updateClassStatus",

  // -Subject Master Service Endpoints
  getAllSubjects: SUBJECT_BASE_URL + "all",
  getAllSubjectsWithoutPagination: SUBJECT_BASE_URL + "getAllSubjects",
  deleteSubject: SUBJECT_BASE_URL + "deleteSubject",
  addSubject: SUBJECT_BASE_URL + "addSubject",
  updateSubject: SUBJECT_BASE_URL + "updateSubject",
  updateSubjectStatus: SUBJECT_BASE_URL + "updateSubjectStatus",

  // -Study Material Service Endpoints
  getAllStudyMaterials: STUDY_MATERIAL_BASE_URL + "list-all-study-material",
  deleteStudyMaterial: STUDY_MATERIAL_BASE_URL + "delete-study-material",
  addStudyMaterial: STUDY_MATERIAL_BASE_URL + "add-study-material",
  updateStudyMaterialStatus: STUDY_MATERIAL_BASE_URL + "change-status",
  addModule: STUDY_MATERIAL_BASE_URL + "add-edit-module",
  addTopic: STUDY_MATERIAL_BASE_URL + "add-edit-topic",
  getAllModules: STUDY_MATERIAL_BASE_URL + "list-all-module",
  getAllModulesBySubject:
    STUDY_MATERIAL_BASE_URL + "list-all-module-by-subject",
  getAllTopics: STUDY_MATERIAL_BASE_URL + "list-all-topics",
  deleteModule: STUDY_MATERIAL_BASE_URL + "delete-module",
  deleteTopic: STUDY_MATERIAL_BASE_URL + "delete-topic",

  // -Question Bank Service Endpoints
  getAllQuestions: QUESTION_BANK_BASE_URL + "all-question-list",
  getAllSubQuestions: QUESTION_BANK_BASE_URL + "list-all-sub-question",
  getBulkUploadHistory: QUESTION_BANK_BASE_URL + "getBulkUploadHistory",
  deleteQuestion: QUESTION_BANK_BASE_URL + "delete-question",
  deleteSubQuestion: QUESTION_BANK_BASE_URL + "delete-sub-question",
  addQuestion: QUESTION_BANK_BASE_URL + "add-question",
  addSubQuestion: QUESTION_BANK_BASE_URL + "add-sub-question",
  updateQuestion: QUESTION_BANK_BASE_URL + "update-question",
  updateQuestionStatus: QUESTION_BANK_BASE_URL + "update-question-status",
  bulkUploadQuestions: QUESTION_BANK_BASE_URL + "bulk-upload-questions",

  // -Mock Test Service Endpoints
  getAllMockTest: MOCK_TEST_BASE_URL + "list-all-mock-test",
  getAllMockTestWithoutPagination: MOCK_TEST_BASE_URL + "get-all-mock-test",
  deleteMockTest: MOCK_TEST_BASE_URL + "delete-mock-test",
  addMockTest: MOCK_TEST_BASE_URL + "create-mock-test",
  updateMockTest: MOCK_TEST_BASE_URL + "updateSubject",
  updateMockTestStatus: MOCK_TEST_BASE_URL + "change-status",
  //Blog Category Service Endpoints

  getBlogCategory: BLOG_CATEGORY_BASE_URL + "list-all-blog-category",
  addBlogCategory: BLOG_CATEGORY_BASE_URL + "add-blog-category",
  changeStatusBlogCategory: BLOG_CATEGORY_BASE_URL + "change-status",
  deleteBlogCategory: BLOG_CATEGORY_BASE_URL + "delete-blog-category",

  //Blog Service End Poibtes

  getAllCategoryWithoutPagination:
    BLOG_CATEGORY_BASE_URL + "get-all-blog-category",
  addBlog: BLOG_BASE_URL + "add-blog",
  getAllBlog: BLOG_BASE_URL + "list-all-blog",
  changeStatusBlog: BLOG_BASE_URL + "change-status",
  deleteBlog: BLOG_BASE_URL + "delete-blog",

  //Auther Service End Poibtes

  addAuthor: AUTHOR_BASE_URL + "add-author",
  getAllAuthors: AUTHOR_BASE_URL + "list-authors",
  changeAuthorStatus: AUTHOR_BASE_URL + "change-status",
  deleteAuthor: AUTHOR_BASE_URL + "delete-author",
  getAllAuthorsWithoutPagination: AUTHOR_BASE_URL + "get-all-author",

  // packages
  listAllPackages: PACKAGE_BASE_URL + "list-all-package",
  deletePackage: PACKAGE_BASE_URL + "delete-package",
  addPackage: PACKAGE_BASE_URL + "add-package",
  updateMockTest: PACKAGE_BASE_URL + "updateSubject",
  updatePackageStatus: PACKAGE_BASE_URL + "change-status",
};

export default ApiConstants;
