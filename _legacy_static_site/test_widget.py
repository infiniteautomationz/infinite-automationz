import ssl, urllib.request, os, json
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://services.leadconnectorhq.com/locations/43ttz135eUcQq32zMJUv"
req = urllib.request.Request(url, headers={
    "Authorization": "Bearer pit-e0ffeddd-9022-4dc5-b0e3-7631b34aa357",
    "Version": "2021-07-28",
    "Accept": "application/json"
})
try:
    with urllib.request.urlopen(req, context=ctx) as r:
        data = json.loads(r.read().decode())
        if 'location' in data:
            print(json.dumps(data['location'].get('chatWidget', 'No Chat Widget Data')))
            
except Exception as e:
    print("Error:", e)
