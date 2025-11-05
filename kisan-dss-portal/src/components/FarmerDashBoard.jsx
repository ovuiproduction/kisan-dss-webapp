import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../static/css/farmer_dashboard.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import IntelGovMarketForm from "./IntelGovMarketForm";
import IntelLocalMarketForm from "./IntelLocalMarketForm";
import FarmerProfileCard from "./FarmerProfileCard";
import IntelCropRecommendationForm from "./IntelCropRecommendationForm";

import ChatBot from "./ChatBot";
import { intelDecisionBuilding_api, IntelWeatherAdvisory_api } from "./apis_ml";
import { getWeatherAdvisory, updateWeatherAdvisory } from "./apis_db";

export default function FarmerDashBoard() {
  const navigate = useNavigate();

  const [commodity, setCommodity] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [storageAvailability, setStorageAvailability] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [weatherAdvisory, setWeatherAdvisory] = useState(null);
  const [isScrollOpen, setIsScrollOpen] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("user")) || {};

  const [chatBot, setChatBot] = useState(false);

  const [govMarketForm, setGovMarketForm] = useState(false);
  const [localMarketForm, setLocalMarketForm] = useState(false);
  const [intelCropRecommendationForm, setIntelCropRecommendationForm] =
    useState(false);

  const handleChatBot = (e) => {
    e.preventDefault();
    if (chatBot) {
      setChatBot(false);
    } else {
      setChatBot(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData(null);
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("commodity", commodity);
    formData.append("year", year);
    formData.append("month", month);
    formData.append("storageAvailability", storageAvailability);

    try {
      const data = await intelDecisionBuilding_api(formData);
      setData(data);
      console.log(responseData);
    } catch (err) {
      setError("Failed to build decision. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Loading state changed:", loading);
  }, [loading]);

  const farmerAdminNavigation = () => {
    navigate("/home-farmer");
  };

  const serviceCards = [
    {
      icon: "🌱",
      title: "Smart Crop Recommendation",
      description:
        "Grow the Right Crop, at the Right Time! Get AI-powered crop suggestions based on your soil and climate.",
      action: () => setIntelCropRecommendationForm(true),
      type: "button",
    },
    {
      icon: "🤝",
      title: "Government Schemes",
      description:
        "Bridging Farmers with Government Support! Discover and apply for beneficial government schemes.",
      link: "/intel-goverment-scheme",
      type: "link",
    },
    {
      icon: "🧑‍🌾",
      title: "Cultivation Guide",
      description:
        "Learn modern farming techniques and best practices for optimal crop yield and sustainable farming.",
      link: "/intel-cultivation-guide",
      type: "link",
    },
    {
      icon: "🏛️",
      title: "Government APMC",
      description:
        "Agricultural market platform with real-time commodity prices & APMC Market price forecasting.",
      action: () => setGovMarketForm(true),
      type: "button",
    },
    {
      icon: "🛒",
      title: "Local Mandi",
      description:
        "Connect with regional local markets and local traders. Local market price forecasting, transportation cost calculation and market recommendation.",
      action: () => setLocalMarketForm(true),
      type: "button",
    },
    {
      icon: "📦",
      title: "E-Commerce",
      description:
        "Producer to Consumer Service. Direct digital marketplace connecting farmers with consumers.",
      action: farmerAdminNavigation,
      type: "button",
    },
  ];

  const handleFarmerProfile = () => {
    setShowProfile(true);
  };

  const getWeatherAdvice = async () => {
    if (user.district === undefined) return;
    const payload = { city: user.district }; // or dynamic city
    const res = await IntelWeatherAdvisory_api(payload);
    console.log("Weather Advisory:", res.weatherAdvisory);
    setWeatherAdvisory(res.weatherAdvisory);
    return res.weatherAdvisory;
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (localStorage.getItem("weatherAdvisory")) {
        setWeatherAdvisory(localStorage.getItem("weatherAdvisory"));
        return;
      }
      if (!user || weatherAdvisory) return;

      try {
        console.log("Fetching weather advisory for district:", user.district);
        // Get advisory from DB
        const dbAdvisory = await getWeatherAdvisory();
        const currentDate = new Date();

        if (
          dbAdvisory.weatherAdvisory &&
          new Date(dbAdvisory.weatherAdvisory.expiryDate) > currentDate
        ) {
          console.log("✅ Using cached weather advisory");
          setWeatherAdvisory(dbAdvisory.weatherAdvisory.advisoryText);
          localStorage.setItem(
            "weatherAdvisory",
            dbAdvisory.weatherAdvisory.advisoryText
          );
          return;
        }

        // Else get fresh advisory from backend API
        console.log("⚠️ Cache expired → fetching fresh advisory");
        const newAdvisory = getWeatherAdvice();

        // Set to state
        setWeatherAdvisory(newAdvisory);
        localStorage.setItem("weatherAdvisory", newAdvisory);

        // Save to DB (valid for 4 days)
        const expiryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        await updateWeatherAdvisory(newAdvisory, expiryDate);
      } catch (err) {
        console.error("Weather advisory fetch error:", err);
      }
    };

    fetchWeatherData();
  }, [user]);

  return (
    <div className="farmer-dashboard-root">
      <div className="farmer-dashboard-root">
        <div className="farmer-profile">
          <button onClick={handleFarmerProfile}>
            <i className="fa-solid fa-user"></i>
          </button>
        </div>

        {showProfile && (
          <FarmerProfileCard onClose={() => setShowProfile(false)} />
        )}
      </div>
      <div id="cover_root">
        <div className="cover_container">
          <h1 className="cover_heading">🌾 Agricultural Services Gateway</h1>

          <main>
            {weatherAdvisory && (
              <div className="weather-advisory-section">
                <div
                  className={`scroll-container ${
                    isScrollOpen ? "open" : "closed"
                  }`}
                >
                  <div
                    className="scroll-header"
                    onClick={() => setIsScrollOpen(!isScrollOpen)}
                  >
                    <h2>🌤️ Weather Advisory & Guidance</h2>
                    <button
                      className="scroll-toggle"
                      aria-label="Toggle weather advisory"
                    >
                      <span className={`arrow ${isScrollOpen ? "up" : "down"}`}>
                        ▼
                      </span>
                    </button>
                  </div>

                  <div className="scroll-content">
                    <div className="scroll-paper">
                      {weatherAdvisory === "loading" ? (
                        <div className="loading-message">
                          <span className="loading-spinner"></span>
                          <p>
                            Receiving weather advisory from the royal
                            meteorologists...
                          </p>
                        </div>
                      ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {weatherAdvisory}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>

          <main className="farmer-dashboard-smart-container">
            {loading && (
              <div
                className="farmer-dashboard-loading-overlay"
                id="farmer-dashboard-loading"
              >
                <div className="farmer-dashboard-loader">
                  <div className="farmer-dashboard-loader-div"></div>
                  <p>Analyzing...</p>
                </div>
              </div>
            )}

            <h1 className="farmer-dashboard-h1">Smart Decision Building</h1>
            {error && (
              <div
                className="farmer-dashboard-error-message"
                id="farmer-dashboard-error"
              >
                {error}
              </div>
            )}

            <form
              id="farmer-dashboard-transportForm"
              className="farmer-dashboard-transport-form"
              onSubmit={handleSubmit}
            >
              <div className="farmer-dashboard-input-group">
                <label htmlFor="farmer-dashboard-sourceDistrict">
                  Commodity
                </label>
                <select
                  id="farmer-dashboard-sourceDistrict"
                  required
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                >
                  <option value="">Select Commodity</option>
                  {[
                    "Bajra",
                    "Barley",
                    "Cotton",
                    "Gram",
                    "Groundnut",
                    "Jowar",
                    "Maize",
                    "Masoor",
                    "Moong",
                    "Soyabean",
                    "Sugarcane",
                    "Tur",
                    "Urad",
                    "Wheat",
                  ].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="farmer-dashboard-input-group">
                <label htmlFor="farmer-dashboard-destinationDistrict">
                  Year
                </label>
                <input
                  id="farmer-dashboard-destinationDistrict"
                  type="number"
                  placeholder="Enter Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>

              <div className="farmer-dashboard-input-group">
                <label htmlFor="farmer-dashboard-destinationDistrict">
                  Month
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option value="">Select Month</option>
                  {[
                    "1 - January",
                    "2 - February",
                    "3 - March",
                    "4 - April",
                    "5 - May",
                    "6 - June",
                    "7 - July",
                    "8 - August",
                    "9 - September",
                    "10 - October",
                    "11 - November",
                    "12 - December",
                  ].map((item, index) => (
                    <option key={index + 1} value={index + 1}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="farmer-dashboard-input-group">
                <label htmlFor="farmer-dashboard-sourceDistrict">
                  Storage Availability
                </label>
                <select
                  id="farmer-dashboard-sourceDistrict"
                  required
                  value={storageAvailability}
                  onChange={(e) => setStorageAvailability(e.target.value)}
                >
                  <option value="">Select Storage Availability</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <button type="submit" className="farmer-dashboard-calculate-btn">
                Build Decision
              </button>
            </form>

            {data && (
              <div
                class="farmer-dashboard-results-section"
                id="farmer-dashboard-results"
              >
                <div class="farmer-dashboard-result-card">
                  <h3>Decision</h3>
                  <div
                    class="farmer-dashboard-result-grid"
                    id="farmer-dashboard-resultGrid"
                  >
                    <p className="decision-text">{data.decision.decision}</p>
                    <p>{data.decision.reasoning}</p>
                  </div>
                </div>
              </div>
            )}
          </main>

          {govMarketForm && (
            <IntelGovMarketForm setGovMarketForm={setGovMarketForm} />
          )}
          {localMarketForm && (
            <IntelLocalMarketForm setLocalMarketForm={setLocalMarketForm} />
          )}

          {intelCropRecommendationForm && (
            <IntelCropRecommendationForm
              setIntelCropRecommendationForm={setIntelCropRecommendationForm}
            />
          )}

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Our Agricultural Services</h2>
              <p>Comprehensive solutions for modern farming needs</p>
            </div>

            <div className="services-grid">
              {serviceCards.map((service, index) => (
                <div key={index} className="service-card">
                  <div className="service-icon">{service.icon}</div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  {service.type === "link" ? (
                    <Link to={service.link} className="service-btn">
                      Access Service
                    </Link>
                  ) : (
                    <button onClick={service.action} className="service-btn">
                      Access Portal
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {chatBot && <ChatBot />}

        <div className="farmer-bot-block">
          <button onClick={handleChatBot} className="farmer-bot-btn">
            <i class="fa-solid fa-robot"></i>
          </button>
        </div>
      </div>

      <footer>
        <p>© 2026 Kisan Decision Support System. All rights reserved.</p>
      </footer>
    </div>
  );
}
