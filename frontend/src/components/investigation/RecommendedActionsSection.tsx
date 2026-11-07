import { CheckSquare, AlertCircle, Shield, User, Terminal, Network } from 'lucide-react';
import type { RecommendedAction } from '../../types/investigation.ts';

interface RecommendedActionsSectionProps {
  actions: RecommendedAction[];
}

export function RecommendedActionsSection({ actions }: RecommendedActionsSectionProps) {
  const getPriorityBadge = (priority: RecommendedAction['priority']) => {
    switch (priority) {
      case 'Immediate':
        return 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse';
      case 'Important':
        return 'bg-amber-500/20 border-amber-500/50 text-amber-300';
      case 'Advisory':
      default:
        return 'bg-blue-500/20 border-blue-500/50 text-blue-300';
    }
  };

  const getRoleIcon = (role: RecommendedAction['role']) => {
    switch (role) {
      case 'User':
        return <User className="w-3.5 h-3.5 text-cyan-400" />;
      case 'SecOps':
        return <Terminal className="w-3.5 h-3.5 text-purple-400" />;
      case 'Network Admin':
        return <Network className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="rounded-2xl bg-[#091224] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
          SECTION 6 • INCIDENT MITIGATION & SAFETY DIRECTIVES
        </span>
        <h3 className="text-lg md:text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
          <CheckSquare className="w-5 h-5 text-emerald-400" />
          <span>Prescribed Tactical Actions</span>
          <span className="text-xs font-mono text-slate-400 font-normal">({actions.length} Directives)</span>
        </h3>
      </div>

      {/* Directives Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-[#060b17] border border-white/5 space-y-2.5 hover:border-cyan-500/30 transition-colors"
          >
            {/* Top row: Priority and Role */}
            <div className="flex items-center justify-between text-xs font-mono">
              <span
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold border uppercase ${getPriorityBadge(
                  item.priority
                )}`}
              >
                {item.priority} Action
              </span>

              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-white/5 text-slate-300 text-[11px]">
                {getRoleIcon(item.role)}
                <span>Role: {item.role}</span>
              </span>
            </div>

            {/* Action Statement */}
            <div className="text-sm font-mono font-bold text-slate-100 flex items-start gap-2 pt-1">
              <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{item.action}</span>
            </div>

            {/* Rationale */}
            <div className="pl-6 text-xs font-sans text-slate-300/90 leading-relaxed bg-white/[0.02] p-2 rounded border border-white/5">
              <span className="font-semibold text-slate-200">Security Rationale: </span>
              {item.rationale}
            </div>
          </div>
        ))}
      </div>

      {/* Safety Banner */}
      <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-cyan-200 text-xs font-mono flex items-center gap-3">
        <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          Zero-Trust Principle: Never enter credentials or bypass browser certificate warnings based on informal assertions. Always verify domains via authoritative registries.
        </span>
      </div>
    </div>
  );
}

