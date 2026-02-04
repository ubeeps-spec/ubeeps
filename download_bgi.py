import requests
import os

url = "https://cdn.it.bgi.com/source/307baeb6ec6b3872a55792a9f672178.jpg"
output_path = "images/bgi_building.jpg"

try:
    print(f"Attempting to download {url}...")
    response = requests.get(url, timeout=30, verify=False)
    print(f"Status code: {response.status_code}")
    response.raise_for_status()
    
    with open(output_path, 'wb') as f:
        f.write(response.content)
    
    if os.path.exists(output_path):
        print(f"Success! Downloaded {output_path}, size: {os.path.getsize(output_path)} bytes")
    else:
        print("Error: File not found after write.")
except Exception as e:
    print(f"Error: {e}")
