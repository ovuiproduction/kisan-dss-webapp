// const mongoose = require("mongoose");

// const farmerSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     phone: { type: String, required: true },
//     state: { type: String, required: true },
//     district: { type: String, required: true },
//     coins: { type: Number, default: 0 } // Earned through crop sales
// });

// module.exports = mongoose.model("Farmer", farmerSchema);


const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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
    ]
});

module.exports = mongoose.model("Farmer", farmerSchema);
