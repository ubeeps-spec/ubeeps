import requests
import re
from urllib.parse import urljoin

url = "https://www.bgi.com/area"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

try:
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()
    
    # Simple regex to find image sources
    img_tags = re.findall(r'<img[^>]+src="([^">]+)"', response.text)
    
    print(f"Found {len(img_tags)} images:")
    for img in img_tags:
        full_url = urljoin(url, img)
        if "jpg" in full_url.lower() or "png" in full_url.lower():
             print(full_url)
             
except Exception as e:
    print(f"Error: {e}")
