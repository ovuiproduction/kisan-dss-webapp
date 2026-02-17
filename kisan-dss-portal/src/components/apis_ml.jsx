import axios from "axios";
// const API_BASE_URL = "https://onkar-waghmode-kisan-dss.hf.space";
const API_BASE_URL = "http://localhost:7860";

import { insert_logs_api } from './apis_db';

const loggedInFarmerId = JSON.parse(localStorage.getItem("user"))?._id || null;


// AI and Machine Learning-based Functions for Kisan DSS Portal
const insert_logs = async (farmerId, query, response, service) => {
  if (farmerId && query && response && service) {
    await insert_logs_api({
      farmerId: farmerId,
      query: JSON.stringify({ service: service, input: JSON.stringify(query) }),
      response: JSON.stringify(response),
    });
  }
};

// AI and Machine Learning-based Decision Building
export const intelDecisionBuilding_api = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/intel-build-decision`,
      formData,
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    let farmerId = loggedInFarmerId;
    let query = JSON.stringify(formData);
    let response_data = JSON.stringify(response.data)
    let service = "Smart Decision Building"
    insert_logs(farmerId,query,response_data,service)
    return data;
  } catch (error) {
    console.error("Error in intelDecisionBuilding:", error);
    throw error; 
  }
};

// AI & ML-based Crop Recommendation
export const cropRecommendation_api = async (formData) => {
  try {
    const response = await axios.post(  
      `${API_BASE_URL}/intel-crop-recommendation`,
      formData,
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );  
    const data = response.data;
    let farmerId = loggedInFarmerId;
    let query = JSON.stringify(formData);
    let response_data = JSON.stringify(response.data)
    let service = "Intel Crop Recommedation"
    insert_logs(farmerId,query,response_data,service)
    return data;
  } catch (error) {
    console.error("Error in cropRecommendation:", error);
    throw error; // rethrow to handle it in the caller
  }
};

// ML Based APMC Crop Price Prediction
export const intelWPIPrice_api = async (formData) => {
  try {
    const response = await axios.post(  
      `${API_BASE_URL}/intel-wpi-price`,
      formData,
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    let farmerId = loggedInFarmerId;
    let query = JSON.stringify(formData);
    let response_data = JSON.stringify(response.data)
    let service = "Intel WPI Price"
    insert_logs(farmerId,query,response_data,service)
    return data;
  } catch (error) {
    console.error("Error in intelWPIPrice:", error);
    throw error;
  }
};

// AI-based Cultivation Practice Recommendations
export const IntelCultivation_api = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/intel-cultivation-practices`,
      formData,
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    let farmerId = loggedInFarmerId;
    let query = JSON.stringify(formData);
    let response_data = JSON.stringify(response.data)
    let service = "Intel Cultivation Guide"
    insert_logs(farmerId,query,response_data,service)
    return response.data; 
  } catch (error) {
    console.error("Error in IntelCultivation_api:", error);
    throw error;
  }
};

// AI based Weather Advisory [Open Weather API integration]
export const IntelWeatherAdvisory_api = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/intel-weather-advisory`,
      formData,
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    let farmerId = loggedInFarmerId;
    let query = JSON.stringify(formData);
    let response_data = JSON.stringify(response)
    let service = "Smart Decision Building"
    insert_logs(farmerId,query,response_data,service)
    return response.data;
  } catch (error) {
    console.error("Error in IntelWeatherAdvisory_api:", error);
    throw error;
  }
};

// AI and Machine Learning-based Market Price Prediction
export const intelMarketPrice_api = async (formData) => {
  try {
    const response = await axios.post(  
      `${API_BASE_URL}/intel-market-price`,
      formData,
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    let farmerId = loggedInFarmerId;
    let query = JSON.stringify(formData);
    let response_data = JSON.stringify(response.data)
    let service = "Smart Decision Building"
    insert_logs(farmerId,query,response_data,service)
    return data;
  } catch (error) {
    console.error("Error in intelMarketPrice:", error);
    throw error; // rethrow to handle it in the caller
  }
};

// AI-based Crop Image Analysis
export const intelCropImageAnalysis = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/intel-crop-image-analysis`,
      formData,
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const data = response.data;
    let farmerId = loggedInFarmerId;
    let query = JSON.stringify(formData);
    let response_data = JSON.stringify(response.data)
    let service = "Intel Crop Image Analysis"
    insert_logs(farmerId,query,response_data,service)
    return data;
  } catch (error) {
    console.error("Error in intelCropImageAnalysis:", error);
    throw error; // rethrow to handle it in the caller
  }
};

// AI-based Government Scheme Support
export const IntelGovSchemeSupport = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/intel-gov-scheme-support`,
      formData,
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    const data = response.data;
    let farmerId = loggedInFarmerId;
    let query = JSON.stringify(formData);
    let response_data = JSON.stringify(response.data)
    let service = "Intel Goverment Scheme Support"
    insert_logs(farmerId,query,response_data,service)
    return data;
  } catch (error) {
    console.error("Error in intelGovSchemeSupport:", error);
    throw error; // rethrow to handle it in the caller
  }
};

// AI-based Fertilizer Advisory
export const IntelFertilizerAdvisory = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/intel-fertilizer-advisory`,
      formData,
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    let farmerId = loggedInFarmerId;
    let query = JSON.stringify(formData);
    let response_data = JSON.stringify(response.data)
    let service = "Intel Fertilizer Advisory"
    insert_logs(farmerId,query,response_data,service)
    return response.data;
  } catch (error) {
    console.error("Error in IntelFertilizerAdvisory:", error);
    throw error;
  }
};

// AI-based Yield Prediction
export const IntelYieldPrediction = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/intel-yield-prediction`,
      formData,
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    let farmerId = loggedInFarmerId;
    let query = JSON.stringify(formData);
    let response_data = JSON.stringify(response.data)
    let service = "Intel Yield Prediction"
    insert_logs(farmerId,query,response_data,service)
    return response.data; // returns { weatherAdvisory: ... }
  } catch (error) {
    console.error("Error in IntelYieldPrediction:", error);
    throw error;
  }
};

// AI-based Pest Management Advisory
export const IntelPestManagementAdvisory = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/intel-pest-management-advisory`,
      formData,
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    let farmerId = loggedInFarmerId;
    let query = JSON.stringify(formData);
    let response_data = JSON.stringify(response.data)
    let service = "Intel Pest Management"
    insert_logs(farmerId,query,response_data,service)
    return response.data;
  } catch (error) {
    console.error("Error in IntelPestManagementAdvisory:", error);
    throw error;
  }
};

// AI-based Crop Plan Manager
export const IntelCropPlanManager = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/intel-crop-plan-manager`,
      formData,
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    let farmerId = loggedInFarmerId;
    let query = JSON.stringify(formData);
    let response_data = JSON.stringify(response.data)
    let service = "Intel Crop Planing"
    insert_logs(farmerId,query,response_data,service)
    return response.data; 
  } catch (error) {
    console.error("Error in IntelCropPlanManager:", error);
    throw error;
  }
};
