import { NavigationProvider, useNavigation } from './context/NavigationContext.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { UrlAnalyzerPage } from './pages/UrlAnalyzerPage.tsx';
import { TlsInspectorPage } from './pages/TlsInspectorPage.tsx';
import { SmsScannerPage } from './pages/SmsScannerPage.tsx';
import { SecurityAuditorPage } from './pages/SecurityAuditorPage.tsx';
import { ThreatIntelPage } from './pages/ThreatIntelPage.tsx';
import { ThreatRegistryPage } from './pages/ThreatRegistryPage.tsx';
import { Web3ThreatPage } from './pages/Web3ThreatPage.tsx';

function AppContent() {
  const { currentPage } = useNavigation();

  switch (currentPage) {
    case 'url-analyzer':
      return <UrlAnalyzerPage />;
    case 'tls-inspector':
      return <TlsInspectorPage />;
    case 'sms-scanner':
      return <SmsScannerPage />;
    case 'security-auditor':
      return <SecurityAuditorPage />;
    case 'threat-intel':
      return <ThreatIntelPage />;
    case 'web3-threat':
      return <Web3ThreatPage />;
    case 'threat-registry':
    case 'analyst-console':
      return <ThreatRegistryPage />;
    case 'home':
    default:
      return <LandingPage />;
  }
}

export function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}

export default App;
