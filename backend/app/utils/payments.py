import secrets
from urllib.parse import urlencode
import hmac, hashlib

def new_reference() -> str:
    return secrets.token_hex(12)

# Stub builder: in production, call provider initialize endpoints to get an auth checkout URL
# This function mimics a redirect URL for demo purposes only.

def build_checkout_url(provider: str, reference: str, amount: float, currency: str) -> str:
    base = "https://checkout.example.com/" + provider
    q = urlencode({"reference": reference, "amount": int(amount * 100), "currency": currency})
    return f"{base}?{q}"

def verify_signature(provider: str, headers: dict, body_bytes: bytes, secret: str | None = None) -> bool:
    try:
        if not secret:
            return False
        provider = (provider or '').lower()
        if provider == 'paystack':
            sig = headers.get('x-paystack-signature') or headers.get('X-Paystack-Signature')
            if not sig:
                return False
            digest = hmac.new(secret.encode('utf-8'), body_bytes, hashlib.sha512).hexdigest()
            return hmac.compare_digest(digest, sig)
        elif provider == 'flutterwave':
            # Flutterwave sets 'verif-hash' header equal to secret
            verif = headers.get('verif-hash') or headers.get('Verif-Hash')
            return verif == secret
        else:
            return False
    except Exception:
        return False
