import React from "react";
import logoImage from "../images/loader.png";

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="loader-circle">
        {/* Outer orbital rings */}
        <div className="spinner-outer"></div>
        <div className="spinner-inner"></div>
        
        {/* The Logo */}
        <div className="logo-wrapper">
          <img src={logoImage} alt="Renew Mate" className="loader-logo" />
        </div>
      </div>

      <p className="loader-text">Loading Renew Mate...</p>
    </div>
  );
}