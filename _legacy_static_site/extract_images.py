import re
import base64
import os

with open("index.html", "r") as f:
    html = f.read()

# Make sure assets/images exists
os.makedirs("assets/images", exist_ok=True)

# Find all base64 images
matches = re.finditer(r'src="(data:image/(png|jpeg);base64,([A-Za-z0-9+/=]+))"', html)

count = 0
for match in matches:
    full_string = match.group(1)
    img_type = match.group(2)
    b64_data = match.group(3)
    
    ext = "png" if img_type == "png" else "jpg"
    filename = f"extracted_img_{count}.{ext}"
    filepath = f"assets/images/{filename}"
    
    with open(filepath, "wb") as img_file:
        img_file.write(base64.b64decode(b64_data))
        
    print(f"Saved {filepath} ({len(b64_data)} bytes of base64)")
    
    # Replace in html
    html = html.replace(full_string, f"assets/images/{filename}")
    count += 1

with open("index.html", "w") as f:
    f.write(html)
    
print("Extraction complete. index.html updated.")
