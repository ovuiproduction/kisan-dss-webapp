import React, { useState } from "react";
import { IntelCropPlanManager } from "./apis_ml"; // adjust import path
import "../css/CropPlanManager.css";

import {add_initial_plan_api, update_crop_name_api} from "./apis_db";

const CropPlanManager = ({ selectedInstance, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [cropNameUpdated, setCropNameUpdated] = useState("false");

  const {
    cropName,
    season,
    landUsed,
    soilSnapshot,
    localitySnapshot,
  } = selectedInstance;

   const handleSetInitialPlan = async (plan) => {
    try {
      await add_initial_plan_api(selectedInstance._id, plan);
    } catch (err) {
      console.error("Error saving initial plan:", err);
      setError(err.message || "Failed to save initial plan.");
    }
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError(null);
    setPlan(null);

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
      const response = await IntelCropPlanManager(formData);
      setPlan(response.cropPlanManager);
      handleSetInitialPlan(response.cropPlanManager);
    } catch (err) {
      console.error("Crop plan error:", err);
      setError(err.message || "Failed to generate crop plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetCrop = async () => {
    try {
      setCropNameUpdated("loading");
      await update_crop_name_api(selectedInstance._id, plan.recommended_crop);
      setCropNameUpdated("success");
    } catch (err) {
      console.error("Error setting crop:", err);
      setCropNameUpdated("error");
    }
  };

  return (
    <div className="crop-plan-overlay" onClick={onClose}>
      <div className="crop-plan-modal" onClick={(e) => e.stopPropagation()}>
        <div className="crop-plan-header">
          <h2>🌱 Smart Crop Plan</h2>
          <button className="crop-plan-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="crop-plan-content">
          {/* Instance details summary */}
          <div className="crop-plan-details">
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
          <div className="crop-plan-action">
            <button
              className="crop-plan-generate-btn"
              onClick={handleGeneratePlan}
              disabled={loading}
            >
              {loading ? "Generating Plan..." : "🌾 Generate Crop Plan"}
            </button>
          </div>

          {/* Error message */}
          {error && <div className="crop-plan-error">{error}</div>}

          {/* Plan result */}
          {plan && (
            <div className="crop-plan-result">
              {/* Recommended crop + Set Crop button */}
              <div className="crop-plan-recommendation-header">
                <h3>✅ Recommended Crop</h3>
                <div className="recommended-crop-row">
                  <span className="recommended-crop-name">
                    {plan.recommended_crop || "—"}
                  </span>
                                      <button
                      className="crop-plan-set-btn"
                      onClick={handleSetCrop}
                      disabled={cropNameUpdated === "loading"}
                    >
                      {cropNameUpdated === "loading" ? (
                        <>⏳ Setting...</>
                      ) : (
                        "Set Crop"
                      )}
                    </button>
                    
                    {/* Status indicator */}
                    {cropNameUpdated === "success" && (
                      <span className="set-crop-success">
                        ✓ Crop set!
                      </span>
                    )}
                    {cropNameUpdated === "error" && (
                      <span className="set-crop-error">
                        ✗ Failed. Try again.
                      </span>
                    )}
                </div>
                {plan.crop_recommendation_reasoning && (
                  <p className="recommendation-reason">
                    <strong>Why?</strong> {plan.crop_recommendation_reasoning}
                  </p>
                )}
              </div>

              {/* Complete Crop Plan */}
              {plan.complete_crop_plan && (
                <div className="crop-plan-sections">
                  <h4>📋 Complete Crop Plan</h4>
                  <div className="plan-grid">
                    {Object.entries(plan.complete_crop_plan).map(([key, value]) => (
                      <div key={key} className="plan-item">
                        <span className="plan-label">
                          {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}:
                        </span>
                        <span className="plan-value">{value || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropPlanManager;