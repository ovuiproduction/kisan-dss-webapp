import React, { useState } from "react";
import { useEffect } from "react";
import "../css/InstanceDetails.css";

import { get_instance_by_id_api } from "./apis_db";

const InstanceDetails = ({ selectedInstance }) => {
  const { _id } = selectedInstance;

  const [instanceDetails, setInstanceDetails] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await get_instance_by_id_api(_id);
        setInstanceDetails(data);
      } catch (err) {
        console.error("Error fetching instance details:", err);
      }
    };
    fetchData();
  }, [_id]);

  if (!instanceDetails) {
    return <div>Loading instance details...</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="instance-details">
      {/* Header with crop name and stage badge */}
      <div className="instance-details-header">
        <h2 className="instance-details-crop-name">
          {instanceDetails.cropName || "Unnamed Crop"}
        </h2>
        <span
          className={`instance-details-stage-badge ${instanceDetails.currentStage?.toLowerCase()}`}
        >
          {instanceDetails.currentStage || "Planning"}
        </span>
      </div>

      {/* Quick stats row */}
      <div className="instance-details-stats">
        <div className="instance-details-stat-item">
          <span className="stat-label">🌾 Season</span>
          <span className="stat-value">{instanceDetails.season || "—"}</span>
        </div>
        <div className="instance-details-stat-item">
          <span className="stat-label">📏 Land</span>
          <span className="stat-value">{instanceDetails.landUsed} acres</span>
        </div>
        <div className="instance-details-stat-item">
          <span className="stat-label">💧 Irrigation</span>
          <span className="stat-value">{instanceDetails.irrigationType || "—"}</span>
        </div>
      </div>

      {/* Two-column layout for Location & Soil */}
      <div className="instance-details-row">
        {/* Location Card */}
        <div className="instance-details-card">
          <h3 className="card-title">📍 Location</h3>
          <div className="details-grid">
            <div>
              <span>State:</span> {instanceDetails.localitySnapshot?.state || "—"}
            </div>
            <div>
              <span>District:</span> {instanceDetails.localitySnapshot?.district || "—"}
            </div>
            <div>
              <span>Village:</span> {instanceDetails.localitySnapshot?.village || "—"}
            </div>
          </div>
        </div>

        {/* Soil Card */}
        <div className="instance-details-card">
          <h3 className="card-title">🧪 Soil Parameters</h3>
          <div className="details-grid">
            <div>
              <span>Type:</span> {instanceDetails.soilSnapshot?.soilType || "—"}
            </div>
            <div>
              <span>N (kg/ha):</span> {instanceDetails.soilSnapshot?.nitrogen ?? "—"}
            </div>
            <div>
              <span>P (kg/ha):</span> {instanceDetails.soilSnapshot?.phosphorus ?? "—"}
            </div>
            <div>
              <span>K (kg/ha):</span> {instanceDetails.soilSnapshot?.potassium ?? "—"}
            </div>
            <div>
              <span>pH:</span> {instanceDetails.soilSnapshot?.ph ?? "—"}
            </div>
            <div>
              <span>Organic Carbon (%):</span>{" "}
              {instanceDetails.soilSnapshot?.organicCarbon ?? "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Initial Plan Section (if exists) */}
      {instanceDetails.initialPlan && (
        <div className="instance-details-plan-section">
          <h3 className="section-title">🌱 AI Crop Plan</h3>

          {/* Recommended crop & reasoning */}
          <div className="plan-recommendation">
            <div className="recommendation-header">
              <span className="recommendation-label">Recommended Crop</span>
              <span className="recommendation-value">
                {instanceDetails.initialPlan.recommended_crop}
              </span>
            </div>
            {instanceDetails.initialPlan.crop_recommendation_reasoning && (
              <p className="recommendation-reason">
                <strong>Why?</strong>{" "}
                {instanceDetails.initialPlan.crop_recommendation_reasoning}
              </p>
            )}
          </div>

          {/* Complete crop plan grid */}
          {instanceDetails.initialPlan.complete_crop_plan && (
            <div className="plan-details-grid">
              {Object.entries(instanceDetails.initialPlan.complete_crop_plan).map(
                ([key, value]) => (
                  <div key={key} className="plan-detail-item">
                    <span className="detail-label">
                      {key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                      :
                    </span>
                    <span className="detail-value">{value || "—"}</span>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      )}

      {/* Stage Timeline */}
      <div className="instance-details-timeline">
        <h3 className="section-title">⏳ Stage Progress</h3>
        <div className="timeline-row">
          <div className="timeline-item">
            <span className="timeline-label">Current Stage</span>
            <span
              className={`timeline-value ${instanceDetails.currentStage?.toLowerCase()}`}
            >
              {instanceDetails.currentStage}
            </span>
          </div>
          <div className="timeline-item">
            <span className="timeline-label">Entered On</span>
            <span className="timeline-value">
              {formatDate(instanceDetails.currentStageEnteredAt)}
            </span>
          </div>
        </div>

        {/* Completed Stages */}
        {instanceDetails.completedStages && instanceDetails.completedStages.length > 0 && (
          <div className="completed-stages">
            <span className="completed-label">✅ Completed Stages:</span>
            <div className="completed-stages-list">
              {instanceDetails.completedStages.map((stage, idx) => (
                <span key={idx} className="completed-stage-item">
                  {stage.stage}{" "}
                  <span className="stage-date">
                    ({formatDate(stage.completedAt)})
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstanceDetails;
