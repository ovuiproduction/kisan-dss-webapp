import google.generativeai as genai
# import requests
# from PIL import Image
# from io import BytesIO
import os
from dotenv import load_dotenv
load_dotenv()

GEMINI_API_KEY_2 = os.getenv("GEMINI_API_KEY_2")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY_2)

# Load Gemini Vision Model
model = genai.GenerativeModel("gemini-2.5-flash-lite")


def analyze_crop_image(image, language="Marathi"):
    
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

    response = model.generate_content(
        [prompt, image],
        generation_config={
            "temperature": 0.4,
            "max_output_tokens": 500
        }
    )

    return response.text

