import os
import glob

def update_file(filepath):
    print(f"Processing {filepath}...")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace the link in navbar
        # Case 1: href="index.html#science" -> href="science.html"
        content = content.replace('href="index.html#science"', 'href="science.html"')
        
        # Case 2: href="#science" (only in index.html usually) -> href="science.html"
        # Be careful not to replace other anchors if any, but specifically the navbar one
        # Usually found as: <a href="#science" class="...">幹細胞科學</a>
        if 'href="#science"' in content:
            # We want to replace it only if it's the main nav link or similar call-to-actions
            # But "Learn More" buttons might also point there. 
            # If we split the page, all #science links should probably go to science.html
            content = content.replace('href="#science"', 'href="science.html"')

        # Special handling for active state
        if 'science.html' in filepath:
             # Make "Science" link active color (text-accent) and others text-white
             # This is a bit complex with regex, maybe just manual fix for science.html is better?
             # But let's at least point the link correctly.
             pass

        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  Updated {filepath}")
        else:
            print(f"  No changes needed for {filepath}")
            
    except Exception as e:
        print(f"  Error processing {filepath}: {e}")

# Get all HTML files
html_files = glob.glob("*.html")

for file in html_files:
    update_file(file)
