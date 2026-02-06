from typing import Dict, Any, List
import logging
from ..common.ark_client import ArkClient

logger = logging.getLogger(__name__)

def handle_ai_bot(
    message_text: str,
    chat_history: List[Dict[str, Any]],
    config: Dict[str, Any],
    ark_client: ArkClient
) -> str:
    """
    Processes a user message using DeepSeek v3 via ArkClient.
    
    Args:
        message_text: The user's input.
        chat_history: List of previous messages (dict with 'role' and 'content').
        config: Bot configuration containing 'prompt' and 'model'.
        ark_client: Instance of ArkClient to make the API call.
        
    Returns:
        The text response from the AI.
    """
    
    # 1. Construct System Prompt
    system_prompt = config.get("prompt", "Eres un asistente útil y amable.")
    
    # Contextual data injection (if we had specific context like business info in config)
    business_info = config.get("business_info", "")
    if business_info:
        system_prompt += f"\n\nInformación del negocio:\n{business_info}"

    messages = [{"role": "system", "content": system_prompt}]
    
    # 2. Append Chat History (normalize keys if necessary)
    # Firestore might store timestamp, etc. We just need role/content.
    for msg in chat_history:
        role = msg.get("role")
        content = msg.get("content")
        if role and content:
            # Map 'bot' role to 'assistant' for OpenAI/DeepSeek compatibility if needed
            if role == "bot": role = "assistant"
            messages.append({"role": role, "content": content})
            
    # 3. Append Current User Message
    messages.append({"role": "user", "content": message_text})
    
    # 4. Call LLM
    model = config.get("model", "deepseek-v3")
    response_text = ark_client.chat_completion(messages=messages, model=model)
    
    return response_text
