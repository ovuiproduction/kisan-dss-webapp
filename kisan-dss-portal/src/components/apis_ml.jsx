import axios from "axios";
// const API_BASE_URL = "https://onkar-waghmode-kisan-dss.hf.space";
const API_BASE_URL = "http://localhost:7860";

export const intelDecisionBuilding_api = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/intel-build-decision`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error in intelDecisionBuilding:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const cropRecommendation_api = async (formData) => {
  try {
    const response = await axios.post(  
      `${API_BASE_URL}/intel-crop-recommendation`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );  
   
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error in cropRecommendation:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const intelWPIPrice_api = async (formData) => {
  try {
    const response = await axios.post(  
      `${API_BASE_URL}/intel-wpi-price`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error in intelWPIPrice:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const IntelGovScheme_api = async (formData) => {
  try {
    const response = await axios.post(  
      `${API_BASE_URL}/intel-gov-scheme`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },  
      }
    );
   
    const data = response.data;
    return data;
  }
  catch (error) {
    console.error("Error in IntelGovScheme:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const intelMarketPrice_api = async (formData) => {
  try {
    const response = await axios.post(  
      `${API_BASE_URL}/intel-market-price`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error in intelMarketPrice:", error);
    throw error; // rethrow to handle it in the caller
  }
};