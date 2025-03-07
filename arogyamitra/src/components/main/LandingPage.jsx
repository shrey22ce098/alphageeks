import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const containerStyle = {
    textAlign: "center",
    padding: "50px 20px",
    backgroundColor: "#f8f9fa",
  };

  const headingStyle = {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#333",
  };

  const textStyle = {
    fontSize: "18px",
    color: "#555",
    maxWidth: "600px",
    margin: "20px auto",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px",
  };

  const buttonStyle = {
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    textDecoration: "none",
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    border: "1px solid #007bff",
    color: "#007bff",
    backgroundColor: "transparent",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Welcome to Arogyamitra</h1>
      <p style={textStyle}>
        Your trusted partner in preventive healthcare. Get health reminders,
        vaccination alerts, AI-based consultations, and more.
      </p>
      <div style={buttonContainerStyle}>
        <Link to="/services" style={primaryButtonStyle}>
          Explore Services
        </Link>
        <Link to="/login" style={secondaryButtonStyle}>
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
