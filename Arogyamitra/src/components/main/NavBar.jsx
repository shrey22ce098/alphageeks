import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignUp from "../auth/SignUp";
import Login from "../auth/Login";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NavBar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Check if user is logged in on component mount and on any changes to localStorage
  useEffect(() => {
    const checkLoginStatus = () => {
      const userData = localStorage.getItem("arogyamitra_user");
      if (userData) {
        try {
          setUser(JSON.parse(userData));
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("arogyamitra_user");
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    // Check initially
    checkLoginStatus();

    // Set up storage event listener to detect changes from other tabs/windows
    window.addEventListener("storage", checkLoginStatus);

    // Clean up
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogin = () => {
    setShowLoginModal(true);
    setMobileMenuOpen(false);
  };

  const handleSignUp = () => {
    setShowSignUpModal(true);
    setMobileMenuOpen(false);
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowSignUpModal(false);
  };

  const handleLoginSuccess = (userData) => {
    // Make sure we have the required data
    if (!userData || !userData.fullName) {
      console.error("Invalid user data received:", userData);
      toast.error("Login failed: Invalid user data");
      return;
    }

    // Save user data to localStorage
    localStorage.setItem("arogyamitra_user", JSON.stringify(userData));

    // Update state
    setUser(userData);
    setIsLoggedIn(true);
    closeModals();

    // Show success message - force it to appear with a small delay
    setTimeout(() => {
      toast.success("You are logged in successfully", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }, 100);

    console.log("User logged in:", userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("arogyamitra_user");
    setUser(null);
    setIsLoggedIn(false);
    setShowProfileDropdown(false);

    // Show logout message
    toast.info("You have been logged out", {
      position: "bottom-left",
      autoClose: 3000,
    });
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  // Debug output
  console.log("Current user state:", { isLoggedIn, user });

  return (
    <>
      <ToastContainer />

      <nav className="sticky top-0 z-40 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer">
              <Link to="/">
                <span className="text-2xl font-bold text-blue-700">
                  Arogya<span className="text-green-500">mitra</span>
                  <span className="text-green-500">.</span>
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => scrollToSection("services")}
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("find-doctors")}
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                Find Doctors
              </button>
              <button
                onClick={() => scrollToSection("health-bot")}
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                AI Assistant
              </button>
              <button
                onClick={() => scrollToSection("tips")}
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                Health Tips
              </button>

              {isLoggedIn && user ? (
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt="Profile"
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <span className="text-blue-700 font-bold">
                          {user.fullName?.charAt(0).toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                    <span>{user.fullName || "User"}</span>
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                      <Link
                        to="/userprofile"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/appointments"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        My Appointments
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="bg-white border border-blue-700 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            <button
              className="md:hidden text-gray-600 focus:outline-none"
              onClick={toggleMobileMenu}
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 p-4">
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => scrollToSection("services")}
                className="text-gray-600 hover:text-blue-700 py-2 transition-colors text-left"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("find-doctors")}
                className="text-gray-600 hover:text-blue-700 py-2 transition-colors text-left"
              >
                Find Doctors
              </button>
              <button
                onClick={() => scrollToSection("health-bot")}
                className="text-gray-600 hover:text-blue-700 py-2 transition-colors text-left"
              >
                AI Assistant
              </button>
              <button
                onClick={() => scrollToSection("tips")}
                className="text-gray-600 hover:text-blue-700 py-2 transition-colors text-left"
              >
                Health Tips
              </button>

              {isLoggedIn && user ? (
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt="Profile"
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <span className="text-blue-700 font-bold">
                          {user.fullName?.charAt(0).toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                    <span className="font-medium">
                      {user.fullName || "User"}
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    className="block py-2 text-gray-700 hover:text-blue-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/appointments"
                    className="block py-2 text-gray-700 hover:text-blue-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Appointments
                  </Link>
                  <Link
                    to="/settings"
                    className="block py-2 text-gray-700 hover:text-blue-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={handleLogin}
                    className="flex-1 bg-white border border-blue-700 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="flex-1 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <Login onClose={closeModals} onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <SignUp onClose={closeModals} />
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
