const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
      index: true,
    },
    query: {
      type: String,
      required: true,
    },
    response: {
      type: String, // can be plain text or JSON string
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // adds updatedAt as well
);

module.exports = mongoose.model('Log', LogSchema);