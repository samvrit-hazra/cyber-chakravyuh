import ipaddress
import socket
from urllib.parse import urlparse


def is_safe_url(target_url: str) -> bool:
    """
    Validates URL to protect against SSRF.
    Rejects private, loopback, link-local, and reserved IP ranges.
    """
    try:
        parsed = urlparse(target_url)
        if parsed.scheme not in ("http", "https"):
            return False

        hostname = parsed.hostname
        if not hostname:
            return False

        # Disallow localhost directly
        if hostname.lower() in ("localhost", "127.0.0.1", "0.0.0.0"):
            return False

        # Resolve IP and check if private
        ip_str = socket.gethostbyname(hostname)
        ip = ipaddress.ip_address(ip_str)

        if ip.is_private or ip.is_loopback or ip.is_reserved or ip.is_link_local:
            return False

        return True
    except Exception:
        return False
