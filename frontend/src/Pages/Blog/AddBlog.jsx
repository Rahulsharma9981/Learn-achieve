import React, { useEffect, useState } from "react";
import ButtonWithIcon from "../../Components/Reusable/ButtonWithIcon";
import Image from "../../Components/Reusable/Image";
import { SvgImages } from "../../Utils/LocalImages";
import { ImageFilters } from "../../Utils/Enums";
import CustomDropDown from "../../Components/Reusable/CustomDropDown";
import { InputType, createFileFromMetadata, handleApiErrors, validationRegex } from "../../Utils/Utils";
import CustomTextField from "../../Components/Reusable/CustomTextField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import BlogService from "../../Services/BlogService";
import { toast } from "react-toastify";
import RoutesPath from "../../Utils/RoutesPath";
import AuthorService from "../../Services/AuthorService";
import CustomFileInput from "../../Components/Reusable/CustomFileInput";

const AddBlog = () => {
  const location = useLocation();
  const EditBlogData = location.state || null;
  const [category, setCategory] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [blog, setBlog] = useState(EditBlogData);
  const [uploadFeatureImg, setUploadFeatureImg] = useState(Array());
  const [uploadMainImg, setUploadMainImg] = useState(Array());

  const navigate = useNavigate();

  const Validations = yup.object().shape({
    category_id: validationRegex.required,
    author_id: validationRegex.required,
    date: validationRegex.required,
    title: validationRegex.required,
    briefIntro: validationRegex.required,
    details: validationRegex.required,
    featuredImage: validationRegex.image,
    mainImage: validationRegex.image,
  });

  const {
    register: register,
    handleSubmit: handleSubmit,
    setValue: setValues,
    formState: { errors: errors },
    getValues: getValues,
    reset: reset,
  } = useForm({
    resolver: yupResolver(Validations),
    defaultValues: {
      category_id: "",
      author_id: "",
      date: "",
      title: "",
      briefIntro: "",
      details: "",
      featuredImage: "",
      mainImage: "",
    },
  });

  const onSubmit = async (blogData) => {
    try {
      // Call BlogService to add the blog
      const response = await BlogService.addBlog(
        blog?.blog_id || "",
        blogData.category_id,
        blogData.author_id,
        blogData.date,
        blogData.details,
        blogData.title,
        blogData.briefIntro,
        uploadFeatureImg,
        uploadMainImg
      );
      toast.success(response.message);
      navigate(RoutesPath.blog);
    } catch (error) {
      // Handle API errors
      handleApiErrors(error);
      toast.error("Failed to add blog. Please try again later.");
    }
  };

  const getAllcategory = async () => {
    try {
      const response = await BlogService.getAllCategoryWithoutPagination();
      setCategory(response.data);
    } catch (error) {
      handleApiErrors(error);
    }
  };

  const getAllAuthors = async () => {
    try {
      const response = await AuthorService.getAllAuthorsWithoutPagination();
      setAuthors(response.data);
    } catch (error) {
      handleApiErrors(error);
    }
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        var date = new Date(blog.date);
        if (blog) {
          setValues("category_id", blog?.category_id || "");
          setValues("author_id", blog?.author_id || "");
          setValues("date", date.toLocaleDateString("sv-SE") || "");
          setValues("title", blog?.title || "");
          setValues("briefIntro", blog?.briefIntro || "");
          setValues("details", blog?.details || "");
          setValues("featuredImage", blog?.featuredImage, {
            shouldValidate: true,
          });
          setValues("mainImage", blog?.mainImage, {
            shouldValidate: true,
          });
          const featureImage = await createFileFromMetadata(
            blog?.featuredImage
          );
          const mainImage = await createFileFromMetadata(blog?.mainImage);
          setUploadFeatureImg(featureImage);
          setUploadMainImg(mainImage);
        }
      } catch (error) {
        console.error("Error creating file from metadata:", error);
      }
    };
    fetchFiles();
  }, [blog, setValues]);

  useEffect(() => {
    getAllcategory();
    getAllAuthors();
  }, []);

  return (
    <div>
      <div className="mb-3 d-flex justify-content-between">
        <h1 className="black fs-18 fw-600 mb-0">BLOG PAGE</h1>
        <div className="d-flex">
          <h4 className="fs-12 fw-500 black mb-0 me-1">Dashboard &gt;</h4>
          <h4 className="fs-12 fw-500 primary mb-0">Blog Page</h4>
        </div>
      </div>
      <div className="table_container" style={{ display: "block" }}>
        <div className="table_title">
          <div className="table_headings">
            <h1 className="black fs-18 fw-600 mb-0">Blog</h1>
            <div className="d-flex gap-4 align-items-center">
              <div className="position-relative">
                <input
                  type="search"
                  className="search_box search_bar"
                  placeholder="Search"
                />
                <Image
                  src={SvgImages.search}
                  style={ImageFilters.gray}
                  className="search_icon"
                  alt="Search Icon"
                  height="20px"
                />
              </div>
              {!blog?.blog_id ? (
                <ButtonWithIcon text={"Add Blog"} icon={SvgImages.plus} />
              ) : (
                ""
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row profile_inputs w-100 mt-5">
              <div className="col-md-6">
                {category.length != 0 && (
                  <CustomDropDown
                    labelTitle="Select Category"
                    placeholder="Select"
                    name="category_id"
                    id="category_id"
                    additionalClasses="profile_edit"
                    inputType={InputType.text}
                    showMandatory={true}
                    setValue={setValues}
                    showError={errors?.category_id}
                    errorMessage={errors?.category_id?.message}
                    options={category?.map((e) => {
                      return { value: e._id, label: e.categoryName };
                    })}
                    defaultOption={() => {
                      let data = category?.find(
                        (e) => e._id == blog?.category_id
                      );

                      if (data) {
                        return { value: data._id, label: data.categoryName };
                      }
                    }}
                  />
                )}
              </div>
              <div className="col-md-6">
                {authors.length != 0 && (
                  <CustomDropDown
                    labelTitle="Author Name"
                    placeholder="Select"
                    name="author_id"
                    id="author_id"
                    inputType={InputType.text}
                    showMandatory={true}
                    setValue={setValues}
                    showError={errors?.author_id}
                    errorMessage={errors?.author_id?.message}
                    options={authors?.map((e) => {
                      return { value: e._id, label: e.name };
                    })}
                    defaultOption={() => {
                      const data = authors?.find(
                        (e) => e._id == blog?.author_id
                      );
                      if (data) {
                        return { value: data._id, label: data.name };
                      }
                    }}
                  />
                )}
              </div>
              <div className="col-md-6">
                <CustomTextField
                  labelTitle="Class End Date"
                  placeholder="Enter class end date"
                  name="date"
                  id="date"
                  showError={errors?.date}
                  errorMessage={errors?.date?.message}
                  register={register}
                  additionalClasses="profile_edit"
                  inputType="date"
                  showMandatory={true}
                />
              </div>

              <div className="col-md-6">
                <CustomTextField
                  labelTitle="Blog Title"
                  placeholder="Blog Title"
                  name="title"
                  id="title"
                  additionalClasses="profile_edit"
                  setValue={setValues}
                  inputType={InputType.text}
                  showMandatory={true}
                  register={register}
                  showError={errors?.title}
                  errorMessage={errors?.title?.message}
                />
              </div>
              <div className="col-md-6">
                <CustomFileInput
                  name="featuredImage"
                  labelTitle="Feature Image"
                  labelTitleText="(Extension: jpg. jpeg. webp) Note: Dimension Size 1000x600 px"
                  showMandatory={true}
                  showError={!!errors.featuredImage}
                  errorMessage={errors.featuredImage?.message}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setUploadFeatureImg(file);
                    setValues("featuredImage", file, {
                      shouldValidate: true,
                    });
                  }}
                  defaultValue={blog?.featuredImage?.name || ""}
                />
              </div>
              <div className="col-md-6">
                <CustomFileInput
                  name="mainImage"
                  labelTitle="Main Image"
                  labelTitleText="(Extension: jpg. jpeg. webp) Note: Dimension Size 1000x600 px"
                  showMandatory={true}
                  showError={!!errors.mainImage}
                  errorMessage={errors.mainImage?.message}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setUploadMainImg(file);
                    setValues("mainImage", file, {
                      shouldValidate: true,
                    });
                  }}
                  defaultValue={blog?.mainImage?.name || ""}
                />
              </div>
              <div className="col-md-6 mt-3">
                <CustomTextField
                  labelTitle="Brief Intro"
                  placeholder="File Name"
                  name="briefIntro"
                  id="briefIntro"
                  inputType={InputType.text}
                  showMandatory={true}
                  setValue={setValues}
                  register={register}
                  additionalClasses="brief_input"
                  showError={errors?.briefIntro}
                  errorMessage={errors?.briefIntro?.message}
                />
              </div>
              <div className="col-md-6 mt-3">
                <CustomTextField
                  labelTitle="Details"
                  placeholder="File Name"
                  name="details"
                  id="details"
                  inputType={InputType.text}
                  showMandatory={true}
                  setValue={setValues}
                  register={register}
                  additionalClasses="brief_input"
                  showError={errors?.details}
                  errorMessage={errors?.details?.message}
                />
              </div>
              <div className="d-flex justify-content-end">
                <ButtonWithIcon
                  text={blog?.blog_id ? "Update" : "Submit"}
                  icon={SvgImages.tick_mark}
                  onClick={handleSubmit(onSubmit)}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;
