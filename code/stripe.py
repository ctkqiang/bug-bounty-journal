import stripe

# 🚨 P1: This key should NEVER be public-facing
stripe.api_key = "pk_live_6Q8w0SU4FvZknkWNDvOnrSGy"

try:
    # Example API call - list last 5 customers
    customers = stripe.Customer.list(limit=10)

    print("🔥 Connection successful. Retrieved customers:")
    for c in customers["data"]:
        print(f"- {c['id']} | {c.get('email')}")
except stripe.error.AuthenticationError:
    print("❌ Invalid key or access denied.")
except Exception as e:
    print(f"⚠️ Something went wrong: {e}")
