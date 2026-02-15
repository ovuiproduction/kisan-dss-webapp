import React, { useState, useEffect } from "react";
import { create_instance_api, get_farmer_profile_api } from "./apis_db";
import "../css/CreateInstance.css";

const CreateInstance = ({ isOpen, onClose, onSuccess }) => {
  
  const [farmerProfile, setFarmerProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    instanceName: "",
    cropName: "",
    season: "",
    landUsed: "",
    startingStage: "Planning",
  });

  const [stageData, setStageData] = useState({});

  // 🔹 Fetch farmer profile when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadProfile = async () => {
        try {
          setFetching(true);
          const profile = await get_farmer_profile_api();
          setFarmerProfile(profile);
          setFormData((prev) => ({ ...prev, email: profile.email }));
        } catch (err) {
          console.error("Failed to load farmer profile:", err);
        } finally {
          setFetching(false);
        }
      };
      loadProfile();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStageChange = (e) => {
    const newStage = e.target.value;
    setFormData({ ...formData, startingStage: newStage });
    setStageData({});

    // Clear crop name if switching to Planning
    if (newStage === "Planning") {
      setFormData((prev) => ({ ...prev, cropName: "" }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!farmerProfile) return;

    // Validate land used
    if (parseFloat(formData.landUsed) > farmerProfile.landSize) {
      alert(`Land used cannot exceed ${farmerProfile.landSize} acres`);
      return;
    }

    // Build payload – cropName is sent as empty string for Planning
    const payload = {
      email: formData.email,
      instanceName: formData.instanceName,
      season: formData.season,
      landUsed: parseFloat(formData.landUsed),
      startingStage: formData.startingStage,
    };

    // Only include cropName if stage is NOT Planning
    if (formData.startingStage !== "Planning") {
      payload.cropName = formData.cropName;
    }

    setLoading(true);
    try {
      await create_instance_api(payload);
      alert("✅ Instance created successfully!");
      onSuccess?.();
      onClose();
    } catch (err) {
      alert(err.message || "❌ Creation failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="create-instance-overlay" onClick={onClose}>
      <div className="create-instance-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🌾 Create New Crop Cycle</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {fetching ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div className="spinner" style={{ margin: "0 auto 1rem" }}></div>
            <p>Loading your profile...</p>
          </div>
        ) : farmerProfile ? (
          <>
            {/* Profile Summary */}
            <div className="profile-summary">
              <p>
                <strong>{farmerProfile.name}</strong> – {farmerProfile.village || ""}, {farmerProfile.district}
              </p>
              <p>
                Total Land: {farmerProfile.landSize || 0} acres | Irrigation: {farmerProfile.irrigationType || "Not set"}
              </p>
              <p>
                Soil: {farmerProfile.soilProfile?.soilType || farmerProfile.soilType || "Not specified"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="create-instance-form">
              {/* Instance Name */}
              <div className="form-group">
                <label>Instance Name *</label>
                <input
                  name="instanceName"
                  placeholder="e.g. Soybean Kharif 2026"
                  value={formData.instanceName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                {/* Crop Input – hidden for Planning stage */}
                {formData.startingStage !== "Planning" ? (
                  <div className="form-group">
                    <label>Crop *</label>
                    <input
                      name="cropName"
                      placeholder="e.g. Soybean"
                      value={formData.cropName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ) : (
                  <div className="form-group system-recommend-message">
                    <label>🌿 Recommended Crop</label>
                    <div className="recommend-box">
                      <span className="recommend-icon">🤖</span>
                      <span className="recommend-text">
                        System will suggest best crop based on your soil, season and location.
                      </span>
                    </div>
                  </div>
                )}

                {/* Season */}
                <div className="form-group">
                  <label>Season *</label>
                  <select
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Kharif">Kharif</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Summer">Summer</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                {/* Land Used */}
                <div className="form-group">
                  <label>Land Used (acres) *</label>
                  <input
                    name="landUsed"
                    type="number"
                    step="0.1"
                    placeholder={`Max ${farmerProfile.landSize || 0}`}
                    value={formData.landUsed}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Starting Stage */}
                <div className="form-group">
                  <label>Starting Stage *</label>
                  <select
                    name="startingStage"
                    value={formData.startingStage}
                    onChange={handleStageChange}
                  >
                    <option value="Planning">Planning</option>
                    <option value="Sowing">Sowing</option>
                    <option value="Cultivation">Cultivation</option>
                    <option value="Harvesting">Harvesting</option>
                    <option value="Selling">Selling</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Creating..." : "🌱 Create Instance"}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>❌ Could not load profile. Please try again.</p>
            <button className="close-btn" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateInstance;