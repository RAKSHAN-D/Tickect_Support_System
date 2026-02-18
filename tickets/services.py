import json
import logging
from google import genai
from django.conf import settings

logger = logging.getLogger(__name__)

ALLOWED_CATEGORIES = ["billing", "technical", "account", "general"]
ALLOWED_PRIORITIES = ["low", "medium", "high", "critical"]


def classify_ticket_description(description: str):
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)

        prompt = f"""
You are a support ticket classifier.
Allowed categories:
- billing
- technical
- account
- general
Allowed priorities:
- low
- medium
- high
- critical
Respond ONLY in valid JSON format with no extra text:
{{
  "category": "...",
  "priority": "..."
}}
Ticket Description:
{description}
"""

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        content = response.text.strip()

        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
            content = content.strip()

        parsed = json.loads(content)

        category = parsed.get("category")
        priority = parsed.get("priority")

        if category not in ALLOWED_CATEGORIES:
            category = None
        if priority not in ALLOWED_PRIORITIES:
            priority = None

        return {
            "suggested_category": category,
            "suggested_priority": priority
        }

    except Exception as e:
        logger.error(f"LLM classification failed: {str(e)}")
        return {
            "suggested_category": None,
            "suggested_priority": None
        }