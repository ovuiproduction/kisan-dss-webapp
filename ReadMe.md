# 🌾 Kisan-DSS (Decision Support System)
## Empowering Farmers to Make the Right Decisions

### [Demo](https://youtu.be/3V9oge3-8Q8)

--- 

### Deployment Details

#### Kisan DSS Frontend

#### Code Link : https://github.com/ovuiproduction/kisan-dss-webapp

### Deployed Link : https://kisan-dss-portal.netlify.app/

### Platform : Netlify

----

#### Kisan DSS Node Backend

#### Code Link : https://github.com/ovuiproduction/kisan-dss-webapp

### Server Deployed Link  : https://kisan-dss-db.onrender.com

### Platform : Render

### Database Deployment Platform : MongoDB Atlas

---

#### Kisan DSS Flask Backend

#### Code Link : https://huggingface.co/spaces/onkar-waghmode/Kisan-DSS/tree/main

### Deployed Link : https://onkar-waghmode-kisan-dss.hf.space

### Platform : HuggingFace spaces

---

## ✅ System Addresses Key Farmer Questions

👨‍🌾 **What to sow?** 🌱  
👩‍🌾 **How to grow?** 🚜💧🌾  
👨‍🌾 **When to harvest?** ⏱️🌤️🌾  
👩‍🌾 **Where to sell?** 📦🛒📈  


## 🌾 Key Capabilities of Kisan-DSS

### ✅ Smart Crop Selection  
Based on rainfall, temperature, soil conditions & profit predictions  

---

### ✅ Weather-Smart Cultivation Guidance  
Actionable location-based advisories to reduce crop loss & improve yield  

---

### ✅ Government Scheme Detection  
Automatic identification of subsidies and farmer-benefit programs  

---

### ✅ Harvest Timing Optimization  
Combining price trends & climate forecasts to pick the ideal harvesting window  

---

### ✅ Smart Selling & Market Intelligence  
Compare mandi prices, transport costs & storage to choose the most profitable market  

---

### ✅ Voice-Assisted Multilingual Chatbot  
AI-driven farmer assistant in regional languages for accessible guidance  

---

## 🌍 Impact Vision

Empowering **small & marginal farmers** with the same intelligence and insights available to agri-corporates —  
in their **own language**, through **simple voice-based interaction**.

From **what to sow** to **where to sell**, Kisan-DSS brings **AI to the farm gate**,  
enabling farmers to **grow smarter, sell better, and earn more**.

---

### 🧠 Technology Stack

#### ⚙️ Backend
- **Flask / FastAPI (Python)** for AI logic & APIs  
- **Node.js & Express** for authentication & user services  
- **MongoDB** for storing user profiles, crop data, and market insights  

#### 🎯 AI & Machine Learning
- **Python, Scikit-Learn, Pandas, NumPy** for data processing & ML  
- **ML models** for price & profitability prediction  
- **Gemini API** for conversational AI & decision support  

#### 🌐 Frontend
- **React.js UI** with voice interface  
- **Bootstrap & CSS** for responsive & user-friendly design  

#### 🌍 External Integrations & APIs
- **OpenWeather API** for real-time & forecast-based advisories  
- **OSRM API** for transportation & logistics optimization  
- **Government schemes & agri-data APIs** for policy & market info  
- **Web Speech API** for audio and voice to text conversion

---
  
### 📂 Folder Structure
```bash
Kisan-DSS/
├── LICENSE
├── node_requirements_backend.txt
├── node_requirements_frontend.txt
├── pip_requirements_backend.txt
├── README.md
│
├── Backend-Flask/
│   ├── app.py
│   └── models/
│       ├── cropyield/
│       ├── MarketPrice/
│       ├── Rainfall/
│       ├── Temperature/
│       └── WPI/
│
├── Backend-Node/
│   ├── package.json
│   ├── server.js
│   └── models/
│       ├── crop.js
│       ├── farmer.js
│       └── user.js
│
└── Frontend/
    ├── package.json
    ├── public/
    │   ├── _redirects
    │   ├── index.html
    │   └── site.webmanifest
    └── src/
        ├── app.js
        ├── index.js
        ├── components/
        │   ├── ActiveCrops.jsx
        │   ├── Alert.jsx
        │   ├── apis_db.jsx
        │   ├── apis_ml.jsx
        │   ├── AuthComponent.jsx
        │   ├── AuthRedirect.js
        │   ├── axiosConfig.js
        │   ├── ChatBot.jsx
        │   ├── CoverPage.jsx
        │   ├── CropHistory.jsx
        │   ├── FarmerAdminDashboard.jsx
        │   ├── FarmerDashBoard.jsx
        │   ├── FarmerProfile.jsx
        │   ├── FarmerProfileCard.jsx
        │   ├── HelpModal.jsx
        │   ├── IntelCropRecommendationForm.jsx
        │   ├── IntelCropRecResult.jsx
        │   ├── IntelCultivationGuide.jsx
        │   ├── IntelCultivationPractices.jsx
        │   ├── IntelGovMarketForm.jsx
        │   ├── IntelGovMarketPrice.jsx
        │   ├── IntelGovScheme.jsx
        │   ├── IntelLocalMarket.jsx
        │   ├── IntelLocalMarketForm.jsx
        │   ├── LoginFarmer.jsx
        │   ├── LoginUser.jsx
        │   ├── MyCart.jsx
        │   ├── MyOrders.jsx
        │   ├── PostCrop.jsx
        │   ├── ProtectedRoute.js
        │   ├── SignupFarmer.jsx
        │   ├── SignupUser.jsx
        │   ├── SpeakMessages.jsx
        │   ├── TransactionHistory.jsx
        │   ├── UserAdminDashboard.jsx
        │   ├── UserDashboard.jsx
        │   ├── UserProfile.jsx
        │   └── UserTransactions.jsx
        ├── css/
        │   ├── ActiveCrops.css
        │   ├── Alert.css
        │   ├── auth.css
        │   ├── chatbot.css
        │   ├── CoversPage.css
        │   ├── CropDistribution.css
        │   ├── CropHistory.css
        │   ├── cropSubmitForm.css
        │   ├── cultivationGuide.css
        │   ├── FarmerAdminDashboard.css
        │   ├── FarmerProfile.css
        │   ├── HelpModal.css
        │   ├── HomeFarmer.css
        │   ├── HomeUser.css
        │   ├── MyCart.css
        │   ├── MyOrders.css
        │   ├── NewPost.css
        │   ├── PostCrop.css
        │   ├── Services.css
        │   ├── SowingGuide.css
        │   ├── style.css
        │   ├── TransactionHistory.css
        │   ├── UserAdminDashboard.css
        │   ├── UserDashboard.css
        │   └── UserProfile.css
        ├── static/
        │   ├── CropImages/
        │   ├── css/
        │   │   ├── farmer_dashboard.css
        │   │   ├── intel_gov_market_form.css
        │   │   ├── intel_gov_market_price.css
        │   │   ├── intel_local_market.css
        │   │   ├── intel-crop-rec-result.css
        │   │   ├── intel-crop-rec.css
        │   │   ├── intel-crop-reccomandation.css
        │   │   └── intel-gov-scheme.css
        │   └── images/
        └── Training video/

```
---

### 🏗️ Installation & Setup

#### 1️⃣ Clone the Repository & Enviroment varible setup

```bash
git clone https://github.com/shripad19/Kisan-DSS.git
cd Kisan-DSS
```

#### Enviromental Variable Setup
##### Backend (Flask)
```bash
GEMINI_API_KEY = "<your api key>"
DAILY_FUEL_DATA_KEY = "<your api key>"
OPENWEATHERMAP_API_KEY = "<your api key>"
```
**DAILY_FUEL_DATA_KEY**
[Generate API Key](https://rapidapi.com/mi8y-mi8y-default/api/daily-petrol-diesel-lpg-cng-fuel-prices-in-india)

**OPENWEATHERMAP_API_KEY**
[Generate API Key](https://openweathermap.org/)

---

##### Backend (Node)
```bash
JWT_SECRET="mySuperSecretKey123!@#"
EMAIL_USER="<your email>"
GEMINI_API_KEY="<your api key>"
MONGODB_URI="<mongodb url>"
SENDGRID_API_KEY="<sendgrid api key>"
```
**SENDGRID_API_KEY**
[Generate API Key](https://sendgrid.com/en-us/solutions/email-api)

---


#### 2️⃣ Backend (Flask) Setup
```bash
cd Backend-Flask
pip install -r pip_requirements_backend.txt
python app.py
```
#### 3️⃣ Backend (Node.js) Setup
```bash
cd Backend-Node
npm install
node server.js
```
#### 4️⃣ Frontend (React.js) Setup
```bash
cd Frontend
npm install
npm start
```

## LICENSE
This project is licensed under the [MIT License](https://github.com/ovuiproduction/Kisan-DSS/blob/main/LICENSE).  
