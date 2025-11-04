import React, { useState } from "react";
import { IntelCultivation_api } from "./apis_ml";
import "../css/cultivationGuide.css";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function IntelCultivationPractices() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("English");

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await IntelCultivation_api({ query, language });
      setData(response?.cultivationPractices);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch cultivation data. Please try again.");
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="cultivation-container">
      <Link to="/intel-cultivation-guide" className="cultivation-backBtn">
        <FaArrowLeft /> Back to Home
      </Link>
      <div className="cultivation-header">
        <h2>Intelligent Cultivation Practices</h2>
        <p className="subtitle">
          Get expert farming practices and resources for your crops
        </p>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Enter crop name (e.g., Wheat, Rice, Cotton)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
        </div>
        <select
          name="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          id=""
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Marathi">Marathi</option>
        </select>
        <button
          onClick={handleSearch}
          className="search-btn"
          disabled={loading || !query.trim()}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Searching...
            </>
          ) : (
            "Get Cultivation Guide"
          )}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <p>Fetching cultivation practices for {query}...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-card">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <div className="results-container">
          <div className="results-header">
            <h3>Cultivation Practices for {query}</h3>
            <span className="results-badge">
              {data.cultivation_practices?.length || 0} Stages
            </span>
          </div>

          {/* Cultivation Practices */}
          <div className="practices-grid">
            {data.cultivation_practices?.map((item, idx) => (
              <div key={idx} className="practice-card">
                <div className="practice-number">{idx + 1}</div>
                <div className="practice-content">
                  <h4 className="practice-stage">{item.stage}</h4>
                  <p className="practice-description">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Videos Section */}
          {data.recommended_youtube_videos &&
            data.recommended_youtube_videos.length > 0 && (
              <div className="videos-section">
                <h4 className="section-title">
                  <span className="video-icon">🎥</span>
                  Recommended Video Resources
                </h4>
                <div className="videos-grid">
                  {data.recommended_youtube_videos.map((v, idx) => (
                    <a
                      key={idx}
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="video-card"
                    >
                      <div className="video-thumbnail">
                        <span className="play-icon">▶</span>
                      </div>
                      <div className="video-info">
                        <h5 className="video-title">{v.title}</h5>
                        <p className="video-channel">{v.channel}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Empty State */}
      {!data && !loading && !error && (
        <div className="empty-state">
          <div className="empty-icon">🌱</div>
          <h3>Start Your Cultivation Journey</h3>
          <p>
            Enter a crop name above to discover best practices and expert
            guidance
          </p>
        </div>
      )}
    </div>
  );
}
