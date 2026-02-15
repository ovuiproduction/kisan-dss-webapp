import React, { useState, useEffect } from "react";
import { update_farmer_profile_api, get_farmer_profile_api } from "./apis_db";
import "../css/UpdateProfile.css";

const UpdateProfile = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    email: user.email || "",
    village: "",
    landSize: "",
    irrigationType: "",
    soilType: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
    organicCarbon: "",
  });

  // Load existing profile data when modal opens
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setFetching(true);
        const profile = await get_farmer_profile_api();
        setFormData({
          email: profile.email,
          village: profile.village || "",
          landSize: profile.landSize || "",
          irrigationType: profile.irrigationType || "",
          soilType: profile.soilProfile?.soilType || "",
          nitrogen: profile.soilProfile?.nitrogen || "",
          phosphorus: profile.soilProfile?.phosphorus || "",
          potassium: profile.soilProfile?.potassium || "",
          ph: profile.soilProfile?.ph || "",
          organicCarbon: profile.soilProfile?.organicCarbon || "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setFetching(false);
      }
    };

    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await update_farmer_profile_api(formData);
      alert("Profile updated successfully");
      onSuccess?.();
      onClose();
    } catch (err) {
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-profile-overlay" onClick={onClose}>
      <div className="update-profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="update-profile-header">
          <h2>Complete Your Farm Profile</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {fetching ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div className="spinner" style={{ margin: "0 auto 1rem" }}></div>
            <p>Loading profile...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="update-profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>Village *</label>
                <input
                  name="village"
                  placeholder="e.g. Baramati"
                  value={formData.village}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Land Size (acres) *</label>
                <input
                  name="landSize"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 5.5"
                  value={formData.landSize}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Irrigation Type *</label>
                <select
                  name="irrigationType"
                  value={formData.irrigationType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="Rainfed">Rainfed</option>
                  <option value="Borewell">Borewell</option>
                  <option value="Canal">Canal</option>
                  <option value="Drip">Drip</option>
                </select>
              </div>
              <div className="form-group">
                <label>Soil Type</label>
                <input
                  name="soilType"
                  placeholder="Black / Red / Alluvial"
                  value={formData.soilType}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="soil-health-section">
              <h3>Soil Health (optional)</h3>
              <div className="soil-inputs-grid">
                <div className="form-group">
                  <label>Nitrogen (N)</label>
                  <input
                    name="nitrogen"
                    placeholder="kg/ha"
                    value={formData.nitrogen}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phosphorus (P)</label>
                  <input
                    name="phosphorus"
                    placeholder="kg/ha"
                    value={formData.phosphorus}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Potassium (K)</label>
                  <input
                    name="potassium"
                    placeholder="kg/ha"
                    value={formData.potassium}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>pH</label>
                  <input
                    name="ph"
                    placeholder="e.g. 7.2"
                    value={formData.ph}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Organic Carbon</label>
                  <input
                    name="organicCarbon"
                    placeholder="%"
                    value={formData.organicCarbon}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Saving..." : "💾 Save Profile"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateProfile;