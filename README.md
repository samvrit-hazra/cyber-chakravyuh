# 🛡️ Cyber Chakravyuh

> **AI-Powered Web Threat Detection & Digital Trust Intelligence**  
> *Built for 48-Hour Hackathon • AI | Cybersecurity | Web3*

---

## 📖 Overview

**Cyber Chakravyuh** is an intelligent digital security platform designed to protect individuals and organisations against the modern wave of sophisticated web threats: phishing campaigns, fraudulent links, TLS/CA trust compromises, social engineering scams, and website misconfigurations.

By synthesizing **Cybersecurity heuristics**, **Artificial Intelligence explainability**, and **Web3 verifiable provenance**, Cyber Chakravyuh not only classifies threats with evidence-backed reasoning but also provides a tamper-evident on-chain threat registry.

---

## 🏛️ Core Modules

1. **Intelligent URL & Phishing Analysis:** Typosquatting, homograph detection, redirect chain tracking, domain age inspection, and reputation feeds (VirusTotal, Google Safe Browsing).
2. **TLS Certificate & Web Trust Analysis:** Deep HTTPS handshake inspection, certificate chain validation, Certificate Transparency (CT) logs (`crt.sh`), and distrusted CA detection.
3. **AI-Powered Scam & Message Analysis:** LLM-based detection of social engineering manipulation (urgency, spoofed institutions, fraudulent payment gateways) with automated indicator extraction.
4. **Intelligent Threat Correlation:** Correlates disparate reports sharing underlying IP infrastructure, domain naming schemes, or payment targets.
5. **Passive Website Security Assessment:** Evaluates security headers (CSP, HSTS, X-Frame-Options), TLS cipher suites, and exposed sensitive endpoints.
6. **Decentralized Threat Intelligence (Web3):** Hashes verified threat reports onto Ethereum (Sepolia testnet) via smart contracts, establishing immutable verification and provenance without exposing sensitive data on-chain.

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite, Tailwind CSS, Lucide Icons
- **Backend:** FastAPI (Python), Motor (Async MongoDB), Pydantic v2
- **Database:** MongoDB
- **AI/LLM:** Google Gemini API
- **Web3:** Solidity, Hardhat, Web3.py, Ethereum Sepolia Testnet
- **Threat Intelligence:** VirusTotal, Google Safe Browsing, crt.sh, WHOIS, DNS

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB instance (Local or MongoDB Atlas)

### Setup & Run
See [`SETUP.md`](file:///home/samvrit/Desktop/cyber-chakravyuh/SETUP.md) for full instructions.

```bash
# 1. Clone repository
git clone https://github.com/your-org/cyber-chakravyuh.git
cd cyber-chakravyuh

# 2. Configure environment
cp .env.example .env
# Edit .env with your keys (Gemini, VirusTotal, MongoDB, Web3 RPC)
```

---

## 📄 Documentation

- [System Context & Rules (`CONTEXT.md`)](file:///home/samvrit/Desktop/cyber-chakravyuh/CONTEXT.md)
- [Project Memory & Decisions (`MEMORY.md`)](file:///home/samvrit/Desktop/cyber-chakravyuh/MEMORY.md)
- [Local Setup Guide (`SETUP.md`)](file:///home/samvrit/Desktop/cyber-chakravyuh/SETUP.md)
- [Hackathon Problem Statement (`Problem Statement.md`)](file:///home/samvrit/Desktop/cyber-chakravyuh/Problem%20Statement.md)
- [License (`LICENSE.md`)](file:///home/samvrit/Desktop/cyber-chakravyuh/LICENSE.md)
