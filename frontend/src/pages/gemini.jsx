import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with your environment variable
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyseMessageAI = async (message) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Act as a Cyber Security Specialist. Analyze the following message for fraud, phishing, or malicious intent.
    
    Provide the analysis in the following JSON format ONLY:
    {
      "score": (number between 0-100, where 100 is high risk),
      "verdict": "Fraud" | "Suspicious" | "Safe",
      "reasons": [
        {"text": "Specific reason for this verdict", "points": (number)}
      ]
    }

    Message to analyze: "${message}"
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response (remove markdown code blocks if present)
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};