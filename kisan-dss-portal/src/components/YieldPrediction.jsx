import React, { useState } from "react";
import { IntelYieldPrediction } from "./apis_ml"; // adjust import path
import "../css/YieldPrediction.css";
import ReactMarkdown from "react-markdown";

const YieldPrediction = ({ selectedInstance, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const {
    cropName,
    season,
    landUsed,
    soilSnapshot,
    localitySnapshot
  } = selectedInstance;

  const handleGeneratePrediction = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    const formData = {
      cropName,
      season,
      landUsed,
      soil: {
        soilType: soilSnapshot?.soilType || "",
        nitrogen: soilSnapshot?.nitrogen || null,
        phosphorus: soilSnapshot?.phosphorus || null,
        potassium: soilSnapshot?.potassium || null,
        ph: soilSnapshot?.ph || null,
        organicCarbon: soilSnapshot?.organicCarbon || null,
      },
      locality: {
        state: localitySnapshot?.state || "",
        district: localitySnapshot?.district || "",
        village: localitySnapshot?.village || "",
      },
    };

    try {
      const response = await IntelYieldPrediction(formData);
      setPrediction(response.yieldPrediction);
    } catch (err) {
      console.error("Yield prediction error:", err);
      setError(err.message || "Failed to generate prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="yield-prediction-overlay" onClick={onClose}>
      <div className="yield-prediction-modal" onClick={(e) => e.stopPropagation()}>
        <div className="yield-prediction-header">
          <h2>📊 Yield Prediction</h2>
          <button className="yield-prediction-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="yield-prediction-content">
          {/* Instance details summary */}
          <div className="yield-prediction-details">
            <h3>Crop Cycle Details</h3>
            <div className="details-grid">
              <div><span>Crop:</span> {cropName || "—"}</div>
              <div><span>Season:</span> {season || "—"}</div>
              <div><span>Land used:</span> {landUsed} acres</div>
              
            </div>
            <h4>Soil Parameters</h4>
            <div className="details-grid">
              <div><span>Soil type:</span> {soilSnapshot?.soilType || "—"}</div>
              <div><span>Nitrogen (N):</span> {soilSnapshot?.nitrogen ?? "—"}</div>
              <div><span>Phosphorus (P):</span> {soilSnapshot?.phosphorus ?? "—"}</div>
              <div><span>Potassium (K):</span> {soilSnapshot?.potassium ?? "—"}</div>
              <div><span>pH:</span> {soilSnapshot?.ph ?? "—"}</div>
              <div><span>Organic Carbon:</span> {soilSnapshot?.organicCarbon ?? "—"}</div>
            </div>
            <h4>Location</h4>
            <div className="details-grid">
              <div><span>State:</span> {localitySnapshot?.state || "—"}</div>
              <div><span>District:</span> {localitySnapshot?.district || "—"}</div>
              <div><span>Village:</span> {localitySnapshot?.village || "—"}</div>
            </div>
          </div>

          {/* Generate button */}
          <div className="yield-prediction-action">
            <button
              className="yield-prediction-generate-btn"
              onClick={handleGeneratePrediction}
              disabled={loading}
            >
              {loading ? "Predicting..." : "🌾 Predict Yield"}
            </button>
          </div>

          {/* Error message */}
          {error && <div className="yield-prediction-error">{error}</div>}

          {/* Prediction result */}
          {prediction && (
            <div className="yield-prediction-result">
              <h3>📋 Yield Estimate</h3>
              <div className="prediction-content">
                  <ReactMarkdown>
                  {prediction}
                  </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YieldPrediction;