const mongoose = require("mongoose");

const cropInstanceSchema = new mongoose.Schema({
  // ---------- Core Instance Info ----------
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmer",
    required: true,
  },

  instanceName: {
    type: String,
    required: true,
  },

  cropName: {
    type: String,
    // Not required – can be empty for Planning stage
  },

  season: {
    type: String, // Kharif / Rabi / Summer
    required: true,
  },

  landUsed: {
    type: Number, // acres
    required: true,
  },

  // 📍 Snapshot of farmer's location at creation
  localitySnapshot: {
    state: String,
    district: String,
    village: String,
  },

  // 🌱 Snapshot of farmer's soil data at creation
  soilSnapshot: {
    soilType: String,
    nitrogen: String,
    phosphorus: String,
    potassium: String,
    ph: Number,
    organicCarbon: Number,
  },

  irrigationType: String,

  initialPlan:{
    recommended_crop: String,
    crop_recommendation_reasoning: String,
    complete_crop_plan: {
      seed_selection: String,
      sowing_plan: String,
      expected_yield: String,
      expected_expenditure: String,
  }},
  // ---------- Stage Tracking ----------
  currentStage: {
    type: String,
    enum: ["Planning", "Sowing", "Cultivation", "Harvesting", "Selling", "Completed"],
    default: "Planning",
  },

  currentStageEnteredAt: {
    type: Date,
    default: Date.now,
  },


  completedStages: [
    {
      stage: String,
      completedAt: { type: Date, default: Date.now },
    },
  ],

  // ---------- Status ----------
  isActive: {
    type: Boolean,
    default: true,
  },

  completedAt: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CropInstance", cropInstanceSchema);