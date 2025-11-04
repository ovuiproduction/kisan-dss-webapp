import React, { useState } from "react";
import axios from "axios";
import "../static/css/intel-gov-scheme.css";

import { IntelGovScheme_api } from "./apis_ml";

export default function IntelGovScheme() {
  const [commodity, setCommodity] = useState("");
  const [loading, setLoading] = useState(false);

  const [governmentData, setGovernmentData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const formData = {
      commodity,
    };

    try {
      // Send the data to the server
      const data = await IntelGovScheme_api(formData);
      setGovernmentData(data.govSchemeData);
      console.log(data.govSchemeData);
      setLoading(false);
      // Handle the response from the server if necessary
    } catch (error) {
      console.error("Error sending data to the server:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      <div className="govscheme_intel-crop-rec-root">
        <nav className="govscheme_intel-price-nav">
          <div className="govscheme_intel-header-logotext">
            Intel Government Schemes
          </div>
          <div className="govscheme_intel-header-content">
            <a href="/farmer-dashboard">Home</a>
            <a href="#">Help</a>
            <a href="">Contact</a>
          </div>
        </nav>
        <div className="govscheme_input-crop-list-block">
          <div className="govscheme_crop-tags">
            {commodity && <div className="govscheme_crop-tag">{commodity}</div>}
          </div>

          <input
            type="text"
            className="govscheme_input-crop-list"
            value={commodity}
            list="crop_list"
            onChange={(e) => setCommodity(e.target.value)}
            placeholder="Enter crop name"
          />
          <datalist id="crop_list">
            <option value="Jowar">Jowar</option>
            <option value="Bajra">Bajra</option>
            <option value="Sugarcane">Sugarcane</option>
            <option value="Maize">Maize</option>
            <option value="Cotton">Cotton</option>
          </datalist>

          <form className="govscheme_form-handle-btn" onSubmit={handleSubmit}>
            {loading && (
              <div className="govscheme_loader-container">
                <div className="govscheme_spinner"></div>
                <p>Processing...</p>
              </div>
            )}

            {/* Submit Button (Only Show When Not Loading) */}
            {!loading && (
              <div className="govscheme_btn-block">
                <button id="predict_btn" className="govscheme_submitbtn" type="submit">
                  Submit
                </button>
              </div>
            )}
          </form>
        </div>

        {governmentData.length > 0 && (
          <>
            <div className="govscheme_gov-scheme-section-header">
              <h2>Government Schemes</h2>
            </div>
            <div className="govscheme_gov-scheme-guide-container">
              <ul className="govscheme_gov-scheme-list">
                {governmentData.map((scheme, index) => (
                  <SchemeBlock key={index} scheme={scheme} />
                ))}
              </ul>
            </div>
          </>
        )}
        <footer className="govscheme_footer-gov-scheme">
          <p>| © 2026 Kisan DSS. All rights reserved | </p>
        </footer>
      </div>
    </>
  );
}

// Reusable Scheme Block
const SchemeBlock = ({ scheme }) => (
  <li className="govscheme_gov-scheme-block">
    <article>
      <h3>{scheme.scheme_name}</h3>
      <ul>
        {scheme.benefits.map((benefit, index) => (
          <li key={index}>{benefit}</li>
        ))}
      </ul>
      <p>{scheme.purpose}</p>
    </article>
  </li>
);


