import re
import os

with open("index.html", "r") as f:
    html = f.read()

# Find the main CSS block
style_pattern = re.compile(r'<style>(.*?)</style>', re.DOTALL)
match = style_pattern.search(html)

if match:
    css_content = match.group(1).strip()
    
    os.makedirs("assets/css", exist_ok=True)
    with open("assets/css/main.css", "w") as f:
        f.write(css_content)
    print(f"Extracted {len(css_content)} bytes of CSS to assets/css/main.css")
    
    link_tag = '<link rel="stylesheet" href="assets/css/main.css">'
    
    # Replace in index.html
    new_html = html[:match.start()] + link_tag + html[match.end():]
    with open("index.html", "w") as f:
        f.write(new_html)
    print("Replaced <style> in index.html with <link>")
    
    # Replace in individual-pricing.html
    with open("individual-pricing.html", "r") as f:
        pricing_html = f.read()
    
    # Note: individual-pricing.html might also have the same <style> block, let's find and replace it
    match_pricing = style_pattern.search(pricing_html)
    if match_pricing:
        new_pricing_html = pricing_html[:match_pricing.start()] + link_tag + pricing_html[match_pricing.end():]
        with open("individual-pricing.html", "w") as f:
            f.write(new_pricing_html)
        print("Replaced <style> in individual-pricing.html with <link>")
else:
    print("No <style> block found!")

