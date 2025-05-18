from openai import OpenAI
import os
import json
from pathlib import Path
from dotenv import load_dotenv

from system_prompt import SYSTEM_PROMPT
from tools_schema import TOOLS

# Load .env
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

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
