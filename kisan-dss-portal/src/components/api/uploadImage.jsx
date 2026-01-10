// src/api/uploadImage.js
import axios from "axios";

// const API_BASE_URL = "http://localhost:4000";
const API_BASE_URL = "https://kisan-dss-db.onrender.com";

export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await axios.post(
    `${API_BASE_URL}/upload-image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  // Expected: { imageUrl: "https://..." }
  return response.data.imageUrl;
};
