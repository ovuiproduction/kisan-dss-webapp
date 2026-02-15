import axios from "axios";
// const API_BASE_URL = "https://onkar-waghmode-kisan-dss.hf.space";
const API_BASE_URL = "http://localhost:7860";

import { insert_logs_api } from './apis_db';

const loggedInFarmerId = JSON.parse(localStorage.getItem("user"))?._id || null;


// AI and Machine Learning-based Functions for Kisan DSS Portal


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
    await insert_logs_api({
      farmerId: loggedInFarmerId,
      query: JSON.stringify({ service: 'intel-build-decision', input: JSON.stringify(formData) }),
      response: JSON.stringify(data.decision),
    });
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
    await insert_logs_api({
      farmerId: loggedInFarmerId,
      query: JSON.stringify({ service: 'crop-recommendation', input: JSON.stringify(formData) }),
      response: JSON.stringify(response.data.conclusion),
    });
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
    await insert_logs_api({
      farmerId: loggedInFarmerId,
      query: JSON.stringify({ service: 'weather-advisory', input: JSON.stringify(formData) }),
      response: JSON.stringify(response.data.weatherAdvisory),
    });
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
    await insert_logs_api({
      farmerId: loggedInFarmerId,
      query: JSON.stringify({ service: 'market-price-prediction', input: JSON.stringify(formData) }),
      response: JSON.stringify(response.data.conclusion),
    });
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
    await insert_logs_api({
      farmerId: loggedInFarmerId,
      query: JSON.stringify({ service: 'crop-image-analysis', input: JSON.stringify(formData) }),
      response: JSON.stringify(response.data),
    });
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
    await insert_logs_api({
      farmerId: loggedInFarmerId,
      query: JSON.stringify({ service: 'gov-scheme-support', input: JSON.stringify(formData) }),
      response: JSON.stringify(data),
    });
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
    await insert_logs_api({
      farmerId: loggedInFarmerId,
      query: JSON.stringify({ service: 'fertilizer-advisory', input: JSON.stringify(formData) }),
      response: JSON.stringify(response.data),
    });
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
    await insert_logs_api({
      farmerId: loggedInFarmerId,
      query: JSON.stringify({ service: 'yield-prediction', input: JSON.stringify(formData) }),
      response: JSON.stringify(response.data),
    });
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
    await insert_logs_api({
      farmerId: loggedInFarmerId,
      query: JSON.stringify({ service: 'crop-plan-manager', input: JSON.stringify(formData) }),
      response: JSON.stringify(response.data),
    });
    return response.data; 
  } catch (error) {
    console.error("Error in IntelCropPlanManager:", error);
    throw error;
  }
};
