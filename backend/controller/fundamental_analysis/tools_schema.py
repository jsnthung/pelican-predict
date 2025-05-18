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