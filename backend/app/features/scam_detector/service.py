import uuid
import re
from datetime import datetime, timezone
from typing import List, Tuple, Dict, Any

from app.features.scam_detector.models import (
    ScamAnalyzeRequest,
    ScamAnalyzeResponse,
    ExtractedIndicators,
    ParsedContext,
    CorrelatedThreat,
    ScamFinding
)
from app.features.scam_detector.parsers import (
    detect_format,
    parse_email_raw,
    parse_whatsapp_export,
    parse_plain_text
)
from app.features.scam_detector.extractors import extract_indicators
from app.features.scam_detector.threat_correlator import correlate_indicators
from app.core.groq_client import query_groq
from app.core.database import get_database


class ScamDetectorService:

    def detect_heuristics(
        self,
        cleaned_text: str,
        parsed_ctx: ParsedContext,
        indicators: ExtractedIndicators,
        correlated_threats: List[CorrelatedThreat]
    ) -> Tuple[List[ScamFinding], List[str], int]:
        findings = []
        tactics = []
        base_score = 0
        text_lower = cleaned_text.lower()

        # 1. Email Header Spoofing Findings
        for spoof in parsed_ctx.spoofing_indicators:
            findings.append(ScamFinding(
                category="spoofing",
                indicator="Header Spoofing / Sender Impersonation",
                severity="critical",
                evidence=spoof,
                impact="Attacker is disguising sender identity to masquerade as a trusted brand",
                remediation="Do not trust sender identity; inspect genuine envelope sender domain"
            ))
            tactics.append("Identity Spoofing")
            base_score += 45

        # 2. Correlated Threat Intelligence (Verified Evidence of Fraud)
        for ct in correlated_threats:
            if ct.verdict == "malicious":
                findings.append(ScamFinding(
                    category="threat_intelligence",
                    indicator=f"Verified Malicious {ct.indicator_type.upper()}: {ct.value}",
                    severity="critical",
                    evidence=f"Threat intelligence feeds (VirusTotal/Heuristics) confirmed indicator as malicious: {ct.details}",
                    impact="Clicking or interacting with this indicator leads directly to an active attack infrastructure",
                    remediation="Block the indicator immediately and do not open or interact with it"
                ))
                tactics.append("Weaponized Malicious Payload")
                base_score += 50
            elif ct.verdict == "suspicious":
                findings.append(ScamFinding(
                    category="threat_intelligence",
                    indicator=f"Suspicious {ct.indicator_type.upper()}: {ct.value}",
                    severity="high",
                    evidence=f"Flagged by threat feeds or heuristic anomaly: {ct.details}",
                    impact="Indicator exhibits structural anomalies or reputational risks",
                    remediation="Avoid interacting with unverified destinations"
                ))
                base_score += 25

        # 3. Urgency & Coercion Patterns
        urgency_kws = [
            "immediately", "within 24 hours", "account suspended", "final notice",
            "electricity disconnected", "arrest warrant", "legal action", "deactivation",
            "sim block", "law enforcement", "urgent"
        ]
        matched_urgency = [kw for kw in urgency_kws if kw in text_lower]
        if matched_urgency:
            tactics.append("Artificial Urgency & Coercion")
            findings.append(ScamFinding(
                category="social_engineering",
                indicator=f"Urgency-Based Psychological Pressure ({', '.join(matched_urgency[:3])})",
                severity="medium" if base_score > 0 else "low",
                evidence=f"Message uses coercive language: '{', '.join(matched_urgency[:3])}'",
                impact="Designed to panic the recipient into bypassing rational security judgment",
                remediation="Pause and verify through official channels before reacting to urgent demands"
            ))
            base_score += 15

        # 4. Credential & KYC Harvesting
        kyc_kws = ["update kyc", "verify kyc", "update pan", "update aadhaar", "share otp", "enter otp", "login to claim", "confirm password"]
        matched_kyc = [kw for kw in kyc_kws if kw in text_lower]
        if matched_kyc and indicators.urls:
            tactics.append("Credential / KYC Harvesting")
            findings.append(ScamFinding(
                category="credential_harvesting",
                indicator="KYC / Sensitive Credential Harvesting via External Link",
                severity="critical" if base_score >= 30 else "high",
                evidence=f"Message pairs credential requests ('{', '.join(matched_kyc)}') with link: {indicators.urls[0]}",
                impact="Direct theft of personal identity documents, banking logins, or session tokens",
                remediation="Never enter credentials or KYC documents on links received via SMS/WhatsApp"
            ))
            base_score += 35

        # 5. Financial Solicitation (Crypto / Untraceable UPI / Gift Cards)
        if indicators.crypto_addresses or any("gift card" in p.lower() for p in indicators.payment_handles):
            tactics.append("Irreversible / Untraceable Payment Demand")
            findings.append(ScamFinding(
                category="payment_fraud",
                indicator="Demand for Irreversible Cryptographic or Gift Card Payment",
                severity="high",
                evidence=f"Extracted payment targets: {indicators.crypto_addresses + indicators.payment_handles}",
                impact="Funds transferred via crypto or gift cards cannot be recovered or disputed",
                remediation="Legitimate organizations and government agencies NEVER demand gift cards or crypto"
            ))
            base_score += 30
        elif indicators.payment_handles:
            tactics.append("Peer-to-Peer Payment Solicitation")
            findings.append(ScamFinding(
                category="payment_fraud",
                indicator=f"Personal Payment Handle Solicitation ({', '.join(indicators.payment_handles[:2])})",
                severity="medium",
                evidence=f"Extracted payment handles: {', '.join(indicators.payment_handles[:2])}",
                impact="Direct P2P money transfer without escrow or invoice protection",
                remediation="Confirm payee identity with the purported sender via a separate phone call"
            ))
            base_score += 15

        # 6. Lottery, Prize, or Unrealistic Financial Lures
        lure_kws = ["won lottery", "congratulations won", "prize winner", "double your money", "guaranteed profit", "free gift"]
        matched_lures = [kw for kw in lure_kws if kw in text_lower]
        if matched_lures:
            tactics.append("Unrealistic Financial Lure / Greed Exploitation")
            findings.append(ScamFinding(
                category="social_engineering",
                indicator=f"Prize / Advance Fee Fraud Hook ({', '.join(matched_lures)})",
                severity="high",
                evidence=f"Unsolicited prize or reward promise: '{', '.join(matched_lures)}'",
                impact="Advance fee fraud: victims are asked to pay fees or taxes before receiving a nonexistent prize",
                remediation="Disregard unsolicited sweepstakes, lottery, or investment reward promises"
            ))
            base_score += 25

        tactics_unique = list(dict.fromkeys(tactics))
        return findings, tactics_unique, min(base_score, 100)

    async def query_ai_synthesis(
        self,
        cleaned_text: str,
        parsed_ctx: ParsedContext,
        indicators: ExtractedIndicators,
        correlated_threats: List[CorrelatedThreat],
        findings: List[ScamFinding],
        tactics: List[str],
        base_score: int
    ) -> Dict[str, Any]:
        """
        Invokes Groq LLM to synthesize social engineering cues, technical evidence,
        and provide a human-friendly explainable breakdown.
        """
        threat_summaries = []
        for ct in correlated_threats:
            threat_summaries.append(f"- [{ct.verdict.upper()}] {ct.indicator_type}: {ct.value} ({ct.details})")
        threat_str = "\n".join(threat_summaries) or "No external threat hits."

        findings_str = "\n".join([f"- [{f.severity.upper()}] {f.indicator}: {f.evidence}" for f in findings]) or "No heuristic anomalies."

        prompt = f"""
You are an expert Social Engineering Analyst and Anti-Fraud Investigator. Analyze the following digital communication:

Input Format: {parsed_ctx.detected_format}
Sender Info: {parsed_ctx.sender or 'Unknown'}
Subject / Header: {parsed_ctx.subject or 'None'}
Message Count: {parsed_ctx.message_count}

Message Content:
\"\"\"
{cleaned_text[:2000]}
\"\"\"

Extracted Indicators:
- URLs: {indicators.urls}
- Emails: {indicators.emails}
- Phones: {indicators.phone_numbers}
- Crypto Addresses: {indicators.crypto_addresses}
- Payment Handles: {indicators.payment_handles}

Threat Intelligence Correlation:
{threat_str}

Heuristic Findings:
{findings_str}

Heuristic Score: {base_score}/100

CRITICAL EVALUATION GUIDELINES:
1. Distinguish carefully between suspicious persuasive language and verified evidence of fraud. A message must not be labeled fraudulent solely because it contains urgency or persuasive wording.
2. If verified malicious URLs, spoofed sender headers, or fraudulent payment demands are present, classify as HIGH or CONFIRMED_FRAUD.
3. If the message appears to be a legitimate marketing notification or benign conversation, classify as LOW or SUSPICIOUS accordingly.

Output format must be EXACTLY:
SCAM_TYPE: <concise scam name, e.g. "Bank Impersonation KYC Scam", "Courier Delivery Phishing", "Fake Lotter Sweepstakes", or "Benign Communication">
RISK_LEVEL: <low | suspicious | high | confirmed_fraud>
RISK_SCORE: <integer 0 to 100>
CONFIDENCE: <float 0.50 to 0.99>
TACTICS: <comma separated social engineering tactics, or "None">
EXPLANATION: <2-3 sentences explaining the assessment with evidence>
RECOMMENDATIONS:
- <action 1>
- <action 2>
- <action 3>
"""
        response_text = await query_groq(prompt)

        # Defaults
        scam_type = "Social Engineering Assessment"
        risk_level = "high" if base_score >= 60 else ("suspicious" if base_score >= 30 else "low")
        risk_score = base_score
        confidence = 0.85
        ai_tactics = tactics
        explanation = f"Analysis of {parsed_ctx.detected_format} identified {len(findings)} security findings."
        recommendations = [
            "Do not click links or share sensitive credentials.",
            "Verify the request through official customer care channels."
        ]

        if "SCAM_TYPE:" in response_text:
            try:
                for line in response_text.splitlines():
                    line_s = line.strip()
                    if line_s.startswith("SCAM_TYPE:"):
                        scam_type = line_s.replace("SCAM_TYPE:", "").strip()
                    elif line_s.startswith("RISK_LEVEL:"):
                        rl = line_s.replace("RISK_LEVEL:", "").strip().lower()
                        if rl in ["low", "suspicious", "high", "confirmed_fraud"]:
                            risk_level = rl
                    elif line_s.startswith("RISK_SCORE:"):
                        try:
                            risk_score = int(re.sub(r'\D', '', line_s.replace("RISK_SCORE:", "")))
                        except Exception:
                            pass
                    elif line_s.startswith("CONFIDENCE:"):
                        try:
                            confidence = float(line_s.replace("CONFIDENCE:", "").strip())
                        except Exception:
                            pass
                    elif line_s.startswith("TACTICS:"):
                        raw_tac = line_s.replace("TACTICS:", "").strip()
                        if raw_tac.lower() != "none":
                            ai_tactics = [t.strip() for t in raw_tac.split(",") if t.strip()]

                if "EXPLANATION:" in response_text:
                    parts = response_text.split("RECOMMENDATIONS:")
                    exp_part = parts[0].split("EXPLANATION:")[-1].strip()
                    if exp_part:
                        explanation = exp_part
                    if len(parts) > 1:
                        recs = [r.strip("- ").strip() for r in parts[1].strip().splitlines() if r.strip()]
                        if recs:
                            recommendations = recs
            except Exception:
                pass

        return {
            "scam_type": scam_type,
            "risk_level": risk_level,
            "risk_score": min(max(risk_score, 0), 100),
            "confidence": min(max(confidence, 0.5), 0.99),
            "tactics": ai_tactics or tactics,
            "explanation": explanation,
            "recommendations": recommendations
        }

    async def analyze_message(self, raw_message: str, user_format: str = "auto") -> ScamAnalyzeResponse:
        report_id = str(uuid.uuid4())

        # 1. Format Detection and Specialized Parsing
        fmt = detect_format(raw_message, user_override=user_format)
        if fmt == "email_raw":
            parsed_ctx, cleaned_text = parse_email_raw(raw_message)
        elif fmt == "whatsapp_chat":
            parsed_ctx, cleaned_text = parse_whatsapp_export(raw_message)
        else:
            parsed_ctx, cleaned_text = parse_plain_text(raw_message)

        # 2. Extract Technical Entities & Payment Indicators
        indicators = extract_indicators(cleaned_text)

        # 3. Cross-Module Threat Correlation (VirusTotal, Shodan, Heuristics via URL Scanner)
        correlated_threats = await correlate_indicators(indicators)

        # 4. Heuristic & Social Engineering Analysis
        findings, tactics, base_score = self.detect_heuristics(
            cleaned_text, parsed_ctx, indicators, correlated_threats
        )

        # 5. Groq LLM Synthesis
        ai_res = await self.query_ai_synthesis(
            cleaned_text, parsed_ctx, indicators, correlated_threats, findings, tactics, base_score
        )

        # 6. Build Final Structured Response
        response = ScamAnalyzeResponse(
            report_id=report_id,
            risk_level=ai_res["risk_level"],
            risk_score=ai_res["risk_score"],
            scam_type=ai_res["scam_type"],
            confidence=ai_res["confidence"],
            parsed_context=parsed_ctx,
            extracted_indicators=indicators,
            correlated_threats=correlated_threats,
            findings=findings,
            social_engineering_tactics=ai_res["tactics"],
            ai_explanation=ai_res["explanation"],
            recommended_actions=ai_res["recommendations"],
            created_at=datetime.now(timezone.utc)
        )

        # 7. Async Save to MongoDB (scam_analyses collection)
        db = get_database()
        if db is not None:
            try:
                doc = response.model_dump()
                doc["_id"] = report_id
                await db.scam_analyses.insert_one(doc)
            except Exception as e:
                print(f"MongoDB scam persistence notice: {e}")

        return response


scam_detector_service = ScamDetectorService()
