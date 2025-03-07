import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import VerifyOTP from "./components/auth/OtpVer";
import Navbar from "./components/main/navebar";
import LandingPage from "./components/main/LandingPage";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otpverify" element={<VerifyOTP />} />
      </Routes>
    </Router>
  );
};

export default App;
