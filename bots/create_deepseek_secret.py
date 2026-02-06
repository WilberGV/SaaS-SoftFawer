"""
Create DeepSeek Secret in Modal (Clean)
"""
import modal
import os
import subprocess
import sys

API_KEY = "7da8107d-403a-43c2-a11e-182a7524bae9"

print("Creating deepseek-secret...")

result = subprocess.run([
    sys.executable, "-m", "modal", "secret", "create", 
    "deepseek-secret",
    f"DEEPSEEK_API_KEY={API_KEY}"
], capture_output=True, text=True, encoding="utf-8") # Enforce encoding reading

if result.returncode == 0:
    print("Secret created successfully.")
else:
    print(f"Error creating secret: {result.stderr}")
