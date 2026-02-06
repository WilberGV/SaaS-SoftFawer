import requests
import os
import logging
from typing import List, Dict, Any

class ArkClient:
    """
    Client for interacting with BytePlus Ark API (DeepSeek v3).
    """
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("ARK_API_KEY")
        self.base_url = "https://ark.ap-southeast.bytepluses.com/api/v3/chat/completions"
        self.logger = logging.getLogger(__name__)

    def chat_completion(self, messages: List[Dict[str, str]], model: str = "deepseek-v3", temperature: float = 0.7) -> str:
        """
        Sends messages to DeepSeek v3 and returns the response content.
        """
        if not self.api_key:
            self.logger.error("ARK_API_KEY is missing")
            return "Error: Internal configuration issue (Missing API Key)."

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }

        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature
        }

        try:
            response = requests.post(self.base_url, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            # Assuming standard OpenAI-compatible format which Ark uses
            content = data['choices'][0]['message']['content']
            return content

        except requests.Exceptions.RequestException as e:
            self.logger.error(f"Ark API Request Error: {e}")
            if hasattr(e, 'response') and e.response:
                 self.logger.error(f"Response: {e.response.text}")
            return "Lo siento, tuve un problema al procesar tu mensaje."
