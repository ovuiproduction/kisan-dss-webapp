const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "farmers", // Reference to farmers collection
      required: true,
    },
    email: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    cropname: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price_per_kg: { type: Number, required: true },
    earnings: { type: Number, required: true, default: 0 },
    quantity: { type: Number, required: true },
    unit: { type: String, enum: ["kg"], default: "kg" },
    organic: { type: Boolean, required: true },
    imageBase64: { type: String, required: true },
    rating: {
      average: { type: Number, default: 0 },
      totalRating: { type: Number, default: 0 },
      ratingCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("crops", cropSchema);
