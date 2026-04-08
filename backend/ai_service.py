import os
import re
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

# Fixed tactic taxonomy Gemini must use for sentence classification
TACTIC_LABELS = [
    "URGENCY_THREAT",
    "AUTHORITY_IMPERSONATION",
    "FEAR_APPEAL",
    "REWARD_LURE",
    "SOCIAL_PROOF",
    "ARTIFICIAL_SCARCITY",
    "PERSONAL_DATA_REQUEST",
    "ISOLATION_TACTIC",
    "LEGAL_THREAT",
    "ACCOUNT_DEACTIVATION",
    "NEUTRAL",
]

class AIService:
    @staticmethod
    def analyze_message(message_text: str):
        """
        Connects to Gemini Pro to analyze if a message is a scam.
        Returns overall verdict + per-sentence heatmap breakdown.
        """
        model = genai.GenerativeModel('gemini-2.5-flash')

        tactic_list = ", ".join(TACTIC_LABELS)

        prompt = f"""
Act as a Cyber Security Specialist. Analyze the following message for fraud, phishing, or malicious intent.

You must split the message into its individual sentences and classify each one.

Provide the analysis ONLY as valid JSON, matching this exact structure:
{{
  "score": <integer 0-100>,
  "verdict": "Fraud" | "Suspicious" | "Safe",
  "confidence": <integer 0-100>,
  "breakdown": {{
    "NLP": <integer 0-40>,
    "URL": <integer 0-30>,
    "Sender": <integer 0-30>
  }},
  "reasons": [
    {{
      "text": "<specific reason>",
      "category": "NLP · Intent" | "URL · Domain" | "NLP · Keywords" | "Sender · Reputation",
      "points": <integer>
    }}
  ],
  "heatmap": [
    {{
      "sentence": "<exact sentence text>",
      "intensity": <float 0.0-1.0>,
      "tactic": "<one of: {tactic_list}>",
      "explanation": "<plain-English explanation ≤40 words, or null if NEUTRAL>"
    }}
  ]
}}

Rules for heatmap:
- Split the message into natural sentences (by punctuation or logical breaks).
- intensity 0.0-0.09 = completely neutral; 0.1-0.29 = mild; 0.30-0.54 = moderate; 0.55-0.74 = high; 0.75-1.0 = extreme.
- If a sentence is neutral/safe, set tactic to "NEUTRAL" and explanation to null.
- Use ONLY the tactic labels from this list: {tactic_list}
- Do NOT wrap in markdown code blocks.

Message to analyze: "{message_text}"
"""

        try:
            response = model.generate_content(prompt)
            content = response.text.strip()

            # Strip markdown code fences if present
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()

            parsed = json.loads(content)

            # Ensure heatmap key always exists (fallback: empty list)
            if "heatmap" not in parsed:
                parsed["heatmap"] = []

            return parsed

        except json.JSONDecodeError as e:
            print(f"JSON parse error in Gemini response: {str(e)}")
            print(f"Raw content: {content[:500]}")
            raise e
        except Exception as e:
            print(f"Error in Gemini Analysis: {str(e)}")
            raise e
