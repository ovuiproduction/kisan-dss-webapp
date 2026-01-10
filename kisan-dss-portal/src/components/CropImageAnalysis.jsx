// src/components/CropImageAnalysis.jsx
import React, { useState } from "react";
import { uploadImage } from "./api/uploadImage";
import { intelCropImageAnalysis } from "./apis_ml";
import ReactMarkdown from "react-markdown";
import "../css/CropImageAnalysis.css";

const CropImageAnalysis = () => {
  const [imageFile, setImageFile] = useState(null);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please upload an image");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      // 🔹 STEP 1: Upload image to server
      const imageUrl = await uploadImage(imageFile);

      // 🔹 STEP 2: Send image URL + language
      const payload = {
        image_url: imageUrl,
        language: language,
      };

      const analysisResult = await intelCropImageAnalysis(payload);
      setResult(analysisResult);

    } catch (err) {
      alert("Image analysis failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Format the result for ReactMarkdown
  const formatResult = () => {
    if (!result) return "";
    
    if (typeof result === "object" && result.cropImageAnalysis) {
      return result.cropImageAnalysis;
    }
    
    return String(result);
  };

  return (
    <div className="crop-image-analysis-container">
      <div className="crop-image-analysis-header">
          <h3 className="crop-image-analysis-title">
            <span className="crop-image-analysis-icon">🌱</span>
            Crop Doctor
          </h3>
          <p className="crop-image-analysis-subtitle">
            Upload an image of your crop for disease diagnosis and treatment recommendations
          </p>
        </div>
      <div className="crop-image-analysis-card">
        

        <form onSubmit={handleSubmit} className="crop-image-analysis-form">
          {/* Image Preview */}
          {previewUrl && (
            <div className="crop-image-analysis-preview">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="crop-image-analysis-preview-image"
              />
            </div>
          )}

          {/* Image Input */}
          <div className="crop-image-analysis-upload-area">
            <label className="crop-image-analysis-upload-label">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="crop-image-analysis-file-input"
              />
              <div className="crop-image-analysis-upload-box">
                <span className="crop-image-analysis-upload-icon">📷</span>
                <span className="crop-image-analysis-upload-text">
                  {imageFile ? imageFile.name : "Choose an image file"}
                </span>
              </div>
            </label>
          </div>

          {/* Language Input */}
          <div className="crop-image-analysis-language-group">
            <label className="crop-image-analysis-language-label">
              Analysis Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="crop-image-analysis-select"
            >
              <option value="en">English</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="mr">Marathi (मराठी)</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !imageFile}
            className="crop-image-analysis-button"
          >
            {loading ? (
              <>
                <span className="crop-image-analysis-spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                <span className="crop-image-analysis-button-icon">🔍</span>
                Analyze Image
              </>
            )}
          </button>
        </form>

        {/* Results Section */}
        {result && (
          <div className="crop-image-analysis-result-section">
          <div className="crop-image-analysis-result">
            <div className="crop-image-analysis-result-header">
              <h4 className="crop-image-analysis-result-title">
                <span className="crop-image-analysis-result-icon">📋</span>
                Analysis Report
              </h4>
              <div className="crop-image-analysis-result-language">
                Language: {language === "en" ? "English" : 
                         language === "hi" ? "Hindi" : "Marathi"}
              </div>
            </div>
            
            <div className="crop-image-analysis-result-content">
              <div className="crop-image-analysis-markdown">
                <ReactMarkdown>{formatResult()}</ReactMarkdown>
              </div>
            </div>
            <div className="close-btn-crop-image">
            <button onClick={() => setResult(null)}>Close</button>
          </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropImageAnalysis;