import React, { useState } from "react";
import { IntelCultivation_api } from "./apis_ml";
import "../css/cultivationGuide.css";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function IntelCultivationGuide() {
  const serviceCards = [
    {
      icon: "🚜",
      title: "Smart Cultivation Practices",
      description:
        "Learn modern and scientific cultivation methods tailored to your soil, crop, and climate for healthier yields.",
      link: "/intel-cultivation-practices",
      type: "link",
    },

    {
      icon: "📊",
      title: "Crop Distribution Assistance",
      description:
        "Track crop sowing trends across farmers to avoid overproduction and choose profitable crops for the season.",
      link: "https://crop-price-prediction.onrender.com/crop_statistics",
      type: "link-external",
    },
  ];

  return (
    <div className="cultivation-container">
       <Link to="/farmer-dashboard" className="cultivation-backBtn">
        <FaArrowLeft /> Back to Home
      </Link>
      <div className="cultivation-header">
        <h2>Intelligent Cultivation Guide</h2>
        <p className="subtitle">
          Get expert farming practices and resources for your crops
        </p>
      </div>

      <div className="cultivation-services">
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
              ) : service.type === "link-external" ? (
                <a
                  href={service.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="service-btn"
                >
                  Access Portal
                </a>
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
  );
}
