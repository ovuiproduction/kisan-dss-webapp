import React, { useEffect, useRef } from "react";

export default function FarmerProfileCard({ onClose }) {
    const user = JSON.parse(sessionStorage.getItem("user")) || {};
    const cardRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="profile-card-backdrop">
            <div className="aadhaar-profile-card" ref={cardRef}>
                {/* Card Header */}
                <div className="aadhaar-header">
                    <div className="aadhaar-logo">
                        <div className="logo-circle">🌾</div>
                        <span>Krishi Card</span>
                    </div>
                    <button className="aadhaar-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                {/* Card Body */}
                <div className="aadhaar-body">
                    <div className="aadhaar-photo-section">
                        <div className="aadhaar-photo">
                            <i className="fa-solid fa-user"></i>
                        </div>
                    </div>

                    <div className="aadhaar-details">
                        <div className="aadhaar-row">
                            <span className="aadhaar-label">Name</span>
                            <span className="aadhaar-value">{user.name || "Farmer Name"}</span>
                        </div>

                        <div className="aadhaar-row">
                            <span className="aadhaar-label">Phone</span>
                            <span className="aadhaar-value">{user.phone || "Not provided"}</span>
                        </div>

                        <div className="aadhaar-row">
                            <span className="aadhaar-label">State</span>
                            <span className="aadhaar-value">{user.state || "State"}</span>
                        </div>

                        <div className="aadhaar-row">
                            <span className="aadhaar-label">District</span>
                            <span className="aadhaar-value">{user.district || "District"}</span>
                        </div>

                        <div className="aadhaar-row">
                            <span className="aadhaar-label">Earnings</span>
                            <span className="aadhaar-value earnings">
                                ₹{user.earnings ? user.earnings.toLocaleString() : "0"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className="aadhaar-footer">
                    <div className="aadhaar-number">
                        अन्नदाता सुखी भव
                    </div>
                </div>
            </div>
        </div>
    );
}