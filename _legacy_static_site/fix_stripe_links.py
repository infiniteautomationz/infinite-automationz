import urllib.request, json, ssl, urllib.parse

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

API_KEY = "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"

def req(url, data=None):
    if data:
        data = urllib.parse.urlencode(data, doseq=True).encode()
    r = urllib.request.Request(url, data=data)
    r.add_header("Authorization", f"Bearer {API_KEY}")
    try:
        with urllib.request.urlopen(r, context=ctx) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        if hasattr(e, "read"):
            print("Error:", e.read().decode())
        raise e

bundles = [
    {
        "name": "The Digital Presence Bundle (Updated)",
        "monthly": 14900,
        "setup": 99900
    },
    {
        "name": "The Operations & Scale Bundle (Updated)",
        "monthly": 29900,
        "setup": 249900
    },
    {
        "name": "The Social Growth Bundle (Updated)",
        "monthly": 19900,
        "setup": 149900
    }
]

links = {}

for b in bundles:
    print(f"Creating exact product for {b['name']}...")
    prod = req("https://api.stripe.com/v1/products", {"name": b["name"]})
    prod_id = prod["id"]
    
    price_setup = req("https://api.stripe.com/v1/prices", {
        "product": prod_id,
        "unit_amount": b["setup"],
        "currency": "usd"
    })
    
    price_monthly = req("https://api.stripe.com/v1/prices", {
        "product": prod_id,
        "unit_amount": b["monthly"],
        "currency": "usd",
        "recurring[interval]": "month"
    })
    
    plink = req("https://api.stripe.com/v1/payment_links", {
        "line_items[0][price]": price_setup["id"],
        "line_items[0][quantity]": 1,
        "line_items[1][price]": price_monthly["id"],
        "line_items[1][quantity]": 1,
        "subscription_data[trial_period_days]": 30
    })
    
    # store with original name
    original_name = b["name"].replace(" (Updated)", "")
    links[original_name] = plink["url"]
    print(f"Created {original_name} -> {plink['url']}")
    
with open("bundle_links_fixed.json", "w") as f:
    json.dump(links, f)
