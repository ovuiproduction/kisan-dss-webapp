import React, { useState } from "react";
import { IntelPestManagementAdvisory } from "./apis_ml";
import "../css/FertilizerAdvisory.css";
import ReactMarkdown from "react-markdown";

const PestAdvisory = ({ selectedInstance, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [advisory, setAdvisory] = useState(null);
  const [error, setError] = useState(null);



  // Extract required data from selectedInstance
  const {
    cropName,
    season,
    landUsed,
    soilSnapshot,
    localitySnapshot,
  } = selectedInstance;

  const handleGenerateAdvisory = async () => {
    setLoading(true);
    setError(null);
    setAdvisory(null);

    // Build formData exactly as the backend expects
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
      const response = await IntelPestManagementAdvisory(formData);
      setAdvisory(response.pestManagementAdvisory);
    } catch (err) {
      console.error("Pest advisory error:", err);
      setError(err.message || "Failed to generate advisory. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fertilizer-advisory-overlay" onClick={onClose}>
      <div className="fertilizer-advisory-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fertilizer-advisory-header">
          <h2>🐛 Pest Advisory</h2>
          <button className="fertilizer-advisory-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="fertilizer-advisory-content">
          {/* Instance details summary */}
          <div className="fertilizer-advisory-details">
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
          <div className="fertilizer-advisory-action">
            <button
              className="fertilizer-advisory-generate-btn"
              onClick={handleGenerateAdvisory}
              disabled={loading}
            >
              {loading ? "Generating..." : "🌱 Generate Advisory"}
            </button>
          </div>

          {/* Error message */}
          {error && <div className="fertilizer-advisory-error">{error}</div>}

          {/* Advisory result */}
          {advisory && (
            <div className="fertilizer-advisory-result">
              <h3>Pest Advisory</h3>
              <div className="advisory-content">
                 <ReactMarkdown>
                  {advisory}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PestAdvisory;