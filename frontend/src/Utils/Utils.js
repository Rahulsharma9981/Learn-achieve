import * as Yup from "yup";
import SessionManager from "./Session";
import { toast } from "react-toastify";


export const InputType = {
  email: "email",
  password: "password",
  text: "text",
  number: "number",
  date: "date",
  file: "file",
};

export const handleApiErrors = (error) => {
  const statusCode = error?.response?.status;
  if (statusCode) {
    switch (statusCode) {
      case 401:
        SessionManager.shared.logout();
        break;
      case 400:
        toast.error(error?.response?.data?.error);
        break;
      default:
        break;
    }
  }
};

const generatePasswordValidation = () => {
  return Yup.string()
    .trim()
    .required("Field can't be empty!")
    .min(6, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );
};

export const getTextFromHtml = (html) => {
  return html
    .replace(/<[^>]+>/g, "") // Remove HTML tags
    .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
    .trim(); // Trim leading and trailing whitespace
};

export const validationRegex = {
  required: Yup.string().trim().required("Field can't be empty!"),
  email: Yup.string()
    .trim()
    .required("Email is required  ")
    .email("Invalid email")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
  password: generatePasswordValidation(),
  currentPassword: generatePasswordValidation(),
  newPassword: generatePasswordValidation(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
  date: (date) =>
    Yup.date()
      .trim()
      .required("Field can't be empty!")
      .min(date, "Class End Date must be in the future"),
  image: Yup.mixed()
    .required("A file is required")
    .test(
      "fileType",
      "Unsupported File Format",
      (value) =>
        value && ["image/jpeg", "image/jpg", "image/webp"].includes(value.type)
    )
    .test(
      "fileSize",
      "File Size is too large",
      (value) => value && value.size <= 1024 * 1024
    ), // Example: 1MB limit
  youtube: Yup.string()
    .trim()
    .required("YouTube URL is required")
    .matches(
      /^(?:(?:https?:)?\/\/)?(?:(?:(?:www|m(?:usic)?)\.)?youtu(?:\.be|be\.com)\/(?:shorts\/|live\/|v\/|e(?:mbed)?\/|watch(?:\/|\?(?:\S+=\S+&)*v=)|oembed\?url=https?%3A\/\/(?:www|m(?:usic)?)\.youtube\.com\/watch\?(?:\S+=\S+&)*v%3D|attribution_link\?(?:\S+=\S+&)*u=(?:\/|%2F)watch(?:\?|%3F)v(?:=|%3D))?|www\.youtube-nocookie\.com\/embed\/|www\.youtube\.com\/(?:playlists(?:\?|\/list=)|watch\?.*&list=))([\w-]{11})[\?&#]?\S*$/i,
      "Invalid YouTube URL format"
    ),
  instagram: Yup.string()
    .trim()
    .required("Instagram URL is required")
    .matches(
      /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/[a-zA-Z0-9._-]+\/?(?:\?.*)?$/i
      ,
      "Invalid Instagram URL format"
    ),
  linkedin: Yup.string()
    .trim()
    .required("LinkedIn URL is required")
    .matches(
      /^(?:(?:https?:)?\/\/)?(?:www\.)?linkedin\.com\/(?:in|profile|company|school|help)\/[a-zA-Z0-9_-]+\/?(?:\?.*)?$/i,
      "Invalid LinkedIn URL format"
    ),
  facebook: Yup.string()
    .trim()
    .required("Facebook URL is required")
    .matches(
      /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:facebook\.com|fb\.com)\/[a-zA-Z0-9._-]+\/?$/i,
      "Invalid Facebook URL format"
    ),
  twitter: Yup.string()
    .trim()
    .required("Twitter URL is required")
    .matches(
      /^(?:(?:https?:)?\/\/)?(?:www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?(?:status\/[0-9]+\/?)?(?:\?.*)?$/i,
      "Invalid Twitter URL format"
    ),
};

export class ValidationHelper {
  static isValidUrl(urlString) {
    var urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // validate protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // validate fragment locator
    return !!urlPattern.test(urlString);
  }

  static isValidYoutubeUrl(urlString) {
    var urlPattern =
      /^(?:(?:https?:)?\/\/)?(?:(?:(?:www|m(?:usic)?)\.)?youtu(?:\.be|be\.com)\/(?:shorts\/|live\/|v\/|e(?:mbed)?\/|watch(?:\/|\?(?:\S+=\S+&)*v=)|oembed\?url=https?%3A\/\/(?:www|m(?:usic)?)\.youtube\.com\/watch\?(?:\S+=\S+&)*v%3D|attribution_link\?(?:\S+=\S+&)*u=(?:\/|%2F)watch(?:\?|%3F)v(?:=|%3D))?|www\.youtube-nocookie\.com\/embed\/|www\.youtube\.com\/(?:laylists(?:\?|\/list=)|watch\?.*&list=))([\w-]{11})[\?&#]?\S*$/i;
    // validate fragment locator
    return !!urlPattern.test(urlString);
  }

  static formatBytes(bytes, decimals = 2) {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }
}

// This is used to Convert Image object to File Instance 
export const createFileFromMetadata = async (fileMetadata) => {
  const { name, size, url, type } = fileMetadata;
 

  try {
    // Fetch the file content (blob) asynchronously using URL
    const response = await fetch(url);
    const blob = await response.blob();

    // Create a File from the Blob
    const file = new File([blob], name, { type });

    // Optionally, add the URL as a property for reference
    file.url = url;

    return file;
  } catch (error) {
    console.error("Error creating file from metadata:", error);
    throw error;
  }
};
