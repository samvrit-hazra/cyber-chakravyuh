import { CheckSquare, AlertCircle, Shield, User, Terminal, Network } from 'lucide-react';
import type { RecommendedAction } from '../../types/investigation.ts';

interface RecommendedActionsSectionProps {
  actions: RecommendedAction[];
}

export function RecommendedActionsSection({ actions }: RecommendedActionsSectionProps) {
  const getPriorityBadge = (priority: RecommendedAction['priority']) => {
    switch (priority) {
      case 'Immediate':
        return 'bg-[#B64B46]/10 dark:bg-[#E17B70]/20 border-[#B64B46]/30 dark:border-[#E17B70]/40 text-[#B64B46] dark:text-[#E17B70] animate-pulse';
      case 'Important':
        return 'bg-[#A87532]/10 dark:bg-[#D7AA61]/20 border-[#A87532]/30 dark:border-[#D7AA61]/40 text-[#A87532] dark:text-[#D7AA61]';
      case 'Advisory':
      default:
        return 'bg-[#A95636]/10 dark:bg-[#C47A52]/20 border-[#A95636]/30 dark:border-[#C47A52]/40 text-[#A95636] dark:text-[#C47A52]';
    }
  };

  const getRoleIcon = (role: RecommendedAction['role']) => {
    switch (role) {
      case 'User':
        return <User className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52]" />;
      case 'SecOps':
        return <Terminal className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52]" />;
      case 'Network Admin':
        return <Network className="w-3.5 h-3.5 text-[#36745F] dark:text-[#79B69A]" />;
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] p-5 md:p-6 space-y-6 shadow-sm dark:shadow-2xl">
      {/* Header */}
      <div className="border-b border-[#D9DED7] dark:border-[#304144] pb-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#A95636] dark:text-[#C47A52] font-bold">
          SECTION 6 • INCIDENT MITIGATION & SAFETY DIRECTIVES
        </span>
        <h3 className="text-lg md:text-xl font-bold font-mono text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2 mt-0.5">
          <CheckSquare className="w-5 h-5 text-[#36745F] dark:text-[#79B69A]" />
          <span>Prescribed Tactical Actions</span>
          <span className="text-xs font-mono text-[#647477] dark:text-[#A6B3AE] font-normal">({actions.length} Directives)</span>
        </h3>
      </div>

      {/* Directives Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-2.5 hover:border-[#A95636] dark:hover:border-[#C47A52] transition-colors"
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

              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] text-[#182629] dark:text-[#E8E6DC] text-[11px]">
                {getRoleIcon(item.role)}
                <span>Role: {item.role}</span>
              </span>
            </div>

            {/* Action Statement */}
            <div className="text-sm font-mono font-bold text-[#182629] dark:text-[#E8E6DC] flex items-start gap-2 pt-1">
              <Shield className="w-4 h-4 text-[#A95636] dark:text-[#C47A52] shrink-0 mt-0.5" />
              <span>{item.action}</span>
            </div>

            {/* Rationale */}
            <div className="pl-6 text-xs font-sans text-[#647477] dark:text-[#A6B3AE] leading-relaxed bg-white dark:bg-[#19272A] p-2 rounded border border-[#D9DED7] dark:border-[#304144]">
              <span className="font-semibold text-[#182629] dark:text-[#E8E6DC]">Security Rationale: </span>
              {item.rationale}
            </div>
          </div>
        ))}
      </div>

      {/* Safety Banner */}
      <div className="p-3.5 rounded-xl bg-[#A95636]/10 dark:bg-[#C47A52]/15 border border-[#A95636]/20 dark:border-[#C47A52]/30 text-[#A95636] dark:text-[#C47A52] text-xs font-mono flex items-center gap-3">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>
          Zero-Trust Principle: Never enter credentials or bypass browser certificate warnings based on informal assertions. Always verify domains via authoritative registries.
        </span>
      </div>
    </div>
  );
}
