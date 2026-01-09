const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
// const sgMail = require("@sendgrid/mail");
const Mailjet = require("node-mailjet");

const farmerscoll = require("./models/farmer");
const userscoll = require("./models/user");
const cropcolls = require("./models/crop");
const { ObjectId } = require("mongodb");


dotenv.config();
const secretKey = process.env.JWT_SECRET || "your_secret_key";
const MONGODB_URI = process.env.MONGODB_URI;

const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE,
});

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// const nodemailer = require("nodemailer");

const port = 4000;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to Atlas Database kisan-dss-db"))
  .catch((err) => console.error("Database connection error:", err));

// Nodemailer Transporter
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const transporter = nodemailer.createTransport({
//   service: "SendGrid",
//   auth: {
//     user: "apikey",
//     pass: process.env.SENDGRID_API_KEY,
//   },
// });

// transporter.verify((error, success) => {
//   if (error) console.error("SendGrid connection error:", error);
//   else console.log("SendGrid transporter ready");
// });

const sendMail = async (mailOptions) => {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: mailOptions.from,
          Name: "Kisan DSS Portal",
        },
        To: [
          {
            Email: mailOptions.to,
            Name: mailOptions.to_name,
          },
        ],
        Subject: mailOptions.subject,
        TextPart: mailOptions.text,
        HTMLPart:
          `<h2>${mailOptions.otp}</h2><h3>Your OTP is: ${mailOptions.otp}. It will expire in 5 minutes.</h3>`,
      },
    ],
  });
  request
    .then((result) => {
      console.log("OTP sent successfully");
      if(result.body.Messages[0].Status === "success") return 200
      else return 500
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
  // try {
  //   await sgMail.send(mailOptions);
  //   console.log("Email sent successfully");
  // } catch (error) {
  //   console.error("Error sending email:", error);
  //   if (error.response) {
  //     console.error("SendGrid response error:", error.response.body);
  //   }
  // }
};

app.get("/", (req, res) => {
  res.send(
    "This is the backend server for Kisan-DSS application. Manages farmers, users, and crops efficiently!"
  );
});

// Farmer Signup
app.post("/signup-farmer", async (req, res) => {
  try {
    const { name, email, state, district, phone } = req.body;

    let user = await farmerscoll.findOne({ email });
    if (user) return res.status(400).json({ message: "Farmer already exists" });
    user = new farmerscoll({ name, email, phone, state, district });
    await user.save();
    res.status(201).json({ message: "Farmer Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// User Signup
app.post("/signup-user", async (req, res) => {
  try {
    const { name, email, phone, Apartment, district, state, pincode } =
      req.body;

    // Check if user already exists
    let user = await userscoll.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Create new user with correct schema structure
    user = new userscoll({
      name,
      email,
      phone,
      address: {
        Apartment, // Correctly stored under `address`
        district,
        state,
        pincode,
      },
      cart: [], // Initialize cart as empty array
      order_history: [], // Initialize order history as empty array
    });

    // Save user to DB
    await user.save();

    res.status(201).json({ message: "User signup successful" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Generate Random 6-Digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Request OTP
app.post("/request-otp-user", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userscoll.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Generate OTP & Store in DB
    let otp = generateOTP();
    user.otp = otp;
    await user.save();

    // Send OTP via Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      to_name:user.name,
      otp:otp,
      subject: `Kisan DSS Portal Login OTP`,
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    };

    let response = await sendMail(mailOptions);
    if(response==200){
      res.status(200).json({ message: "OTP sent successfully" });
    }else{
      res.status(500).json({ message:"Error sending OTP"});
    }
  } catch (err) {
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
});

app.post("/verify-otp-user", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userscoll.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear OTP after successful login
    user.otp = null;
    await user.save();

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      secretKey,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: err.message });
  }
});

app.post("/request-otp-farmer", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await farmerscoll.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Generate OTP & Store in DB
    let otp = generateOTP();
    user.otp = otp;
    await user.save();

    // Send OTP via Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      to_name:user.name,
      otp:otp,
      subject: `Kisan DSS Portal Login OTP`,
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    };

    console.log("Sending OTP email to:", email);

    await sendMail(mailOptions);

    console.log("OTP email sent successfully");
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
});

app.post("/verify-otp-farmer", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await farmerscoll.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear OTP after successful login
    user.otp = null;
    await user.save();

    // Generate JWT Token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
        email: user.email,
        state: user.state,
        phone: user.phone,
        district: user.district,
        coins: user.coins,
      },
      secretKey,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: err.message });
  }
});

app.get("/farmer-profile", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const farmer = await farmerscoll.findOne({ email });
    if (!farmer) return res.status(404).json({ error: "Farmer not found" });

    res.json(farmer);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Post Crop (Base64 Image Storage)
app.post("/postcrop", async (req, res) => {
  try {
    const {
      farmerId,
      email,
      state,
      district,
      cropname,
      description,
      category,
      price_per_kg,
      quantity,
      organic,
      image,
    } = req.body;

    console.log(farmerId);
    const farmer = await farmerscoll.findById(farmerId);
    if (!farmer) {
      return res.status(400).json({
        status: "error",
        message: "Invalid farmerId, farmer does not exist",
      });
    }

    if (!image) {
      return res
        .status(400)
        .json({ status: "error", message: "Image is required" });
    }

    const newCrop = new cropcolls({
      farmerId,
      email,
      state,
      district,
      cropname,
      description,
      category,
      price_per_kg,
      quantity,
      unit: "kg",
      organic,
      imageBase64: image, // Store image as Base64
    });

    await newCrop.save();
    res.status(200).json({ status: "ok", message: "Crop posted successfully" });
  } catch (error) {
    console.error("Error saving crop:", error);
    res.status(500).json({ status: "error", message: "Error saving crop" });
  }
});

// Retrieve Image (Base64)
app.get("/image/:id", async (req, res) => {
  try {
    const crop = await cropcolls.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop not found" });

    res.json({ image: crop.imageBase64 });
  } catch (error) {
    console.error("Error retrieving image:", error);
    res.status(500).json({ message: "Error retrieving image" });
  }
});

app.get("/active-crops", async (req, res) => {
  try {
    console.log("Active crops request arrived");
    const { email } = req.query; // Extract email from query params

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Fetch crops where email matches and quantity > 0
    const crops = await cropcolls.find(
      { email: email, quantity: { $gt: 0 } },
      {
        cropname: 1,
        price_per_kg: 1,
        quantity: 1,
        imageBase64: 1,
        earnings: 1,
        "rating.average": 1,
      } // Select only required fields
    );

    console.log("Fetched Crops:", crops);
    res.json(crops); // Directly send the crops with Base64 image
  } catch (error) {
    console.error("Error fetching active crops:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/delete-crop/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting crop with ID:", id);

    const deletedCrop = await cropcolls.findByIdAndDelete(id);

    if (!deletedCrop) {
      return res.status(404).json({ error: "Crop not found" });
    }

    res.status(200).json({ message: "Crop deleted successfully" });
  } catch (error) {
    console.error("Error deleting crop:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/history-crops", async (req, res) => {
  try {
    console.log("history crops request arrived");
    const { email } = req.query; // Extract email from query params

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Fetch crops where email matches and quantity > 0
    const crops = await cropcolls.find(
      { email: email, quantity: 0 },
      {
        cropname: 1,
        price_per_kg: 1,
        quantity: 1,
        imageBase64: 1,
        earnings: 1,
        "rating.average": 1,
      } // Select only required fields
    );

    console.log("Fetched Crops:", crops);
    res.json(crops); // Directly send the crops with Base64 image
  } catch (error) {
    console.error("Error fetching active crops:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/farmers/:farmerId/transactions", async (req, res) => {
  try {
    const { farmerId } = req.params;
    console.log("Received request for farmer ID:", farmerId);

    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      console.error("Invalid Farmer ID format:", farmerId);
      return res.status(400).json({ message: "Invalid Farmer ID format" });
    }

    const farmer = await farmerscoll.findById(farmerId);

    if (!farmer) {
      console.error("Farmer not found with ID:", farmerId);
      return res.status(404).json({ message: "Farmer not found" });
    }

    // Ensure transactions have the required fields
    const transactions = farmer.transactions.map((txn) => ({
      cropName: txn.cropName || "Unknown Crop", // Correct field name
      quantityBought: txn.quantityBought || 0, // Correct field name
      coinsEarned: txn.coinsEarned || 0, // Correct field name
      transactionDate: txn.date ? new Date(txn.date).toISOString() : "N/A", // Ensure proper date format
    }));

    console.log("Formatted Transactions:", transactions);
    res.json({ transactions });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/user-profile", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const user = await userscoll.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get crops by category or search term
app.get("/crops", async (req, res) => {
  try {
    const { search } = req.query;
    let query = { quantity: { $gt: 0 } }; // Ensure only crops with quantity > 0 are fetched

    if (search) {
      query.$or = [
        { cropname: { $regex: search, $options: "i" } }, // Search by crop name
        { category: { $regex: search, $options: "i" } }, // Search by category
      ];
    }

    const crops = await cropcolls.find(query);
    res.json(crops);
  } catch (err) {
    res.status(500).json({ message: "Error fetching crops" });
  }
});

app.post("/add-to-cart", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const user = await userscoll.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update cart using findByIdAndUpdate
    await userscoll.findByIdAndUpdate(userId, {
      $push: { cart: { productId, quantity } },
    });

    res.json({ message: "Added to cart successfully!" });
  } catch (err) {
    console.error("Error adding to cart:", err); // Log error details
    res.status(500).json({ message: "Error adding to cart" });
  }
});

app.get("/cart", async (req, res) => {
  try {
    console.log("Cart fetch request arrived");
    const { userId } = req.query;
    const user = await userscoll.findById(userId).populate("cart.productId");

    if (!user) return res.status(404).json({ message: "User not found" });
    // console.log(user.cart);
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart items", error });
  }
});

app.delete("/cart/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await userscoll.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter((item) => !item.productId.equals(productId)); // Remove item
    await user.save();

    res.json({
      message: "Item removed from cart successfully",
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Error removing from cart", error });
  }
});

app.post("/cart/buy", async (req, res) => {
  console.log("Before try in buy");
  try {
    const { userId, productId, rating } = req.body;
    console.log("Buy request arrived, rating received:", rating);

    // Fetch user and populate cart items
    const user = await userscoll.findById(userId).populate("cart.productId");
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    // console.log("User found:", user);

    // Find the specific cart item
    const cartItem = user.cart.find(
      (item) => item.productId._id.toString() === productId
    );
    if (!cartItem) {
      console.log("Item not found in cart");
      return res.status(400).json({ message: "Item not found in cart" });
    }
    // console.log("Cart item found:", cartItem);

    const crop = await cropcolls.findById(productId);
    if (!crop || crop.quantity < cartItem.quantity) {
      console.log("Insufficient stock or crop not found");
      return res.status(400).json({
        message: `Insufficient stock for ${
          crop ? crop.cropname : "Unknown Crop"
        }`,
      });
    }
    // console.log("Crop found:", crop);
    console.log("Farmer ID from crop:", crop?.farmerId);

    // Calculate price and update stock
    const amountPaid = cartItem.quantity * crop.price_per_kg;
    crop.quantity -= cartItem.quantity;

    crop.earnings += amountPaid;

    if (
      !cartItem.quantity ||
      isNaN(cartItem.quantity) ||
      cartItem.quantity <= 0
    ) {
      console.log("Error: Invalid cart item quantity!");
      return res.status(400).json({ message: "Invalid cart item quantity" });
    }

    console.log("Cart Item Quantity (Confirmed Valid):", cartItem.quantity);

    // Push the order history correctly
    user.order_history.push({
      orderId: productId,
      amount_paid: amountPaid,
      quantity: Number(cartItem.quantity), // Convert to number explicitly
    });

    // Update rating
    if (rating && rating >= 1 && rating <= 5) {
      // Ensure valid rating
      console.log("Updating rating...");
      crop.rating.totalRating += rating; // Add the given rating
      crop.rating.ratingCount += 1; // Increment rating count
      crop.rating.average = crop.rating.totalRating / crop.rating.ratingCount; // Recalculate average rating
      console.log("Updated rating:", crop.rating);
    } else {
      console.log("Invalid rating received:", rating);
    }

    await crop.save();
    console.log("Crop saved successfully");

    // Update farmer's coins
    const farmer = await farmerscoll.findById(crop.farmerId);
    if (!farmer) {
      console.log("Farmer not found");
      return res
        .status(400)
        .json({ message: "Farmer not found for this crop" });
    }

    await farmerscoll.findByIdAndUpdate(crop.farmerId, {
      $inc: { coins: amountPaid },
    });
    console.log("Farmer coins updated");

    // Add transaction record to the farmer's transactions array
    await farmerscoll.findByIdAndUpdate(crop.farmerId, {
      $push: {
        transactions: {
          cropName: crop.cropname, // Correct field name
          quantityBought: cartItem.quantity, // Correct field name
          coinsEarned: amountPaid, // Correct field name
          date: new Date(), // Ensure timestamp is added
        },
      },
    });

    // Remove purchased item from cart
    user.cart = user.cart.filter(
      (item) => item.productId._id.toString() !== productId
    );
    await user.save();
    console.log("User cart updated successfully");

    res.json({
      message: "Purchase successful!",
      amountPaid,
      newRating: crop.rating.average,
    });
  } catch (error) {
    console.error("Error processing purchase:", error);
    res
      .status(500)
      .json({ message: "Error processing purchase", error: error.message });
  }
});

app.get("/order-history", async (req, res) => {
  try {
    console.log("Fetching order history...");
    const { userId } = req.query;

    // ✅ Check if userId is provided
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await userscoll
      .findById(userId)
      .populate("order_history.orderId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      order_history: user.order_history.map((order) => ({
        orderId: order.orderId?._id, // Order ID
        imageBase64: order.orderId?.imageBase64,
        cropname: order.orderId?.cropname, // Crop Name
        category: order.orderId?.category, // Crop Category
        price_per_kg: order.orderId?.price_per_kg, // Crop Price
        quantity: order.quantity, // Quantity Purchased
        total_price: order.amount_paid, // Total Paid Amount
        date: order.date, // Order Date
      })),
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ message: "Error fetching order history", error });
  }
});

app.get("/api/users/:userId/transactions", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find user and populate the crop details from cropcolls
    const user = await userscoll.findById(userId).populate({
      path: "order_history.orderId",
      select: "cropname", // Fetch only the crop name
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Mapping transactions with populated crop details
    const transactions = user.order_history.map((order) => ({
      cropname: order.orderId ? order.orderId.cropname : "Unknown",
      quantity: order.quantity,
      amount_paid: order.amount_paid,
      transaction_date: order.date,
    }));

    res.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

async function runChat(userInput) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY); // or replace with your actual API_KEY string

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 1000,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // Create a chat session with system instruction
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: `
You are AgriBot, an advanced agriculture assistant specializing in market intelligence, crop insights, and direct market access for farmers in Maharashtra.

Focus only on:
1. APMC crop prices from Agmarknet.
2. Top crops grown in districts.
3. Profitable crop suggestions based on region.
4. Crop selling guidance.
5. Crop-specific advisory.

Ignore all unrelated topics. Default to Maharashtra unless a different state is mentioned.
`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Hello! I'm AgriBot, your agriculture assistant. How can I help you today?",
            },
          ],
        },
      ],
    });

    const result = await chat.sendMessage(userInput);
    const response = result.response;
    // console.log("AI chatbot response:", response.text());
    return response.text();
  } catch (error) {
    console.error("Error in AI chatbot:", error);
    return "Sorry, I couldn't process your request.";
  }
}

// ✅ API: Chatbot with Multilingual Support
app.post("/chat", async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    if (!userInput) {
      return res.status(400).json({ error: "Invalid request body" });
    }
    const chatbotResponse = await runChat(userInput);
    res.json({ response: chatbotResponse });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/update-weather-advisory", async (req, res) => {
  try {
    const { advisoryText, expiryDate, userId } = req.body;
    // Validate input
    if (!userId || !advisoryText || !expiryDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await farmerscoll.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Initialize array if not present
    if (!user.weatherAdvisory) {
      user.weatherAdvisory = [];
    }

    // Push new advisory
    user.weatherAdvisory.push({ advisoryText, expiryDate });

    await user.save();

    return res.status(200).json({
      message: "Weather advisory updated successfully",
      weatherAdvisory: { advisoryText, expiryDate },
    });
  } catch (error) {
    console.error("Error updating weather advisory:", error);
    res.status(500).json({
      message: "Error updating weather advisory",
      error: error.message,
    });
  }
});

app.get("/get-weather-advisory", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "User ID required" });

    const user = await farmerscoll.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.weatherAdvisory || user.weatherAdvisory.length === 0) {
      return res.status(200).json({
        message: "No weather advisory set for this user",
        weatherAdvisory: null,
      });
    }

    const lastAdvisory = user.weatherAdvisory[user.weatherAdvisory.length - 1];

    return res.status(200).json({
      message: "Weather advisory fetched successfully",
      weatherAdvisory: lastAdvisory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching weather advisory",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(
    `This is the backend server for Kisan-DSS application. Manages farmers, users, and crops efficiently!`
  );
});
