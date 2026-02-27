import re

files = ["index.html", "individual-pricing.html"]

for file in files:
    with open(file, "r") as f:
        html = f.read()
    
    # Replace phone numbers
    html = html.replace("(256) 555-1234", "(757) 810-7810")
    html = html.replace("tel:+12565551234", "tel:+17578107810")
    
    # Replace calendar ID in index.html
    html = html.replace("REPLACE_WITH_CALENDAR_ID", "EkFZRGItnUUIHkgx1g6b")
    
    # Let's save it
    with open(file, "w") as f:
        f.write(html)
        
print("Updated HTML files with Phone and Calendar ID")
