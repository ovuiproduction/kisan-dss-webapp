import React, { useState, useEffect } from "react";
import { get_instances_api } from "./apis_db";
import "../css/InstanceDashboard.css";
import { useNavigate } from "react-router-dom";
import CreateInstance from "./createInstance";

import IntelGovMarketForm from "./IntelGovMarketForm";
import IntelLocalMarketForm from "./IntelLocalMarketForm";
import IntelCropRecommendationForm from "./IntelCropRecommendationForm";
import FertilizerAdvisory from "./FertilizerAdvisory";
import PestAdvisory from "./PestAdvisory";
import YieldPrediction from "./YieldPrediction";
import GovSupport from "./GovSupport";
import CropPlanManager from "./CropPlanManager";
import InstanceDetails from "./InstanceDetails";
import LogsDashboard from "./LogsDashboard";

import { get_instance_by_id_api, complete_stage_api } from "./apis_db";

const InstanceDashboard = () => {
  const navigate = useNavigate();
  const [expandedStage, setExpandedStage] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [completingStage, setCompletingStage] = useState(null);

  const [smartCropPlaner, setSmartCropPlaner] = useState(false);
  const [fertilizerAdvisory, setFertilizerAdvisory] = useState(false);
  const [pestAdvisory, setPestAdvisory] = useState(false);
  const [yieldPrediction, setYieldPrediction] = useState(false);

  const [guidedPath, setGuidedPath] = useState(true);
  const [instanceDetails, setInstanceDetails] = useState(true);
  const [logsDashboard, setLogsDashboard] = useState(false);

  const [govMarketForm, setGovMarketForm] = useState(false);
  const [localMarketForm, setLocalMarketForm] = useState(false);
  const [intelCropRecommendationForm, setIntelCropRecommendationForm] =
    useState(false);
  const [govSupport, setGovSupport] = useState(false);
  
  const farmerAdminNavigation = () => {
    navigate("/home-farmer");
  };
  
  const stageServiceMap = {
    Planning: [
      {
        icon: "🌱",
        title: "Smart Plan Manager",
        description:
          "Your AI-powered crop planning assistant! Get personalized crop and sowing date recommendations based on your soil, climate, and preferences.",
        action: () => setSmartCropPlaner(true),
        type: "button",
      },
      {
        icon: "🤝",
        title: "Government Schemes",
        description:
          "Bridging Farmers with Government Support! Discover and apply for beneficial government schemes.",
        action: () => setGovSupport(true),
        type: "button",
      },
    ],
    Sowing: [
      {
        icon: "🌱",
        title: "Smart Crop Recommendation",
        description:
          "Grow the Right Crop, at the Right Time! Get AI-powered crop suggestions based on your soil and climate.",
        action: () => setIntelCropRecommendationForm(true),
        type: "button",
      },
      {
        icon: "🧑‍🌾",
        title: "Cultivation Guide",
        description:
          "Learn modern farming techniques and best practices for optimal crop yield and sustainable farming.",
        link: "/intel-cultivation-guide",
        type: "link",
      },
    ],
    Cultivation: [
      {
        icon: "🧑‍🌾",
        title: "Cultivation Guide",
        description:
          "Learn modern farming techniques and best practices for optimal crop yield and sustainable farming.",
        link: "/intel-cultivation-guide",
        type: "link",
      },
      {
        icon: "🧪",
        title: "Fertilizer Recommendation",
        description: "NPK dose based on soil & crop.",
        action: () => setFertilizerAdvisory(true),
        type: "button",
      },
      {
        icon: "🐛",
        title: "Pest Advisory",
        description: "Detect and manage pest outbreaks.",
        action: () => setPestAdvisory(true),
        type: "button",
      },
    ],
    Harvesting: [
      {
        icon: "📊",
        title: "Yield Prediction",
        description: "Estimate harvest quantity.",
        action: () => setYieldPrediction(true),
        type: "button",
      },
    ],
    Selling: [
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
    ],
    Completed: [
      {
        icon: "💐",
        title: "Complete! Explore E-Commerce",
        description:
          "Completed all stages! Explore our E-Commerce platform to sell your produce directly to consumers and maximize your profits.",
        action: () =>
          alert(
            "E-Commerce platform is now available for you to sell your produce directly to consumers.",
          ),
        type: "none",
      },
    ],
  };


  const handleCompleteStage = async (stageName) => {
    if (
      !window.confirm(
        `Are you sure you want to mark "${stageName}" as completed?`,
      )
    )
      return;
    setCompletingStage(stageName);
    try {
      await complete_stage_api(selectedInstance._id, stageName);
      const updated = await get_instance_by_id_api(selectedInstance._id);
      setSelectedInstance(updated);
    } catch (error) {
      console.error("Failed to complete stage:", error);
      alert("Failed to complete stage. Please try again.");
    } finally {
      setCompletingStage(null);
    }
  };

  const fetchInstances = async () => {
    try {
      setLoading(true);
      const email = JSON.parse(localStorage.getItem("user"))?.email;
      if (!email) {
        setError("No farmer logged in");
        setLoading(false);
        return;
      }
      const data = await get_instances_api(email);
      setInstances(data);
    } catch (err) {
      console.error("Failed to fetch instances:", err);
      setError(err.message || "Failed to load instances");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstances();
  }, []);

  const stageOrder = [
    "Planning",
    "Sowing",
    "Cultivation",
    "Harvesting",
    "Selling",
    "Completed",
  ];

  const getStageProgress = (currentStage) => {
    const index = stageOrder.indexOf(currentStage);
    const completed = stageOrder.slice(0, index + 1);
    const remaining = stageOrder.slice(index + 1);
    return { completed, remaining };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const openInstanceModal = (instance) => {
    setSelectedInstance(instance);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    // setSelectedInstance(null);
    setExpandedStage(null);
  };

  return (
    <div className="instance-dashboard">
      <div className="instance-main-dashboard">
        <div className="instance-dashboard-header">
          <h1>🌾 Your Crop Cycles</h1>
          <button
            className="instance-dashboard-create-btn"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Create New Cycle
          </button>
        </div>

        {loading && (
          <div className="instance-dashboard-loading-container">
            <div className="instance-dashboard-spinner"></div>
            <p>Loading your crop cycles...</p>
          </div>
        )}

        {error && !loading && (
          <div className="instance-dashboard-error-container">
            <p>❌ {error}</p>
            <button onClick={fetchInstances}>Retry</button>
          </div>
        )}

        {!loading && !error && instances.length === 0 && (
          <div className="instance-dashboard-empty-state">
            <p>You haven't created any crop cycles yet.</p>
            <button
              className="instance-dashboard-create-btn"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Start Your First Cycle
            </button>
          </div>
        )}

        {!loading && !error && instances.length > 0 && (
          <div className="instance-dashboard-grid">
            {instances.map((instance) => {
              const { completed, remaining } = getStageProgress(
                instance.currentStage,
              );
              const progressPercent =
                (completed.length / stageOrder.length) * 100;

              return (
                <div
                  key={instance._id}
                  className="instance-dashboard-card"
                  onClick={() => openInstanceModal(instance)}
                >
                  <div className="instance-dashboard-card-header">
                    <h3>{instance.instanceName}</h3>
                    <span
                      className={`instance-dashboard-stage-badge ${instance.currentStage.toLowerCase()}`}
                    >
                      {instance.currentStage}
                    </span>
                  </div>
                  <div className="instance-dashboard-card-body">
                    <p className="instance-dashboard-instance-name">
                      {instance.instanceName}
                    </p>
                    <p className="instance-dashboard-season">
                      {instance.season}
                    </p>
                    <p className="instance-dashboard-land">
                      🌱 {instance.landUsed} acres
                    </p>
                    <p className="instance-dashboard-dates">
                      Sown: {instance.cropName}
                    </p>
                  </div>
                  <div className="instance-dashboard-progress-section">
                    <div className="instance-dashboard-progress-labels">
                      <span>Progress</span>
                      <span>
                        {completed.length}/{stageOrder.length} stages
                      </span>
                    </div>
                    <div className="instance-dashboard-progress-bar">
                      <div
                        className="instance-dashboard-progress-fill"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="instance-dashboard-stage-summary">
                      <span className="instance-dashboard-completed">
                        ✅ Completed: {completed.join(" → ")}
                      </span>
                      {remaining.length > 0 && (
                        <span className="instance-dashboard-remaining">
                          ⏳ Remaining: {remaining.join(" → ")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {modalOpen && selectedInstance && (
          <div
            className="instance-dashboard-modal-overlay"
            onClick={closeModal}
          >
            <div
              className="instance-dashboard-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="instance-dashboard-modal-header">
                <h2>
                  {selectedInstance.cropName || "Crop"} –{" "}
                  {selectedInstance.instanceName}
                </h2>
                <button
                  className="instance-dashboard-modal-close"
                  onClick={closeModal}
                >
                  ✕
                </button>
              </div>

              <div className="instance-dashboard-controls">
                <button
                  className={guidedPath ? "active" : ""}
                  onClick={() => {
                    setInstanceDetails(false);
                    setGuidedPath(true);
                  }}
                >
                  🌱 Guided Path
                </button>

                <button
                  className={instanceDetails ? "active" : ""}
                  onClick={() => {
                    setGuidedPath(false);
                    setInstanceDetails(true);
                  }}
                >
                  📋 Instance Details
                </button>
              </div>

              {guidedPath && (
                <div className="instance-dashboard-guided-path">
                  <h3>🌱 Stage‑wise Service Guidance</h3>
                  <div className="instance-dashboard-stage-timeline-vertical">
                    {stageOrder.map((stage) => {
                      // ----- Determine stage status -----
                      let status = "upcoming";

                      if (
                        stageOrder.indexOf(stage) <
                        stageOrder.indexOf(selectedInstance.currentStage)
                      ) {
                        status = "completed";
                      } else {
                        const completedStage =
                          selectedInstance.completedStages?.find(
                            (cs) => cs.stage === stage,
                          );
                        if (completedStage) {
                          status = "completed";
                        } else if (stage === selectedInstance.currentStage) {
                          status = "current";
                        }
                      }

                      
                      // ----- Toggle expand -----
                      const isExpanded = expandedStage === stage;
                      const toggleExpand = () =>
                        setExpandedStage((prev) =>
                          prev === stage ? null : stage,
                        );

                      // ----- Get available hint cards for this stage -----
                      const stageHintCards = stageServiceMap[stage] || [];

                      return (
                        <div
                          key={stage}
                          className="instance-dashboard-timeline-stage-wrapper"
                        >
                          {/* Stage row with circle and label */}
                          <div
                            className="instance-dashboard-timeline-stage-row"
                            onClick={toggleExpand}
                          >
                            <div
                              className={`instance-dashboard-stage-circle ${status}`}
                            >
                              {status === "completed" ? "✓" : ""}
                            </div>
                            <div className="instance-dashboard-stage-info">
                              <span className="instance-dashboard-stage-name">
                                {stage}
                              </span>
                              {status === "current" && (
                                <span className="instance-dashboard-current-badge">
                                  Current
                                </span>
                              )}
                            </div>
                            <button className="instance-dashboard-expand-btn">
                              {isExpanded ? "−" : "+"}
                            </button>
                          </div>

                          {/* Expandable details panel – only service hint cards and complete button */}
                          {isExpanded && (
                            <div className="instance-dashboard-stage-details-panel">
                              {stageHintCards.length > 0 && (
                                <div className="instance-dashboard-stage-details-section">
                                  <h4>⚡ Available Services for {stage}</h4>
                                  <div className="instance-dashboard-stage-actions-grid">
                                    {stageHintCards.map((hint, idx) => (
                                      <div
                                        key={idx}
                                        className="instance-dashboard-hint-card"
                                      >
                                        <div className="instance-dashboard-hint-icon">
                                          {hint.icon}
                                        </div>
                                        <h3 className="instance-dashboard-hint-title">
                                          {hint.title}
                                        </h3>
                                        <p className="instance-dashboard-hint-description">
                                          {hint.description}
                                        </p>
                                        {hint.type === "link" && (
                                          <a
                                            href={hint.link}
                                            className="instance-dashboard-hint-btn"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            Access Service
                                          </a>
                                        )}
                                        {hint.type === "button" && (
                                          <button
                                            onClick={hint.action}
                                            className="instance-dashboard-hint-btn"
                                          >
                                            Access Portal
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {status === "current" && (
                                <button
                                  className="instance-dashboard-complete-stage-btn"
                                  onClick={() => handleCompleteStage(stage)}
                                  disabled={completingStage === stage}
                                >
                                  {completingStage === stage
                                    ? "Completing..."
                                    : "✓ Mark as Completed"}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {instanceDetails && (
                <div className="instance-details-container">
                  <InstanceDetails selectedInstance={selectedInstance} />
                </div>
              )}
            </div>
          </div>
        )}

        <CreateInstance
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => fetchInstances()}
        />

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
        {govSupport && <GovSupport onClose={() => setGovSupport(false)} />}

        {fertilizerAdvisory && (
          <FertilizerAdvisory
            selectedInstance={selectedInstance}
            onClose={() => setFertilizerAdvisory(false)}
          />
        )}
        {pestAdvisory && (
          <PestAdvisory
            selectedInstance={selectedInstance}
            onClose={() => setPestAdvisory(false)}
          />
        )}
        {yieldPrediction && (
          <YieldPrediction
            selectedInstance={selectedInstance}
            onClose={() => setYieldPrediction(false)}
          />
        )}

        {smartCropPlaner && (
          <CropPlanManager
            selectedInstance={selectedInstance}
            onClose={() => setSmartCropPlaner(false)}
          />
        )}

        <div className="Logs-button-block">
          <button onClick={()=>setLogsDashboard(true)}>Logs</button>
        </div>
        
        {logsDashboard && <LogsDashboard  onClose={()=>setLogsDashboard(false)} />}

      </div>
    </div>
  );
};

export default InstanceDashboard;
