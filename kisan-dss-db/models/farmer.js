const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },

    village: { type: String },
    landSize: { type: Number },
    irrigationType: { type: String },
    soilType: { type: String },

    soilHealth: {
        nitrogen: { type: Number },
        phosphorus: { type: Number },
        potassium: { type: Number },
        ph: { type: Number },
        organicCarbon: { type: Number }
    },

    preferredLanguage: { type: String, default: "Marathi" },

    otp:{ type:String },

    coins: { type: Number, default: 0 },

    transactions: [{
        cropName: { type: String },
        quantityBought: { type: Number },
        coinsEarned: { type: Number },
        date: { type: Date, default: Date.now }
    }],

    weatherAdvisory: [{
        advisoryText: { type: String },
        expiryDate: { type: Date }
    }]
});


module.exports = mongoose.model("farmers", farmerSchema);
