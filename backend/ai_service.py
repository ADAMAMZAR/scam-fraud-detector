import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Gemini
api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    print("WARNING: GEMINI_API_KEY missing from .env")

class AIService:
    @staticmethod
    def analyze_message(message_text: str):
        """
        Connects to Gemini Pro to analyze if a message is a scam.
        """
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""
        Act as a Cyber Security Specialist. Analyze the following message for fraud, phishing, or malicious intent.
        
        Provide the analysis in the following JSON format ONLY:
        {{
          "score": (number 0-100),
          "verdict": "Fraud" | "Suspicious" | "Safe",
          "confidence": (number 0-100),
          "breakdown": {{
            "NLP": (number 0-40),
            "URL": (number 0-30),
            "Sender": (number 0-30)
          }},
          "reasons": [
            {{
              "text": "Specific reason",
              "category": "NLP · Intent" | "URL · Domain" | "NLP · Keywords" | "Sender · Reputation",
              "points": (number)
            }}
          ]
        }}

        Message to analyze: "{message_text}"
        """
        
        try:
            response = model.generate_content(prompt)
            # Clean response (remove markdown code blocks if present)
            content = response.text.strip()
            if content.startswith("```json"):
                content = content.replace("```json", "").replace("```", "").strip()
            elif content.startswith("```"):
                content = content.replace("```", "").strip()
            
            return json.loads(content)
        except Exception as e:
            print(f"Error in Gemini Analysis: {str(e)}")
            raise e
