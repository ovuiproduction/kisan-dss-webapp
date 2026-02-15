from flask import Flask,request,jsonify,g
import requests
import pickle
import pandas as pd
import os
from dotenv import load_dotenv
import random
from flask_cors import CORS
import concurrent.futures
from PIL import Image
from io import BytesIO
import jwt

app = Flask(__name__)
CORS(app)

load_dotenv()

#loading models
try:
    # Yield prediction model and preprocessor
    yield_model = pickle.load(open('models/cropyieldmodels/model.pkl', 'rb'))
    yield_preprocessor = pickle.load(open('models/cropyieldmodels/preprocessor.pkl', 'rb'))
    # WPI model and preprocessor
    wpi_model = pickle.load(open('models/wpimodels/model.pkl', 'rb'))
    wpi_preprocessor = pickle.load(open('models/wpimodels/preprocessor.pkl', 'rb'))
    # Market price model
    market_price_model = pickle.load(open('models/marketpricemodels/model.pkl', 'rb'))
    market_price_preprocessor = pickle.load(open('models/marketpricemodels/preprocessor.pkl', 'rb'))
     # rainfall prediction model and preprocessor (Division Wise)
    rainfall_model = pickle.load(open('models/rainfallmodels/model.pkl', 'rb'))
    rainfall_preprocessor = pickle.load(open('models/rainfallmodels/preprocessor.pkl', 'rb'))
     # temperature model and preprocessor
    temperature_model = pickle.load(open('models/temperaturemodels/model.pkl', 'rb'))
    temperature_preprocessor = pickle.load(open('models/temperaturemodels/preprocessor.pkl', 'rb'))
    
   
except FileNotFoundError as e:
    raise FileNotFoundError(f"Required file missing: {e}")

# fule data key
DAILY_FUEL_DATA_KEY = os.getenv("DAILY_FUEL_DATA_KEY")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")


# Vision model load
from llm_utility import analyze_crop_image
from llm_utility import farmer_scheme_recommendation
from llm_utility import getCropSelectionConclusion
from llm_utility import getMarketSelectionConclusion
from llm_utility import getMahaAnnualRainfall
from llm_utility import getIndiaRainfallMonthly
from llm_utility import getSellingDecision
from llm_utility import getCultivationPracticeGuide
from llm_utility import getActionableWeatherAdvisory
from llm_utility import getPestManagementAdvisory
from llm_utility import getFertilizerAdvisory
from llm_utility import getYieldPrediction
from llm_utility import getCropPlanManager
from llm_utility import getExpenditurePrediction


# Crop MSP and Average Price Dictionary (Prices in INR per Quintal)
commodity_price = {
    'Bajra': {'avg_price': 1900, 'msp_price': 2500},
    'Barley': {'avg_price': 1600, 'msp_price': 2200},
    'Cotton': {'avg_price': 5500, 'msp_price': 6620},
    'Gram': {'avg_price': 4500, 'msp_price': 5440},
    'Groundnut': {'avg_price': 5000, 'msp_price': 6377},
    'Jowar': {'avg_price': 2300, 'msp_price': 3180},
    'Maize': {'avg_price': 1800, 'msp_price': 2225},
    'Masoor': {'avg_price': 4600, 'msp_price': 6400},
    'Moong': {'avg_price': 6000, 'msp_price': 8558},
    'Soyabean': {'avg_price': 3500, 'msp_price': 4600},
    'Sugarcane': {'avg_price': 290, 'msp_price': 315},  # Per Quintal
    'Tur': {'avg_price': 5000, 'msp_price': 7000},
    'Urad': {'avg_price': 4800, 'msp_price': 6950},
    'Wheat': {'avg_price': 2100, 'msp_price': 2275}
}

# Market list district wise
markets_data = {
    "Kolhapur": ["Kolhapur", "Vadgaonpeth"],
    "Pune": [
        "Pune", "Pune(Pimpri)", "Junnar(Otur)", "Pune(Moshi)", "Junnar(Alephata)", 
        "Manchar", "Junnar", "Nira(Saswad)", "Pune(Khadiki)", "Shirur", "Baramati", 
        "Nira", "Khed(Chakan)", "Bhor", "Pune(Manjri)", "Indapur(Nimgaon Ketki)", 
        "Dound", "Indapur", "Mulshi", "Junnar(Narayangaon)", "Indapur(Bhigwan)"
    ],
    "Sangli": [
        "Sangli", "Vita", "Islampur", "Sangli(Miraj)", "Palus", 
        "Sangli(Phale, Bhajipura Market)", "Tasgaon"
    ],
    "Satara": ["Vai", "Satara", "Phaltan", "Vaduj", "Karad", "Koregaon", "Lonand"],
    "Solapur": [
        "Akluj", "Laxmi Sopan Agriculture Produce Marketing Co Ltd", "Pandharpur", 
        "Mangal Wedha", "Mohol", "Kurdwadi(Modnimb)", "Karmala", "Barshi", "Solapur", 
        "Dudhani", "Akkalkot", "Barshi(Vairag)", "Kurdwadi"
    ]
}

#  Subdistrict of corresponding market list
subdistrict_data = {
     "Kolhapur": {"Kolhapur": "Radhanagari", "Vadgaonpeth": "Hatkanangle"},

    "Pune": {
        "Pune": "Haveli", "Pune(Pimpri)": "Haveli", "Junnar(Otur)": "Junnar", "Pune(Moshi)": "Khed", "Junnar(Alephata)": "Junnar", 
        "Manchar": "Ambegaon", "Junnar": "Junnar", "Nira(Saswad)": "Purandhar", "Pune(Khadiki)": "Haveli", "Shirur": "Shirur", "Baramati": "Baramati", 
        "Nira": "Baramati", "Khed(Chakan)": "Khed", "Bhor": "Bhor", "Pune(Manjri)": "Haveli", "Indapur(Nimgaon Ketki)": "Indapur", 
        "Dound": "Daund", "Indapur": "Indapur", "Mulshi": "Mulshi", "Junnar(Narayangaon)": "Junnar", "Indapur(Bhigwan)": "Indapur"
    },


    "Sangli": {
        "Sangli": "Miraj", "Vita": "Vita", "Islampur": "Walwa", "Sangli(Miraj)": "Miraj", "Palus": "Palus", 
        "Sangli(Phale, Bhajipura Market)": "Miraj", "Tasgaon": "Tasgaon"
    },


    "Satara": {"Vai": "Wai", "Satara": "Koregaon", "Phaltan": "Phaltan", "Vaduj": "Khatav", "Karad": "Karad", "Koregaon": "Koregaon", "Lonand": "Phaltan"},
    

"Solapur": {
        "Akluj": "Malshiras", "Laxmi Sopan Agriculture Produce Marketing Co Ltd": "Barshi", "Pandharpur": "Pandharpur", 
        "Mangal Wedha": "Mangalvedhe", "Mohol": "Mohol", "Kurdwadi(Modnimb)": "Madha", "Karmala": "Karmala", "Barshi": "Barshi", "Solapur": "Solapur", 
        "Dudhani": "Akkalkot", "Akkalkot": "Akkalkot", "Barshi(Vairag)": "Barshi", "Kurdwadi": "Madha"
    }
}

# function map market to subdistrict
def get_subdistrict(market):
    for district, subdistricts in subdistrict_data.items():
        if market in subdistricts:
            return subdistricts[market]
    return market 


#### Models In Use

# division wise
# Rainfall year prediction
def getRainfallDataYearSeries(year):
    aggregated_rainfall = []
    for month in range(1, 13):
        column_names_rainfall_model = ['SUBDIVISION', 'YEAR', 'MONTH']
        features = [["Madhya Maharashtra", year, month]]
        features_df = pd.DataFrame(features, columns=column_names_rainfall_model)

        try:
            transformed_features = rainfall_preprocessor.transform(features_df)
            prediction = rainfall_model.predict(transformed_features).reshape(1, -1)
            rainfall = round(prediction[0][0], 2)
            aggregated_rainfall.append(rainfall)
        except Exception as e:
            print(f"Error processing rainfall data for year {year}, month {month}: {e}")
            aggregated_rainfall.append(None)
            
    return aggregated_rainfall

def getRainfallValue(year, month):
    try:
        column_names_rainfall_model = ['SUBDIVISION', 'YEAR', 'MONTH']
        features = [["Madhya Maharashtra", year, month]]
        features_df = pd.DataFrame(features, columns=column_names_rainfall_model)
        transformed_features = rainfall_preprocessor.transform(features_df)
        prediction = rainfall_model.predict(transformed_features).reshape(1, -1)
        rainfall = round(prediction[0][0], 2)
        return rainfall
    except Exception as e:
        print(f"Error processing rainfall data for year {year}, month {month}: {e}")
        return None

def marketPricePrediction(District, Market, Commodity, Year, Month, Rainfall):
    try:
        column_names = ['District', 'Market', 'Commodity', 'Year', 'Month', 'Rainfall']
        features = [[District, Market, Commodity, Year, Month, Rainfall]]
        features_df = pd.DataFrame(features, columns=column_names)
        transformed_features = market_price_preprocessor.transform(features_df)
        prediction = market_price_model.predict(transformed_features).reshape(1, -1)
        predicted_market_price = round(prediction[0][0], 2)
        return predicted_market_price
    except Exception as e:
        print(f"Error predicting market price for {Commodity} in {Market}, {District} for {Year}-{Month}: {e}")
        return None

def marketPriceSeries(District, Commodity, Year, Month):
    try:
        markets = markets_data.get(District, [])
        marketPriceData = {}
        Rainfall = getMahaAnnualRainfall(Year, District)
        for Market in markets:
            marketPrice = marketPricePrediction(District, Market, Commodity, Year, Month, Rainfall)
            marketPriceData[Market] = marketPrice
        return marketPriceData
    except Exception as e:
        print(f"Error generating market price series for {Commodity} in {District} for {Year}-{Month}: {e}")
        return {}

def getMarketPriceData(Commodity, Year, Month):
    try:
        marketPriceData = {}
        
        for District in markets_data:
            Rainfall = getMahaAnnualRainfall(Year, District)
            markets = markets_data.get(District, [])
            districtMarketData = {}
            
            for Market in markets:
                marketPrice = marketPricePrediction(District, Market, Commodity, Year, Month, Rainfall)
                districtMarketData[Market] = marketPrice
            
            marketPriceData[District] = districtMarketData
            
        return marketPriceData
    except Exception as e:
        print(f"Error generating market price data for {Commodity} in {Year}-{Month}: {e}")
        return {}

def wpiPrediction(Commodity, Month, Year, Rainfall):
    try:
        column_names = ['Commodity', 'Month', 'Year', 'Rainfall']
        features = [[Commodity, Month, Year, Rainfall]]
        features_df = pd.DataFrame(features, columns=column_names)
        transformed_features = wpi_preprocessor.transform(features_df)
        prediction = wpi_model.predict(transformed_features).reshape(1, -1)
        predicted_wpi = round(prediction[0][0], 2)
        return predicted_wpi
    except Exception as e:
        print(f"Error predicting WPI for {Commodity} in {Month}/{Year}: {e}")
        return None

def wpiPricePrediction(Commodity, Month, Year, Rainfall):
    try:
        wpi = wpiPrediction(Commodity, Month, Year, Rainfall)
        commodity_avg_price = commodity_price[Commodity]['avg_price']
        commodity_msp_price = commodity_price[Commodity]['msp_price']
        min_wpi_price = round((wpi * commodity_avg_price) / 100, 2)
        max_wpi_price = round((wpi * commodity_msp_price) / 100, 2)
        avg_wpi_price = round((min_wpi_price + max_wpi_price) / 2, 2)
        return min_wpi_price, avg_wpi_price, max_wpi_price
    except KeyError as e:
        print(f"Error: Missing data for {Commodity} in commodity_price dictionary: {e}")
        return None, None, None
    except Exception as e:
        print(f"Error predicting WPI prices for {Commodity} in {Month}/{Year}: {e}")
        return None, None, None

def wpiPriceWholeYear(Commodity, Year):
    try:
        min_price_data = []
        msp_data = []
        Month = 1
        rainfallData = getRainfallDataYearSeries(Year)
        x_count = 0
        for rainfall in rainfallData:
            min_wpi_price,avg_wpi_price,max_wpi_price = wpiPricePrediction(Commodity, Month, Year, rainfall)
            msp_data.append(max_wpi_price)
            min_price_data.append(min_wpi_price)
            Month = Month + 1
            x_count = x_count + 1
        return min_price_data, msp_data
    except Exception as e:
        print(f"Error predicting WPI prices for {Commodity} in {Year}: {e}")
        return [], []

def getTempretureData(year):
    months = random.sample(range(1, 13), 6)
    aggregated_temperature = 0
        
    for month in months:
        # tempreture prediction
        column_names_temperature_model = ['YEAR','MONTH']
        features = [[year,month]]
        features_df = pd.DataFrame(features, columns=column_names_temperature_model)
        transformed_features = temperature_preprocessor.transform(features_df)
        prediction = temperature_model.predict(transformed_features).reshape(1,-1)
        temperature = round(prediction[0][0] , 2)
        aggregated_temperature+=temperature
        
    aggregated_temperature = round(aggregated_temperature/6,2)
   
    return aggregated_temperature

def yieldPrediction(Year, District, Commodity, Area, Rainfall, Temperature, Soil_color, Fertilizer, Nitrogen, Phosphorus, Potassium, pH):
    column_names = ['Year', 'District', 'Commodity', 'Area', 'Rainfall', 'Temperature','Soil_color','Fertilizer', 'Nitrogen', 'Phosphorus', 'Potassium', 'pH']
    features = [[Year, District, Commodity, Area, Rainfall, Temperature, Soil_color, Fertilizer, Nitrogen, Phosphorus, Potassium, pH]]
    features_df = pd.DataFrame(features, columns=column_names)
    transformed_features = yield_preprocessor.transform(features_df)
    prediction = yield_model.predict(transformed_features).reshape(1,-1)
    predicted_yield = round(prediction[0][0] , 2)
    return predicted_yield

def getIntelCropData(Commoditys, Year, Month, District, Area, Nitrogen, Potassium, Phosphorus, Fertilizer, soilColor, pH):
    wpi_Rainfall = getIndiaRainfallMonthly(Year, Month)
    Rainfall = getMahaAnnualRainfall(Year, District)
    Temperature = getTempretureData(Year)
    IntelCroprecData = {}

    for Commodity in Commoditys:
        min_wpi_price, predicted_price, max_wpi_price = wpiPricePrediction(Commodity, Month, Year, wpi_Rainfall)
        predicted_yield = yieldPrediction(Year, District, Commodity, Area, Rainfall, Temperature, soilColor, Fertilizer, Nitrogen, Phosphorus, Potassium, pH)
        totalPrice = round((predicted_yield*Area*predicted_price), 2)
        
        # Corrected dictionary assignment
        IntelCroprecData[Commodity] = {
            "predicted_price": predicted_price,
            "predicted_yield": predicted_yield,
            "area":Area,
            "totalPrice": totalPrice
        }
    return IntelCroprecData


#### Transportation Distance and Cost Calculation with Caching

coordinate_cache = {}

def get_coordinates(subdistrict, district):
    district = district.lower()
    subdistrict = get_subdistrict(subdistrict).lower()
    
    # Check if the coordinates are already in the cache
    cache_key = (subdistrict, district)
    if cache_key in coordinate_cache:
        return coordinate_cache[cache_key]

    query = f"{subdistrict}, {district}, maharashtra"
    url = f"https://nominatim.openstreetmap.org/search?format=json&countrycodes=IN&addressdetails=1&q={query}"
    
    try:
        headers = {
            "User-Agent": "kisan-dss/1.0",
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.9",
        }
        response = requests.get(url, headers=headers)
        
        # Check if the request was successful
        if response.status_code != 200:
            print(f"Error: Received status code {response.status_code}")
            return None
        
        # Parse the JSON response
        data = response.json()
        
        if data:
            for item in data:
                if item.get("address"):
                    taluka_match = item["address"].get("county") or item["address"].get("suburb") or item["address"].get("town") or item["address"].get("village")
                    district_match = item["address"].get("state_district") or item["address"].get("county") or item["address"].get("state")
                    
                    # Check if the subdistrict and district match
                    if taluka_match and district_match and subdistrict in taluka_match.lower() and district in district_match.lower():
                        coordinates = {"lat": float(item["lat"]), "lon": float(item["lon"])}
                        
                        # Store in cache
                        coordinate_cache[cache_key] = coordinates
                        
                        return coordinates
        
        # If no matching data is found
        print("No matching data found.")
        return None

    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return None

distance_cache = {}

def calculate_osrm_distance(source_coords, destination_coords):
    try:
        # Create a unique cache key using source and destination coordinates
        cache_key = (source_coords['lat'], source_coords['lon'], destination_coords['lat'], destination_coords['lon'])

        # Check if data is already in the cache
        if cache_key in distance_cache:
            return distance_cache[cache_key]

        # Make request to OSRM API
        url = f"http://router.project-osrm.org/route/v1/driving/{source_coords['lon']},{source_coords['lat']};{destination_coords['lon']},{destination_coords['lat']}?overview=false"
        response = requests.get(url)

        # Handle non-200 status codes
        if response.status_code != 200:
            print(f"Error: Received status code {response.status_code}")
            return None

        data = response.json()

        # Extract distance and duration if available
        if data.get("routes"):
            distance = data["routes"][0]["legs"][0]["distance"] / 1000  # in km
            duration = data["routes"][0]["legs"][0]["duration"] / 60    # in minutes
            result = {"distance": distance, "duration": duration}

            # Store result in cache
            distance_cache[cache_key] = result
            return result

        print("Error: No route found in the response.")
        return None

    except requests.exceptions.RequestException as e:
        print(f"Error making the request: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

# Dictionary to store cached fuel prices
fuel_price_cache = {}

def get_fuel_prices_for_district(district):
    try:
        district = district.lower()
       
        # Check if data is in cache and not expired
        if district in fuel_price_cache:
            cached_data = fuel_price_cache[district]
         
            return cached_data

        url = f"https://daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com/v1/fuel-prices/today/india/maharashtra/{district}"
        headers = {
            "x-rapidapi-key": DAILY_FUEL_DATA_KEY,
            "x-rapidapi-host": "daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com",
        }
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            print(f"Error: Received status code {response.status_code}")
            return None

        fuel_data = response.json()

        # Store data in cache with timestamp
        fuel_price_cache[district] = (fuel_data)

        return fuel_data
    except requests.exceptions.RequestException as e:
        print(f"Error making the request: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

def calculateTransportationDistance(coords_source, fuel_prices, des_district, mileage):
    transportation_data_all = {}
    transportation_data = {}
    
    try:
        subdistricts = markets_data.get(des_district, [])
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = {}
            # Submit tasks for getting coordinates for all subdistricts
            for des_subdistrict in subdistricts:
                future_coords_destination = executor.submit(get_coordinates, des_subdistrict, des_district)
                futures[des_subdistrict] = future_coords_destination
        
            # Process the results
            for des_subdistrict, future_coords_destination in futures.items():
                coords_destination = future_coords_destination.result()
                if coords_source and coords_destination:
                    distance_result = calculate_osrm_distance(coords_source, coords_destination)
                    if distance_result:
                        transportation_cost = (distance_result["distance"] / mileage) * fuel_prices["fuel"]["diesel"]["retailPrice"]
                        data = {
                            "distance": round(distance_result["distance"], 2),
                            "duration": round(distance_result["duration"], 2),
                            "transportation_cost": round(transportation_cost, 2),
                            "fuel_prices": round(fuel_prices["fuel"]["diesel"]["retailPrice"], 2)
                        }
                    else:
                        data = {
                            "distance": 'N/A',
                            "duration": 'N/A',
                            "transportation_cost": 'N/A',
                            "fuel_prices": 'N/A'
                        }
                else:
                    data = {
                        "distance": 'N/A',
                        "duration": 'N/A',
                        "transportation_cost": 'N/A',
                        "fuel_prices": 'N/A'
                    }

                transportation_data[des_subdistrict] = data
                transportation_data_all[des_subdistrict] = data
        
    except Exception as e:
        print(f"Error calculating transportation distance: {e}")
        return {}, {}

    return transportation_data_all, transportation_data

def getTransportationData(src_subdistrict, src_district, des_district, mileage):
    try:
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future_coords_source = executor.submit(get_coordinates, src_subdistrict, src_district)
            future_fuel_prices = executor.submit(get_fuel_prices_for_district, src_district)
            
            coords_source = future_coords_source.result()
            fuel_prices = future_fuel_prices.result()
        
        if coords_source and fuel_prices:
            transportation_data_all, transportation_data = calculateTransportationDistance(coords_source, fuel_prices, des_district, mileage)
        else:
            print("Error: Coordinates or fuel prices could not be fetched.")
            return {}, {}

    except concurrent.futures.TimeoutError:
        print("Error: Request timed out while fetching data.")
        return {}, {}
    except Exception as e:
        print(f"Error calculating transportation data: {e}")
        return {}, {}

    return transportation_data_all, transportation_data


#### Functions for Weather Data and Advisory

def fetch_weather_data(city,country):
    api_key = OPENWEATHER_API_KEY
    base_url = "http://api.openweathermap.org/data/2.5/forecast/hourly"
    complete_url = f"{base_url}?q={city},{country}&appid={api_key}&units=metric"
    response = requests.get(complete_url)
    weather_data = response.json()
    return weather_data

def extract_agri_weather_info(weather_data):
    important_info = []
    for entry in weather_data.get("list", []):
        rain = entry.get("rain", {})
        rain_mm = rain.get("1h") or rain.get("3h") or 0
        
        info = {
            "datetime": entry.get("dt_txt"),
            "rain_mm": rain_mm,
            "pop": entry.get("pop", 0),
            "temp": entry["main"].get("temp"),
            "humidity": entry["main"].get("humidity"),
            "wind_speed": entry["wind"].get("speed"),
            "description": entry["weather"][0].get("description"),
            "clouds": entry.get("clouds", {}).get("all", 0)
        }

        important_info.append(info)
    return important_info


##### Routes 

@app.route('/')
def index():
    return jsonify({
        "message": "Kisan DSS API Server",
        "status": "running",
        "platform": "Hugging Face Spaces",
    })


SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")

@app.before_request
def extract_user():
    auth_header = request.headers.get("Authorization")

    g.user_id = "default_user"   # fallback

    if auth_header:
        try:
            token = auth_header.split(" ")[1]
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            g.user_id = decoded.get("userId", "default_user")
        except:
            pass


@app.route('/intel-market-price', methods=['POST'])
def marketPrice():
    if request.method == 'POST':
        try:
            # Parse incoming JSON data
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['commodity', 'year', 'month', 'srcSubdistrict', 'srcDistrict', 'desDistrict', 'milage']
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400

            # Extract values from data
            Commodity = data.get('commodity')
            Year = int(data.get('year'))
            Month = int(data.get('month'))
            srcSubdistrict = data.get('srcSubdistrict')
            srcDistrict = data.get('srcDistrict')
            desDistrict = data.get('desDistrict')
            milage = int(data.get('milage'))
            cropyield = int(data.get('cropyield'))
            
            # Get market price data
            marketPriceData = marketPriceSeries(desDistrict, Commodity, Year, Month)
            if not marketPriceData:
                return jsonify({"error": "Failed to get market price data"}), 500
            
            # Get transportation data
            transportation_data_all, transportation_data = getTransportationData(srcSubdistrict, srcDistrict, desDistrict, milage)
            
            if not transportation_data_all or not transportation_data:
                return jsonify({"error": "Failed to get transportation data"}), 500
            
            # Get conclusion
            conclusion = getMarketSelectionConclusion(marketPriceData,cropyield, transportation_data, srcDistrict)
            if not conclusion:
                return jsonify({"error": "Failed to generate market selection conclusion"}), 500
            
            # Return the response
            return jsonify({
                'data': marketPriceData,
                'transportationData': transportation_data_all,
                'cropyield':cropyield,
                'conclusion': conclusion
            })

        except Exception as e:
            # Handle unexpected errors
            return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@app.route('/intel-wpi-price', methods=['POST'])
def IntelWPI():
    if request.method == 'POST':
        try:
            # Parse incoming JSON data
            data = request.get_json()

            # Validate required fields
            required_fields = ['commodity', 'year', 'month']
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400

            # Extract values from data
            Commodity = data.get('commodity')
            Year = int(data.get('year'))
            Month = int(data.get('month'))

            # Get rainfall data
            Rainfall = getIndiaRainfallMonthly(Year, Month)
            if not Rainfall:
                return jsonify({"error": "Failed to get rainfall data"}), 500

            # Get WPI price prediction
            minPrice,avgPrice,maxPrice = wpiPricePrediction(Commodity, Month, Year, Rainfall)
            if avgPrice is None or minPrice is None or maxPrice is None:
                return jsonify({"error": "Failed to predict WPI prices"}), 500

            # Get WPI price series for current and next year
            minPriceCurrSeries, maxPriceCurrSeries = wpiPriceWholeYear(Commodity, Year)
            minPriceNextSeries, maxPriceNextSeries = wpiPriceWholeYear(Commodity, Year + 1)

            # Calculate max and min prices
            maxMSPPrice = max(maxPriceCurrSeries)
            minMSPPrice = max(minPriceCurrSeries)
            maxAvgPrice = min(maxPriceCurrSeries)
            minAvgPrice = min(minPriceCurrSeries)
            # Find gold and silver month indexes
            goldMonthIndex = maxPriceCurrSeries.index(maxMSPPrice) + 1
            silverMonthIndex = minPriceCurrSeries.index(minAvgPrice) + 1

            # Return the response
            return jsonify({
                'rainfall': Rainfall,
                'commodity': Commodity,
                'year': Year,
                'month': Month,
                'avgPrice': avgPrice,
                'minPrice': minPrice,
                'maxPrice': maxPrice,
                'minPriceCurrSeries': minPriceCurrSeries,
                'maxPriceCurrSeries': maxPriceCurrSeries,
                'minPriceNextSeries': minPriceNextSeries,
                'maxPriceNextSeries': maxPriceNextSeries,
                'maxMSPPrice': maxMSPPrice,
                'maxAvgPrice': maxAvgPrice,
                'minMSPPrice': minMSPPrice,
                'minAvgPrice': minAvgPrice,
                'goldMonthIndex': goldMonthIndex,
                'silverMonthIndex': silverMonthIndex,
            })

        except Exception as e:
            # Handle unexpected errors
            return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@app.route('/intel-build-decision', methods=['POST'])
def getDecision():
    if request.method == 'POST':
        try:
            # Parse incoming JSON data
            data = request.get_json()

            # Validate required fields
            required_fields = ['commodity', 'year', 'month', 'storageAvailability']
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400

            # Extract values from data
            Commodity = data.get('commodity')
            Year = int(data.get('year'))
            Month = int(data.get('month'))
            storageAvailability = data.get('storageAvailability')

            # Get rainfall data
            Rainfall = getIndiaRainfallMonthly(Year, Month)
            if not Rainfall:
                return jsonify({"error": "Failed to retrieve rainfall data"}), 500

            # Get government market price prediction
            govMarketPrice = wpiPricePrediction(Commodity, Month, Year, Rainfall)
            if govMarketPrice is None:
                return jsonify({"error": "Failed to predict government market price"}), 500

            # Get market price data for local markets
            marketPriceData = getMarketPriceData(Commodity, Year, Month)
            if not marketPriceData:
                return jsonify({"error": "Failed to retrieve market price data"}), 500

            # Find the highest local market price and associated district and market
            highestLocalMarketPrice = -1 
            localMarketName = None
            districtName = None

            for district, market_data in marketPriceData.items():
                for market, price in market_data.items():
                    if price > highestLocalMarketPrice:
                        highestLocalMarketPrice = price
                        localMarketName = market
                        districtName = district

            # Check if any valid market price was found
            if highestLocalMarketPrice == -1:
                return jsonify({"error": "No valid market price found in local markets"}), 500

            # Get selling decision
            decision = getSellingDecision(Commodity, highestLocalMarketPrice, localMarketName, districtName, govMarketPrice, storageAvailability)
            
            return jsonify({
                'decision': decision,
                'govMarketPrice': govMarketPrice,
                'highestLocalMarketPrice': highestLocalMarketPrice,
                'localMarketName': localMarketName,
                'districtName': districtName
            })

        except Exception as e:
            return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@app.route('/intel-crop-recommendation',methods=['POST'])
def IntelCropRec():
    if request.method == 'POST':
        data = request.get_json()
        Commoditys = data.get('crops')
        Year = data.get('year')
        Month = data.get('month')
        District = data.get('district')
        Area = data.get('area')
        Fertilizer = data.get('fertilizer')
        Nitrogen = data.get('nitrogen')
        Phosphorus = data.get('phosphorus')
        Potassium = data.get('potassium')
        pH = data.get('pH')
        soilColor  = data.get("soilColor")
        try:
            Year = int(Year)
            Month = int(Month)
            Area = float(Area)
            Nitrogen = float(Nitrogen)
            Phosphorus = float(Phosphorus)
            Potassium = float(Potassium)
            pH = float(pH)
        except ValueError:
            print("Error data conversion")
            return jsonify({"error": "Invalid input format for numbers"}), 400

        IntelCropData = getIntelCropData(Commoditys,Year,Month,District,Area,Nitrogen,Potassium,Phosphorus,Fertilizer,soilColor,pH)
        IntelExpenditureData = getExpenditurePrediction(crops=Commoditys,area=Area,fertilizer=Fertilizer,district=District)
        conclusion = getCropSelectionConclusion(IntelCropData,IntelExpenditureData,Nitrogen,Potassium,Phosphorus,soilColor,pH)
        return jsonify({'data':IntelCropData,'expenditureData':IntelExpenditureData,'conclusion':conclusion})
     

@app.route('/intel-cultivation-practices', methods=['POST'])   
def getCultivationPractices():
    data = request.get_json()
    crop = data.get('query')
    language = data.get('language', 'English')
    cultivation_data = getCultivationPracticeGuide(crop,language)
    return jsonify({'cultivationPractices': cultivation_data})


@app.route('/intel-weather-advisory', methods=['POST'])
def getWeatherAdvisory():
    data = request.get_json()
    city = data.get('city')
    country = 'IN'
    weather_data = fetch_weather_data(city, country)
    weather_data_extracted = extract_agri_weather_info(weather_data)
    advisory = getActionableWeatherAdvisory(weather_data_extracted)
    return jsonify({'weatherAdvisory': advisory})

@app.route('/intel-crop-image-analysis', methods=['POST'])
def getCropImageAnalysis():

    if 'image' not in request.files:
        return jsonify({"error": "Image file not found"}), 400

    image_file = request.files['image']
    language = request.form.get('language', 'Marathi')

    # Read image directly
    image_bytes = image_file.read()
    image = Image.open(BytesIO(image_bytes))

    analysis_result = analyze_crop_image(image, language)

    return jsonify({'cropImageAnalysis': analysis_result})


@app.route('/intel-gov-scheme-support', methods=['POST'])
def govSchemesSupport():
    data = request.get_json()
    farmer_profile = data.get('farmer_profile')
    language = data.get('language', 'Marathi')
    scheme_recommendations = farmer_scheme_recommendation(farmer_profile,language)

    return jsonify({'govSchemesSupport': scheme_recommendations})



@app.route('/intel-fertilizer-advisory', methods=['POST'])
def get_fertilizer_advisory():
    """Generate NPK recommendation based on crop, soil, and location."""
    try:
        data = request.get_json()
        
        # Extract all required fields (with defaults to avoid KeyError)
        crop_name = data.get('cropName', '')
        season = data.get('season', '')
        land_used = data.get('landUsed', 0)
        soil = data.get('soil', {})
        locality = data.get('locality', {})

        # Call your advisory logic (replace with actual function)
        fertilizer_advisory = getFertilizerAdvisory(
            crop=crop_name,
            season=season,
            land_area=land_used,
            soil_n=soil.get('nitrogen'),
            soil_p=soil.get('phosphorus'),
            soil_k=soil.get('potassium'),
            soil_ph=soil.get('ph'),
            soil_oc=soil.get('organicCarbon'),
            soil_type=soil.get('soilType'),
            state=locality.get('state'),
            district=locality.get('district'),
            village=locality.get('village')
        )

        return jsonify({'fertilizerAdvisory': fertilizer_advisory}), 200

    except Exception as e:
        print(f"Error in fertilizer advisory: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/intel-yield-prediction', methods=['POST'])
def get_yield_prediction():
    """Predict expected yield based on crop, soil, season, and location."""
    try:
        data = request.get_json()
        
        # Extract all relevant fields
        crop_name = data.get('cropName', '')
        season = data.get('season', '')
        land_used = data.get('landUsed', 0)
        soil = data.get('soil', {})
        locality = data.get('locality', {})

        # Call your yield prediction model/function
        yield_prediction = getYieldPrediction(
            crop=crop_name,
            season=season,
            land_area=land_used,
            soil_n=soil.get('nitrogen'),
            soil_p=soil.get('phosphorus'),
            soil_k=soil.get('potassium'),
            soil_ph=soil.get('ph'),
            soil_oc=soil.get('organicCarbon'),
            soil_type=soil.get('soilType'),
            state=locality.get('state'),
            district=locality.get('district'),
            village=locality.get('village')
        )

        return jsonify({'yieldPrediction': yield_prediction}), 200

    except Exception as e:
        print(f"Error in yield prediction: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/intel-pest-management-advisory', methods=['POST'])
def get_pest_management_advisory():
    try:
        data = request.get_json()
        
        # Extract all required fields (with defaults to avoid KeyError)
        crop_name = data.get('cropName', '')
        season = data.get('season', '')
        land_used = data.get('landUsed', 0)
        soil = data.get('soil', {})
        locality = data.get('locality', {})

        # Call your advisory logic (replace with actual function)
        fertilizer_advisory = getPestManagementAdvisory(
            crop=crop_name,
            season=season,
            land_area=land_used,
            soil_n=soil.get('nitrogen'),
            soil_p=soil.get('phosphorus'),
            soil_k=soil.get('potassium'),
            soil_ph=soil.get('ph'),
            soil_oc=soil.get('organicCarbon'),
            soil_type=soil.get('soilType'),
            state=locality.get('state'),
            district=locality.get('district'),
            village=locality.get('village')
        )

        return jsonify({'pestManagementAdvisory': fertilizer_advisory}), 200

    except Exception as e:
        print(f"Error in pest management advisory: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/intel-crop-plan-manager', methods=['POST'])
def get_crop_plan_manager():
    try:
        data = request.get_json()
        
        # Extract all required fields (with defaults to avoid KeyError)
        crop_name = data.get('cropName', '')
        season = data.get('season', '')
        land_used = data.get('landUsed', 0)
        soil = data.get('soil', {})
        locality = data.get('locality', {})

        # Call your advisory logic (replace with actual function)
        crop_plan_manager = getCropPlanManager(
            crop=crop_name,
            season=season,
            land_area=land_used,
            soil_n=soil.get('nitrogen'),
            soil_p=soil.get('phosphorus'),
            soil_k=soil.get('potassium'),
            soil_ph=soil.get('ph'),
            soil_oc=soil.get('organicCarbon'),
            soil_type=soil.get('soilType'),
            state=locality.get('state'),
            district=locality.get('district'),
            village=locality.get('village')
        )
        return jsonify({'cropPlanManager': crop_plan_manager}), 200

    except Exception as e:
        print(f"Error in crop plan manager: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 7860))
    app.run(host='0.0.0.0', port=port, debug=False)