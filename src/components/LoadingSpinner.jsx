import React from "react";
import logo from "../assets/Loading_Logo.gif";

function LoadingSpinner({ height }) {
  return (
    <div
      className="loading-spinner-container"
      style={{ height: height || "calc(100vh - 8rem)" }}
    >
      <div className="saw-spinner">
        <img src={logo} alt="logo" />
      </div>
    </div>
  );
}

export default LoadingSpinner;
