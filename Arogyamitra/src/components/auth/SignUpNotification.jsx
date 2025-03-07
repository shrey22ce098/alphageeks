import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Configuration for consistent toast styling
const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

// Toast notification functions for the sign-up process
const signupToast = {
  // Success notifications
  success: {
    accountCreated: (role) =>
      toast.success(
        `Your ${role} account has been created successfully! Please check your email for verification.`,
        toastConfig
      ),
    emailVerified: () =>
      toast.success(
        "Email verified successfully! You can now log in.",
        toastConfig
      ),
    passwordValid: () =>
      toast.success("Password meets all requirements.", {
        ...toastConfig,
        autoClose: 2000,
      }),
    validField: (field) =>
      toast.success(`${field} is valid.`, { ...toastConfig, autoClose: 1500 }),
  },

  // Error notifications
  error: {
    emailExists: () =>
      toast.error(
        "Email already exists. Please try a different email address.",
        toastConfig
      ),
    passwordWeak: (message) =>
      toast.error(`Password too weak: ${message}`, toastConfig),
    passwordMismatch: () => toast.error("Passwords do not match.", toastConfig),
    invalidField: (field, message) =>
      toast.error(`${field}: ${message}`, toastConfig),
    networkError: () =>
      toast.error(
        "Network error. Please check your connection and try again.",
        toastConfig
      ),
    serverError: () =>
      toast.error("Server error. Please try again later.", toastConfig),
    invalidEmail: () =>
      toast.error("Please enter a valid email address.", toastConfig),
    formError: (message) =>
      toast.error(
        message || "Please correct all errors before submitting.",
        toastConfig
      ),
    requiredFields: () =>
      toast.error("Please fill in all required fields.", toastConfig),
  },

  // Info notifications
  info: {
    processingRequest: () =>
      toast.info("Processing your request...", {
        ...toastConfig,
        autoClose: false,
      }),
    emailSent: (email) =>
      toast.info(
        `Verification email sent to ${email}. Please check your inbox.`,
        toastConfig
      ),
    roleChanged: (role) =>
      toast.info(`You are now registering as a ${role}.`, {
        ...toastConfig,
        autoClose: 2000,
      }),
    additionalInfoNeeded: () =>
      toast.info(
        "Please provide additional information for doctor registration.",
        toastConfig
      ),
  },

  // Warning notifications
  warning: {
    capsLockOn: () =>
      toast.warning("Caps Lock is ON", { ...toastConfig, autoClose: 2000 }),
    sessionExpiring: () =>
      toast.warning(
        "Your session will expire soon. Please complete registration.",
        toastConfig
      ),
    termsNotAccepted: () =>
      toast.warning(
        "You must accept the terms and conditions to continue.",
        toastConfig
      ),
  },

  // Custom toast with loading spinner
  loading: (message = "Creating your account...") => {
    return toast.loading(message, {
      ...toastConfig,
      autoClose: false,
    });
  },

  // Update an existing toast (useful for loading -> success/error transitions)
  update: (toastId, type, message) => {
    toast.update(toastId, {
      render: message,
      type: type,
      autoClose: 3000,
      isLoading: false,
    });
  },

  // Password strength feedback
  // passwordStrength: (strength) => {
  //   let message = "";
  //   let type = "info";

  //   if (strength <= 1) {
  //     message =
  //       "Password is too weak. Add uppercase letters, numbers, and special characters.";
  //     type = "error";
  //   } else if (strength <= 3) {
  //     message =
  //       "Password is moderate. Consider adding more complexity for better security.";
  //     type = "warning";
  //   } else {
  //     message = "Password is strong!";
  //     type = "success";
  //   }

  //   toast[type](message, { ...toastConfig, autoClose: 2000 });
  // },

  // Doctor verification notification
  doctorVerification: () =>
    toast.info(
      "Your doctor profile will be reviewed within 48 hours. You'll receive a confirmation email once verified.",
      {
        ...toastConfig,
        autoClose: 5000,
      }
    ),

  // Dismiss all toasts
  dismissAll: () => toast.dismiss(),
};

export default signupToast;
