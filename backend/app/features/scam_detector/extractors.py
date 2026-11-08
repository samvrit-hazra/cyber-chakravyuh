import re
from typing import List
from app.features.scam_detector.models import ExtractedIndicators

URL_PATTERN = re.compile(
    r'(?:https?://|www\.)[^\s<>"{}|\\^`]+',
    re.IGNORECASE
)

EMAIL_PATTERN = re.compile(
    r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
)

PHONE_PATTERN = re.compile(
    r'(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{3,5}'
)

CRYPTO_BTC = re.compile(r'\b(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{39,59})\b')
CRYPTO_ETH = re.compile(r'\b(0x[a-fA-F0-9]{40})\b')
CRYPTO_TRON = re.compile(r'\b(T[A-Za-z1-9]{33})\b')

UPI_PATTERN = re.compile(
    r'\b[a-zA-Z0-9.\-_]{2,64}@(oksbi|okhdfcbank|okaxis|okicici|paytm|ybl|upi|apl|axl|ibl|barodampay|federal|kotak|postbank)\b',
    re.IGNORECASE
)

IBAN_PATTERN = re.compile(r'\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b')


def extract_indicators(text: str) -> ExtractedIndicators:
    """
    Extracts URLs, email addresses, phone numbers, crypto wallet addresses,
    and payment handles from the submitted text.
    """
    # 1. URLs
    raw_urls = URL_PATTERN.findall(text)
    clean_urls = []
    seen_urls = set()
    for u in raw_urls:
        # Strip trailing punctuation
        cleaned = re.sub(r'[.,;:\'")>\]]+$', '', u)
        if not cleaned.startswith(("http://", "https://")):
            cleaned = "https://" + cleaned
        if cleaned not in seen_urls:
            seen_urls.add(cleaned)
            clean_urls.append(cleaned)

    # 2. Emails
    raw_emails = EMAIL_PATTERN.findall(text)
    clean_emails = []
    seen_emails = set()
    for e in raw_emails:
        el = e.lower()
        if el not in seen_emails:
            seen_emails.add(el)
            clean_emails.append(e)

    # 3. Phone Numbers
    raw_phones = PHONE_PATTERN.findall(text)
    clean_phones = []
    seen_phones = set()
    for p in raw_phones:
        digits_only = re.sub(r'\D', '', p)
        # Must have between 7 and 15 digits to qualify as a valid phone number
        if 7 <= len(digits_only) <= 15:
            p_strip = p.strip()
            if p_strip not in seen_phones:
                seen_phones.add(p_strip)
                clean_phones.append(p_strip)

    # 4. Crypto Addresses
    crypto_addrs = []
    seen_crypto = set()

    for btc in CRYPTO_BTC.findall(text):
        if btc not in seen_crypto:
            seen_crypto.add(btc)
            crypto_addrs.append(f"BTC: {btc}")

    for eth in CRYPTO_ETH.findall(text):
        if eth not in seen_crypto:
            seen_crypto.add(eth)
            crypto_addrs.append(f"ETH/EVM: {eth}")

    for tron in CRYPTO_TRON.findall(text):
        if tron not in seen_crypto:
            seen_crypto.add(tron)
            crypto_addrs.append(f"TRON/USDT: {tron}")

    # 5. Payment Handles (UPI & Bank Accounts)
    payment_handles = []
    seen_pay = set()

    for upi in UPI_PATTERN.finditer(text):
        val = upi.group(0).lower()
        if val not in seen_pay:
            seen_pay.add(val)
            payment_handles.append(f"UPI: {val}")

    for iban in IBAN_PATTERN.findall(text):
        if iban not in seen_pay:
            seen_pay.add(iban)
            payment_handles.append(f"IBAN: {iban}")

    # Check for gift card payment solicitation
    gift_card_matches = re.findall(
        r'\b(google\s*play|apple\s*gift\s*card|itunes|steam\s*wallet|amazon\s*gift\s*card)\b',
        text,
        re.IGNORECASE
    )
    if gift_card_matches:
        for gc in set(gift_card_matches):
            payment_handles.append(f"Gift Card Solicitation: {gc.title()}")

    return ExtractedIndicators(
        urls=clean_urls,
        emails=clean_emails,
        phone_numbers=clean_phones,
        crypto_addresses=crypto_addrs,
        payment_handles=payment_handles
    )
