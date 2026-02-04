import requests
import os
import time

# Directory for images
output_dir = "images"
os.makedirs(output_dir, exist_ok=True)

# Headers to mimic a browser
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

# Image mapping: (filename, list of Unsplash IDs)
image_tasks = [
    # Heart / Cardiac regeneration
    ("science_heart.jpg", ["photo-1559757175-5700dde675bc", "photo-1628348068343-c6a848d2b6dd", "photo-1530026405186-ed1f139313f8"]),
    ("science_heart_2.jpg", ["photo-1628348068343-c6a848d2b6dd", "photo-1559757175-5700dde675bc"]),
    ("science_heart_3.jpg", ["photo-1530026405186-ed1f139313f8", "photo-1576086213369-97a306d36557"]),
    
    # Stem Cell / Microscope view
    ("stem_cell_science.jpg", ["photo-1532187863486-abf9dbad1b69", "photo-1530026405186-ed1f139313f8"]),
    
    # Lab / Research / Scientist
    ("science_lab.jpg", ["l-NIPb-9Njg", "WLxQvbMyfas", "Q1p7bh3SHj8", "J103z2585kQ"]),
    # l-NIPb-9Njg: Scientist working
    # WLxQvbMyfas: Pipette and tubes
    
    # DNA / Genetics (if needed for background)
    ("science_dna.jpg", ["G1N9kDHqBrQ", "sang50Jkacc", "DNA12345678"]), 
    
    # Diagrammatic / Abstract body (for mechanism)
    ("science_body.jpg", ["4_hF-Ugy6Yg", "HOrhCnQsxbQ"])
]

def download_image(filename, candidate_ids):
    print(f"Attempting to download {filename}...")
    for photo_id in candidate_ids:
        # Try direct image URL (more reliable without API key)
        # Clean the ID if it contains 'photo-' prefix (though the URL structure handles it)
        url = f"https://images.unsplash.com/{photo_id}?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
        try:
            print(f"  - Trying URL: {url}")
            response = requests.get(url, headers=headers, allow_redirects=True, stream=True, timeout=10)
            
            if response.status_code == 200:
                # Verify it's actually an image
                content_type = response.headers.get('content-type', '')
                if 'image' not in content_type:
                    print(f"    Skipping: Content-type is {content_type}")
                    continue
                    
                total_size = 0
                with open(os.path.join(output_dir, filename), 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)
                            total_size += len(chunk)
                
                if total_size > 1000: # Ensure not empty error page
                    print(f"    Success! Saved to {filename}")
                    return True
                else:
                    print("    File too small, likely error.")
            else:
                print(f"    Failed with status {response.status_code}")
                
        except Exception as e:
            print(f"    Error: {e}")
        
        time.sleep(1) # Be nice to the server
    
    print(f"Could not download {filename} after trying all candidates.")
    return False

# Execute
for filename, ids in image_tasks:
    download_image(filename, ids)
