import React, { useState, useEffect } from "react";
import { fetch_logs_api } from "./apis_db";
import "../css/LogsDashboard.css";

const LogsDashboard = ({ onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const farmerId = JSON.parse(localStorage.getItem("user"))?._id || null;

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetch_logs_api(farmerId);
      setLogs(data);
    } catch (err) {
      console.error("Fetch logs error:", err);
      setError(err.message || "Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (farmerId) fetchLogs();
  }, [farmerId]);

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const deepParseJSON = (data) => {
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        return deepParseJSON(parsed); // parse again if nested
      } catch {
        return data; // normal string
      }
    }

    if (Array.isArray(data)) {
      return data.map(deepParseJSON);
    }

    if (typeof data === "object" && data !== null) {
      const result = {};
      for (const key in data) {
        result[key] = deepParseJSON(data[key]);
      }
      return result;
    }

    return data;
  };

  const prettyPrint = (value) => {
    if (!value) return "—";

    const cleaned = deepParseJSON(value);

    return JSON.stringify(cleaned, null, 2);
  };

  return (
    <div className="logs-dashboard-overlay" onClick={onClose}>
      <div
        className="logs-dashboard-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="logs-dashboard-header">
          <h2>📜 AI Interaction Logs</h2>
          <button className="logs-dashboard-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="logs-dashboard-toolbar">
          <button
            className="logs-dashboard-refresh-btn"
            onClick={fetchLogs}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "🔄 Refresh"}
          </button>
        </div>

        {loading && (
          <div className="logs-dashboard-loading">
            <div className="spinner"></div>
            <p>Loading logs...</p>
          </div>
        )}

        {error && (
          <div className="logs-dashboard-error">
            <p>❌ {error}</p>
            <button onClick={fetchLogs}>Retry</button>
          </div>
        )}

        {!loading && !error && logs.length === 0 && (
          <div className="logs-dashboard-empty">
            <p>No logs found for this farmer.</p>
          </div>
        )}

        {!loading && !error && logs.length > 0 && (
          <div className="logs-dashboard-list">
            {logs.map((log) => (
              <div key={log._id} className="logs-dashboard-card">
                <div className="logs-dashboard-card-header">
                  <span className="logs-dashboard-date">
                    {formatDate(log.createdAt)}
                  </span>
                  <span className="logs-dashboard-id">
                    ID: {log._id.slice(-6)}
                  </span>
                </div>

                <div className="logs-dashboard-query">
                  <span className="logs-dashboard-label">📤 Query:</span>
                  <pre className="logs-dashboard-content">
                    {prettyPrint(log.query)}
                  </pre>
                </div>

                <div className="logs-dashboard-response">
                  <span className="logs-dashboard-label">📥 Response:</span>
                  <pre className="logs-dashboard-content">
                    {prettyPrint(log.response)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsDashboard;
