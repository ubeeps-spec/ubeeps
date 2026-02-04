
import os
import glob
import re

def update_mobile_menu(filepath):
    print(f"Processing {filepath}...")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Define the regex pattern for the old mobile menu button
        # It looks for the md:hidden div containing the button and ends before the closing nav tag
        # We need to be careful not to replace too much. 
        # Strategy: Find the specific mobile button block and replace it, then insert the menu before </nav>
        
        # 1. Replace the button
        old_button_pattern = r'<div class="md:hidden flex items-center">\s*<button class="text-gray-600 hover:text-primary">\s*<i class="fas fa-bars text-2xl"></i>\s*</button>\s*</div>'
        
        new_button_html = '''<div class="md:hidden flex items-center">
                    <button class="text-gray-300 hover:text-white focus:outline-none p-2" onclick="document.getElementById('mobile-menu').classList.toggle('hidden')">
                        <i class="fas fa-bars text-2xl"></i>
                    </button>
                </div>'''
        
        content = re.sub(old_button_pattern, new_button_html, content)
        
        # 2. Add the mobile menu content if it's missing
        if 'id="mobile-menu"' not in content:
            mobile_menu_html = '''
        <!-- Mobile Menu, hidden by default -->
        <div id="mobile-menu" class="hidden md:hidden bg-brand-dark border-t border-gray-700">
            <div class="px-4 pt-2 pb-4 space-y-1">
                <a href="index.html" class="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-accent hover:bg-white/10 transition">首頁</a>
                <a href="about.html" class="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-accent hover:bg-white/10 transition">關於我們</a>
                <a href="science.html" class="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-accent hover:bg-white/10 transition">幹細胞科學</a>
                <a href="applications.html" class="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-accent hover:bg-white/10 transition">臨床應用</a>
                <a href="faq.html" class="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-accent hover:bg-white/10 transition">常見問題</a>
                <a href="news.html" class="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-accent hover:bg-white/10 transition">最新消息</a>
                <a href="#contact" class="block px-3 py-2 rounded-md text-base font-bold text-brand-dark bg-white hover:bg-gray-100 mt-4 text-center transition">立即諮詢</a>
            </div>
        </div>
    '''
            # Insert before the last closing </nav> tag
            # We use rsplit to find the last occurrence
            parts = content.rsplit('</nav>', 1)
            if len(parts) == 2:
                content = parts[0] + mobile_menu_html + '</nav>' + parts[1]
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  Updated {filepath}")
        else:
            print(f"  No changes needed for {filepath}")
        
    except Exception as e:
        print(f"  Error processing {filepath}: {e}")

# Get all HTML files except index.html (already manually updated)
html_files = glob.glob("*.html")
for file in html_files:
    if file != "index.html":
        update_mobile_menu(file)
