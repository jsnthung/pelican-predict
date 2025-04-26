from openai import OpenAI
import os
import json
from pathlib import Path
from dotenv import load_dotenv

# Load env file
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# SYSTEM_PROMPT stays the same
SYSTEM_PROMPT = """
You are a professional equity research analyst specializing in fundamental analysis and market sentiment.

You are given structured JSON data for several companies, including:
- 4 years of financial statements (income, balance sheet)
- Trailing P/E and P/B ratios
- Historical P/E ratios
- Recent news articles

For EACH company:
1. Review Revenue, Net Income, Debt, P/E, P/B trends, and recent news sentiment.
2. Identify exactly one PRO and one CON (short ~25 words each).
3. Weigh the evidence and:
    - Make a recommendation: BUY / WAIT / AVOID
    - Give a confidence level: High / Medium / Low
4. Write a brief overall summary (30–50 words) that justifies the recommendation considering both PRO and CON.
5. Return a structured JSON object with:
    - ticker (string)
    - recommendation (BUY, WAIT, AVOID)
    - confidence (High, Medium, Low)
    - pro (string)
    - con (string)
    - summary (string)

Respond STRICTLY in JSON format using the provided function schema. Do not add any extra text.
"""


# Schema / Tool definition
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "return_recommendations",
            "description": "Return stock recommendations for long-term investing",
            "parameters": {
                "type": "object",
                "properties": {
                    "recommendations": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "ticker": {"type": "string"},
                                "recommendation": {
                                    "type": "string",
                                    "enum": ["BUY", "WAIT", "AVOID"]
                                },
                                "confidence": {
                                    "type": "string",
                                    "enum": ["High", "Medium", "Low"]
                                },
                                "pro": {"type": "string"},
                                "con": {"type": "string"},
                                "summary": {"type": "string"}
                            },
                            "required": ["ticker", "recommendation", "confidence", "pro", "con", "summary"]
                        }
                    }
                },
                "required": ["recommendations"]
            }
        }
    }
]

def ask_chatgpt(data: dict) -> dict:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OpenAI API key missing")

    client = OpenAI(api_key=api_key)

    user_prompt = (
            "Analyze the following JSON data for each stock individually:\n\n"
            + json.dumps(data, indent=2)
    )

    response = client.chat.completions.create(
        model="o3",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        tools=TOOLS,
        tool_choice={"type": "function", "function": {"name": "return_recommendations"}},
    )

    # Extract the output
    tool_calls = response.choices[0].message.tool_calls
    function_args = tool_calls[0].function.arguments
    parsed_json = json.loads(function_args)

    return parsed_json
