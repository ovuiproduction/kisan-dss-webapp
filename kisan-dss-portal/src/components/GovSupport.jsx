// import React, { useState } from "react";
// import { IntelGovSchemeSupport } from "./apis_ml";

// import "../static/css/GovSupport.css";

// const GovSupport = ({ onClose }) => {
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [language, setLanguage] = useState("English");
//   const [farmerProfile, setFarmerProfile] = useState({
//     state: "",
//     district: "",
//     taluka: "",
//     landSize: "",
//     landUnit: "acre",
//     landType: "",
//     ownershipStatus: "",
//     primaryCrops: "",
//     cropCategory: "",
//     farmingSeason: "",
//     purpose: [],
//     farmerCategory: "",
//     bankAccount: "",
//     aadhaar: "",
//     kcc: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFarmerProfile((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCheckboxChange = (e) => {
//     const { value, checked } = e.target;
//     setFarmerProfile((prev) => ({
//       ...prev,
//       purpose: checked
//         ? [...prev.purpose, value]
//         : prev.purpose.filter((item) => item !== value),
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const formData = {
//         "farmer_profile": { ...farmerProfile},
//         "language": language || "English"
//       }
//       const res = await IntelGovSchemeSupport(formData);
//       setResult(res); // form disappears automatically
//     } catch (err) {
//       setError("Failed to fetch schemes. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="gov-overlay">
//       <div className="gov-modal">
//         <button className="close-btn" onClick={onClose}>
//           ✕
//         </button>

//         {!result ? (
//           <form className="farmer-form" onSubmit={handleSubmit}>
//             <h2>Farmer Scheme Eligibility</h2>

//             {/* Location */}
//             <label>State</label>
//             <input name="state" value={farmerProfile.state} onChange={handleChange} required />

//             <label>District</label>
//             <input name="district" value={farmerProfile.district} onChange={handleChange} required />

//             <label>Village / Taluka</label>
//             <input name="taluka" value={farmerProfile.taluka} onChange={handleChange} />

//             {/* Land */}
//             <label>Landholding Size</label>
//             <div className="inline">
//               <input
//                 type="number"
//                 name="landSize"
//                 value={farmerProfile.landSize}
//                 onChange={handleChange}
//                 required
//               />
//               <select name="landUnit" value={farmerProfile.landUnit} onChange={handleChange}>
//                 <option value="acre">Acres</option>
//                 <option value="hectare">Hectares</option>
//               </select>
//             </div>

//             <label>Type of Land</label>
//             <select name="landType" value={farmerProfile.landType} onChange={handleChange} required>
//               <option value="">Select</option>
//               <option value="irrigated">Irrigated</option>
//               <option value="rainfed">Rainfed</option>
//               <option value="mixed">Mixed</option>
//             </select>

//             <label>Ownership Status</label>
//             <select
//               name="ownershipStatus"
//               value={farmerProfile.ownershipStatus}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select</option>
//               <option value="owner">Owner</option>
//               <option value="tenant">Tenant</option>
//               <option value="sharecropper">Sharecropper</option>
//             </select>

//             {/* Crop */}
//             <label>Primary Crops</label>
//             <input
//               name="primaryCrops"
//               placeholder="Wheat, Rice, Cotton"
//               value={farmerProfile.primaryCrops}
//               onChange={handleChange}
//               required
//             />

//             <label>Crop Category</label>
//             <select name="cropCategory" value={farmerProfile.cropCategory} onChange={handleChange} required>
//               <option value="">Select</option>
//               <option value="food_grains">Food Grains</option>
//               <option value="horticulture">Horticulture</option>
//               <option value="plantation">Plantation</option>
//               <option value="cash_crops">Cash Crops</option>
//             </select>

//             <label>Farming Season</label>
//             <select
//               name="farmingSeason"
//               value={farmerProfile.farmingSeason}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select</option>
//               <option value="kharif">Kharif</option>
//               <option value="rabi">Rabi</option>
//               <option value="zaid">Zaid</option>
//               <option value="perennial">Perennial</option>
//             </select>

//             {/* Purpose */}
//             <label>Purpose</label>
//             <div className="checkbox-group">
//               {[
//                 "seeds",
//                 "plantation",
//                 "equipment",
//                 "irrigation",
//                 "loan",
//                 "income_support",
//                 "insurance",
//               ].map((item) => (
//                 <label key={item}>
//                   <input
//                     type="checkbox"
//                     value={item}
//                     checked={farmerProfile.purpose.includes(item)}
//                     onChange={handleCheckboxChange}
//                   />
//                   {item.replace("_", " ").toUpperCase()}
//                 </label>
//               ))}
//             </div>

//             {/* Access */}
//             <label>Farmer Category</label>
//             <select
//               name="farmerCategory"
//               value={farmerProfile.farmerCategory}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select</option>
//               <option value="marginal">Marginal</option>
//               <option value="small">Small</option>
//               <option value="medium">Medium</option>
//               <option value="large">Large</option>
//             </select>

//             <label>Bank Account Available?</label>
//             <select name="bankAccount" value={farmerProfile.bankAccount} onChange={handleChange}>
//               <option value="">Select</option>
//               <option value="yes">Yes</option>
//               <option value="no">No</option>
//             </select>

//             <label>Aadhaar Available?</label>
//             <select name="aadhaar" value={farmerProfile.aadhaar} onChange={handleChange}>
//               <option value="">Select</option>
//               <option value="yes">Yes</option>
//               <option value="no">No</option>
//             </select>

//             <label>Kisan Credit Card (KCC)</label>
//             <select name="kcc" value={farmerProfile.kcc} onChange={handleChange}>
//               <option value="">Select</option>
//               <option value="yes">Yes</option>
//               <option value="no">No</option>
//             </select>

//             <select value={language} onChange={(e) => setLanguage(e.target.value)} name="language" id="">
//                 <option value="English">English</option>
//                 <option value="Hindi">Hindi</option>
//                 <option value="Marathi">Marathi</option>
//             </select>

//             {error && <p className="error">{error}</p>}

//             <button type="submit" disabled={loading}>
//               {loading ? "Checking..." : "Check Eligible Schemes"}
//             </button>
//           </form>
//         ) : (
//           <div className="result-section">
//             <h2>Recommended Government Schemes</h2>
//             <pre>{JSON.stringify(result, null, 2)}</pre>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GovSupport;

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { IntelGovSchemeSupport } from "./apis_ml";
import "../static/css/GovSupport.css";

const GovSupport = ({ onClose }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("English");
  const [selectedLandType, setSelectedLandType] = useState("");

  const [farmerProfile, setFarmerProfile] = useState({
    state: "",
    district: "",
    taluka: "",
    landSize: "",
    landUnit: "acre",
    landType: "",
    ownershipStatus: "",
    primaryCrops: "",
    cropCategory: "",
    farmingSeason: "",
    purpose: [],
    farmerCategory: "",
    bankAccount: "",
    aadhaar: "",
    kcc: "",
  });

  const landTypeOptions = [
    { value: "irrigated", label: "Irrigated", description: "Regular water supply" },
    { value: "rainfed", label: "Rainfed", description: "Depends on rainfall" },
    { value: "mixed", label: "Mixed", description: "Both irrigated & rainfed" },
  ];

  const purposeOptions = [
    { 
      value: "seeds", 
      label: "Seeds", 
      description: "Quality seeds, planting material",
      icon: "🌱"
    },
    { 
      value: "plantation", 
      label: "Plantation", 
      description: "New planting, saplings",
      icon: "🌳"
    },
    { 
      value: "equipment", 
      label: "Equipment", 
      description: "Farm machinery, tools",
      icon: "🚜"
    },
    { 
      value: "irrigation", 
      label: "Irrigation", 
      description: "Water supply systems",
      icon: "💧"
    },
    { 
      value: "loan", 
      label: "Loan", 
      description: "Financial assistance",
      icon: "💰"
    },
    { 
      value: "income_support", 
      label: "Income Support", 
      description: "Direct benefit transfer",
      icon: "📈"
    },
    { 
      value: "insurance", 
      label: "Insurance", 
      description: "Crop insurance coverage",
      icon: "🛡️"
    },
  ];

  useEffect(() => {
    setSelectedLandType(farmerProfile.landType);
  }, [farmerProfile.landType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFarmerProfile((prev) => ({ ...prev, [name]: value }));
    
    if (name === "landType") {
      setSelectedLandType(value);
    }
  };

  const handleLandTypeSelect = (type) => {
    setFarmerProfile((prev) => ({ ...prev, landType: type }));
    setSelectedLandType(type);
  };

  const handlePurposeSelect = (value) => {
    setFarmerProfile((prev) => ({
      ...prev,
      purpose: prev.purpose.includes(value)
        ? prev.purpose.filter((item) => item !== value)
        : [...prev.purpose, value],
    }));
  };

  const handleSelectAllPurpose = () => {
    if (farmerProfile.purpose.length === purposeOptions.length) {
      // If all selected, deselect all
      setFarmerProfile((prev) => ({ ...prev, purpose: [] }));
    } else {
      // Select all
      setFarmerProfile((prev) => ({
        ...prev,
        purpose: purposeOptions.map(option => option.value),
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFarmerProfile((prev) => ({
      ...prev,
      purpose: checked
        ? [...prev.purpose, value]
        : prev.purpose.filter((item) => item !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = {
        "farmer_profile": { ...farmerProfile },
        "language": language || "English"
      };
      const res = await IntelGovSchemeSupport(formData);
      setResult(res);
    } catch (err) {
      setError("Failed to fetch schemes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setResult(null);
    setError(null);
  };

  const renderResult = () => {
    if (!result?.govSchemesSupport) return null;
    
    // Parse the markdown content
    const markdownContent = result.govSchemesSupport;
    
    return (
      <div className="gov-support-result-section">
        <div className="gov-support-result-header">
          <h2>Recommended Government Schemes</h2>
          <p>Tailored recommendations based on your profile</p>
        </div>
        
        <div className="gov-support-result-content">
          <ReactMarkdown>
            {markdownContent}
          </ReactMarkdown>
        </div>
        
        <div className="gov-support-result-actions">
          <button 
            className="gov-support-action-btn gov-support-btn-secondary" 
            onClick={handleBackToForm}
          >
            <span>←</span> Back to Form
          </button>
          <button 
            className="gov-support-action-btn gov-support-btn-primary" 
            onClick={onClose}
          >
            Close <span>×</span>
          </button>
        </div>
      </div>
    );
  };

  const renderForm = () => (
    <form className="gov-support-farmer-form" onSubmit={handleSubmit}>
      <div className="gov-support-form-section gov-support-section-location">
        <h3>Location Details</h3>
        <div className="gov-support-form-group">
          <label>State</label>
          <input 
            name="state" 
            value={farmerProfile.state} 
            onChange={handleChange}
            placeholder="Enter your state" 
            required 
          />
        </div>
        
        <div className="gov-support-form-group">
          <label>District</label>
          <input 
            name="district" 
            value={farmerProfile.district} 
            onChange={handleChange}
            placeholder="Enter your district" 
            required 
          />
        </div>
        
        <div className="gov-support-form-group">
          <label>Village / Taluka</label>
          <input 
            name="taluka" 
            value={farmerProfile.taluka} 
            onChange={handleChange}
            placeholder="Enter your village or taluka" 
          />
        </div>
      </div>

      <div className="gov-support-form-section gov-support-section-land">
        <h3>Land Information</h3>
        
        {/* Improved Land Size Input */}
        <div className="gov-support-land-size-container">
          <div className="gov-support-form-group">
            <label>Landholding Size</label>
            <div className="gov-support-land-input-group">
              <div className="gov-support-form-group">
                <input
                  type="number"
                  name="landSize"
                  value={farmerProfile.landSize}
                  onChange={handleChange}
                  placeholder="Enter land size"
                  min="0"
                  step="0.1"
                  required
                />
              </div>
              <div className="gov-support-form-group">
                <select name="landUnit" value={farmerProfile.landUnit} onChange={handleChange}>
                  <option value="acre">Acres</option>
                  <option value="hectare">Hectares</option>
                </select>
              </div>
            </div>
          </div>

          <div className="gov-support-form-group">
            <label>Type of Land</label>
            <div className="gov-support-land-type-group">
              {landTypeOptions.map((type) => (
                <div 
                  key={type.value}
                  className={`gov-support-land-type-option ${selectedLandType === type.value ? 'selected' : ''}`}
                  onClick={() => handleLandTypeSelect(type.value)}
                >
                  <input
                    type="radio"
                    name="landType"
                    value={type.value}
                    checked={selectedLandType === type.value}
                    onChange={() => {}}
                  />
                  <div className="gov-support-land-type-label">
                    <span className="gov-support-land-type-name">{type.label}</span>
                    <span className="gov-support-land-type-desc">{type.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="gov-support-form-group">
            <label>Ownership Status</label>
            <select
              name="ownershipStatus"
              value={farmerProfile.ownershipStatus}
              onChange={handleChange}
              required
            >
              <option value="">Select ownership type</option>
              <option value="owner">Owner</option>
              <option value="tenant">Tenant</option>
              <option value="sharecropper">Sharecropper</option>
              <option value="leasehold">Leasehold</option>
            </select>
          </div>
        </div>
      </div>

      <div className="gov-support-form-section gov-support-section-crop">
        <h3>Crop Details</h3>
        <div className="gov-support-form-group">
          <label>Primary Crops Grown</label>
          <input
            name="primaryCrops"
            placeholder="e.g., Wheat, Rice, Cotton, Vegetables"
            value={farmerProfile.primaryCrops}
            onChange={handleChange}
            required
          />
          <small style={{color: '#666', fontSize: '12px', marginTop: '5px'}}>
            Enter crops separated by commas
          </small>
        </div>

        <div className="gov-support-form-group">
          <label>Crop Category</label>
          <select name="cropCategory" value={farmerProfile.cropCategory} onChange={handleChange} required>
            <option value="">Select primary crop category</option>
            <option value="food_grains">Food Grains</option>
            <option value="horticulture">Horticulture</option>
            <option value="plantation">Plantation</option>
            <option value="cash_crops">Cash Crops</option>
            <option value="pulses">Pulses</option>
            <option value="oilseeds">Oilseeds</option>
          </select>
        </div>

        <div className="gov-support-form-group">
          <label>Farming Season</label>
          <select
            name="farmingSeason"
            value={farmerProfile.farmingSeason}
            onChange={handleChange}
            required
          >
            <option value="">Select main farming season</option>
            <option value="kharif">Kharif (Monsoon: June-Oct)</option>
            <option value="rabi">Rabi (Winter: Nov-Mar)</option>
            <option value="zaid">Zaid (Summer: Apr-June)</option>
            <option value="perennial">Perennial (Year-round)</option>
            <option value="mixed">Multiple Seasons</option>
          </select>
        </div>
      </div>

      {/* Improved Purpose Section */}
      <div className="gov-support-form-section gov-support-section-purpose gov-support-purpose-section">
        <div className="gov-support-purpose-header">
          <h3>Support Required</h3>
          <div 
            className="gov-support-purpose-select-all"
            onClick={handleSelectAllPurpose}
          >
            <input
              type="checkbox"
              checked={farmerProfile.purpose.length === purposeOptions.length}
              onChange={() => {}}
              style={{width: '16px', height: '16px', accentColor: '#4a9e48'}}
            />
            <span>
              {farmerProfile.purpose.length === purposeOptions.length ? 'Deselect All' : 'Select All'}
            </span>
          </div>
        </div>
        
        <div className="gov-support-form-group">
          <label>Select the support you need (multiple selections allowed)</label>
          <div className="gov-support-purpose-grid">
            {purposeOptions.map((purpose) => (
              <div
                key={purpose.value}
                className={`gov-support-purpose-card ${farmerProfile.purpose.includes(purpose.value) ? 'selected' : ''}`}
                onClick={() => handlePurposeSelect(purpose.value)}
              >
                <div className="gov-support-purpose-icon">
                  {purpose.icon}
                </div>
                <div className="gov-support-purpose-content">
                  <span className="gov-support-purpose-name">{purpose.label}</span>
                  <span className="gov-support-purpose-desc">{purpose.description}</span>
                </div>
                <input
                  type="checkbox"
                  value={purpose.value}
                  checked={farmerProfile.purpose.includes(purpose.value)}
                  onChange={() => {}}
                />
              </div>
            ))}
          </div>
          <div className="gov-support-purpose-stats">
            {farmerProfile.purpose.length} of {purposeOptions.length} selected
          </div>
        </div>
      </div>

      <div className="gov-support-form-section gov-support-section-access">
        <h3>Access & Documentation</h3>
        <div className="gov-support-form-group">
          <label>Farmer Category</label>
          <select
            name="farmerCategory"
            value={farmerProfile.farmerCategory}
            onChange={handleChange}
            required
          >
            <option value="">Select your category</option>
            <option value="marginal">Marginal (less than 1 hectare)</option>
            <option value="small">Small (1-2 hectares)</option>
            <option value="medium">Medium (2-10 hectares)</option>
            <option value="large">Large (more than 10 hectares)</option>
          </select>
        </div>

        <div className="gov-support-form-group">
          <label>Bank Account Available?</label>
          <select name="bankAccount" value={farmerProfile.bankAccount} onChange={handleChange} required>
            <option value="">Select option</option>
            <option value="yes">Yes, I have a bank account</option>
            <option value="no">No bank account</option>
          </select>
        </div>

        <div className="gov-support-form-group">
          <label>Aadhaar Available?</label>
          <select name="aadhaar" value={farmerProfile.aadhaar} onChange={handleChange} required>
            <option value="">Select option</option>
            <option value="yes">Yes, I have Aadhaar</option>
            <option value="no">No Aadhaar card</option>
          </select>
        </div>

        <div className="gov-support-form-group">
          <label>Kisan Credit Card (KCC)</label>
          <select name="kcc" value={farmerProfile.kcc} onChange={handleChange}>
            <option value="">Select option</option>
            <option value="yes">Yes, I have KCC</option>
            <option value="no">No KCC card</option>
            <option value="applied">Applied, pending approval</option>
          </select>
        </div>
      </div>

      <div className="gov-support-form-section gov-support-section-language">
        <h3>Language Preference</h3>
        <div className="gov-support-form-group">
          <label>Select Language for Scheme Details</label>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="gov-support-language-select"
          >
            <option value="English">English</option>
            <option value="Hindi">हिंदी (Hindi)</option>
            <option value="Marathi">मराठी (Marathi)</option>
            <option value="Telugu">తెలుగు (Telugu)</option>
            <option value="Tamil">தமிழ் (Tamil)</option>
            <option value="Bengali">বাংলা (Bengali)</option>
          </select>
          <small style={{color: '#666', fontSize: '12px', marginTop: '5px'}}>
            Scheme details will be shown in your preferred language
          </small>
        </div>
      </div>

      {error && (
        <div className="gov-support-error-message">
          {error}
        </div>
      )}

      <button type="submit" className="gov-support-submit-btn" disabled={loading}>
        {loading ? (
          <>
            <div className="gov-support-spinner" style={{width: '20px', height: '20px'}}></div>
            Finding Best Schemes...
          </>
        ) : (
          <>
            <span style={{fontSize: '18px'}}>🔍</span>
            Check Eligible Schemes
          </>
        )}
      </button>
    </form>
  );

  return (
    <div className="gov-support-overlay">
      <div className="gov-support-modal">
        <div className="gov-support-modal-header">
          <h2>
            {result ? "Scheme Recommendations" : "Government Scheme Eligibility"}
          </h2>
          <button className="gov-support-close-btn" onClick={onClose} title="Close">
            ✕
          </button>
        </div>
        
        <div className="gov-support-modal-body">
          {loading ? (
            <div className="gov-support-loading-spinner">
              <div className="gov-support-spinner"></div>
              <p>Analyzing your profile and finding best schemes...</p>
              <p style={{fontSize: '14px', color: '#666'}}>This may take a few moments</p>
            </div>
          ) : result ? (
            renderResult()
          ) : (
            renderForm()
          )}
        </div>
        
        <div className="gov-support-modal-footer">
          <p>© 2024 Government Scheme Portal | Secure & Confidential | All data is encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default GovSupport;