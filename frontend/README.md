# Cyber Chakravyuha — Frontend Architecture & Developer Guide

> **Cyber Chakravyuha**: AI-Powered Cybersecurity & Digital Trust Intelligence Platform.
> High-performance, isolated web command-centre built for threat monitoring, AI risk scoring, digital trust auditing, and automated defense matrix visualization.

---

## 1. Architecture & Isolation Boundaries

In accordance with Phase 0 specifications, the frontend resides completely within the self-contained `frontend/` directory.

- **Zero Root Contamination**: All dependencies, build tools, and configurations exist strictly inside `frontend/`. No files have been created or modified in the workspace root.
- **Backend & Web3 Decoupling**: Communicates with backend APIs and Web3 networks through typed REST contracts and environment configurations (`VITE_API_BASE_URL`).
- **Safe Offline Operation**: When backend services are offline, the frontend transparently reports offline mode and uses deterministic client-side evaluation engines. **Successful backend API responses are never fabricated.**

---

## 2. Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Component-driven UI rendering with strict concurrent rendering |
| **TypeScript (v7.0.2)** | Type-safe enterprise domain models & strict null checking |
| **Vite (v8.3.6)** | Ultra-fast build tool and development server |
| **Tailwind CSS v4** | Dark cybersecurity command-centre design system with custom tokens |
| **Lucide Icons** | Cybersecurity, network, and telemetry iconography |
| **Oxlint** | High-performance Rust-based linter enforcing clean code quality |

---

## 3. Phase Implementations & Capabilities

### Phase 1 — Visual Design System & Reusable Components
- Located in `src/components/common/`:
  - `Button`, `Input`, `Textarea`, `Card`, `Modal`, `Sidebar`, `Navbar`, `Badge`, `Tooltip`, `Dropdown`, `Tabs`, `Progress`, `RiskIndicator`, `AlertBanner`, `DataTable`, `EmptyState`, `LoadingSkeleton`, `LoadingState`, `NetworkBackground`.
- Custom color tokens: Dark navy (`#030712`), obsidian (`#070d1e`), electric cyan (`#06b6d4`), violet (`#a855f7`), emerald verified states, and threat alert rose/amber.

### Phase 2 — Responsive Landing Page
- Located in `src/pages/LandingPage.tsx`:
  - 7 responsive sections: Navigation, Hero with animated constellation, Threat Statistics, Core Features (6 interactive cards), How It Works (4-step pipeline), Digital Trust Matrix (7-layer Chakravyuha architecture), and Call to Action.
  - Interactive feature detail modal and authentication modal.

### Phase 3 — Main Cybersecurity Dashboard
- Located in `src/pages/DashboardPage.tsx`:
  - Responsive SOC layout with collapsible sidebar, command search, notifications drawer, and theme switcher.
  - 4 StatCards: Total Investigations, High-Risk Findings, Suspicious Domains, Verified Reports.
  - 5 SVG visualizations: Threat Distribution, Risk Classification, Activity Timeline, Threat Categories, and Investigation Activity.
  - Interactive Evaluator State Tester (`Ready`, `Loading`, `Empty`, `Error`).

### Phase 4 — Intelligent URL Investigation
- Located in `src/components/investigation/`:
  - Validated input with preset scenarios.
  - 5-tier risk classification: `Low Risk`, `Suspicious`, `High Risk`, `Confirmed Malicious`, `Inconclusive`.
  - Shannon entropy calculation, homoglyph punycode detection, typosquatting indicators, redirect hops tracer, structured technical findings, and mitigation playbooks.

### Phase 5 — AI-Powered Scam & Message Analysis
- Located in `src/components/scam/`:
  - Multi-format ingestion: SMS, emails, job offers, investment pitches, payment requests.
  - Explicit rule: **Urgent or persuasive language alone never classifies a message as fraud.**
  - Zero-credential policy: Permanent refusal to request or process OTPs/passwords.
  - Extracted IOCs (URLs, emails, phone numbers) and dual-column evidence vs. AI interpretation.

### Phase 6 — TLS Certificate & Digital Trust Intelligence
- Located in `src/components/tls/`:
  - X.509 certificate inspection, validity dates, SANs, and signature algorithms.
  - Interactive 3D/graphical certificate chain (Root CA → Intermediate CA → Leaf).
  - Explicit warning: Valid HTTPS does not prove a website is legitimate or safe.

### Phase 7 — Website Security Assessment
- Located in `src/components/security/`:
  - Passive security inspection across 7 mandatory categories: HTTP/S configuration, security headers, TLS cipher suites, mixed content, suspicious redirects, exposed endpoints, and version disclosures.
  - Strict non-exploitation guarantee: zero active vulnerability scanning or intrusive probing.

### Phase 8 — Threat Intelligence & Web3 Verification
- Located in `src/components/threatIntel/` and `src/components/blockchain/`:
  - **Module A**: Threat relationship graph connecting campaigns ↔ malicious domains ↔ suspicious URLs ↔ reported incidents.
  - **Module B**: Decentralized threat report registry anchoring SHA-256 fingerprints to smart contracts (`ThreatRegistryV4.sol`).
  - Clear distinction: On-chain anchoring proves report submission integrity and timestamp, not that the report content itself is true.

### Phase 9 — History, Reports & User Settings
- Located in `src/components/dashboard/`:
  - `InvestigationHistoryTab`: Multi-filter investigation table (date, risk, vector), search, sorting, pagination, CSV/JSON export.
  - `ForensicReportModal`: Comprehensive multi-tab dossier with Markdown summary copying, JSON attestation downloading, raw evidence code blocks, and on-chain signature validation.
  - `SettingsTab`: 5 settings domains (Profile, Notifications, Display Themes, Privacy & Zero-Knowledge, Account & API Credentials) with evaluator state testing.

### Phase 10 — Integration, QA & Final Polish
- Located in `src/services/` and `src/tests/`:
  - `threatApi.ts`: Active backend API probing and transparent fallback.
  - `functionalAudit.ts`: 15-point automated verification test suite.

---

## 4. API Integration Protocols

The frontend attempts communication with backend services defined in `.env.example`:

- `GET  /api/v1/health` — Backend health probe
- `POST /api/v1/investigate/url` — Lexical URL investigation
- `POST /api/v1/investigate/message` — AI scam & manipulation analysis
- `POST /api/v1/investigate/tls` — TLS X.509 certificate validation
- `POST /api/v1/investigate/website-security` — Passive website security audit
- `GET  /api/v1/threats/live` — Live threat feed
- `GET  /api/v1/blockchain/reports` — Decentralized ledger audit log

### Transparent Offline Fallback Policy
If the backend server on port 5000 is unavailable:
1. The top navigation bar displays `API Core: OFFLINE / DEMO`.
2. Telemetry engines fall back to local deterministic analysis models.
3. Every finding is labeled with its data source origin.
4. **Successful backend responses are never fabricated.**

---

## 5. Security & Privacy Safeguards

- **Zero API Secrets in Client Code**: All environment variables use `VITE_` public configurations; private keys are never included.
- **Untrusted Content Sanitization**: All user inputs (URLs, message content) are rendered as plaintext or sanitized text nodes. `dangerouslySetInnerHTML` and `eval()` are strictly prohibited.
- **Zero-Knowledge Query Commitments**: Supports local HMAC-SHA256 URL hashing to prevent raw internal URLs from leaking over network telemetry.
- **Passive Non-Exploitation**: The website security assessment explicitly documents limitations and never conducts active penetration testing.

---

## 6. Testing & Quality Assurance

### Run Automated Test Suite
From inside the `frontend/` directory:
```bash
npm test
```
The test suite executes `src/tests/functionalAudit.ts` directly in Node and validates:
1. URL Investigation Phishing Heuristics & Tier Classification.
2. Scam Analysis, Entity Extraction, and the Urgency-Alone-IsNot-Fraud Discriminator.
3. TLS Certificate Chain Reconstruction and Cipher Audit.
4. Website Security Assessment across all 7 categories with Passive Limitations.
5. API Health Probing and Safe Offline Fallback without Fabrication.

### Run Linter
```bash
npm run lint
```
Enforces zero warnings and zero errors across all components.

### Run Production Build
```bash
npm run build
```
Compiles TypeScript and bundles via Vite into `dist/`.

---

## 7. Folder Structure

```
frontend/
├── .env.example              # Frontend environment configuration template
├── package.json              # Dependencies and npm scripts
├── tsconfig.json             # Root TypeScript config
├── tsconfig.app.json         # Client application compiler options
├── tsconfig.node.json        # Build tooling TypeScript config
├── vite.config.ts            # Vite bundler configuration
├── README.md                 # Complete documentation
├── public/                   # Static assets
└── src/
    ├── assets/               # Branding and static imagery
    ├── components/
    │   ├── common/           # 19 Reusable atomic UI components
    │   ├── landing/          # Landing page sections
    │   ├── dashboard/        # Dashboard overview, history, settings, and tabs
    │   ├── investigation/    # URL analysis forms, indicators, and evidence
    │   ├── scam/             # Scam detection inputs, NLP cards, and IOCs
    │   ├── tls/              # Certificate chain, findings, and warnings
    │   ├── security/         # Passive website security assessment widgets
    │   ├── threatIntel/      # Campaign graphs, indicators, and domains
    │   └── blockchain/       # Merkle prover, registry table, and audit modals
    ├── pages/                # LandingPage, DashboardPage, InvestigationDashboard, DesignSystemShowcase
    ├── services/             # apiClient.ts and threatApi.ts
    ├── types/                # Domain models across all 10 phases
    ├── utils/                # Heuristic engines and mock data
    ├── tests/                # functionalAudit.ts test runner
    ├── App.tsx               # Root route orchestrator
    ├── main.tsx              # Application entry point
    └── index.css             # Cyber design tokens and global styles
```
