import google.generativeai as genai
import os
import json
import re
import time
from openai import OpenAI
from flask import g

MAX_TOKENS_PER_REQUEST = 500
RATE_LIMIT = 10                
TIME_WINDOW = 60               

# OpenAI Client Initialization
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Gemini Configuration
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


# Extract JSON Safely
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

def extract_content_from_openai_response(response):
    
    if not response:
        print("Error: Empty response from model.")
        return response

    raw_text = response

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


# call OpenAI Model

def call_openai_model(prompt: str, user_id: str = "default_user"):
    
    check_rate_limit(user_id)

    input_tokens = count_tokens(prompt)

    if input_tokens > MAX_TOKENS_PER_REQUEST:
        raise Exception("Prompt too large! Reduce input size.")

    response = client.chat.completions.create(
        model="gpt-5.2",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_completion_tokens=MAX_TOKENS_PER_REQUEST
    )
    return response.choices[0].message.content


# Call Gemini Model

def call_gemini_model(prompt: str, user_id: str = "default_user"):
    
    check_rate_limit(user_id)
    
    # if(count_tokens(prompt) > 1000):
    #     return Exception("Input prompt is too long. Please shorten it.")

    response = gemini_model.generate_content(
        [prompt],
        generation_config={
            "temperature": 0.7,
            "max_output_tokens": 900
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


# -----------------------------
# Public Function (Main Entry)
# -----------------------------

# openai for text based tasks, gemini for vision and multimodal

def get_structured_output(prompt: str, model_choice: str):
    user_id = g.user_id
    if(count_tokens(prompt) > 400) or model_choice == 'gemini':
        print("Using Gemini for long prompt")
        response = call_gemini_model(prompt,user_id=user_id)
        print(response)
        response = extract_json_from_response(response)
    else:
        print("Using OpenAI for short prompt")
        response = call_openai_model(prompt, user_id=user_id)
        print("Raw OpenAI response:", response)
        response = extract_content_from_openai_response(response)
    return response


def get_structured_output_vision(prompt: str, image):
    response = call_gemini_vision_model(prompt, image)
    return response.text.strip()
