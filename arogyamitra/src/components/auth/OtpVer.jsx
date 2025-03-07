import { useState } from "react";
import axios from "axios";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/verify-otp",
        { otp },
        {
          withCredentials: true, // Ensures cookies are sent
        }
      );
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={handleChange}
          required
        />
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default VerifyOTP;
