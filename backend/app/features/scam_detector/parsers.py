import re
import email
from email import policy
from email.utils import parseaddr
from typing import Tuple, Dict, List
from app.features.scam_detector.models import ParsedContext

# Known brands often spoofed in display names
TARGET_BRANDS = [
    "paypal", "netflix", "amazon", "apple", "microsoft", "google", "meta",
    "facebook", "instagram", "whatsapp", "fedex", "dhl", "usps", "india post",
    "sbi", "hdfc", "icici", "chase", "wells fargo", "bank of america", "irs",
    "income tax", "binance", "coinbase", "metamask", "telegram"
]

WHATSAPP_LINE_REGEX = re.compile(
    r'^(?:\[?(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\]?(?:\s*-\s*|\s+))([^:]+):\s*(.*)$'
)


def detect_format(raw_text: str, user_override: str = "auto") -> str:
    """
    Detects the format of the input message (whatsapp_chat, email_raw, or plain_text).
    """
    if user_override and user_override != "auto":
        return user_override

    stripped = raw_text.strip()

    # 1. Check for Email Headers
    email_header_matches = 0
    for header in ["From:", "Subject:", "Date:", "To:", "Reply-To:", "Return-Path:"]:
        if re.search(rf'^{header}', stripped, re.IGNORECASE | re.MULTILINE):
            email_header_matches += 1

    if email_header_matches >= 2:
        return "email_raw"

    # 2. Check for WhatsApp Export lines
    lines = [line.strip() for line in stripped.splitlines() if line.strip()]
    wa_match_count = sum(1 for line in lines[:15] if WHATSAPP_LINE_REGEX.match(line))
    if wa_match_count >= 2:
        return "whatsapp_chat"

    return "plain_text"


def parse_email_raw(raw_text: str) -> Tuple[ParsedContext, str]:
    """
    Parses raw RFC 822 / MIME email text and extracts headers, body, and spoofing indicators.
    """
    try:
        msg = email.message_from_string(raw_text, policy=policy.default)
    except Exception:
        return ParsedContext(detected_format="email_raw"), raw_text

    sender = msg.get("From", "")
    recipient = msg.get("To", "")
    subject = msg.get("Subject", "")
    date_str = msg.get("Date", "")
    reply_to = msg.get("Reply-To", "")

    headers_dict = {}
    for h in ["From", "To", "Subject", "Date", "Reply-To", "Return-Path", "Authentication-Results"]:
        val = msg.get(h)
        if val:
            headers_dict[h] = str(val)

    # Spoofing checks
    spoofing_indicators = []
    display_name, email_addr = parseaddr(sender)
    display_lower = display_name.lower()
    email_lower = email_addr.lower()

    if "@" in email_lower:
        email_domain = email_lower.split("@")[-1]
        for brand in TARGET_BRANDS:
            if brand in display_lower and brand not in email_domain:
                spoofing_indicators.append(
                    f"Brand Impersonation in Email Header: Display name claims '{display_name}' but sent from unrelated domain '@{email_domain}'"
                )
                break

    if reply_to and reply_to.strip() != sender.strip():
        _, reply_email = parseaddr(reply_to)
        if reply_email and reply_email.lower() != email_lower:
            spoofing_indicators.append(
                f"Mismatched Reply-To Address: Replies routed to '{reply_email}' instead of sender '{email_addr}'"
            )

    # Extract clean body text
    body_text = ""
    try:
        body_part = msg.get_body(preferencelist=('plain', 'html'))
        if body_part:
            body_text = body_part.get_content()
    except Exception:
        pass

    if not body_text:
        # Fallback to payload or strip headers
        body_lines = []
        is_body = False
        for line in raw_text.splitlines():
            if not is_body and line.strip() == "":
                is_body = True
                continue
            if is_body:
                body_lines.append(line)
        body_text = "\n".join(body_lines) if body_lines else raw_text

    # Strip HTML tags if body contains HTML markup
    if "<html" in body_text.lower() or "<p>" in body_text.lower() or "<a " in body_text.lower():
        body_text = re.sub(r'<[^>]+>', ' ', body_text)
        body_text = re.sub(r'\s+', ' ', body_text).strip()

    context = ParsedContext(
        detected_format="email_raw",
        sender=sender,
        recipient=recipient,
        subject=subject,
        timestamp=date_str,
        headers=headers_dict,
        message_count=1,
        participants=[sender] if sender else [],
        spoofing_indicators=spoofing_indicators
    )

    return context, body_text


def parse_whatsapp_export(raw_text: str) -> Tuple[ParsedContext, str]:
    """
    Parses WhatsApp conversation exports (iOS and Android formats).
    """
    lines = raw_text.splitlines()
    participants = set()
    cleaned_dialogue = []
    first_timestamp = None
    msg_count = 0

    for line in lines:
        line_clean = line.strip()
        if not line_clean:
            continue

        match = WHATSAPP_LINE_REGEX.match(line_clean)
        if match:
            date_part, time_part, sender_part, text_part = match.groups()
            sender = sender_part.strip()

            # Ignore system notifications
            if "Messages and calls are end-to-end encrypted" in text_part:
                continue

            participants.add(sender)
            msg_count += 1
            if not first_timestamp:
                first_timestamp = f"{date_part} {time_part}"

            cleaned_dialogue.append(f"{sender}: {text_part}")
        else:
            # Continuation of previous message
            if cleaned_dialogue:
                cleaned_dialogue[-1] += " " + line_clean
            else:
                cleaned_dialogue.append(line_clean)

    synthesized_body = "\n".join(cleaned_dialogue) if cleaned_dialogue else raw_text

    context = ParsedContext(
        detected_format="whatsapp_chat",
        sender=", ".join(list(participants)[:3]) if participants else None,
        timestamp=first_timestamp,
        message_count=max(msg_count, 1),
        participants=list(participants)
    )

    return context, synthesized_body


def parse_plain_text(raw_text: str) -> Tuple[ParsedContext, str]:
    """
    Processes generic SMS, instant messages, and plain text.
    """
    cleaned = raw_text.strip()
    context = ParsedContext(
        detected_format="plain_text",
        message_count=1
    )
    return context, cleaned
