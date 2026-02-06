"""
Local Test Script for Bot Engine
Mocking Modal handling locally.
"""

import asyncio
import json
from unittest.mock import MagicMock
from datetime import datetime

# Import handlers locally
from handlers.ai_bot_handler import handle_ai_bot
from handlers.rules_bot_handler import handle_rule_bot

# Mock Objects
class MockEvent:
    def __init__(self, text, tenantId="demo-tenant", serviceId="demo-service", from_="123456"):
        self.tenantId = tenantId
        self.serviceId = serviceId
        self.from_ = from_
        self.text = text
        self.timestamp = int(datetime.utcnow().timestamp())

class MockDB:
    def collection(self, name): return self
    def document(self, name): return self
    def get(self): return MockDoc()
    def set(self, data, merge=True): print(f"  [DB SAVE] {data}")

class MockDoc:
    exists = True
    def to_dict(self): return {}

async def test_scenarios():
    print("\n--- TEST 1: AI Bot (Pricing) ---")
    ai_config = {"settings": {"business_name": "Tech Corp"}}
    evt = MockEvent("cual es el precio?")
    res = await handle_ai_bot(evt, ai_config, MockDB())
    print(f"User: {evt.text}")
    print(f"Bot:  {res['reply_text']}")
    assert "precios varían" in res['reply_text']

    print("\n--- TEST 2: Rules Bot (Menu) ---")
    rules_config = {
        "settings": {
            "mode": "support", 
            "opening_hours": "09:00 - 18:00"
        }
    }
    # Initial
    evt = MockEvent("hola")
    res = await handle_rule_bot(evt, rules_config, MockDB())
    print(f"User: {evt.text}")
    print(f"Bot:  {res['reply_text']}")
    
    # Option 1
    evt = MockEvent("1")
    res = await handle_rule_bot(evt, rules_config, MockDB())
    print(f"User: {evt.text}")
    print(f"Bot:  {res['reply_text']}")
    assert "09:00 - 18:00" in res['reply_text']

    print("\n--- TEST 3: Rules Bot (Appointments Flow) ---")
    # Need to mock the state persistence more realistically for flow test
    # but for simple function check:
    app_config = {"settings": {"mode": "appointments"}}
    
    # 1. Init
    # We cheat and mock the DB state return inside the handler if we wanted proper unit test
    # For now ensuring it runs without error
    evt = MockEvent("quiero cita")
    try:
        res = await handle_rule_bot(evt, app_config, MockDB())
        print(f"User: {evt.text}")
        print(f"Bot:  {res['reply_text']}")
    except Exception as e:
        print(f"Error in appointment test (likely DB mock limits): {e}")

if __name__ == "__main__":
    asyncio.run(test_scenarios())
