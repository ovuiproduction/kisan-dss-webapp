import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()

GEMINI_API_KEY_2 = os.getenv("GEMINI_API_KEY_2")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY_2)

# Load Gemini Vision Model
model = genai.GenerativeModel("gemini-2.5-flash-lite")

def farmer_scheme_recommendation(farmer_profile,language):

    prompt = f"""
    Act as an expert Indian agriculture and government policy assistant.

    You are given a farmer’s profile collected through a form.
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
    
    response = model.generate_content(
        [prompt],
        generation_config={
            "temperature": 0.4,
            "max_output_tokens": 700
        }
    )

    return response.text