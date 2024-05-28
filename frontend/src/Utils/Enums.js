export const OtpVerificationType = {
  login: "login",
  forgotPassword: "forgot-password",
};

export const ImageFilters = {
  white: {
    filter:
      "brightness(0) saturate(100%) invert(97%) sepia(3%) saturate(2%) hue-rotate(214deg) brightness(117%) contrast(100%)",
  },
  green: {
    filter:
      "brightness(0) saturate(100%) invert(32%) sepia(99%) saturate(1981%) hue-rotate(129deg) brightness(100%) contrast(103%)",
  },
  blue: {
    filter:
      "brightness(0) saturate(100%) invert(21%) sepia(22%) saturate(6559%) hue-rotate(206deg) brightness(96%) contrast(94%)",
  },
  red: {
    filter:
      "brightness(0) saturate(100%) invert(33%) sepia(35%) saturate(6651%) hue-rotate(344deg) brightness(106%) contrast(104%)",
  },
  gray: {
    filter:
      "brightness(0) saturate(100%) invert(30%) sepia(0%) saturate(0%) hue-rotate(136deg) brightness(96%) contrast(83%)",
  },
  lightGrey: {
    filter:
      "brightness(0) saturate(100%) invert(70%) sepia(0%) saturate(2530%) hue-rotate(349deg) brightness(104%) contrast(98%)",
  },
  black: {
    filter:
      "brightness(0)",
  },
};

export const ConfirmationModalTheme = {
  warning: {
    primary: "#FEBE5D",
    secondary: "#FFF0D9",
    tertiary: "#FFF5E5"
  },
  error: {
    primary: "#FF3535",
    secondary: "#FFDBDB",
    tertiary: "#FFE5E5"
  }, 
  theme: {
    primary: "#14489F",
    secondary: "#C6DBFF",
    tertiary: "#DFEBFF"
  },
  success: {
    primary: "#3EC13E",
    secondary: "#DFFFDF",
    tertiary: "#E9FFE9"
  }
}
