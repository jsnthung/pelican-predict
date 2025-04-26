import os
from http.client import responses
from pyexpat.errors import messages

import openai
import json
from pathlib import Path
from dotenv import load_dotenv

# Load env file since it is one dir above
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

SYSTEM_PROMPT = """
You are a professional equity research analyst specializing in fundamental analysis and market sentiment.

You are given structured JSON data for several companies, including:
- 4 years of financial statements (income, balance sheet)
- Trailing P/E and P/B ratios
- Historical P/E ratios
- Recent news articles

For EACH company, do the following:
1. Carefully review Revenue, Net Income, Debt, P/E, and P/B trends.
2. Identify at least one PRO and one CON affecting the long-term investment thesis.
3. Weigh the evidence and recommend one of:
    - BUY (strong fundamentals and/or strong positive momentum)
    - WAIT (uncertain fundamentals or expensive valuation)
    - AVOID (declining fundamentals, negative sentiment)
4. Output a table with 4 columns:
| Ticker | Recommendation | Confidence (High/Medium/Low) | Reason |

Be concise but insightful. Base your reasoning on tangible financials and news data.
"""

def ask_chatgpt(data:dict) -> str:
    openai.api_key = os.getenv("OPENAI_API_KEY")
    if not openai.api_key:
        raise RuntimeError("OpenAI api key missing")

    user_prompt = (
        "Here is the JSON data containing financials and news:\n\n"
        + json.dumps(data, indent=2)
        + "\n\nPlease analyze each stock individually and generate the table."
    )

    response = openai.chat.completions.create(
        model="gpt-4o",
        messages= [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content":user_prompt}
        ],
        # Low temperature leads to more predictable response
        temperature=0.1,
    )

    return response.choices[0].message.content.strip()