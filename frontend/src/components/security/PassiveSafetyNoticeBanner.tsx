import { Shield, Info } from 'lucide-react';

interface PassiveSafetyNoticeBannerProps {
  notice: string;
}

export function PassiveSafetyNoticeBanner({ notice }: PassiveSafetyNoticeBannerProps) {
  return (
    <div className="p-4 rounded-md bg-[#EAECE6] dark:bg-[#223336] border border-[#D9DED7] dark:border-[#304144] flex items-start gap-3.5 text-xs font-mono shadow-xs">
      <div className="p-2 rounded bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] text-[#356D68] dark:text-[#79A99C] shrink-0 mt-0.5">
        <Shield className="w-4 h-4" />
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#182629] dark:text-[#E8E6DC]">
          <span>Passive Hygiene & Non-Exploitation Policy</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#356D68]/10 dark:bg-[#79A99C]/15 text-[#356D68] dark:text-[#79A99C] border border-[#356D68]/25 dark:border-[#79A99C]/30">
            NON-INTRUSIVE AUDIT
          </span>
        </div>
        <p className="text-[#647477] dark:text-[#A6B3AE] font-sans leading-relaxed text-xs">
          {notice}
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-[#647477] dark:text-[#A6B3AE] pt-0.5 font-mono">
          <Info className="w-3.5 h-3.5 text-[#356D68] dark:text-[#79A99C]" />
          <span>No port scans, fuzzing strings, or exploitation attempts are ever conducted against target hosts.</span>
        </div>
      </div>
    </div>
  );
}
