from openai_utility import get_structured_output
from openai_utility import get_structured_output_vision

# from gemini_utility import get_structured_output
# from gemini_utility import get_structured_output_vision

def farmer_scheme_recommendation(farmer_profile,language):
    prompt = f"""
    Act as an expert Indian agriculture and government policy assistant.

    You are given a farmer's profile collected through a form.
    Using this information, identify and recommend ONLY those Indian government schemes
    for which the farmer is most likely eligible and which directly match the farmer’s stated need.

    Farmer Profile:
    - State:
    - District:
    - Village / Taluka:
    - Landholding size (in acres or hectares):
    - Type of land (irrigated / rainfed / mixed):
    - Ownership status (owner / tenant / sharecropper):
    - Primary crops grown:
    - Crop category (food grains / horticulture / plantation / cash crops):
    - Farming season (Kharif / Rabi / Zaid / perennial):
    - Purpose for seeking schemes (seeds / plantation / equipment / irrigation / loan / income support / insurance / multiple):
    - Farmer category (small / marginal / medium / large):
    - Bank account available (yes/no):
    - Aadhaar available (yes/no):
    - Kisan Credit Card status (yes/no):

    Task:
    1. Filter and shortlist ONLY relevant central and state government schemes applicable to this farmer.
    2. Prioritize schemes that directly match the farmer’s stated purpose.
    3. For each recommended scheme, provide:
    • Official scheme name  
    • Whether it is Central or State scheme  
    • Why the farmer is eligible (mapped to their inputs)  
    • Benefits provided (amount / subsidy %)  
    • Exact eligibility conditions  
    • How and where to apply (state-specific portal or office)  
    • Required documents (customized to this farmer)  
    • Application window or timing (if seasonal)  
    4. If a scheme has state-specific variations, mention the version applicable to the given state.
    5. If the farmer is NOT eligible for a popular scheme, clearly explain why.
    6. Provide practical next steps the farmer should take immediately.

    Output Requirements:
    - Use simple, non-technical language.
    - Present results as a prioritized list.
    - Highlight the “Best 3 Schemes” at the top.
    - Ensure information is accurate for the given state and district.

    Response Format:
    **Scheme Name**: [Official name
    - **Type**: [Central/State]  
    - **Eligibility Reason**: [Mapped to farmer inputs]  
    - **Benefits**: [Amount / Subsidy %]  
    - **Eligibility Conditions**: [Exact conditions]  
    - **Application Process**: [How & where to apply]  
    - **Required Documents**: [Customized list]  
    - **Application Timing**: [Window/season]
    like this for each recommended scheme.
    
    Farmer Profile Details:
    {farmer_profile}
    
    Respond strictly in {language}.
    No any additional commentary outside the response format.
    No any voage words or explanations.
    """
    
    response = get_structured_output(prompt,'gemini')
    return response

def analyze_crop_image(image, language="English"):
    
    image = image.convert("RGB")
    
    print("Analyzing image for crop disease/pest...")
    
    prompt = f"""
        You are an expert Agricultural Scientist specialized in Indian farming and Integrated Pest Management (IPM).
        Analyze the provided image of the crop and provide a detailed report in {language}.

        ### Analysis Task:
        1. **Visual Observation**: Describe what you see (e.g., spots, wilting, powder, holes, or discoloration).
        2. **Identification**: Name the most likely disease, pest, or nutrient deficiency.
        3. **Organic Remedies (Priority)**: List natural treatments (e.g., Neem oil, Dashparni ark, crop rotation).
        4. **Safe Chemical Intervention**: If the damage looks severe, suggest safe, generic chemical categories (e.g., "Copper-based fungicide") without mentioning specific commercial brand names or exact toxic dosages.
        5. **Cultural Practices**: Suggest changes in watering, sunlight, or spacing.

        ### Response Format (Strictly in {language}):
        🌱 **पीक समस्या (Possible Issue):** [Name of disease/pest]
        🔍 **लक्षणे (Symptoms):** [Simple description of what is happening]
        🌿 **सेंद्रिय उपाय (Organic Remedies):** [Natural solutions first]
        🧪 **सुरक्षित रासायनिक उपाय (Safe Chemical Steps):** [Generic, safe chemical advice if needed]
        🚧 **प्रतिबंधात्मक उपाय (Prevention):** [How to stop it from returning]
        📢 **महत्वाची सूचना (Advisory):** [Advice to consult a local expert]
        """

    response = get_structured_output_vision(prompt, image)
    return response

def getCropSelectionConclusion(IntelCropData,IntelExpenditureData,Nitrogen,Potassium,Phosphorus,soilColor,pH):
    Prompt = f"""
        You are an expert in crop selection. I will provide you with data that includes:
        The expected total price and yield for various crops.
        Meteorological and soil data relevant to crop growth.
        Based on this data, suggest the most profitable crop that is also suitable for the given soil conditions.
        
        Price and yield data : {IntelCropData},
        Expenditure data : {IntelExpenditureData},
        Nitrogen : {Nitrogen},
        Potassium : {Potassium},
        Phosphorus : {Phosphorus},
        soilColor : {soilColor},
        pH : {pH}
        
        Output Format: JSON
        suggested_crop
        reasoning
        
        In output only suggested crop and reasoning no any desclaimers or voage statements.
    """
    response = get_structured_output(Prompt,'gemini')
    return response

# Market price prediction
def getMahaAnnualRainfall(year, district):
    prompt = f"""Based on historical rainfall data and climatic patterns in Maharashtra, 
                predict the **annual rainfall** for the year {year} in the district of {district}.
                
                - Use previous rainfall data trends for the district and Maharashtra state to make the prediction.
                - Consider typical rainfall ranges:
                    - **January to May**: Typically dry, with rainfall between **0 mm to 100 mm**.
                    - **June to September (Monsoon Season)**: Heavy rainfall, ranging from **500 mm to 1500 mm**, with the peak usually in **July**.
                    - **October to December**: Moderate rainfall, between **50 mm to 300 mm**.
                - Output the **annual rainfall in millimeters (mm)**.
                - Ensure the rainfall value is realistic and falls within the typical ranges for the region.
                - Provide only the **rainfall value** in **JSON format**, without any explanation or additional text.
                
                ### Expected output format:
                {{ "rainfall": 750.5 }}
                
                - The rainfall value should be a **positive floating-point number** (e.g., 1200.5) representing millimeters (mm).
                - Example: 
                {{ "rainfall": 850.2 }}
                """
    rainfall = get_structured_output(prompt,'openai')
    return rainfall['rainfall']

# WPI prediction
def getIndiaRainfallMonthly(year, month):
    prompt = f"""Analyze historical rainfall patterns in India and predict the expected rainfall 
                for the year {year} and month {month}. Base your prediction on past trends 
                and ensure the value aligns with India's typical rainfall range.
                
                - The normal range for India's monthly rainfall varies between **10 mm to 400 mm**,
                  except in extreme monsoon months (June-September), where it can reach **800 mm max**.  
                - Ensure the prediction reflects realistic values based on IMD historical data.  
                  
                The response should only contain a **valid JSON object** with the following format:
                {{ "rainfall": <number> }} 
                
                ### Example output format:  
                {{ "rainfall": 154.5 }}  
                """
    rainfall = get_structured_output(prompt,'openai')
    return rainfall['rainfall']

# market selection guide
def getMarketSelectionConclusion(MarketData,cropyield,transportation_data,sourceDistrict):
    Prompt = f"""
            You are expert in market selection i will provide you the market and the crop prices in that market.
            your job is to guide the farmer to decide the market which gives highest profit.
            On the basis of crop price in that market and the transportation cost required to reach that market.
            Total net Profit = (cropyield * marketprice) - trasportationcost
            so you need to use this equation to get the net profit. 
            According to this net profit suggest the market that provide max profit.
            
            cropyield : {cropyield}
            marketData : {MarketData}
            transportationData : {transportation_data}
            sourceDistrict : {sourceDistrict}
            
            output format : JSON
            suggested_market : <market> <price in that market> ₹/Qtl
            reasoning : explain why and how the suggested market gives the max profit.
            
            In output no any desclaimers or voage statements. in output Do not return marketData or transprotation data just return suggested_market reasoning.
            output must be in json format.
    """
    response = get_structured_output(Prompt,'gemini')
    return response

# guide for which option to choose
def getSellingDecision(Commodity,highestLocalMarketPrice,localMarketName,districtName,govMarketPrice,storageAvailability):
    prompt = f"""
            Assume that you are the farmer guide , guiding farmer to sell their product. now for farmer he have a three choices to sell their product 
            
            1. goverment market
            2. Local Market
            3. Direct selling to customers
            
            now I will provide you the prices in goverment markets , local markets and if farmer choose third option then it is sure that it will get the max profit. as in markets the prices are decided by middle man but in third option price is decided by farmer himself.but for third option problem is storage , if farmer go for third option then he should have the storage Avalability. so always third option is not max profitable you also need to consider the commodity as some commodities cannot stored for long time so in that case 3rd option is not helpful.So consider all possibilites and guide the farmer.
            
            ### Data
            Commodity : {Commodity}
            highestLocalMarketPrice : {highestLocalMarketPrice} ,
            Local Market Name where price is highest :{ localMarketName} ,
            District of local Market Where price is highest : {districtName}
            govMarketPriceMax : {govMarketPrice[2]} ,
            govMarketPriceMin : {govMarketPrice[0]} ,
            govMarketPriceAvg : {govMarketPrice[1]} ,
            storageAvailability : {storageAvailability}
            
            Your task to analyze the all data and guide the farmer which path he/she should choose and why with the price details you need to convince the farmer to choose the correct path that gives max profit.
            
            ### decision format :
            if local market specify which market and the corresponding price 
            ex. Local Market (<district>,<market name>, <price> ₹ per Quintal)
            
            if goverment market then
            ex. APMC Market (Price : <highest price> ₹ per Quintal)
            
            if Direct sell to customer
            then only Direct Sell to Customer
            
            ### reasoning
            reasoning for the given decision.
            
            ## Do NOT include disclaimers or vague statements.  .
            
            return ans in json format.
            """
    
    response = get_structured_output(prompt,'gemini')
    return response

def getCultivationPracticeGuide(crop,language):
    Prompt = f"""
        Provide recommended cultivation practices for {crop} farming in India.
        # Output language : {language}
        Return output strictly in JSON format with keys:
        {{
            "crop": "{crop}",
            "cultivation_practices": [
                {{
                "stage": "Stage name",
                "description": "Explanation"
                }}
            ],
            "recommended_youtube_videos": [
                {{
                "title": "Video title",
                "channel": "Channel name",
                "url": "Video URL"
                }}
            ]
            }}

        Guidelines:
        1. Give practices specific to {crop}.
        2. Include 3-5 YouTube video links validated to be relevant to {crop} farming.
        3. Do NOT add any text outside JSON. No disclaimers.
        """
    response = get_structured_output(Prompt,'openai')
    return response

def getActionableWeatherAdvisory(weather_data):
    prompt = f"""You are an expert Agriculture Advisor for Indian farmers. 
            Your task is to analyze the weather data and give practical, simple, actionable farm advisories in Marathi.

            Weather Forecast Data:
            {weather_data}

            Goals:
            - Use weather to recommend actions for the next 1–3 days
            - Output must be easy to understand for rural farmers

            Include advisories for:
            1) **Irrigation**
            2) **Spraying (Pesticide/Fungicide/Herbicide)**
            3) **Fertilizer/Urea/Manure Application**
            4) **Pest & Disease Risk**
            5) **Heat Stress / Sunlight Advisory**
            6) **Rainfall Safety Advisory**
            7) **Wind Advisory (Spray drift, lodging risk)**
            8) **General Crop Protection Tips**
            9) **Short summary + clear DO and DON'T list**

            Output Format:
            1) ✅ **Rain & Weather Summary**
            2) 💧 **Irrigation Advice**
            3) 🧴 **Spray Advice**
            4) 🌾 **Fertilizer Advice**
            5) 🐛 **Pest/Disease Alert**
            6) ☀️ **Heat/Weather Protection**
            7) 📌 **Farmer DOs & DON'Ts**
            8) 🔊 **Very short farmer-friendly voice-style line**
            (Example: "उद्या हलका पाऊस, फवारणी थांबवा, हलके सिंचन करा.")

            Language:
            - Marathi
            - Short sentences
            - Very practical, ground-level tone
            - Avoid scientific jargon — use farmer-friendly words
            """
    advisory = get_structured_output(prompt,'gemini')
    return advisory

def getFertilizerAdvisory(crop, season, land_area,
                              soil_n, soil_p, soil_k,
                              soil_ph, soil_oc, soil_type,
                              state, district, village,
                              language="English"):
   
    prompt = f"""
You are a fertilizer expert for Indian farmers.

Give a VERY SHORT, practical advisory in {language}
for the given farm conditions.

Crop: {crop}
Season: {season}
Land: {land_area} acres
Soil: N={soil_n}, P={soil_p}, K={soil_k}, pH={soil_ph}, OC={soil_oc}, type={soil_type}
Location: {village}, {district}, {state}

STRICT OUTPUT RULES:

• Return ONLY a plain STRING (no JSON, no objects)
• Format in React Markdown (Markdown text only)
• EXACTLY 7 lines — no extra text before/after
• Each line must be under 60 characters
• Simple, practical advice for farmers

FORMAT (follow exactly):

• ✅ Fertilizer — names + kg/acre  
• 🕒 Timing — stage/date  
• 🌾 Method — how to apply  
• 💧 Irrigation — if needed  
• ☀️ Weather — ideal/avoid  
• 📌 DO — one action  
• ❌ DON'T — one mistake to avoid
"""
    advisory = get_structured_output(prompt,'openai')
    return advisory

def getYieldPrediction(crop, season, land_area,
                           soil_n, soil_p, soil_k,
                           soil_ph, soil_oc, soil_type,
                           state, district, village,
                           language="English"):

    prompt = f"""
    You are an agricultural yield expert for Indian farmers.

    Task: Predict crop yield per acre using soil nutrients,
    soil type, pH, organic carbon, season, and location.
    Then give ultra-short practical advice.

    Crop: {crop}
    Season: {season}
    Land: {land_area} acres
    Soil: N={soil_n}, P={soil_p}, K={soil_k}, pH={soil_ph},
    OC={soil_oc}, type={soil_type}
    Location: {village}, {district}, {state}

    STRICT OUTPUT RULES:

    • Return ONLY a plain STRING (no JSON/object)
    • React Markdown format (Markdown text only)
    • EXACTLY 7 bullet lines — no extra text
    • Each line under 60 characters
    • Base prediction on soil fertility + locality
    • Keep advice practical for farmers

    FORMAT (follow exactly):

    • 🌾 Expected yield — quintals/acre range  
    • 🌧️ Weather impact — short note  
    • 🌱 Soil status — fertility summary  
    • ⚠️ Major risk — pest/disease/water  
    • 💡 Improve yield — one key action  
    • 📌 DO — one simple action  
    • ❌ DON'T — one mistake to avoid
    """
    prediction = get_structured_output(prompt,'openai')
    return prediction

def getPestManagementAdvisory(crop, season, land_area,
                           soil_n, soil_p, soil_k,
                           soil_ph, soil_oc, soil_type,
                           state, district, village,
                           language="English"):

    prompt = f"""
    You are an expert in pest management for Indian farmers.

    Task: Analyze the given farm data and predict the most likely pest or disease threat to the crop. 
    Then provide a practical advisory in {language} on how to manage it effectively.

    Crop: {crop}
    Season: {season}
    Land: {land_area} acres
    Soil: N={soil_n}, P={soil_p}, K={soil_k}, pH={soil_ph},
    OC={soil_oc}, type={soil_type}
    Location: {village}, {district}, {state}

    STRICT OUTPUT RULES:

    • Return ONLY a plain STRING (no JSON/object)
    • React Markdown format (Markdown text only)
    • EXACTLY 7 bullet lines — no extra text
    • Each line under 60 characters
    • Base prediction on crop + soil + locality
    • Keep advice practical for farmers

    FORMAT (follow exactly):

    • 🐛 Likely pest/disease — name it  
    • 🌾 Crop risk — low/medium/high  
    • ⚠️ Warning signs — what to look for  
    • 🧴 Management — one key action  
    • 💡 Prevention — one tip  
    • 📌 DO — one simple action  
    • ❌ DON'T — one mistake to avoid
    """
    advisory = get_structured_output(prompt,'openai')
    return advisory

def getCropPlanManager(crop, season, land_area,
                       soil_n, soil_p, soil_k,
                       soil_ph, soil_oc, soil_type,
                       state, district, village,
                       language="English"):

    prompt = f"""
You are an expert Crop Planning Manager for Indian farmers.

Your task is to analyze the farm data and generate a COMPLETE crop plan for the upcoming season.
The plan must be practical, location-aware, soil-aware, and suitable for small and medium farmers.

Return ONLY a valid JSON object. Do not include any explanation outside JSON.

Farmer Data:
- Intended Crop: {crop}
- Season: {season}
- Land Area: {land_area} acres
- Soil Nutrients: N={soil_n}, P={soil_p}, K={soil_k}
- Soil pH: {soil_ph}
- Organic Carbon: {soil_oc}
- Soil Type: {soil_type}
- Location: {village}, {district}, {state}
- Advisory Language: {language}

Your output JSON must follow this structure:

{{
  "recommended_crop": "",
  "crop_recommendation_reasoning": "",
  "complete_crop_plan": {{
    "seed_selection": "",
    "sowing_plan": "",
    "expected_yield": ""
    "expected_expenditure": ""
  }},
}}

Guidelines:
- ouput must be in JSON format only, no extra text
- **Short and practical advice for each section of the crop plan**
- Recommend the best crop for profit and suitability (can differ from intended crop if needed)
- Consider soil nutrients, pH, season, and location
- Use simple farmer-friendly language in {language}
- Ensure advice is practical for Indian farming conditions
- Output tokens should be less than 500 to ensure concise plans
"""
    
    response = get_structured_output(prompt,'gemini')
    return response

def getExpenditurePrediction(crops, area, fertilizer, district):
   
    prompt = f"""
        You are an agricultural economist. Estimate the total expenditure (in local currency) for each crop based on the details below. Assume each crop is grown on the **entire given area** with the **total fertilizer amount** allocated to that crop. Include all production costs: seeds, labor, irrigation, fertilizer, pesticides, machinery, etc., using typical practices for the locality.

        **Input:**
        - Crops: {crops}
        - Area: {area} hectares
        - Fertilizer used: {fertilizer} kg
        - District: {district}

        **Output Format:**
        Return a **valid JSON array** of objects, each with:
        - "crop": crop name (string)
        - "cost": total estimated expenditure for that crop on the given area (number, in local currency)

        Example:
        Input: Crops: ["wheat", "rice"], Area: 2, Fertilizer: 100, Locality: "Uttar Pradesh, India"
        Output: [{{"crop": "wheat", "cost": 50000}}, {{"crop": "rice", "cost": 60000}}]

        **Important:** Output only the JSON array—no additional text, explanations, or markdown.
        """
    prediction = get_structured_output(prompt, 'openai')
    return prediction
