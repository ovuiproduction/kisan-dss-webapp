import axios from "axios";
// const API_BASE_URL = "https://kisan-dss-db.onrender.com";
const API_BASE_URL = "http://localhost:4000";


// APIs for Database interactions (MongoDB) - CRUD operations and Logs


// Farmer Profile APIs

export const fetchActiveCrops_api = async (email) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/active-crops?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch crops");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchActiveCrops:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const deleteCrop_api = async (cropId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete-crop/${cropId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete crop");
    }
    return true;
  } catch (error) {
    console.error("Error in deleteCrop:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const sendMessage_api = async (userInput) => {
  try {
    const ChatResponse = await axios.post(`${API_BASE_URL}/chat`, { userInput });
    let botMessage = ChatResponse.data.response;
    return botMessage;
  } catch (error) {
    console.error("Error in sendMessage:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const fetchCropHistory_api = async (email) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/history-crops?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch crop history");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchCropHistory:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const fetchFarmerProfile_api = async (email) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/farmer-profile?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch farmer profile");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchFarmerProfile:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const authRequestOtp_api = async (email, userType) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/request-otp-${userType}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },    
        body: JSON.stringify({ email }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "User not found");
    }
    return data;
  } catch (error) {
    console.error("Error in authRequestOtp:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const verifyOtp_api = async (email, otp, userType) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/verify-otp-${userType}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Invalid OTP");
    }
    return data;
  }
  catch (error) {
    console.error("Error in verifyOtp:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const fetchCartItems_api = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart?userId=${userId}`);  
    if (!response.ok) {
      throw new Error("Failed to fetch cart items");
    } 
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchCartItems:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const buyProduct_api = async (userId, productId,rating) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/buy`, {    
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId,rating }),
    });
    const data = await response.json(); 
    if (!response.ok) {
      throw new Error(data.message || "Failed to add to cart");
    }
    return data;
  } catch (error) {
    console.error("Error in addToCart:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const removeFromCart_api = async (userId, productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/remove`, {     
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId }),
    });
    if (!response.ok) {
      throw new Error("Failed to remove from cart");
    }
    return true;
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const fetchOrderHistory_api = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/order-history?userId=${userId}`); 
    if (!response.ok) {
      throw new Error("Failed to fetch order history");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchOrderHistory:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const postCrop_api = async (cropData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/postcrop`, {  
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cropData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to post crop");
    }
    return data;
  } catch (error) {
    console.error("Error in postCrop:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const signup_farmer_api = async (userData, userType) => {
  try {
    const response = await fetch( 
      `${API_BASE_URL}/signup-${userType}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    } 
    return data;
  }
  catch (error) {
    console.error("Error in signup:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const update_farmer_profile_api = async (profileData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/farmer/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Profile update failed");
    }

    return data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const signup_user_api = async (userData, userType) => {
  try {
    const response = await fetch( 
      `${API_BASE_URL}/signup-${userType}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }
    return data;
  } catch (error) {
    console.error("Error in signup:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const fetchTransactions_api = async (farmerId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/farmers/${farmerId}/transactions`
    );  
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    } 
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error("Error in fetchTransactions:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const fetchAllCropUserDashboard_api = async (search) => {
  try {
    const response = await fetch(`${API_BASE_URL}/crops?search=${search}`);
    if (!response.ok) {
      throw new Error("Failed to fetch crops");
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error("Error in fetchAllCropUserDashboard:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const addToCart_api = async (userId, productId,quantity) => {
  try { 
    const response = await fetch(`${API_BASE_URL}/add-to-cart`, {     
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId,quantity }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to add to cart");
    }
    return data;
  } catch (error) {
    console.error("Error in addToCart:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const fetchUserProfile_api = async (email) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/user-profile?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );  
    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error("Error in fetchUserProfile:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export  const fetchUserTransactions_api = async (userId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/users/${userId}/transactions`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user transactions");
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error("Error in fetchUserTransactions:", error);
    throw error; // rethrow to handle it in the caller
  }
};

export const get_farmer_profile_api = async () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const email = user?.email;
  if (!email) {
    throw new Error("User email not found in session");
  }
  const response = await fetch(`${API_BASE_URL}/farmer-profile?email=${encodeURIComponent(email)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch profile");
  return data;
};


// Weather Advisory APIs


export const updateWeatherAdvisory = async (advisoryText,expiryDate) => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const userId = user?._id;
    const response = await fetch(`${API_BASE_URL}/update-weather-advisory`, {     
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ advisoryText,expiryDate,userId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to add to cart");
    }
    return data.weatherAdvisory;
  } catch (error) {
    console.error("Error in updating weather advisory:", error);
    throw error;
  }
};

export const getWeatherAdvisory = async () => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const userId = user?._id;

    const response = await axios.get(`${API_BASE_URL}/get-weather-advisory`, {
      params: { userId },
    });
    return response.data;

  } catch (error) {
    console.error("Error in fetching weather advisory:", error);
    throw error;
  }
};



// Instance APIs


// Create new instance
export const create_instance_api = async (instanceData) => {
  const response = await fetch(`${API_BASE_URL}/instance/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(instanceData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Instance creation failed");
  return data;
};

// Get all instances for a farmer (by email)
export const get_instances_api = async (email) => {
  const response = await fetch(`${API_BASE_URL}/instance?email=${encodeURIComponent(email)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch instances");
  return data;
};

// Get single instance by ID 
export const get_instance_by_id_api = async (id) => {
  const response = await fetch(`${API_BASE_URL}/instance/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch instance");
  return data;
};

// Update instance - complete stage, update crop name, add initial plan
export const complete_stage_api = async (instanceId, stageName) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/instance/complete-stage/${instanceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stage: stageName }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to complete stage");
    }

    return data; // returns updated instance
  } catch (error) {
    console.error("Error completing stage:", error);
    throw error;
  }
};

// update crop name
export const update_crop_name_api = async (instanceId, cropName) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/instance/update-crop-name/${instanceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cropName }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update crop name");
    }

    return data; // returns updated instance
  } catch (error) {
    console.error("Error updating crop name:", error);
    throw error;
  }
};

// add initial plan
export const add_initial_plan_api = async (instanceId, initialPlan) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/instance/add-initial-plan/${instanceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ initialPlan }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add initial plan");
    }

    return data; // returns updated instance
  } catch (error) {
    console.error("Error completing stage:", error);
    throw error;
  }
};


// Logs APIs


export const insert_logs_api = async (logData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/logs/insert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to insert logs');
    }

    return responseData;
  } catch (error) {
    console.error('Error inserting logs:', error);
    throw error;
  }
};

export const fetch_logs_api = async (farmerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/logs/get/${farmerId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch logs');
    }

    return data;
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
};