import google.generativeai as genai
import os
import json
import re
import time
from flask import g

# Configuration Constants

MAX_TOKENS_PER_REQUEST = 500  
RATE_LIMIT = 10                 
TIME_WINDOW = 60

# Model congiguration

API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)
gemini_model = genai.GenerativeModel("gemini-2.5-flash-lite")


# Rate Limiting and Token Counting

def count_tokens(text: str):
    words = text.split()
    return int(len(words) * 1.3)

# In-memory storage
rate_limit_store = {}

def check_rate_limit(user_id: str):
    current_time = time.time()

    # Get user history
    user_data = rate_limit_store.get(user_id, [])

    # Remove old requests outside window
    user_data = [t for t in user_data if current_time - t < TIME_WINDOW]

    # Check limit
    if len(user_data) >= RATE_LIMIT:
        return Exception("Rate limit exceeded. Try again later.")

    user_data.append(current_time)
    rate_limit_store[user_id] = user_data


# Internal Functions (Helpers)

def call_gemini_model(prompt: str, user_id: str = "default_user"):
    
    check_rate_limit(user_id)
    
    if(count_tokens(prompt) > MAX_TOKENS_PER_REQUEST):
        return Exception("Input prompt is too long. Please shorten it.")

    response = gemini_model.generate_content(
        [prompt],
        generation_config={
            "temperature": 0.7,
            "max_output_tokens": MAX_TOKENS_PER_REQUEST
        }
    )
    return response

def call_gemini_vision_model(prompt: str, image):
    response = gemini_model.generate_content(
        [prompt,image],
        generation_config={
            "temperature": 0.7,
            "max_output_tokens": 500
        }
    )
    return response

def extract_json_from_response(response):
    if not response or not hasattr(response, "text") or not response.text:
        print("Error: Empty response from model.")
        return None

    raw_text = response.text.strip()

    try:
       
        cleaned_text = re.sub(r"```(?:json)?\s*", "", raw_text)
        cleaned_text = re.sub(r"```", "", cleaned_text).strip()

       
        try:
            return json.loads(cleaned_text)
        except json.JSONDecodeError:
            pass  
       
        json_match = re.search(r"(\{.*?\}|\[.*?\])", cleaned_text, re.DOTALL)

        if json_match:
            try:
                return json.loads(json_match.group())
            except json.JSONDecodeError:
                pass  
            
        return cleaned_text

    except Exception as e:
        print("Unexpected error:", e)
        return raw_text


# Public Function (Main Entry)
def get_structured_output(prompt: str):
    user_id = g.user_id
    response = call_gemini_model(prompt, user_id=user_id)
    return extract_json_from_response(response)

def get_structured_output_vision(prompt: str, image):
    response = call_gemini_vision_model(prompt, image)
    return response.text.strip()
