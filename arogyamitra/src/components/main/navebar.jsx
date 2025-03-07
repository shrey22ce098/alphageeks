import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navStyle = {
    backgroundColor: "#f8f9fa",
    padding: "16px 24px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#333",
    margin: "0 12px",
    fontSize: "16px",
    transition: "color 0.3s",
  };

  const buttonStyle = {
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    border: "none",
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#007bff",
    color: "white",
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    border: "1px solid #007bff",
    color: "#007bff",
    backgroundColor: "transparent",
  };

  return (
    <nav style={navStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/" style={{ fontSize: "24px", fontWeight: "bold", color: "#007bff" }}>
          Arogyamitra
        </Link>
        
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex" }}>
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/about" style={linkStyle}>About</Link>
            <Link to="/services" style={linkStyle}>Services</Link>
          </div>
          
          <div style={{ marginLeft: "20px", display: "flex", gap: "10px" }}>
            <Link to="/signup" style={primaryButtonStyle}>Sign Up</Link>
            <Link to="/login" style={secondaryButtonStyle}>Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;