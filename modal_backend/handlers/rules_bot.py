from typing import Dict, Any, Optional
import re
import logging

logger = logging.getLogger(__name__)

def handle_rules_bot(
    message_text: str,
    config: Dict[str, Any]
) -> str:
    """
    Processes a user message based on defined rules in the config.
    
    Args:
        message_text: The user's input.
        config: Bot configuration containing 'rules'.
        
    Returns:
        The matching response or a default fallback.
    """
    rules = config.get("rules", {})
    keywords_config = rules.get("keywords", [])
    default_response = rules.get("default_fallback", "Lo siento, no entendí tu mensaje. ¿Puedes intentar de otra forma?")
    
    # Clean message text for matching
    clean_text = message_text.lower().strip()
    
    # 1. Check for keyword matches
    for rule in keywords_config:
        patterns = rule.get("patterns", [])
        response = rule.get("response", "")
        
        for pattern in patterns:
            # Simple keyword match or regex
            if re.search(rf"\b{re.escape(pattern.lower())}\b", clean_text):
                return response
                
    # 2. Return default if no matches
    return default_response
