const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    otp:{type:String},
    coins: { type: Number, default: 0 }, // Earned through crop sales
    transactions: [ 
        {
            cropName: { type: String, required: true },
            quantityBought: { type: Number, required: true },
            coinsEarned: { type: Number, required: true },
            date: { type: Date, default: Date.now } // Timestamp for the transaction
        }
    ],
    weatherAdvisory: [{
        advisoryText: { type: String },
        expiryDate: { type: Date, default: Date.now },
    }]
});

module.exports = mongoose.model("farmers", farmerSchema);
