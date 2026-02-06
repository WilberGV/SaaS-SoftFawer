import asyncio
from modal_backend.handlers.ai_bot import handle_ai_bot
from modal_backend.common.ark_client import ArkClient

# Mock Config
mock_config = {
    "type": "ai",
    "prompt": "Eres un experto en pizzas. Vendes pizzas.",
    "model": "deepseek-v3",
    "business_info": "Pizzería Luiggi. Tenemos Pepperoni (10$) y Margarita (8$)."
}

# Mock History
mock_history = [
    {"role": "user", "content": "Hola"},
    {"role": "assistant", "content": "Hola! Bienvenido a Pizzería Luiggi. ¿Qué te gustaría ordenar?"}
]

def test_ai_logic():
    print("--- Testing AI Bot Logic (DeepSeek v3) ---")
    
    # Needs API Key in env for real test, or we mock the client
    # For this safe check, we will mock the client response if no key is present to avoid crashing
    
    import os
    if not os.getenv("ARK_API_KEY"):
        print("WARNING: ARK_API_KEY not found. Using Mock Client.")
        class MockArk(ArkClient):
            def chat_completion(self, messages, model, temperature=0.7):
                print(f"   [Mock Call] Model: {model}")
                print(f"   [Mock Call] Messages: {messages}")
                return "Respuesta simulada de DeepSeek: Claro, una de Pepperoni sale en 15 minutos."
        
        client = MockArk(api_key="mock")
    else:
        print("Using REAL Ark Client")
        client = ArkClient()

    user_msg = "Quiero una de pepperoni por favor."
    print(f"User: {user_msg}")
    
    response = handle_ai_bot(user_msg, mock_history, mock_config, client)
    
    print(f"Bot: {response}")
    print("--- Test Completed ---")

if __name__ == "__main__":
    test_ai_logic()
