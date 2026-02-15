const dotenv = require("dotenv");

dotenv.config();

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

async function runChat(userInput) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 800,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // Create chat session with system instruction
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: `
You are AgriBot, an advanced agriculture assistant specializing in market intelligence, crop insights, and direct market access for farmers in Maharashtra.

Focus only on:
1. APMC crop prices from Agmarknet.
2. Top crops grown in districts.
3. Profitable crop suggestions based on region.
4. Crop selling guidance.
5. Crop-specific advisory.

Ignore all unrelated topics. Default to Maharashtra unless a different state is mentioned.
`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Hello! I'm AgriBot, your agriculture assistant. How can I help you today?",
            },
          ],
        },
      ],
    });

    const result = await chat.sendMessage(userInput);
    return result.response.text();

  } catch (error) {
    console.error("Error in AI chatbot:", error);
    return "Sorry, I couldn't process your request.";
  }
}

module.exports = runChat;