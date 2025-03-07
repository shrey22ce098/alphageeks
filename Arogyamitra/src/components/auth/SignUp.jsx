import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import signupToast from "./SignUpNotification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const SignUp = ({ onClose, onLoginClick }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    gender: "",
    password: "",
    confirmpassword: "",
    role: "user",
    // Adding additional fields for doctors
    specialization: "",
    licenseNumber: "",
    experience: "",
    // Adding terms acceptance checkbox
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Check if the user is a doctor to show additional fields
  const isDoctor = formData.role === "doctor";

  // Calculate password strength
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    // Length check
    if (formData.password.length >= 8) strength += 1;
    // Contains number
    if (/\d/.test(formData.password)) strength += 1;
    // Contains lowercase
    if (/[a-z]/.test(formData.password)) strength += 1;
    // Contains uppercase
    if (/[A-Z]/.test(formData.password)) strength += 1;
    // Contains special char
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;

    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Add toasts for specific field validations
    if (name === "email" && value) {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(value)) {
        signupToast.error.invalidEmail();
      }
    }

    if (name === "password" && value) {
      // Show password strength feedback
      signupToast.passwordStrength(passwordStrength);
    }

    // if (name === "confirmpassword" && value) {
    //   if (value !== for  mData.password) {
    //     signupToast.error.passwordMismatch();
    //   }
    // }

    if (name === "role" && formData.role !== value) {
      signupToast.info.roleChanged(value === "doctor" ? "Doctor" : "Patient");
      if (value === "doctor") {
        signupToast.info.additionalInfoNeeded();
      }
    }

    if (name === "acceptTerms" && !checked) {
      signupToast.warning.termsNotAccepted();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phonenumber.trim()) {
      newErrors.phonenumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phonenumber.replace(/\D/g, ""))) {
      newErrors.phonenumber = "Please enter a valid 10-digit phone number";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (passwordStrength < 3) {
      newErrors.password = "Password is too weak";
    }

    if (formData.confirmpassword !== formData.password) {
      newErrors.confirmpassword = "Passwords do not match";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }

    // Validate doctor-specific fields if the role is doctor
    if (isDoctor) {
      if (!formData.specialization) {
        newErrors.specialization = "Specialization is required";
      }
      if (!formData.licenseNumber) {
        newErrors.licenseNumber = "License number is required";
      }
      if (!formData.experience) {
        newErrors.experience = "Years of experience is required";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      // Show loading toast
      const toastId = signupToast.loading();

      try {
        // Simulate API call

        const response = await axios.post(
          "http://localhost:5000/api/signup",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("Signup successful", response.data);

        // Update loading toast to success
        signupToast.update(toastId, "success", "Account created successfully!");

        // Show additional success messages based on user role
        if (formData.role === "doctor") {
          signupToast.doctorVerification();
        } else {
          signupToast.info.emailSent(formData.email);
        }

        // Redirect to dashboard or home page
        navigate("/");
        if (typeof onClose === "function") {
          onClose();
        }
      } catch (error) {
        console.error("Signup error:", error);

        // Update loading toast to error
        signupToast.update(toastId, "error", "Signup failed");

        // Show specific error message
        signupToast.error.serverError();

        setErrors({
          general: "An error occurred during signup. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Show form validation errors
      signupToast.error.formError();
      setErrors(formErrors);
    }
  };

  useEffect(() => {
    const handleCapsLock = (e) => {
      if (e.getModifierState("CapsLock")) {
        signupToast.warning.capsLockOn();
      }
    };

    // Add event listeners for password input fields
    document.querySelectorAll('input[type="password"]').forEach((input) => {
      input.addEventListener("keydown", handleCapsLock);
    });

    return () => {
      document.querySelectorAll('input[type="password"]').forEach((input) => {
        input.removeEventListener("keydown", handleCapsLock);
      });
    };
  }, []);

  const handleLoginClick = (e) => {
    e.preventDefault();
    if (typeof onLoginClick === "function") {
      onLoginClick();
    } else {
      console.error("onLoginClick prop is not a function or not provided");
    }
  };

  // Render password strength indicator
  const renderPasswordStrength = () => {
    if (!formData.password) return null;

    const getStrengthLabel = () => {
      if (passwordStrength <= 1) return "Weak";
      if (passwordStrength <= 3) return "Medium";
      return "Strong";
    };

    const getStrengthColor = () => {
      if (passwordStrength <= 1) return "bg-red-500";
      if (passwordStrength <= 3) return "bg-yellow-500";
      return "bg-green-500";
    };

    return (
      <div className="mt-2">
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getStrengthColor()}`}
              style={{ width: `${passwordStrength * 20}%` }}
            ></div>
          </div>
          <span className="ml-2 text-xs text-gray-600">
            {getStrengthLabel()}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg mx-auto max-h-screen overflow-y-auto">
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-white p-4 text-white text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              <span className="mt-2">Join </span>
              <span className="text-3xl font-bold text-blue-700">
                Arogya<span className="text-green-500">mitra</span>
                <span className="text-green-500">.</span>
              </span>
            </h2>
            <p className="mt-2 font-bold text-gray-800 text-sm opacity-90">
              Your journey to better health starts here
            </p>
          </div>

          <div className="p-6">
            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                    errors.fullname ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.fullname && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                    errors.phonenumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phonenumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phonenumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                    errors.gender ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                          clipRule="evenodd"
                        />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                </div>
                {renderPasswordStrength()}
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Password should be at least 6 characters and include numbers,
                  uppercase, and special characters.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmpassword"
                  value={formData.confirmpassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                    errors.confirmpassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmpassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmpassword}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a:
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="patient"
                      checked={formData.role === "patient"}
                      onChange={handleChange}
                      className="h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">Patient</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="doctor"
                      checked={formData.role === "doctor"}
                      onChange={handleChange}
                      className="h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">Doctor</span>
                  </label>
                </div>
              </div>

              {/* Additional fields for doctors */}
              {isDoctor && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization
                    </label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                        errors.specialization
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Specialization</option>
                      <option value="cardiology">Cardiology</option>
                      <option value="dermatology">Dermatology</option>
                      <option value="neurology">Neurology</option>
                      <option value="orthopedics">Orthopedics</option>
                      <option value="pediatrics">Pediatrics</option>
                      <option value="psychiatry">Psychiatry</option>
                      <option value="general-medicine">General Medicine</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.specialization && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.specialization}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Number
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                        errors.licenseNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your medical license number"
                    />
                    {errors.licenseNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.licenseNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                        errors.experience ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Years of professional experience"
                    />
                    {errors.experience && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.experience}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="flex items-start mt-6">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-600 mt-1"
                />
                <label
                  htmlFor="acceptTerms"
                  className="ml-2 text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-red-500 text-xs">{errors.acceptTerms}</p>
              )}

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:bg-blue-400"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>

              <p className="text-center text-sm text-gray-600 mt-3">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Log in
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
