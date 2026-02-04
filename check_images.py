import os
from PIL import Image

image_dir = 'images/extracted'
files = [f for f in os.listdir(image_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

print(f"Checking {len(files)} images in {image_dir}...")

candidates = []

for f in files:
    try:
        path = os.path.join(image_dir, f)
        with Image.open(path) as img:
            w, h = img.size
            # Logos are usually small (width < 300, height < 150) or have aspect ratio > 2
            # But let's just print all PNGs and small JPGs
            if f.lower().endswith('.png') or (w < 400 and h < 200):
                print(f"{f}: {w}x{h}")
                candidates.append((f, w, h))
    except Exception as e:
        print(f"Error reading {f}: {e}")

print("\nPotential logo candidates (PNGs or small images):")
for c in candidates:
    print(c)
