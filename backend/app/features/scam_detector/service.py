import uuid
import re
from datetime import datetime, timezone
from app.features.scam_detector.models import ScamAnalyzeResponse, ExtractedIndicators


class ScamDetectorService:
    async def analyze_message(self, message: str) -> ScamAnalyzeResponse:
        # Regex extraction
        urls = re.findall(r'https?://[^\s]+', message)
        emails = re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', message)
        phones = re.findall(r'(\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})', message)

        # Basic keyword heuristics (to be augmented with Gemini LLM)
        urgent_keywords = ["urgent", "immediately", "suspended", "won", "prize", "otp", "kyc"]
        detected_patterns = [kw for kw in urgent_keywords if kw in message.lower()]

        risk_score = min(len(detected_patterns) * 25 + len(urls) * 20, 95)
        risk_level = "high" if risk_score >= 70 else ("suspicious" if risk_score >= 40 else "low")

        return ScamAnalyzeResponse(
            report_id=str(uuid.uuid4()),
            risk_level=risk_level,
            risk_score=risk_score,
            scam_type="social_engineering_inquiry",
            extracted_indicators=ExtractedIndicators(urls=urls, emails=emails, phone_numbers=phones),
            patterns_detected=detected_patterns,
            ai_explanation=f"Message contains {len(detected_patterns)} urgency indicators. Full AI explainability pipeline ready for Gemini integration.",
            recommended_actions=["Verify directly with the legitimate organization", "Never share OTP or credentials"],
            created_at=datetime.now(timezone.utc)
        )


scam_detector_service = ScamDetectorService()
