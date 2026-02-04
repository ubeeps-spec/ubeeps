import requests
import os

url = "https://cdn.it.bgi.com/source/307baeb6ec6b3872a55792a9f672178.jpg"
output_path = os.path.join("images", "bgi_building.jpg")

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Referer": "https://www.bgi.com/"
}

try:
    print(f"Downloading from {url}...")
    response = requests.get(url, headers=headers, timeout=30)
    response.raise_for_status()
    
    with open(output_path, 'wb') as f:
        f.write(response.content)
    
    print(f"Successfully downloaded to {output_path}")
    print(f"File size: {len(response.content)} bytes")
except Exception as e:
    print(f"Error downloading: {e}")
