import React, { useState,useEffect, useRef } from "react";
import UpdateProfile from "./updateProfile"; 

export default function FarmerProfileCard({ onClose }) {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const user = JSON.parse(sessionStorage.getItem("user")) || {};
    const cardRef = useRef(null);

    return (
        <>
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
                    <button 
                            className="update-profile-btn"
                            onClick={() => setIsUpdateModalOpen(true)}
                        >
                            ✎ Update Profile
                        </button>
                </div>
            </div>
        </div>
        
         <UpdateProfile 
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onSuccess={() => {
                    // Refresh user data in sessionStorage if needed
                    setIsUpdateModalOpen(false);
                }}
            />
            </>
    );
}