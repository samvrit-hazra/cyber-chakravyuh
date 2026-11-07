import { Shield, Info } from 'lucide-react';

interface PassiveSafetyNoticeBannerProps {
  notice: string;
}

export function PassiveSafetyNoticeBanner({ notice }: PassiveSafetyNoticeBannerProps) {
  return (
    <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-3.5 text-xs font-mono text-cyan-200">
      <div className="p-2 rounded-lg bg-black/40 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
        <Shield className="w-4 h-4" />
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-slate-100">
          <span>Passive Hygiene & Non-Exploitation Policy</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            NON-INTRUSIVE AUDIT
          </span>
        </div>
        <p className="text-slate-300 font-sans leading-relaxed text-xs">
          {notice}
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-0.5 font-mono">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>No port scans, fuzzing strings, or exploitation attempts are ever conducted against target hosts.</span>
        </div>
      </div>
    </div>
  );
}

