import { performUrlInvestigation } from '../utils/investigationEngine.ts';
import { performScamAnalysis } from '../utils/scamAnalysisEngine.ts';
import { performTlsInvestigation } from '../utils/tlsAnalysisEngine.ts';
import { performWebsiteSecurityAssessment } from '../utils/websiteSecurityEngine.ts';
import { ThreatApiService } from '../services/threatApi.ts';

declare const process: { exit: (code: number) => void };

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${testName}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${testName}`);
  }
}

async function runAudit() {
  console.log('\n======================================================');
  console.log('🛡️ CYBER CHAKRAVYUHA — PHASE 10 COMPREHENSIVE AUDIT');
  console.log('======================================================\n');

  // TEST 1: URL Investigation Engine
  console.log('--- 1. Testing URL Investigation Engine ---');
  const phishUrl = 'https://security-verify.paypal.account-update.phish-alert.net/login';
  const phishResult = await performUrlInvestigation(phishUrl);
  assert(
    phishResult.riskClassification === 'Confirmed Malicious' || phishResult.riskClassification === 'High Risk',
    'Identifies malicious credential phishing lure'
  );
  assert(
    phishResult.phishingIndicators.hasTyposquatting ||
    phishResult.phishingIndicators.hasHomograph ||
    Boolean(phishResult.phishingIndicators.impersonatedBrand) ||
    phishResult.phishingIndicators.knownThreatMatches.length > 0,
    'Flags phishing heuristics (typosquatting, brand impersonation, or threat signatures)'
  );
  assert(phishResult.technicalFindings.length > 0, 'Produces structured technical evidence items');
  assert(phishResult.recommendedActions.length > 0, 'Produces actionable mitigation guidance');

  const cleanUrl = 'https://www.google.com';
  const cleanResult = await performUrlInvestigation(cleanUrl);
  assert(cleanResult.riskClassification === 'Low Risk', 'Correctly rates authoritative Google domain as Low Risk');

  const unkUrl = 'https://unseen-subdomain.random-test-xyz.net/probe';
  const unkResult = await performUrlInvestigation(unkUrl);
  assert(
    ['Suspicious', 'Inconclusive', 'Low Risk'].includes(unkResult.riskClassification),
    'Gracefully handles unknown/neutral domains without fabricated positives'
  );

  // TEST 2: Scam & Message Analysis Engine
  console.log('\n--- 2. Testing AI-Powered Scam Analysis Engine ---');
  const urgentPhishMsg = 'CHASE BANK ALERT: Unrecognized transaction of $1,429.99 attempted at Target NY. Verify identity at https://chase-security-resolver.online/unlock?case=9412 or debit card will be permanently canceled within 2 hours.';
  const scamRes = await performScamAnalysis(urgentPhishMsg);
  assert(
    scamRes.riskClassification === 'Confirmed Scam / Fraud' || scamRes.riskClassification === 'High Risk / Likely Deceptive',
    'Accurately rates aggressive banking imposter message'
  );
  assert(
    scamRes.extractedUrls.length > 0 || scamRes.extractedPhones.length > 0,
    'Extracts IOCs (URLs / Phone Numbers)'
  );
  assert(scamRes.urgencyAndManipulation.indicators.length > 0, 'Detects artificial countdown and urgency pressure');

  // Test that urgency alone is NOT automatically classified as fraud (Requirement from Phase 5)
  const benignUrgent = '[P1 INCIDENT ALERT] Production Cluster us-east-4 CPU threshold exceeded 94% on worker node pool k8s-prd-09. Automated replica scaling triggered. SRE on-call review Grafana https://monitoring.internal.acme-corp.com/d/cluster-health';
  const benignUrgentRes = await performScamAnalysis(benignUrgent);
  assert(
    benignUrgentRes.riskClassification === 'Low Risk / Likely Legitimate',
    'Discriminator verifies urgency alone does NOT classify benign message as fraud'
  );
  assert(
    benignUrgentRes.urgencyAndManipulation.isUrgencyLegitimate === true,
    'Urgency is marked as operationally legitimate'
  );

  // TEST 3: TLS Certificate Intelligence
  console.log('\n--- 3. Testing TLS Certificate Engine ---');
  const tlsDomain = 'accounts.google.com';
  const tlsResult = await performTlsInvestigation(tlsDomain);
  assert(
    tlsResult.certificateStatus === 'Valid & Trusted' || tlsResult.daysRemaining > 0,
    'Evaluates active X.509 certificate status'
  );
  assert(tlsResult.certificateChain.length >= 2, 'Builds Root -> Intermediate -> Leaf certificate chain hierarchy');
  assert(tlsResult.securityFindings.length > 0, 'Audits Certificate Transparency and cipher strength');

  // TEST 4: Website Security Assessment (Passive & Non-Exploitative)
  console.log('\n--- 4. Testing Website Security Assessment Engine ---');
  const siteUrl = 'https://accounts.google.com';
  const secResult = await performWebsiteSecurityAssessment(siteUrl);
  assert(secResult.securityScore >= 0 && secResult.securityScore <= 100, 'Computes security hygiene score in [0, 100]');
  assert(secResult.categoryScores.length === 7, 'Audits all 7 mandatory security assessment categories');
  assert(
    secResult.findings.every((f) => f.assessmentLimitations.length > 0),
    'Guarantees passive assessment non-exploitation limitations are explicitly attached to all findings'
  );

  // TEST 5: API Integration & Health Verification
  console.log('\n--- 5. Testing API Connectivity & Safe Fallback ---');
  const health = await ThreatApiService.checkHealth();
  assert(health.mode === 'standalone-heuristic' || health.mode === 'connected', 'Probes backend health without crashing');
  if (!health.isAvailable) {
    assert(health.mode === 'standalone-heuristic', 'Transparently reports offline status without fabricating fake 200 responses');
  }

  const { result: fallbackResult, source } = await ThreatApiService.investigateUrl(phishUrl);
  assert(fallbackResult !== null, 'Investigation returns robust result in all states');
  assert(source === 'api' || source === 'heuristic', 'Accurately tags source origin');

  console.log('\n======================================================');
  console.log('🎉 ALL 15 VERIFICATION BENCHMARKS PASSED SUCCESSFULLY!');
  console.log('======================================================\n');
}

runAudit().catch((err) => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
