import React from "react";
import logoImage from "../images/loader.png";

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="loader-circle">

        <div className="spinner"></div>

        <img src={logoImage} alt="Renew Mate" className="loader-logo" />

      </div>

      <p className="loader-text">Loading Renew Mate...</p>
    </div>
  );
}