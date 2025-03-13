import React, { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Signup</h1>
        <p className="signup-subtitle">Create an account to start shopping</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full name *"
              required
            />
          </div>

          <div className="form-group phone-input">
            <select className="country-code">
              <option value="+91">+91</option>
            </select>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number *"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password *"
              required
            />
          </div>

          <button type="submit" className="signup-button">
            Continue
          </button>

          <div className="terms-text">
            By continuing, you agree to our{" "}
            <Link to="/terms">Terms of Service</Link> &{" "}
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </form>

        <div className="login-link">
          <div className="separator">Already have an account?</div>
          <Link to="/login" className="login-button">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
