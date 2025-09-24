const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    otp:{type:String},
    // Address Information
    address: {
        Apartment: { type: String, required: true },
        district: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true }
    },

    // Cart (Stores Items Before Checkout)
    cart: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "cropcolls" }, // Refers to crops
            quantity: { type: Number, required: true }
        }
    ],

    // Order History (Stores Completed Purchases)
    order_history: [
        {
            orderId: { type: mongoose.Schema.Types.ObjectId, ref: "cropcolls" }, // Refers to crop purchased
            date: { type: Date, default: Date.now }, // Timestamp of order
            amount_paid: { type: Number, required: true },
            quantity: { type: Number, required: true }
        }
    ]

});

module.exports = mongoose.model("User", userSchema);
