import { useState } from 'react';
import { Shield, Key, Lock, CheckCircle2, Terminal } from 'lucide-react';
import { Modal, Button, Input, Badge } from '../common/index.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('analyst@chakravyuha.internal');
  const [passkey, setPasskey] = useState('••••••••••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsAuthenticated(true);
      setTimeout(() => {
        setIsAuthenticated(false);
        onClose();
        onSuccess();
      }, 1000);
    }, 800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SecOps Portal Authentication"
      subtitle="Zero-Trust mTLS & Ephemeral Token Gateway"
      size="md"
    >
      {isAuthenticated ? (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-white">Cryptographic Attestation Verified</h4>
          <p className="text-xs text-slate-300">Routing token session to Saptarishi Investigation Core...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-2.5">
            <Terminal className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-cyan-200">
              <span className="font-semibold">Demo Sandbox Environment:</span> Pre-loaded with
              privileged investigation credentials for evaluation.
            </div>
          </div>

          <Input
            label="Operative Security ID / Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Shield className="w-4 h-4 text-slate-400" />}
            required
          />

          <Input
            label="Hardware Passkey / Signature Token"
            type="password"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            leftIcon={<Key className="w-4 h-4 text-slate-400" />}
            isMonospace
            required
            helperText="FIPS 140-2 Level 3 cryptographic hardware token"
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400"
              />
              <span>Remember hardware token</span>
            </label>
            <span className="text-cyan-400 hover:underline cursor-pointer font-mono">
              Reset Keypair
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              leftIcon={<Lock className="w-3.5 h-3.5" />}
            >
              Authenticate & Launch
            </Button>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>CHAKRAVYUHA SEC-GATE v2.4</span>
            <Badge variant="emerald" size="sm">TLS 1.3 Active</Badge>
          </div>
        </form>
      )}
    </Modal>
  );
}

