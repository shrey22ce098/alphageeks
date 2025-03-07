import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfile = () => {
  // State to store user data
  const [userData, setUserData] = useState(null);
  // State for form editing
  const [isEditing, setIsEditing] = useState(false);
  // State for managing active tab
  const [activeTab, setActiveTab] = useState("personal");
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Form data state with all fields
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergencyContact: {
      name: "",
      relation: "",
      phone: "",
    },

    // Physical Metrics
    height: "",
    weight: "",
    bmi: "",
    waistCircumference: "",

    // Vital Statistics
    bloodPressure: {
      systolic: "",
      diastolic: "",
    },
    heartRate: "",
    oxygenSaturation: "",

    // Medical History
    allergies: [],
    chronicConditions: [],
    pastSurgeries: [],
    currentMedications: [],
    familyMedicalHistory: [],

    // Lifestyle Habits
    smokingStatus: "never", // 'never', 'former', 'current'
    smokingFrequency: "",
    alcoholConsumption: "never", // 'never', 'occasional', 'moderate', 'heavy'
    alcoholFrequency: "",
    physicalActivity: {
      frequency: "", // days per week
      duration: "", // minutes per session
      activityType: [],
    },
    diet: {
      type: "", // 'vegetarian', 'vegan', 'non-vegetarian', etc.
      preferences: [],
      restrictions: [],
    },
    sleepPattern: {
      averageHours: "",
      qualityRating: "",
      sleepIssues: [],
    },
    stressLevel: "", // 'low', 'moderate', 'high'

    // Preferences
    notificationPreferences: {
      email: true,
      sms: false,
      app: true,
    },
    appointmentReminders: true,
    medicationReminders: false,
    dataSharing: false,
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user data from localStorage
        const storedUserData = localStorage.getItem("arogyamitra_user");

        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);

          // Initialize form data with existing user data
          setFormData((prevData) => ({
            ...prevData,
            fullName: parsedUserData.fullName || "",
            email: parsedUserData.email || "",
            // Add other fields if they exist in stored data
            ...(parsedUserData.phone && { phone: parsedUserData.phone }),
            ...(parsedUserData.dateOfBirth && {
              dateOfBirth: parsedUserData.dateOfBirth,
            }),
            ...(parsedUserData.gender && { gender: parsedUserData.gender }),
            // ...and so on for other fields
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested objects in the state
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle checkbox changes for arrays (allergies, conditions, etc.)
  const handleArrayItemChange = (e, field) => {
    const { value, checked } = e.target;

    if (checked) {
      setFormData((prevData) => ({
        ...prevData,
        [field]: [...prevData[field], value],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [field]: prevData[field].filter((item) => item !== value),
      }));
    }
  };

  // Handle adding new items to arrays (allergies, medications, etc.)
  const handleAddArrayItem = (field, newItem) => {
    if (newItem.trim() === "") return;

    setFormData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], newItem.trim()],
    }));
  };

  // Handle removing items from arrays
  const handleRemoveArrayItem = (field, index) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].filter((_, i) => i !== index),
    }));
  };

  // Calculate BMI when height or weight changes
  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const weightInKg = parseFloat(formData.weight);

      if (heightInMeters > 0 && weightInKg > 0) {
        const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
        setFormData((prevData) => ({ ...prevData, bmi }));
      }
    }
  }, [formData.height, formData.weight]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // In a real app, you would send the data to your API
      // For demo, we'll just update localStorage
      const updatedUserData = { ...userData, ...formData };
      localStorage.setItem("arogyamitra_user", JSON.stringify(updatedUserData));

      setUserData(updatedUserData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Add new allergy input and button
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newSurgery, setNewSurgery] = useState("");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ToastContainer />

      {/* Profile Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            My Health Profile
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your personal and medical information
          </p>
        </div>

        <button
          onClick={toggleEditMode}
          className={`mt-4 md:mt-0 px-4 py-2 rounded-lg flex items-center ${
            isEditing ? "bg-gray-200 text-gray-800" : "bg-blue-700 text-white"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isEditing
                  ? "M6 18L18 6M6 6l12 12"
                  : "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              }
            />
          </svg>
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Profile Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile Summary (not editable) */}
        {!isEditing && (
          <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-bold">
                {userData?.fullName?.charAt(0) || "U"}
              </div>
            </div>

            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-gray-800">
                {userData?.fullName || "User"}
              </h2>

              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                <div className="flex items-center text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {userData?.email || "No email provided"}
                </div>

                <div className="flex items-center text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {formData.phone || "No phone provided"}
                </div>

                <div className="flex items-center text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {formData.dateOfBirth
                    ? new Date(formData.dateOfBirth).toLocaleDateString()
                    : "No birth date provided"}
                </div>

                <div className="flex items-center text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {formData.gender || "Gender not specified"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "personal"
                  ? "border-b-2 border-blue-700 text-blue-700"
                  : "text-gray-600 hover:text-blue-700"
              }`}
              onClick={() => setActiveTab("personal")}
            >
              Personal Information
            </button>

            <button
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "physical"
                  ? "border-b-2 border-blue-700 text-blue-700"
                  : "text-gray-600 hover:text-blue-700"
              }`}
              onClick={() => setActiveTab("physical")}
            >
              Physical Metrics
            </button>

            <button
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "medical"
                  ? "border-b-2 border-blue-700 text-blue-700"
                  : "text-gray-600 hover:text-blue-700"
              }`}
              onClick={() => setActiveTab("medical")}
            >
              Medical History
            </button>

            <button
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "lifestyle"
                  ? "border-b-2 border-blue-700 text-blue-700"
                  : "text-gray-600 hover:text-blue-700"
              }`}
              onClick={() => setActiveTab("lifestyle")}
            >
              Lifestyle & Habits
            </button>

            <button
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "preferences"
                  ? "border-b-2 border-blue-700 text-blue-700"
                  : "text-gray-600 hover:text-blue-700"
              }`}
              onClick={() => setActiveTab("preferences")}
            >
              Preferences
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Personal Information */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">
                  Personal Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {formData.fullName || "-"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.email || "-"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.phone || "-"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {formData.dateOfBirth
                          ? new Date(formData.dateOfBirth).toLocaleDateString()
                          : "-"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">
                          Prefer not to say
                        </option>
                      </select>
                    ) : (
                      <p className="text-gray-800">
                        {formData.gender
                          ? formData.gender.charAt(0).toUpperCase() +
                            formData.gender.slice(1)
                          : "-"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Group
                    </label>
                    {isEditing ? (
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    ) : (
                      <p className="text-gray-800">
                        {formData.bloodGroup || "-"}
                      </p>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 pt-4 pb-2 border-b border-gray-200">
                  Address Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.address || "-"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.city || "-"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.state || "-"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.pincode || "-"}</p>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 pt-4 pb-2 border-b border-gray-200">
                  Emergency Contact
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="emergencyContact.name"
                        value={formData.emergencyContact.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {formData.emergencyContact.name || "-"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relationship
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="emergencyContact.relation"
                        value={formData.emergencyContact.relation}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {formData.emergencyContact.relation || "-"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="emergencyContact.phone"
                        value={formData.emergencyContact.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {formData.emergencyContact.phone || "-"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Physical Metrics */}
            {activeTab === "physical" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">
                  Body Measurements
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height (cm)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {formData.height ? `${formData.height} cm` : "-"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {formData.weight ? `${formData.weight} kg` : "-"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      BMI
                    </label>
                    <p className="text-gray-800">
                      {formData.bmi ? formData.bmi : "-"}
                    </p>
                    {formData.bmi && (
                      <span
                        className={`text-xs ${
                          formData.bmi < 18.5
                            ? "text-yellow-600"
                            : formData.bmi < 25
                            ? "text-green-600"
                            : formData.bmi < 30
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        (
                        {formData.bmi < 18.5
                          ? "Underweight"
                          : formData.bmi < 25
                          ? "Normal weight"
                          : formData.bmi < 30
                          ? "Overweight"
                          : "Obese"}
                        )
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Waist Circumference (cm)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="waistCircumference"
                        value={formData.waistCircumference}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {formData.waistCircumference
                          ? `${formData.waistCircumference} cm`
                          : "-"}
                      </p>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 pt-4 pb-2 border-b border-gray-200">
                  Vital Signs
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Pressure (mmHg)
                    </label>
                    {isEditing ? (
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          name="bloodPressure.systolic"
                          value={formData.bloodPressure.systolic}
                          onChange={handleInputChange}
                          placeholder="Systolic"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="flex items-center text-gray-500">
                          /
                        </span>
                        <input
                          type="number"
                          name="bloodPressure.diastolic"
                          value={formData.bloodPressure.diastolic}
                          onChange={handleInputChange}
                          placeholder="Diastolic"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-800">
                        {formData.bloodPressure.systolic &&
                        formData.bloodPressure.diastolic
                          ? `${formData.bloodPressure.systolic}/${formData.bloodPressure.diastolic}`
                          : "-"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heart Rate (bpm)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="heartRate"
                        value={formData.heartRate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {formData.heartRate ? `${formData.heartRate} bpm` : "-"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Glucose (mg/dL)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="bloodGlucose"
                        value={formData.bloodGlucose}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {formData.bloodGlucose
                          ? `${formData.bloodGlucose} mg/dL`
                          : "-"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Medical History */}
            {activeTab === "medical" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">
                  Allergies
                </h3>

                <div>
                  {isEditing ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        List your allergies
                      </label>
                      <textarea
                        name="allergies"
                        value={formData.allergies.join(", ")}
                        onChange={(e) => {
                          const allergiesArray = e.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter((item) => item !== "");
                          setFormData({
                            ...formData,
                            allergies: allergiesArray,
                          });
                        }}
                        placeholder="Separate allergies with commas (e.g., Penicillin, Peanuts, Pollen)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </div>
                  ) : (
                    <div>
                      {formData.allergies && formData.allergies.length > 0 ? (
                        <ul className="list-disc pl-5 text-gray-800">
                          {formData.allergies.map((allergy, index) => (
                            <li key={index}>{allergy}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600 italic">
                          No allergies recorded
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-800 pt-4 pb-2 border-b border-gray-200">
                  Chronic Conditions
                </h3>

                <div>
                  {isEditing ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        List your chronic conditions
                      </label>
                      <textarea
                        name="chronicConditions"
                        value={formData.chronicConditions.join(", ")}
                        onChange={(e) => {
                          const conditionsArray = e.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter((item) => item !== "");
                          setFormData({
                            ...formData,
                            chronicConditions: conditionsArray,
                          });
                        }}
                        placeholder="Separate conditions with commas (e.g., Hypertension, Diabetes, Asthma)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </div>
                  ) : (
                    <div>
                      {formData.chronicConditions &&
                      formData.chronicConditions.length > 0 ? (
                        <ul className="list-disc pl-5 text-gray-800">
                          {formData.chronicConditions.map(
                            (condition, index) => (
                              <li key={index}>{condition}</li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="text-gray-600 italic">
                          No chronic conditions recorded
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-800 pt-4 pb-2 border-b border-gray-200">
                  Past Surgeries
                </h3>

                <div>
                  {isEditing ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        List your past surgeries
                      </label>
                      <textarea
                        name="pastSurgeries"
                        value={formData.pastSurgeries.join(", ")}
                        onChange={(e) => {
                          const surgeriesArray = e.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter((item) => item !== "");
                          setFormData({
                            ...formData,
                            pastSurgeries: surgeriesArray,
                          });
                        }}
                        placeholder="Separate surgeries with commas (e.g., Appendectomy 2015, Knee replacement 2020)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </div>
                  ) : (
                    <div>
                      {formData.pastSurgeries &&
                      formData.pastSurgeries.length > 0 ? (
                        <ul className="list-disc pl-5 text-gray-800">
                          {formData.pastSurgeries.map((surgery, index) => (
                            <li key={index}>{surgery}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600 italic">
                          No past surgeries recorded
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-800 pt-4 pb-2 border-b border-gray-200">
                  Current Medications
                </h3>

                <div>
                  {isEditing ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        List your current medications
                      </label>
                      <textarea
                        name="currentMedications"
                        value={formData.currentMedications.join(", ")}
                        onChange={(e) => {
                          const medicationsArray = e.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter((item) => item !== "");
                          setFormData({
                            ...formData,
                            currentMedications: medicationsArray,
                          });
                        }}
                        placeholder="Separate medications with commas (e.g., Lisinopril 10mg daily, Metformin 500mg twice daily)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </div>
                  ) : (
                    <div>
                      {formData.currentMedications &&
                      formData.currentMedications.length > 0 ? (
                        <ul className="list-disc pl-5 text-gray-800">
                          {formData.currentMedications.map(
                            (medication, index) => (
                              <li key={index}>{medication}</li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="text-gray-600 italic">
                          No current medications recorded
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-800 pt-4 pb-2 border-b border-gray-200">
                  Family Medical History
                </h3>

                <div>
                  {isEditing ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        List any relevant family medical history
                      </label>
                      <textarea
                        name="familyMedicalHistory"
                        value={formData.familyMedicalHistory.join(", ")}
                        onChange={(e) => {
                          const historyArray = e.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter((item) => item !== "");
                          setFormData({
                            ...formData,
                            familyMedicalHistory: historyArray,
                          });
                        }}
                        placeholder="Separate conditions with commas (e.g., Father - Diabetes, Mother - Hypertension)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </div>
                  ) : (
                    <div>
                      {formData.familyMedicalHistory &&
                      formData.familyMedicalHistory.length > 0 ? (
                        <ul className="list-disc pl-5 text-gray-800">
                          {formData.familyMedicalHistory.map(
                            (history, index) => (
                              <li key={index}>{history}</li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="text-gray-600 italic">
                          No family medical history recorded
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lifestyle & Habits */}
            {activeTab === "lifestyle" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">
                  Substance Use
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Smoking Status
                    </label>
                    {isEditing ? (
                      <div className="space-y-2">
                        <select
                          name="smokingStatus"
                          value={formData.smokingStatus}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="never">Never smoked</option>
                          <option value="former">Former smoker</option>
                          <option value="current">Current smoker</option>
                        </select>

                        {formData.smokingStatus !== "never" && (
                          <input
                            type="text"
                            name="smokingFrequency"
                            value={formData.smokingFrequency}
                            onChange={handleInputChange}
                            placeholder={
                              formData.smokingStatus === "former"
                                ? "When did you quit?"
                                : "How often?"
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-800">
                        <p>
                          {formData.smokingStatus === "never"
                            ? "Never smoked"
                            : formData.smokingStatus === "former"
                            ? "Former smoker"
                            : "Current smoker"}
                        </p>
                        {formData.smokingStatus !== "never" &&
                          formData.smokingFrequency && (
                            <p className="text-sm text-gray-600 mt-1">
                              {formData.smokingStatus === "former"
                                ? `Quit: ${formData.smokingFrequency}`
                                : `Frequency: ${formData.smokingFrequency}`}
                            </p>
                          )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alcohol Consumption
                    </label>
                    {isEditing ? (
                      <div className="space-y-2">
                        <select
                          name="alcoholConsumption"
                          value={formData.alcoholConsumption}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="never">Never</option>
                          <option value="occasional">Occasional</option>
                          <option value="moderate">Moderate</option>
                          <option value="heavy">Heavy</option>
                        </select>

                        {formData.alcoholConsumption !== "never" && (
                          <input
                            type="text"
                            name="alcoholFrequency"
                            value={formData.alcoholFrequency}
                            onChange={handleInputChange}
                            placeholder="How often? (e.g., Once a week, Daily)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-800">
                        <p>
                          {formData.alcoholConsumption === "never"
                            ? "Never drinks alcohol"
                            : `${
                                formData.alcoholConsumption
                                  .charAt(0)
                                  .toUpperCase() +
                                formData.alcoholConsumption.slice(1)
                              } alcohol consumption`}
                        </p>
                        {formData.alcoholConsumption !== "never" &&
                          formData.alcoholFrequency && (
                            <p className="text-sm text-gray-600 mt-1">
                              {`Frequency: ${formData.alcoholFrequency}`}
                            </p>
                          )}
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 pt-4 pb-2 border-b border-gray-200">
                  Physical Activity
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency (days per week)
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="physicalActivity.frequency"
                        value={formData.physicalActivity.frequency}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {formData.physicalActivity.frequency || "-"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes per session)
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="physicalActivity.duration"
                        value={formData.physicalActivity.duration}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {formData.physicalActivity.duration || "-"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity Types
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="physicalActivity.activityType"
                        value={formData.physicalActivity.activityType.join(
                          ", "
                        )}
                        onChange={(e) => {
                          const activitiesArray = e.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter((item) => item !== "");
                          setFormData({
                            ...formData,
                            physicalActivity: {
                              ...formData.physicalActivity,
                              activityType: activitiesArray,
                            },
                          });
                        }}
                        placeholder="E.g., Walking, Running, Swimming"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {formData.physicalActivity.activityType.length > 0
                          ? formData.physicalActivity.activityType.join(", ")
                          : "-"}
                      </p>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 pt-4 pb-2 border-b border-gray-200">
                  Diet
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diet Type
                    </label>
                    {isEditing ? (
                      <select
                        name="diet.type"
                        value={formData.diet.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Diet Type</option>
                        <option value="non-vegetarian">Non-Vegetarian</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="pescatarian">Pescatarian</option>
                        <option value="keto">Keto</option>
                        <option value="paleo">Paleo</option>
                        <option value="mediterranean">Mediterranean</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p className="text-gray-800">
                        {formData.diet.type
                          ? formData.diet.type.charAt(0).toUpperCase() +
                            formData.diet.type.slice(1)
                          : "-"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Food Preferences
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.diet.preferences.join(", ")}
                        onChange={(e) => {
                          const preferencesArray = e.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter((item) => item !== "");
                          setFormData({
                            ...formData,
                            diet: {
                              ...formData.diet,
                              preferences: preferencesArray,
                            },
                          });
                        }}
                        placeholder="E.g., High protein, Low-carb"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {formData.diet.preferences.length > 0
                          ? formData.diet.preferences.join(", ")
                          : "-"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dietary Restrictions
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.diet.restrictions.join(", ")}
                        onChange={(e) => {
                          const restrictionsArray = e.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter((item) => item !== "");
                          setFormData({
                            ...formData,
                            diet: {
                              ...formData.diet,
                              restrictions: restrictionsArray,
                            },
                          });
                        }}
                        placeholder="E.g., Gluten-free, Dairy-free"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {formData.diet.restrictions.length > 0
                          ? formData.diet.restrictions.join(", ")
                          : "-"}
                      </p>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 pt-4 pb-2 border-b border-gray-200">
                  Sleep Pattern
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Average Hours Per Night
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="sleepPattern.averageHours"
                        value={formData.sleepPattern.averageHours}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {formData.sleepPattern.averageHours
                          ? `${formData.sleepPattern.averageHours} hours`
                          : "-"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sleep Quality Rating
                    </label>
                    {isEditing ? (
                      <select
                        name="sleepPattern.qualityRating"
                        value={formData.sleepPattern.qualityRating}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Rating</option>
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                        <option value="very poor">Very Poor</option>
                      </select>
                    ) : (
                      <p className="text-gray-800">
                        {formData.sleepPattern.qualityRating
                          ? formData.sleepPattern.qualityRating
                              .charAt(0)
                              .toUpperCase() +
                            formData.sleepPattern.qualityRating.slice(1)
                          : "-"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sleep Issues
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.sleepPattern.sleepIssues.join(", ")}
                        onChange={(e) => {
                          const issuesArray = e.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter((item) => item !== "");
                          setFormData({
                            ...formData,
                            sleepPattern: {
                              ...formData.sleepPattern,
                              sleepIssues: issuesArray,
                            },
                          });
                        }}
                        placeholder="E.g., Insomnia, Sleep apnea, Frequent waking"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {formData.sleepPattern.sleepIssues.length > 0
                          ? formData.sleepPattern.sleepIssues.join(", ")
                          : "None reported"}
                      </p>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 pt-4 pb-2 border-b border-gray-200">
                  Stress Management
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Stress Level
                  </label>
                  {isEditing ? (
                    <select
                      name="stressLevel"
                      value={formData.stressLevel}
                      onChange={handleInputChange}
                      className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Stress Level</option>
                      <option value="low">Low</option>
                      <option value="moderate">Moderate</option>
                      <option value="high">High</option>
                      <option value="very high">Very High</option>
                    </select>
                  ) : (
                    <p className="text-gray-800">
                      {formData.stressLevel
                        ? formData.stressLevel.charAt(0).toUpperCase() +
                          formData.stressLevel.slice(1)
                        : "-"}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Preferences */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">
                  Notification Settings
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Receive notifications via:
                    </label>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        {isEditing ? (
                          <input
                            type="checkbox"
                            id="email-notif"
                            name="notificationPreferences.email"
                            checked={formData.notificationPreferences.email}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                notificationPreferences: {
                                  ...formData.notificationPreferences,
                                  email: e.target.checked,
                                },
                              });
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        ) : (
                          <div
                            className={`h-4 w-4 rounded border ${
                              formData.notificationPreferences.email
                                ? "bg-blue-600 border-blue-600"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.notificationPreferences.email && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="white"
                                className="h-4 w-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        )}
                        <label
                          htmlFor="email-notif"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Email notifications
                        </label>
                      </div>

                      <div className="flex items-center">
                        {isEditing ? (
                          <input
                            type="checkbox"
                            id="sms-notif"
                            name="notificationPreferences.sms"
                            checked={formData.notificationPreferences.sms}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                notificationPreferences: {
                                  ...formData.notificationPreferences,
                                  sms: e.target.checked,
                                },
                              });
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        ) : (
                          <div
                            className={`h-4 w-4 rounded border ${
                              formData.notificationPreferences.sms
                                ? "bg-blue-600 border-blue-600"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.notificationPreferences.sms && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="white"
                                className="h-4 w-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        )}
                        <label
                          htmlFor="sms-notif"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          SMS notifications
                        </label>
                      </div>

                      <div className="flex items-center">
                        {isEditing ? (
                          <input
                            type="checkbox"
                            id="app-notif"
                            name="notificationPreferences.app"
                            checked={formData.notificationPreferences.app}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                notificationPreferences: {
                                  ...formData.notificationPreferences,
                                  app: e.target.checked,
                                },
                              });
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        ) : (
                          <div
                            className={`h-4 w-4 rounded border ${
                              formData.notificationPreferences.app
                                ? "bg-blue-600 border-blue-600"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.notificationPreferences.app && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="white"
                                className="h-4 w-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        )}
                        <label
                          htmlFor="app-notif"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          In-app notifications
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reminder Settings
                    </label>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        {isEditing ? (
                          <input
                            type="checkbox"
                            id="appointment-reminder"
                            name="appointmentReminders"
                            checked={formData.appointmentReminders}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                appointmentReminders: e.target.checked,
                              });
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        ) : (
                          <div
                            className={`h-4 w-4 rounded border ${
                              formData.appointmentReminders
                                ? "bg-blue-600 border-blue-600"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.appointmentReminders && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="white"
                                className="h-4 w-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        )}
                        <label
                          htmlFor="appointment-reminder"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Appointment reminders (24 hours before)
                        </label>
                      </div>

                      <div className="flex items-center">
                        {isEditing ? (
                          <input
                            type="checkbox"
                            id="task-reminder"
                            name="taskReminders"
                            checked={formData.taskReminders}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                taskReminders: e.target.checked,
                              });
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        ) : (
                          <div
                            className={`h-4 w-4 rounded border ${
                              formData.taskReminders
                                ? "bg-blue-600 border-blue-600"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.taskReminders && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="white"
                                className="h-4 w-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        )}
                        <label
                          htmlFor="task-reminder"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Task deadline reminders
                        </label>
                      </div>

                      <div className="flex items-center">
                        {isEditing ? (
                          <input
                            type="checkbox"
                            id="update-reminder"
                            name="updateReminders"
                            checked={formData.updateReminders}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                updateReminders: e.target.checked,
                              });
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        ) : (
                          <div
                            className={`h-4 w-4 rounded border ${
                              formData.updateReminders
                                ? "bg-blue-600 border-blue-600"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.updateReminders && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="white"
                                className="h-4 w-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        )}
                        <label
                          htmlFor="update-reminder"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          System update notifications
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Communication Frequency
                    </label>

                    {isEditing ? (
                      <select
                        id="comm-frequency"
                        name="communicationFrequency"
                        value={formData.communicationFrequency}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            communicationFrequency: e.target.value,
                          });
                        }}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    ) : (
                      <div className="mt-1 text-sm text-gray-900">
                        {formData.communicationFrequency
                          .charAt(0)
                          .toUpperCase() +
                          formData.communicationFrequency.slice(1)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button (Only show when editing) */}
            {isEditing && (
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
